import React, { useEffect, useRef, useState } from 'react';

const INDIA_ZONE_COLORS = {
  'Himalayan Mountains': '#2563eb', // Royal Indigo Blue
  'Northern Plains': '#059669',      // Emerald Green
  'Thar Desert': '#d97706',          // Warm Amber
  'Peninsular Plateau': '#ea580c',   // Terracotta Orange
  'Coastal Plains': '#7c3aed',       // Rich Purple
  'Islands': '#db2777'               // Rose Pink
};

const NE_STATE_COLORS = {
  'ASSAM': '#059669',
  'ARUNACHAL PRADESH': '#2563eb',
  'MEGHALAYA': '#d97706',
  'MANIPUR': '#7c3aed',
  'MIZORAM': '#db2777',
  'NAGALAND': '#ca8a04',
  'TRIPURA': '#0284c7'
};

const ASSAM_ZONE_COLORS = {
  'Brahmaputra Valley': '#059669', // Emerald Green for Brahmaputra Valley
  'Central Hills': '#d97706',      // Warm Ochre Gold for Central Hills
  'Barak Valley': '#2563eb'        // Deep Royal Blue for Barak Valley
};

const getAssamZoneCategory = (rawZone = '') => {
  if (!rawZone) return 'Brahmaputra Valley';
  const str = rawZone.toLowerCase();
  if (str.includes('brahmaputra')) return 'Brahmaputra Valley';
  if (str.includes('central') || str.includes('karbi') || str.includes('haflong') || str.includes('hills')) return 'Central Hills';
  if (str.includes('barak')) return 'Barak Valley';
  return 'Brahmaputra Valley';
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

  // Draw canvas with crisp high-contrast visibility
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
      // Draw 7 Northeast states with bold high-contrast visibility
      neStatesData.forEach(stFeat => {
        if (!stFeat.polygons) return;

        const stName = stFeat.stName;
        const isSelected = activeRegion?.toUpperCase() === stName;
        const isHovered = hoveredZone === stName;
        const color = NE_STATE_COLORS[stName] || '#2563eb';

        ctx.fillStyle = isSelected ? color : (isHovered ? color + 'bb' : color + '55');
        ctx.strokeStyle = isSelected ? '#18181b' : color;
        ctx.lineWidth = isSelected ? 2.5 : 1.2;

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
          ctx.fillStyle = '#18181b';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          const displayLabel = stName === 'ARUNACHAL PRADESH' ? 'ARUNACHAL' : (stName === 'MEGHALAYA' ? 'MEGHALAYA' : stName);
          ctx.fillText(displayLabel, cx, cy);
          ctx.shadowBlur = 0;
        }
      });
    } else {
      // Draw Assam 3 Distinct Parts OR India Physiographic Map
      indiaGeoData.forEach(feature => {
        if (!feature.polygons) return;

        const rawZone = feature.zone;
        const category = isAssam ? getAssamZoneCategory(rawZone) : rawZone;
        const baseColor = isAssam ? ASSAM_ZONE_COLORS[category] : (INDIA_ZONE_COLORS[rawZone] || '#2563eb');

        const isSelected = activeRegion === category || activeRegion === rawZone || (isAssam && activeRegion?.toLowerCase().includes(category.toLowerCase().split(' ')[0]));
        const isHovered = hoveredZone === category || hoveredZone === rawZone;

        let fillStyle = baseColor + '55';
        let strokeStyle = baseColor;
        let lineWidth = isAssam ? 1.2 : 0.8;

        if (isSelected) {
          fillStyle = baseColor;
          strokeStyle = '#18181b';
          lineWidth = isAssam ? 2.5 : 1.8;
        } else if (isHovered) {
          fillStyle = baseColor + 'bb';
          strokeStyle = '#18181b';
          lineWidth = isAssam ? 1.8 : 1.2;
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

      // Draw clear labels for Assam's 3 parts
      if (isAssam) {
        const labels = [
          { name: 'Brahmaputra Valley', coords: [92.6, 26.6] },
          { name: 'Central Hills', coords: [93.2, 25.6] },
          { name: 'Barak Valley', coords: [92.7, 24.8] }
        ];

        labels.forEach(lbl => {
          const [lx, ly] = project(lbl.coords[0], lbl.coords[1]);
          ctx.fillStyle = '#18181b';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.fillText(lbl.name, lx, ly);
          ctx.shadowBlur = 0;
        });
      }
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
      const zoneName = isAssam ? getAssamZoneCategory(nearestFeature.zone) : nearestFeature.zone;
      if (hoveredZone !== zoneName) {
        setHoveredZone(zoneName);
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
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-medium)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem' }}>Loading High-Contrast Map...</span>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const currentLegend = isNortheastChapter ? NE_STATE_COLORS : (isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS);

  return (
    <div style={{ position: 'relative', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h4 style={{ textAlign: 'center', margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 800 }}>
        {isNortheastChapter 
          ? '🗺️ Northeast India Map (The Seven Sisters)' 
          : (isAssam ? '🗺️ Assam 3 Sub-Regions (Valleys & Hills)' : '🗺️ Physical & Physiographic Divisions of India')}
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
          transition: 'filter 0.2s'
        }}
      />

      {/* Legend Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: isNortheastChapter ? 'repeat(auto-fit, minmax(110px, 1fr))' : 'repeat(3, 1fr)', gap: '0.65rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
        {Object.entries(currentLegend).map(([zone, color]) => {
          const isSelected = activeRegion?.toUpperCase() === zone.toUpperCase() || activeRegion === zone || hoveredZone === zone;
          return (
            <div
              key={zone}
              onMouseEnter={() => setHoveredZone(zone)}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => onSelectRegion(zone)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isSelected ? 800 : 500,
                opacity: hoveredZone && hoveredZone !== zone ? 0.45 : 1,
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block', flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={zone}>{zone}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
