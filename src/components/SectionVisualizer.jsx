import indiaViz from '../data/india/Viz.json';
import assamViz from '../data/assam/Viz.json';
import neViz from '../data/northeast/Viz.json';

const vizData = {
  SectionVisualisations: [
    ...(indiaViz.SectionVisualisations || []),
    ...(assamViz.SectionVisualisations || []),
    ...(neViz.SectionVisualisations || [])
  ]
};
import { VerticalDivisionsVisual } from './visualizers/VerticalDivisionsVisual';
import { SubdivisionsWestEastVisual } from './visualizers/SubdivisionsWestEastVisual';
import { GeneralStructureVisual } from './visualizers/GeneralStructureVisual';
import { SoilProfileVisual } from './visualizers/SoilProfileVisual';
import { RegionalPlainsVisual } from './visualizers/RegionalPlainsVisual';
import { PlateauGridVisual } from './visualizers/PlateauGridVisual';
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

export function getVizIdea(sectionName) {
  if (!sectionName) return null;
  const list = vizData.SectionVisualisations || [];
  const cleanTarget = sectionName.replace(/\[cite:\s*\d+\]/g, '').trim().toLowerCase();
  
  let found = list.find(v => v.SectionName.replace(/\[cite:\s*\d+\]/g, '').trim().toLowerCase() === cleanTarget);
  if (!found) {
    found = list.find(v => cleanTarget.includes(v.SectionName.replace(/\[cite:\s*\d+\]/g, '').trim().toLowerCase()) || v.SectionName.toLowerCase().includes(cleanTarget));
  }
  return found ? found.VisualisationIdea : null;
}

export function SectionVisualizer({ sectionName, facts = [] }) {
  const idea = getVizIdea(sectionName);
  const cleanName = sectionName ? sectionName.replace(/\[cite:\s*\d+\]/g, '').trim() : '';

  // 1. Central Plateau & Hills Visualizer
  if (cleanName.includes('Central Plateau') || cleanName.includes('Karbi Anglong') || cleanName.includes('Haflong')) {
    return <CentralPlateauVisual />;
  }

  // 2. Specialized Bank Tributary Visualizer (North Bank vs South Bank)
  if (cleanName.includes('North Bank') || cleanName.includes('South Bank')) {
    return <TributariesBankVisual sectionName={cleanName} />;
  }

  // 3. Brahmaputra Valley KML Rivers Visualizer
  if (cleanName.includes('Brahmaputra Valley') || cleanName.includes('Brahmaputra')) {
    return <BrahmaputraValleyVisual />;
  }

  // 4. Major Hill Ranges Visualizer
  if (cleanName.includes('Major Hill Ranges')) {
    return <HillRangesVisual sectionName={cleanName} />;
  }

  // 5. WNHS Visualizer
  if (cleanName.includes('Kaziranga') || cleanName.includes('Manas') || cleanName.includes('Moidams') || cleanName.includes('Khangchendzonga') || cleanName.includes('Heritage')) {
    return <WNHSSitesVisual activeSection={cleanName} />;
  }

  // 6. Biosphere Reserves Visualizer
  if (cleanName.includes('Reserves') || cleanName.includes('Biosphere') || cleanName.includes('Schema') || cleanName.includes('Core, Buffer')) {
    return <BiosphereReservesVisual activeSection={cleanName} />;
  }

  // 4. State Profiles Visualizer (Arunachal, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Tripura)
  if (cleanName.includes('Administration & Symbols') || cleanName.includes('Ecology & Topography') || cleanName.includes('Profile')) {
    let stateName = 'Northeast State';
    let capital = 'State Capital';
    let animal = 'State Animal';
    let bird = 'State Bird';
    let flower = 'State Flower';
    let peak = 'Highest Mountain Peak';
    let park = 'Protected Parks';
    let fauna = 'Special Conserved Fauna';
    let hills = 'Major Hills';

    facts.forEach(f => {
      if (f.startsWith('Capital:')) capital = f.replace('Capital:', '').trim();
      if (f.startsWith('State Symbols:')) {
        const parts = f.replace('State Symbols:', '').split(',');
        animal = parts[0] || animal;
        bird = parts[1] || bird;
        flower = parts[2] || flower;
      }
      if (f.startsWith('Highest Peak:')) peak = f.replace('Highest Peak:', '').trim();
      if (f.startsWith('Important National Parks:')) park = f.replace('Important National Parks:', '').trim();
      if (f.startsWith('Special Conserved Fauna:')) fauna = f.replace('Special Conserved Fauna:', '').trim();
      if (f.startsWith('Major Hills:')) hills = f.replace('Major Hills:', '').trim();
    });

    if (capital.includes('Itanagar')) stateName = 'ARUNACHAL PRADESH';
    else if (capital.includes('Dispur')) stateName = 'ASSAM';
    else if (capital.includes('Imphal')) stateName = 'MANIPUR';
    else if (capital.includes('Shillong')) stateName = 'MEGHALAYA';
    else if (capital.includes('Aizawl')) stateName = 'MIZORAM';
    else if (capital.includes('Kohima')) stateName = 'NAGALAND';
    else if (capital.includes('Agartala')) stateName = 'TRIPURA';

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

  // 7. Vertical Divisions (South to North)
  if (cleanName.includes('Vertical Divisions (South to North)') || cleanName.includes('Vertical Divisions')) {
    return <VerticalDivisionsVisual />;
  }

  // 8. Subdivisions (West to East)
  if (cleanName.includes('Subdivisions (West to East)') || cleanName.includes('Subdivisions')) {
    return <SubdivisionsWestEastVisual />;
  }

  // 9. General Structure
  if (cleanName.includes('General Structure')) {
    return <GeneralStructureVisual idea={idea} />;
  }

  // 10. Formation & Soil
  if (cleanName.includes('Formation & Soil')) {
    return <SoilProfileVisual />;
  }

  // 11. Regional Divisions
  if (cleanName.includes('Regional Divisions')) {
    return <RegionalPlainsVisual />;
  }

  // 12. Central Highlands / Deccan Plateau
  if (cleanName.includes('Central Highlands') || cleanName.includes('Deccan Plateau')) {
    return <PlateauGridVisual />;
  }

  // 13. Mountain Ranges & Peaks
  if (cleanName.includes('Mountain Ranges & Peaks')) {
    return <MountainRangesGhatsVisual />;
  }

  // 14. Thar Desert
  if (cleanName.includes('Desert')) {
    return <TharDesertVisual />;
  }

  // 15. Western & Eastern Coastal Plains
  if (cleanName.includes('Coastal Plains')) {
    return <CoastalPlainsVisual />;
  }

  // 16. Major Island Groups
  if (cleanName.includes('Islands')) {
    return <MajorIslandsVisual />;
  }

  // 17. Rivers & Tributaries
  if (cleanName.includes('System') || cleanName.includes('River') || cleanName.includes('Tributaries')) {
    return <RiverFlowVisual riverName={cleanName} />;
  }

  // Fallback visualizer box if custom diagram is not matched
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
      <h5 style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>
        🎨 Interactive Concept Visualization
      </h5>
      {idea && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          💡 <em>{idea}</em>
        </p>
      )}
    </div>
  );
}
