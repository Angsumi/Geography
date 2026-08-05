import React, { useEffect, useRef, useState } from 'react';

const INDIA_ZONE_COLORS = {
  'Himalayan Mountains': '#60a5fa', // Blue
  'Northern Plains': '#34d399',      // Green
  'Thar Desert': '#fbbf24',          // Yellow
  'Peninsular Plateau': '#fb923c',   // Orange
  'Coastal Plains': '#a78bfa',       // Purple
  'Islands': '#f472b6'               // Pink
};

const ASSAM_ZONE_COLORS = {
  'Brahmaputra Valley (Sadiya to Dhubri, floods)': '#34d399',
  'Central Plateau/Hills (Karbi Anglong, Haflong)': '#fb923c',
  'Barak Valley': '#60a5fa'
};

export default function GeographyMap({ activeRegion, onSelectRegion, isAssam }) {
  const canvasRef = useRef(null);
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredZone, setHoveredZone] = useState(null);
  const boundsRef = useRef({ minLon: 68, maxLon: 98, minLat: 6, maxLat: 38 });
  const rawFeaturesRef = useRef([]);

  // Load the highly optimized compact JSON file
  useEffect(() => {
    fetch('/INDIAN_SUB_DISTRICTS_COMPACT.json')
      .then(res => res.json())
      .then(data => {
        // Struct of data item: [india_zone, is_assam, assam_zone, polygons, centroid]
        rawFeaturesRef.current = data;
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load map data", err);
        setLoading(false);
      });
  }, []);

  // Filter features and calculate bounds when view mode (India/Assam) changes
  useEffect(() => {
    if (rawFeaturesRef.current.length === 0) return;

    let filtered = [];
    if (isAssam) {
      filtered = rawFeaturesRef.current
        .filter(item => item[1] === 1) // is_assam === 1
        .map(item => ({
          zone: item[2], // assam_zone
          polygons: item[3],
          centroid: item[4]
        }));
    } else {
      filtered = rawFeaturesRef.current.map(item => ({
        zone: item[0], // india_zone
        polygons: item[3],
        centroid: item[4]
      }));
    }

    // Compute bounding box
    let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
    let validCentroids = 0;
    filtered.forEach(f => {
      if (f.centroid) {
        validCentroids++;
        const [lon, lat] = f.centroid;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    });

    if (validCentroids > 0) {
      const padding = isAssam ? 0.3 : 1;
      boundsRef.current = {
        minLon: minLon - padding,
        maxLon: maxLon + padding,
        minLat: minLat - padding,
        maxLat: maxLat + padding
      };
    }

    setGeoData(filtered);
  }, [isAssam, loading]);

  // Redraw canvas
  useEffect(() => {
    if (geoData.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const { minLon, maxLon, minLat, maxLat } = boundsRef.current;
    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;

    const project = (lon, lat) => {
      const x = ((lon - minLon) / lonRange) * width;
      const y = height - ((lat - minLat) / latRange) * height;
      return [x, y];
    };

    const zoneColors = isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS;

    geoData.forEach(feature => {
      if (!feature.polygons) return;

      const zone = feature.zone;
      const isSelected = activeRegion === zone || (isAssam && activeRegion?.startsWith(zone?.substring(0, 10)));
      const isHovered = hoveredZone === zone;

      let fillStyle = 'rgba(255, 255, 255, 0.03)';
      let strokeStyle = 'rgba(255, 255, 255, 0.08)';
      let lineWidth = isAssam ? 0.8 : 0.4;

      if (isSelected) {
        fillStyle = zoneColors[zone] + '99';
        strokeStyle = '#ffffff';
        lineWidth = isAssam ? 1.5 : 1;
      } else if (isHovered) {
        fillStyle = zoneColors[zone] + '55';
        strokeStyle = zoneColors[zone];
        lineWidth = isAssam ? 1.2 : 0.8;
      } else {
        fillStyle = zoneColors[zone] + '22';
        strokeStyle = zoneColors[zone] + '33';
      }

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;

      feature.polygons.forEach(polygon => {
        ctx.beginPath();
        polygon.forEach((coord, j) => {
          const [x, y] = project(coord[0], coord[1]);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    });

  }, [geoData, activeRegion, hoveredZone, isAssam]);

  // Handle Mouse Events
  const handleMouseMove = (e) => {
    if (geoData.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { minLon, maxLon, minLat, maxLat } = boundsRef.current;
    const clickLon = minLon + (x / canvas.width) * (maxLon - minLon);
    const clickLat = minLat + ((canvas.height - y) / canvas.height) * (maxLat - minLat);

    let nearestFeature = null;
    let minDist = Infinity;

    geoData.forEach(f => {
      if (!f.centroid) return;
      const dLon = f.centroid[0] - clickLon;
      const dLat = f.centroid[1] - clickLat;
      const dist = dLon * dLon + dLat * dLat;
      if (dist < minDist) {
        minDist = dist;
        nearestFeature = f;
      }
    });

    const maxDistThreshold = isAssam ? 0.08 : 1.2;
    if (nearestFeature && minDist < maxDistThreshold) {
      if (hoveredZone !== nearestFeature.zone) {
        setHoveredZone(nearestFeature.zone);
      }
    } else {
      setHoveredZone(null);
    }
  };

  const handleMouseClick = () => {
    if (hoveredZone) {
      onSelectRegion(hoveredZone);
    }
  };

  const handleMouseLeave = () => {
    setHoveredZone(null);
  };

  if (loading || geoData.length === 0) {
    return (
      <div style={{ height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem' }}>Loading Optimized Map Boundaries (640KB)...</span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const currentColors = isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS;

  return (
    <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
      <canvas
        ref={canvasRef}
        width="450"
        height="380"
        onMouseMove={handleMouseMove}
        onClick={handleMouseClick}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxHeight: '380px',
          cursor: hoveredZone ? 'pointer' : 'default',
          display: 'block',
          margin: '0 auto',
          transition: 'filter 0.3s'
        }}
      />

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: isAssam ? '1fr' : 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
        {Object.entries(currentColors).map(([zone, color]) => {
          const isSelected = activeRegion === zone || (isAssam && activeRegion?.startsWith(zone.substring(0, 10)));
          return (
            <div
              key={zone}
              onMouseEnter={() => setHoveredZone(zone)}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectRegion(zone)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                fontWeight: isSelected ? 'bold' : 'normal',
                opacity: hoveredZone && hoveredZone !== zone ? 0.4 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={zone}>{zone}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
