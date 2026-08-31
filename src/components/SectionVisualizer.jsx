import React from 'react';
import vizData from '../data/Geography.json';
import { isNameMatch } from '../utils/stringMatcher';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { VerticalDivisionsVisual } from './visualizers/VerticalDivisionsVisual';
import { SubdivisionsWestEastVisual } from './visualizers/SubdivisionsWestEastVisual';
import { SoilProfileVisual } from './visualizers/SoilProfileVisual';
import { RegionalPlainsVisual } from './visualizers/RegionalPlainsVisual';
import { PlateauGridVisual } from './visualizers/PlateauGridVisual';
import { DeccanPlateauVisual } from './visualizers/DeccanPlateauVisual';
import { MountainRangesGhatsVisual } from './visualizers/MountainRangesGhatsVisual';
import { TharDesertVisual } from './visualizers/TharDesertVisual';
import { CoastalPlainsVisual } from './visualizers/CoastalPlainsVisual';
import { MajorIslandsVisual } from './visualizers/MajorIslandsVisual';
import { RiverFlowVisual } from './visualizers/RiverFlowVisual';
import { WNHSSitesVisual } from './visualizers/WNHSSitesVisual';
import { BiosphereReservesVisual } from './visualizers/BiosphereReservesVisual';
import { StateProfileVisual } from './visualizers/StateProfileVisual';
import { HillRangesVisual } from './visualizers/HillRangesVisual';
import { BrahmaputraValleyVisual } from './visualizers/BrahmaputraValleyVisual';
import { TributariesBankVisual } from './visualizers/TributariesBankVisual';
import { CentralPlateauVisual } from './visualizers/CentralPlateauVisual';
import { TransportVisual } from './visualizers/TransportVisual';

export function getVizIdea(sectionName) {
  if (!sectionName) return null;
  const list = vizData.SectionVisualisations || [];
  const found = list.find(v => isNameMatch(v.SectionName, sectionName));
  return found ? found.VisualisationIdea : null;
}

