import React, { useEffect, useRef, useState } from 'react';

const HIMALAYAN_STATES = [
  "JAMMU & KASHMIR", "HIMACHAL PRADESH", "UTTARAKHAND", "SIKKIM", 
  "ARUNACHAL PRADESH", "NAGALAND", "MANIPUR", "MIZORAM", 
  "TRIPURA", "MEGHALAYA", "ASSAM", "LADAKH"
];
const COASTAL_STATES = [
  "GOA", "GUJARAT", "MAHARASHTRA", "KARNATAKA", "KERALA", 
  "TAMIL NADU", "ANDHRA PRADESH", "ODISHA", "WEST BENGAL", "PUDUCHERRY"
];
const ISLAND_STATES = ["ANDAMAN & NICOBAR", "LAKSHADWEEP"];

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

function getIndiaZone(state, district) {
  state = (state || '').toUpperCase().trim();
  district = (district || '').toUpperCase().trim();

  if (HIMALAYAN_STATES.includes(state)) {
    return 'Himalayan Mountains';
  }
  if (ISLAND_STATES.includes(state)) {
    return 'Islands';
  }
  if (state === 'RAJASTHAN') {
    const desertDistricts = ['JAISALMER', 'BARMER', 'BIKANER', 'JODHPUR', 'JALOR', 'NAGAUR', 'CHURU', 'JHUNJHUNU', 'SIKAR', 'PALI', 'GANGANAGAR', 'HANUMANGARH'];
    if (desertDistricts.some(d => district.includes(d))) return 'Thar Desert';
    return 'Peninsular Plateau';
  }
  if (COASTAL_STATES.includes(state)) {
    const coastalDistricts = [
      'KUTCH', 'JAMNAGAR', 'PORBANDAR', 'JUNAGADH', 'AMRELI', 'BHAVNAGAR', 'ANAND', 'BHARUCH', 'SURAT', 'NAVSARI', 'VALSAD',
      'THANE', 'MUMBAI', 'RAIGAD', 'RATNAGIRI', 'SINDHUDURG', 'GOA',
      'UTTARA KANNADA', 'UDUPI', 'DAKSHINA KANNADA',
      'KASARAGOD', 'KANNUR', 'KOZHIKODE', 'MALAPPURAM', 'THRISSUR', 'ERNAKULAM', 'ALAPPUZHA', 'KOLLAM', 'THIRUVANANTHAPURAM',
      'KANNYAKUMARI', 'TIRUNELVELI', 'THOOTHUKUDI', 'RAMANATHAPURAM', 'PUDUKKOTTAI', 'THANJAVUR', 'TIRUVARUR', 'NAGAPATTINAM', 'CUDDALORE', 'KANCHIPURAM', 'CHENNAI', 'TIRUVALLUR',
      'NELLORE', 'PRAKASAM', 'GUNTUR', 'KRISHNA', 'WEST GODAVARI', 'EAST GODAVARI', 'VISAKHAPATNAM', 'VIZIANAGARAM', 'SRIKAKULAM',
      'GANJAM', 'PURI', 'JAGATSINGHPUR', 'KENDRAPARA', 'BHADRAK', 'BALASORE',
      'SOUTH 24 PARGANAS', 'NORTH 24 PARGANAS', 'PURBA MEDINIPUR'
    ];
    if (coastalDistricts.some(d => district.includes(d))) return 'Coastal Plains';
  }

  const plainsStates = ['PUNJAB', 'HARYANA', 'UTTAR PRADESH', 'BIHAR', 'DELHI', 'CHANDIGARH', 'WEST BENGAL'];
  if (plainsStates.includes(state)) {
    return 'Northern Plains';
  }

  return 'Peninsular Plateau';
}

function getAssamZone(district) {
  district = (district || '').toUpperCase().trim();
  
  const barakDistricts = ['CACHAR', 'HAILAKANDI', 'KARIMGANJ'];
  if (barakDistricts.some(d => district.includes(d))) {
    return 'Barak Valley';
  }

  const centralHillsDistricts = ['KARBI ANGLONG', 'DIMA HASAO', 'WEST KARBI ANGLONG', 'NORTH CACHAR HILLS'];
  if (centralHillsDistricts.some(d => district.includes(d)) || district.includes('HILL') || district.includes('ANGLONG') || district.includes('HASAO')) {
    return 'Central Plateau/Hills (Karbi Anglong, Haflong)';
  }

  return 'Brahmaputra Valley (Sadiya to Dhubri, floods)';
}

