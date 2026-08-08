import React, { useEffect, useRef, useState } from 'react';

const INDIA_ZONE_COLORS = {
  'Himalayan Mountains': '#60a5fa', // Blue
  'Northern Plains': '#34d399',      // Green
  'Thar Desert': '#fbbf24',          // Yellow
  'Peninsular Plateau': '#fb923c',   // Orange
  'Coastal Plains': '#a78bfa',       // Purple
  'Islands': '#f472b6'               // Pink
};

const NE_STATE_COLORS = {
  'ASSAM': '#34d399',
  'ARUNACHAL PRADESH': '#60a5fa',
  'MEGHALAYA': '#fb923c',
  'MANIPUR': '#a78bfa',
  'MIZORAM': '#f472b6',
  'NAGALAND': '#fbbf24',
  'TRIPURA': '#38bdf8'
};

const ASSAM_ZONE_COLORS = {
  'Brahmaputra Valley': '#34d399',
  'Central Hills': '#fb923c',
  'Barak Valley': '#60a5fa'
};

export default function GeographyMap({ activeRegion, onSelectRegion, isAssam, activeChapter = '' }) {
  const canvasRef = useRef(null);
  const [indiaGeoData, setIndiaGeoData] = useState([]);
  const [neStatesData, setNeStatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredZone, setHoveredZone] = useState(null);
  const boundsRef = useRef({ minLon: 68, maxLon: 98, minLat: 6, maxLat: 38 });
  const rawFeaturesRef = useRef([]);

  const isNortheastChapter = activeChapter.toLowerCase().includes('northeast') || activeChapter.toUpperCase() === 'NE';

  // Load map datasets
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}INDIAN_SUB_DISTRICTS_COMPACT.json`).then(r => r.json()),
      fetch(`${import.meta.env.BASE_URL}NORTHEAST_STATES_ONLY.json`).then(r => r.json())
    ]).then(([subData, neData]) => {
      rawFeaturesRef.current = subData;

      // Parse 7 sister states from Angsumi/INDIAN-SHAPEFILES
      const parsedNe = (neData.features || []).map(feat => {
        const stName = (feat.properties?.STNAME || '').toUpperCase();
        const geom = feat.geometry || {};
        let polys = [];
        if (geom.type === 'Polygon') {
          polys = [geom.coordinates];
        } else if (geom.type === 'MultiPolygon') {
          polys = geom.coordinates;
        }
        
        let sumX = 0, sumY = 0, count = 0;
        polys.forEach(poly => {
          (poly[0] || []).forEach(pt => {
            sumX += pt[0];
            sumY += pt[1];
            count++;
          });
        });

        return {
          stName,
          polygons: polys,
          centroid: count > 0 ? [sumX / count, sumY / count] : null
        };
      });

      setNeStatesData(parsedNe);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load map dataset", err);
      setLoading(false);
    });
  }, []);

  // Filter features and calculate bounds based on active tab mode
  useEffect(() => {
    if (rawFeaturesRef.current.length === 0) return;

    let filtered = [];
    if (isAssam) {
      filtered = rawFeaturesRef.current
        .filter(item => item[1] === 1) // is_assam === 1
        .map(item => ({
          zone: item[2],
          polygons: item[3],
          centroid: item[4]
        }));
    } else {
      filtered = rawFeaturesRef.current.map(item => ({
        zone: item[0],
        polygons: item[3],
        centroid: item[4]
      }));
    }

    setIndiaGeoData(filtered);

    // Calculate viewport bounds
    if (isNortheastChapter && neStatesData.length > 0) {
      let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
      neStatesData.forEach(s => {
        if (s.centroid) {
          const [lon, lat] = s.centroid;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      });
      boundsRef.current = { minLon: minLon - 1.8, maxLon: maxLon + 1.8, minLat: minLat - 1.8, maxLat: maxLat + 1.8 };
    } else if (isAssam && filtered.length > 0) {
      let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
      filtered.forEach(f => {
        if (f.centroid) {
          const [lon, lat] = f.centroid;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      });
      boundsRef.current = { minLon: minLon - 0.5, maxLon: maxLon + 0.5, minLat: minLat - 0.5, maxLat: maxLat + 0.5 };
    } else {
      // Revert to full India bounds for "Indian Geography & Environment"
      boundsRef.current = { minLon: 68 - 1, maxLon: 98 + 1, minLat: 6 - 1, maxLat: 38 + 1 };
    }

  }, [isAssam, isNortheastChapter, neStatesData, loading]);

  // Draw canvas
  useEffect(() => {
    if (loading || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const { minLon, maxLon, minLat, maxLat } = boundsRef.current;
    const lonRange = maxLon - minLon;
    const latRange = maxLat - minLat;

    const project = (lon, lat) => {
      const x = ((lon - minLon) / lonRange) * width;
      const y = height - ((lat - minLat) / latRange) * height;
      return [x, y];
    };

    if (isNortheastChapter) {
      // Draw 7 Northeast states only for Northeast chapter
      neStatesData.forEach(stFeat => {
        if (!stFeat.polygons) return;

        const stName = stFeat.stName;
        const isSelected = activeRegion?.toUpperCase() === stName;
        const isHovered = hoveredZone === stName;
        const color = NE_STATE_COLORS[stName] || '#818cf8';

        ctx.fillStyle = isSelected ? color + 'dd' : (isHovered ? color + 'aa' : color + '44');
        ctx.strokeStyle = isSelected ? '#ffffff' : color;
        ctx.lineWidth = isSelected ? 2 : 1;

        stFeat.polygons.forEach(poly => {
          const outerRing = poly[0];
          if (!outerRing) return;

          ctx.beginPath();
          outerRing.forEach((pt, idx) => {
            const [x, y] = project(pt[0], pt[1]);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        if (stFeat.centroid) {
          const [cx, cy] = project(stFeat.centroid[0], stFeat.centroid[1]);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 4;
          const displayLabel = stName === 'ARUNACHAL PRADESH' ? 'ARUNACHAL' : (stName === 'MEGHALAYA' ? 'MEGHALAYA' : stName);
          ctx.fillText(displayLabel, cx, cy);
          ctx.shadowBlur = 0;
        }
      });
    } else {
      // Revert to Full India Physiographic Divisions Map for "Indian Geography & Environment"
      const zoneColors = isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS;

      indiaGeoData.forEach(feature => {
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
          fillStyle = (zoneColors[zone] || '#818cf8') + '22';
          strokeStyle = (zoneColors[zone] || '#818cf8') + '33';
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
    }

  }, [indiaGeoData, neStatesData, activeRegion, hoveredZone, isAssam, isNortheastChapter, loading]);

  // Handle Mouse Events
  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { minLon, maxLon, minLat, maxLat } = boundsRef.current;
    const clickLon = minLon + (x / canvas.width) * (maxLon - minLon);
    const clickLat = minLat + ((canvas.height - y) / canvas.height) * (maxLat - minLat);

    let nearestFeature = null;
    let minDist = Infinity;

    if (isNortheastChapter) {
      neStatesData.forEach(s => {
        if (!s.centroid) return;
        const dLon = s.centroid[0] - clickLon;
        const dLat = s.centroid[1] - clickLat;
        const dist = dLon * dLon + dLat * dLat;
        if (dist < minDist) {
          minDist = dist;
          nearestFeature = { zone: s.stName };
        }
      });
    } else {
      indiaGeoData.forEach(f => {
        if (!f.centroid) return;
        const dLon = f.centroid[0] - clickLon;
        const dLat = f.centroid[1] - clickLat;
        const dist = dLon * dLon + dLat * dLat;
        if (dist < minDist) {
          minDist = dist;
          nearestFeature = f;
        }
      });
    }

    const threshold = isNortheastChapter ? 0.6 : (isAssam ? 0.08 : 1.2);
    if (nearestFeature && minDist < threshold) {
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

  if (loading) {
    return (
      <div style={{ height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem' }}>Loading Interactive Map...</span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const currentLegend = isNortheastChapter ? NE_STATE_COLORS : (isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS);

  return (
    <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 0.5rem', fontSize: '0.95rem', color: 'var(--primary)' }}>
        {isNortheastChapter 
          ? '🗺️ Northeast India Map (The Seven Sisters)' 
          : (isAssam ? '🗺️ Assam Sub-Regional Map' : '🗺️ Physical & Physiographic Divisions of India')}
      </h4>
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
      <div style={{ display: 'grid', gridTemplateColumns: isNortheastChapter ? 'repeat(4, 1fr)' : (isAssam ? '1fr' : 'repeat(3, 1fr)'), gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
        {Object.entries(currentLegend).map(([zone, color]) => {
          const isSelected = activeRegion?.toUpperCase() === zone || activeRegion === zone || hoveredZone === zone;
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