export function SectionVisualizer({ sectionName = '', facts = [] }) {
  const idea = getVizIdea(sectionName);
  const cleanName = (sectionName || '').trim();
  const lowerName = cleanName.toLowerCase();

  // 0. Transport Visualizers
  if (lowerName.includes('national highway') || lowerName.includes('nh-')) return <TransportVisual mode="nh" />;
  if (lowerName.includes('railway') || lowerName.includes('nfr')) return <TransportVisual mode="railway" />;
  if (lowerName.includes('waterway') || lowerName.includes('transport') || lowerName.includes('nw-')) return <TransportVisual mode="waterway" />;

  // 1. Central Plateau & Hills
  if (lowerName.includes('central plateau') || lowerName.includes('central hills') || lowerName.includes('karbi anglong') || lowerName.includes('haflong')) {
    return <CentralPlateauVisual />;
  }

  // 2. Bank Tributaries
  if (lowerName.includes('north bank') || lowerName.includes('south bank')) {
    return <TributariesBankVisual sectionName={cleanName} />;
  }

  // 3. Brahmaputra Valley
  if (lowerName.includes('brahmaputra valley')) {
    return <BrahmaputraValleyVisual />;
  }

  // 4. Hill Ranges
  if (lowerName.includes('major hill ranges') || lowerName.includes('hill ranges')) {
    return <HillRangesVisual sectionName={cleanName} />;
  }

  // 5. WNHS & Heritage Sites
  if (lowerName.includes('kaziranga') || lowerName.includes('manas') || lowerName.includes('moidam') || lowerName.includes('khangchendzonga') || lowerName.includes('heritage') || lowerName.includes('wnhs')) {
    return <WNHSSitesVisual activeSection={cleanName} />;
  }

  // 6. Biosphere Reserves
  if (lowerName.includes('biosphere') || lowerName.includes('reserve') || lowerName.includes('nokrek') || lowerName.includes('dihang') || lowerName.includes('dibru')) {
    return <BiosphereReservesVisual activeSection={cleanName} />;
  }

  // 7. State Profiles (Arunachal, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura)
  if (lowerName.includes('profile') || lowerName.includes('state') || lowerName.includes('arunachal') || lowerName.includes('manipur') || lowerName.includes('meghalaya') || lowerName.includes('mizoram') || lowerName.includes('nagaland') || lowerName.includes('tripura')) {
    let stateName = cleanName.replace(/profile/i, '').trim() || 'Northeast State';
    let capital = 'State Capital';
    let animal = 'State Animal';
    let bird = 'State Bird';
    let flower = 'State Flower';
    let peak = 'Highest Mountain Peak';
    let park = 'Protected Parks';
    let fauna = 'Conserved Fauna';
    let hills = 'Major Hills';

    facts.forEach(f => {
      const fl = f.toLowerCase();
      if (fl.includes('capital:')) capital = f.split(':')[1].trim();
      if (fl.includes('animal')) animal = f.includes('(') ? f.split('(')[1].split(')')[0] : f;
      if (fl.includes('bird')) bird = f.includes('(') ? f.split('(')[1].split(')')[0] : f;
      if (fl.includes('flower')) flower = f.includes('(') ? f.split('(')[1].split(')')[0] : f;
      if (fl.includes('fauna:')) fauna = f.split(':')[1].trim();
      if (fl.includes('parks:')) park = f.split(':')[1].trim();
      if (fl.includes('peak:')) peak = f.split(':')[1].trim();
      if (fl.includes('hills:')) hills = f.split(':')[1].trim();
    });

    return (
      <StateProfileVisual 
        stateName={stateName} 
        capital={capital} 
        animal={animal} 
        bird={bird} 
        flower={flower} 
        peak={peak} 
        park={park} 
        fauna={fauna}
        hills={hills}
      />
    );
  }

  // 8. Vertical Divisions
  if (lowerName.includes('vertical division') || lowerName.includes('himadri') || lowerName.includes('shiwalik')) {
    return <VerticalDivisionsVisual />;
  }

  // 9. Subdivisions (West to East)
  if (lowerName.includes('subdivision') || lowerName.includes('west to east') || lowerName.includes('syntaxial')) {
    return <SubdivisionsWestEastVisual />;
  }

  // 10. Formation & Soil
  if (lowerName.includes('soil') || lowerName.includes('formation')) {
    return <SoilProfileVisual />;
  }

  // 11. Regional Divisions / Plains
  if (lowerName.includes('regional division') || lowerName.includes('plain')) {
    return <RegionalPlainsVisual />;
  }

  // 12. Central Highlands
  if (lowerName.includes('central highland') || lowerName.includes('midland') || lowerName.includes('malwa')) {
    return <PlateauGridVisual />;
  }

  // 13. Deccan Plateau
  if (lowerName.includes('deccan')) {
    return <DeccanPlateauVisual />;
  }

  // 14. Mountain Ranges & Peaks
  if (lowerName.includes('mountain range') || lowerName.includes('ghat') || lowerName.includes('nilgiri')) {
    return <MountainRangesGhatsVisual />;
  }

  // 15. Thar Desert
  if (lowerName.includes('desert') || lowerName.includes('thar')) {
    return <TharDesertVisual />;
  }

  // 16. Coastal Plains
  if (lowerName.includes('coastal')) {
    return <CoastalPlainsVisual />;
  }

  // 17. Islands
  if (lowerName.includes('island') || lowerName.includes('andaman') || lowerName.includes('lakshadweep')) {
    return <MajorIslandsVisual />;
  }

  // 18. River Flow Systems (Indus, Ganga, Brahmaputra, Peninsular)
  if (lowerName.includes('system') || lowerName.includes('indus') || lowerName.includes('ganga') || lowerName.includes('river') || lowerName.includes('flowing')) {
    return <RiverFlowVisual riverName={cleanName} />;
  }

  // Universal Animated Visualizer Canvas Fallback
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sparkles size={18} color="#34d399" />
        <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 900 }}>
          Interactive Concept Breakdown: {cleanName}
        </h5>
      </div>
      
      {/* Animated Concept Pulse Canvas */}
      <div style={{ height: '65px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
          style={{ width: '35%', height: '3px', background: 'linear-gradient(90deg, transparent, #34d399, transparent)', position: 'absolute' }}
        />
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5, zIndex: 1, fontWeight: 600 }}>
          💡 {idea || `Physiographic features, spatial boundaries, and key exam facts for ${cleanName}.`}
        </p>
      </div>
    </div>
  );
}
