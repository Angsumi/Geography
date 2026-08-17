import React from 'react';
import { SectionVisualizer } from '../components/SectionVisualizer';

export function generateInteractiveLesson(subtopicName, topicName, subjectName, sections, sectionActivity) {
  const allFacts = [];
  sections.forEach(sec => {
    (sec.facts || []).forEach(f => {
      allFacts.push({ sectionName: sec.sectionName, fact: f });
    });
  });

  const flashcards = sectionActivity?.flashcards || [];
  const mcqs = sectionActivity?.mcqs || [];
  const matchPairs = sectionActivity?.match || [];

  const mainSectionName = sections[0]?.sectionName || subtopicName;
  const firstFact = allFacts[0]?.fact || `${subtopicName} is a key geographical division in ${subjectName}.`;
  const secondFact = allFacts[1]?.fact || allFacts[0]?.fact || `Important feature of ${subtopicName}.`;

  const primaryMCQ = mcqs[0] || {
    question: `Which statement correctly describes ${subtopicName} in ${subjectName} geography?`,
    options: {
      A: firstFact,
      B: 'It represents an arid landform exclusive to Western Australia.',
      C: 'It is a glaciated oceanic trench system in the South Pacific.',
      D: 'It is a volcanic island arc formation in the Caribbean Sea.'
    },
    correctAnswer: 'A',
    explanation: `According to ${subjectName} geography syllabus: ${firstFact}`
  };

  const secondaryMCQ = mcqs[1] || (mcqs.length > 0 ? mcqs[0] : {
    question: `Regarding ${subtopicName}, which of the following is accurate?`,
    options: {
      A: 'It has no river drainage connection or ecological significance.',
      B: secondFact,
      C: 'It is an active subduction rift valley located in Iceland.',
      D: 'It represents a polar continental shield in Antarctica.'
    },
    correctAnswer: 'B',
    explanation: `${secondFact}`
  });

  const steps = [
    {
      type: 'hook',
      title: `Explore ${subtopicName}`,
      question: `What makes ${subtopicName} significant in ${subjectName} geography?`,
      text: `${subtopicName} is a core unit under ${topicName}. It defines key physical landforms, drainage networks, climate patterns, and ecological reserves.`
    },
    {
      type: 'predict',
      title: 'Predict & Test Your Understanding',
      question: primaryMCQ.question,
      options: primaryMCQ.options,
      correctAnswer: primaryMCQ.correctAnswer,
      explanation: primaryMCQ.explanation
    },
    {
      type: 'concept',
      title: `${subtopicName} Structural Diagram`,
      text: `Key Geographical Principle: ${firstFact}`,
      VisualizerComponent: () => (
        <div style={{ margin: '0.5rem 0' }}>
          <SectionVisualizer sectionName={mainSectionName} facts={sections[0]?.facts || []} />
        </div>
      )
    },
    {
      type: 'exam_check',
      title: 'ADRE & APSC Competitive Exam Connection',
      examBadge: `${subjectName} EXAM CHECK`,
      examFact: `High-Yield Fact: ${firstFact}`,
      pastQuestionContext: `Frequently tested topic under ${topicName} for competitive recruitment examinations.`
    },
    {
      type: 'predict',
      title: 'Exam-Level Application Question',
      question: secondaryMCQ.question,
      options: secondaryMCQ.options,
      correctAnswer: secondaryMCQ.correctAnswer,
      explanation: secondaryMCQ.explanation
    },
    {
      type: 'concept',
      title: 'Key Sub-Basin & Regional Features',
      text: `Further Insights: ${secondFact}`
    },
    {
      type: 'recap',
      title: 'Summary Takeaways',
      highlights: allFacts.length > 0
        ? allFacts.slice(0, 4).map(f => `${f.sectionName !== 'General Overview' ? f.sectionName + ': ' : ''}${f.fact}`)
        : [`Key feature of ${subtopicName} under ${topicName}.`, `Essential for ${subjectName} competitive examination syllabus.`]
    }
  ];

  return {
    id: `auto-${subtopicName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    topicName: `${subjectName} · ${topicName}`,
    title: subtopicName,
    description: `Interactive step-by-step Brilliant.org learning module for ${subtopicName}.`,
    steps
  };
}
