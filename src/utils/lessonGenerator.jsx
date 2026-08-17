import React from 'react';

export function generateSectionPlayerData(topicObj, lessonName, unitName, chapterName, navTargets = {}) {
  const topicName = topicObj.topicName || topicObj.TopicName || topicObj.sectionName || topicObj.SectionName || 'Topic';
  const conceptUnits = topicObj.ConceptUnits || [];
  const practiceMatching = topicObj.PracticeMatching || [];

  // Fallback if ConceptUnits missing
  const units = conceptUnits.length > 0 ? conceptUnits : (topicObj.facts || topicObj.Facts || []).map((factStr, fIdx) => {
    const parts = factStr.split(':');
    const term = parts.length > 1 ? parts[0].trim() : `${topicName} Point ${fIdx + 1}`;
    const definition = parts.length > 1 ? parts.slice(1).join(':').trim() : factStr;
    return {
      Id: `topic-unit-${fIdx + 1}`,
      Fact: factStr,
      Flashcard: {
        Front: `What is a key feature of ${term} in ${topicName}?`,
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

  const matching = practiceMatching.length > 0 ? practiceMatching : (topicObj.facts || topicObj.Facts || []).map((factStr, fIdx) => {
    const parts = factStr.split(':');
    const term = parts.length > 1 ? parts[0].trim() : `${topicName} Point ${fIdx + 1}`;
    const definition = parts.length > 1 ? parts.slice(1).join(':').trim() : factStr;
    return {
      Term: term,
      Definition: definition.length > 70 ? definition.substring(0, 67) + '...' : definition
    };
  });

  return {
    chapterName: chapterName || 'ASSAM',
    unitName: unitName || 'Syllabus Unit',
    lessonName: lessonName || 'Lesson',
    topicName: topicName,
    title: topicName,
    conceptUnits: units,
    practiceMatching: matching,
    visualisationIdea: topicObj.VisualisationIdea || null,
    navTargets
  };
}

export function generateLessonPlayerData(lessonName, unitName, chapterName, topics, navTargets = {}) {
  const conceptUnits = [];
  const practiceMatching = [];

  (topics || []).forEach(t => {
    if (t.ConceptUnits && Array.isArray(t.ConceptUnits)) {
      conceptUnits.push(...t.ConceptUnits);
    }
    if (t.PracticeMatching && Array.isArray(t.PracticeMatching)) {
      practiceMatching.push(...t.PracticeMatching);
    }
  });

  return {
    chapterName: chapterName || 'ASSAM',
    unitName: unitName || 'Syllabus Unit',
    lessonName: lessonName,
    topicName: `${lessonName} (All Topics)`,
    title: lessonName,
    conceptUnits,
    practiceMatching,
    navTargets
  };
}

export const generateInteractiveLesson = generateLessonPlayerData;