export default function GeographyMap({ activeRegion, onSelectRegion, isAssam }) {
  const canvasRef = useRef(null);
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredZone, setHoveredZone] = useState(null);
  const boundsRef = useRef({ minLon: 68, maxLon: 98, minLat: 6, maxLat: 38 });
  const rawFeaturesRef = useRef([]);

  // Load the GeoJSON file once
  useEffect(() => {
    fetch('/INDIAN_SUB_DISTRICTS.geojson')
      .then(res => res.json())
      .then(data => {
        // Calculate centroid once and cache raw features
        rawFeaturesRef.current = data.features.map(f => {
          let sumLon = 0, sumLat = 0, count = 0;
          const processCoords = (coords) => {
            if (typeof coords[0] === 'number') {
              sumLon += coords[0];
              sumLat += coords[1];
              count++;
            } else {
              coords.forEach(processCoords);
            }
          };
          if (f.geometry && f.geometry.coordinates) {
            processCoords(f.geometry.coordinates);
          }
          return {
            ...f,
            centroid: count > 0 ? [sumLon / count, sumLat / count] : null
          };
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load geojson", err);
        setLoading(false);
      });
  }, []);

  // Filter features and calculate bounds when view mode (India/Assam) changes
  useEffect(() => {
    if (rawFeaturesRef.current.length === 0) return;

    let filtered = [];
    if (isAssam) {
      filtered = rawFeaturesRef.current
        .filter(f => f.properties.stname && f.properties.stname.toUpperCase() === 'ASSAM')
        .map(f => ({
          ...f,
          zone: getAssamZone(f.properties.dtname)
        }));
    } else {
      filtered = rawFeaturesRef.current.map(f => ({
        ...f,
        zone: getIndiaZone(f.properties.stname, f.properties.dtname)
      }));
    }

    // Compute tighter bounding box for the filtered features
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
      // Add margin padding (larger margin for Assam to preserve ratio)
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

  // Redraw canvas when data, activeRegion, or hoveredZone changes
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

    // Helper: keep aspect ratio
    const project = (lon, lat) => {
      const x = ((lon - minLon) / lonRange) * width;
      const y = height - ((lat - minLat) / latRange) * height; // flip Y
      return [x, y];
    };

    const zoneColors = isAssam ? ASSAM_ZONE_COLORS : INDIA_ZONE_COLORS;

    // Draw all features
    geoData.forEach(feature => {
      if (!feature.geometry || !feature.geometry.coordinates) return;

      const zone = feature.zone;
      const isSelected = activeRegion === zone || (isAssam && activeRegion?.startsWith(zone.substring(0, 10)));
      const isHovered = hoveredZone === zone;

      // Color coding
      let fillStyle = 'rgba(255, 255, 255, 0.03)';
      let strokeStyle = 'rgba(255, 255, 255, 0.08)';
      let lineWidth = isAssam ? 0.8 : 0.4;

      if (isSelected) {
        fillStyle = zoneColors[zone] + '99'; // 60% opacity
        strokeStyle = '#ffffff';
        lineWidth = isAssam ? 1.5 : 1;
      } else if (isHovered) {
        fillStyle = zoneColors[zone] + '55'; // 33% opacity
        strokeStyle = zoneColors[zone];
        lineWidth = isAssam ? 1.2 : 0.8;
      } else {
        fillStyle = zoneColors[zone] + '22'; // 13% opacity
        strokeStyle = zoneColors[zone] + '33';
      }

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;

      const drawPolygon = (polygon) => {
        ctx.beginPath();
        polygon.forEach((ring) => {
          ring.forEach((coord, j) => {
            const [x, y] = project(coord[0], coord[1]);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      const coords = feature.geometry.coordinates;
      if (feature.geometry.type === 'Polygon') {
        drawPolygon(coords);
      } else if (feature.geometry.type === 'MultiPolygon') {
        coords.forEach(drawPolygon);
      }
    });

  }, [geoData, activeRegion, hoveredZone, isAssam]);

  // Handle Mouse Hover/Click
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
        <span style={{ fontSize: '0.9rem' }}>Parsing 5.9MB GeoJSON Sub-district Coordinates...</span>
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
