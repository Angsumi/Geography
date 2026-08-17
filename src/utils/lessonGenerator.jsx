import React from 'react';

export function generateSectionPlayerData(sectionObj, subtopicName, topicName, subjectName) {
  const secName = sectionObj.sectionName || sectionObj.SectionName || 'Section';
  const conceptUnits = sectionObj.ConceptUnits || [];
  const practiceMatching = sectionObj.PracticeMatching || [];

  // Fallback if ConceptUnits missing
  const units = conceptUnits.length > 0 ? conceptUnits : (sectionObj.facts || sectionObj.Facts || []).map((factStr, fIdx) => {
    const parts = factStr.split(':');
    const term = parts.length > 1 ? parts[0].trim() : `${secName} Point ${fIdx + 1}`;
    const definition = parts.length > 1 ? parts.slice(1).join(':').trim() : factStr;
    return {
      Id: `sec-unit-${fIdx + 1}`,
      Fact: factStr,
      Flashcard: {
        Front: `What is a key geographical feature of ${term} in ${secName}?`,
        Back: definition,
        Image: null
      },
      Quiz: {
        Question: `Which statement accurately describes ${term}?`,
        Options: {
          A: definition,
          B: 'Arid rain-shadow plateau landform in Deccan interior.',
          C: 'High-altitude glaciated oceanic trench system.',
          D: 'Saline mangrove delta wetland in West Bengal.'
        },
        CorrectAnswer: 'A',
        Explanation: `Official Syllabus Fact: ${definition}`
      }
    };
  });

  const matching = practiceMatching.length > 0 ? practiceMatching : (sectionObj.facts || sectionObj.Facts || []).map((factStr, fIdx) => {
    const parts = factStr.split(':');
    const term = parts.length > 1 ? parts[0].trim() : `${secName} Point ${fIdx + 1}`;
    const definition = parts.length > 1 ? parts.slice(1).join(':').trim() : factStr;
    return {
      Term: term,
      Definition: definition.length > 70 ? definition.substring(0, 67) + '...' : definition
    };
  });

  return {
    subtopicName: secName,
    topicName: `${subjectName || 'Geography'} · ${topicName || 'Syllabus'} (${subtopicName || 'Topic'})`,
    title: secName,
    sectionName: secName,
    conceptUnits: units,
    practiceMatching: matching,
    visualisationIdea: sectionObj.VisualisationIdea || null
  };
}

export function generateLessonPlayerData(subtopicName, topicName, subjectName, sections, sectionActivity) {
  const conceptUnits = [];
  const practiceMatching = [];

  (sections || []).forEach(sec => {
    if (sec.ConceptUnits && Array.isArray(sec.ConceptUnits)) {
      conceptUnits.push(...sec.ConceptUnits);
    }
    if (sec.PracticeMatching && Array.isArray(sec.PracticeMatching)) {
      practiceMatching.push(...sec.PracticeMatching);
    }
  });

  if (conceptUnits.length === 0) {
    (sections || []).forEach(sec => {
      (sec.facts || sec.Facts || []).forEach((factStr, fIdx) => {
        const parts = factStr.split(':');
        const term = parts.length > 1 ? parts[0].trim() : `${sec.sectionName || subtopicName} Point ${fIdx + 1}`;
        const definition = parts.length > 1 ? parts.slice(1).join(':').trim() : factStr;

        conceptUnits.push({
          Id: `unit-${fIdx + 1}`,
          Fact: factStr,
          Flashcard: {
            Front: `What is a key feature of ${term}?`,
            Back: definition,
            Image: null
          },
          Quiz: {
            Question: `Which statement describes ${term} in ${subtopicName}?`,
            Options: {
              A: definition,
              B: 'It is an arid rain-shadow plateau in Deccan interior.',
              C: 'It forms part of the mangrove delta in Sundarbans.',
              D: 'It is a glaciated oceanic trench system.'
            },
            CorrectAnswer: 'A',
            Explanation: `Official ${subjectName} Syllabus Fact: ${definition}`
          }
        });

        practiceMatching.push({
          Term: term,
          Definition: definition.length > 70 ? definition.substring(0, 67) + '...' : definition
        });
      });
    });
  }

  return {
    subtopicName,
    topicName: `${subjectName} · ${topicName}`,
    title: subtopicName,
    conceptUnits,
    practiceMatching
  };
}

export const generateInteractiveLesson = generateLessonPlayerData;
