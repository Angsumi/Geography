import { BrahmaputraValleyVisual } from '../../components/visualizers/BrahmaputraValleyVisual';
import { TributariesBankVisual } from '../../components/visualizers/TributariesBankVisual';
import { BiosphereReservesVisual } from '../../components/visualizers/BiosphereReservesVisual';
import { CentralPlateauVisual } from '../../components/visualizers/CentralPlateauVisual';
import { StateProfileVisual } from '../../components/visualizers/StateProfileVisual';

export const ASSAM_INTERACTIVE_LESSONS = [
  {
    id: 'brahmaputra-entry-valley',
    topicName: 'Physical Geography & Rivers',
    title: 'The Course & Valley of the Brahmaputra',
    description: 'Master the entry, tributary dynamics, and physical divisions of Assam\'s primary river system.',
    steps: [
      {
        type: 'hook',
        question: 'How does the mighty Yarlung Tsangpo become the Brahmaputra in Assam?',
        text: ' Originating from the Chemayungdung glacier in Tibet as the Yarlung Tsangpo, this river cuts through the Himalayas near Namcha Barwa before cascading into India.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80'
      },
      {
        type: 'predict',
        question: 'Where does the river enter Arunachal Pradesh before joining other tributaries to form the Brahmaputra?',
        options: {
          A: 'Passes near Tawang as the Subansiri',
          B: 'Enters near Pasighat as the Siang (Dihang)',
          C: 'Enters near Tezpur as the Jia Bharali',
          D: 'Flows directly through Guwahati'
        },
        correctAnswer: 'B',
        explanation: 'Correct! The river enters Arunachal Pradesh near Pasighat under the name Siang (or Dihang). At Kobo, near Sadiya in Assam, it meets the Dibang and Lohit rivers to officially form the Brahmaputra.'
      },
      {
        type: 'concept',
        title: 'Brahmaputra Valley Structural Overview',
        text: 'The Brahmaputra Valley spans approximately 56,000 sq km between the Eastern Himalayas to the north and the Karbi Anglong / Shillong Plateau to the south. It is an active alluvial valley with high silt loads.',
        VisualizerComponent: BrahmaputraValleyVisual
      },
      {
        type: 'exam_check',
        title: 'High-Yield ADRE / APSC Fact',
        examBadge: 'ADRE GRADE 3 / APSC CCE',
        examFact: 'The Brahmaputra enters Assam near Sadiya (Tinsukia district) and leaves Assam near Dhubri (flowing south into Bangladesh as the Jamuna). Total length in Assam is ~720 km.',
        pastQuestionContext: 'Repeatedly asked in ADRE 2022/2024 regarding entry point (Sadiya) and exit point (Dhubri).'
      },
      {
        type: 'predict',
        question: 'Which of the following is the LARGEST North Bank tributary of the Brahmaputra in Assam?',
        options: {
          A: 'Burhi Dihing',
          B: 'Dhansiri',
          C: 'Subansiri',
          D: 'Kopili'
        },
        correctAnswer: 'C',
        explanation: 'Subansiri is the largest north bank tributary. North bank tributaries generally originate in the Himalayas, are snow-fed, carry heavy silt loads, and cause frequent flash floods in Upper and Central Assam.'
      },
      {
        type: 'recap',
        title: 'Brahmaputra Summary Takeaways',
        highlights: [
          'Entry at Sadiya (Tinsukia) → Exit at Dhubri into Bangladesh as Jamuna.',
          'Formed by confluence of Siang, Dibang, and Lohit at Kobo near Sadiya.',
          'Subansiri is the largest North Bank tributary; Dhansiri & Kopili are South Bank tributaries.',
          'Majuli in Majuli district is the world\'s largest inhabited river island situated on the Brahmaputra.'
        ]
      }
    ]
  },
  {
    id: 'assam-national-parks',
    topicName: 'Wildlife & Environment',
    title: '7 Declared National Parks of Assam',
    description: 'Learn the location, river connections, and key protected species of all 7 National Parks.',
    steps: [
      {
        type: 'hook',
        question: 'Did you know Assam holds the 3rd highest number of National Parks in India?',
        text: 'Assam is home to 7 UNESCO World Heritage & National Parks, preserving rare species like the One-Horned Rhinoceros, Pygmy Hog, and Golden Langur.',
        image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1200&auto=format&fit=crop&q=80'
      },
      {
        type: 'predict',
        question: 'Which TWO National Parks were declared most recently in June 2021?',
        options: {
          A: 'Kaziranga and Manas',
          B: 'Raimona and Dehing Patkai',
          C: 'Dibru-Saikhowa and Nameri',
          D: 'Orang and Kaziranga'
        },
        correctAnswer: 'B',
        explanation: 'Raimona (in Kokrajhar district, 6th NP) and Dehing Patkai (in Dibrugarh & Tinsukia districts, 7th NP) were notified in June 2021!'
      },
      {
        type: 'concept',
        title: 'Protected Reserves Network Map',
        text: 'Kaziranga (Golaghat/Nagaon/Karbi Anglong) and Manas (Chirang/Baksa) are UNESCO World Heritage Sites. Dibru-Saikhowa is famous for Feral Horses and White-winged wood duck.',
        VisualizerComponent: BiosphereReservesVisual
      },
      {
        type: 'exam_check',
        title: 'ADRE & APSC Key Trap',
        examBadge: 'APSC PRELIMS / ADRE',
        examFact: 'Raimona NP is famous for the Golden Langur. Dehing Patkai is known as the "Amazon of the East" (last remaining contiguous patch of lowland rainforest in Assam).',
        pastQuestionContext: 'Distinction between Raimona (Golden Langur habitat in Bodoland) vs Kaziranga (Rhino & Tiger ratio).'
      },
      {
        type: 'recap',
        title: '7 National Parks Quick Memory Grid',
        highlights: [
          '1. Kaziranga (1974 NP, 1985 UNESCO World Heritage)',
          '2. Manas (1990 NP, 1985 UNESCO World Heritage)',
          '3. Nameri (1998 NP - Sonitpur)',
          '4. Dibru-Saikhowa (1999 NP - Dibrugarh/Tinsukia)',
          '5. Orang (1999 NP - Darrang/Sonitpur, smallest NP)',
          '6. Raimona (6th NP, declared June 2021 - Kokrajhar)',
          '7. Dehing Patkai (7th NP, declared June 2021 - Rain forest)'
        ]
      }
    ]
  },
  {
    id: 'hills-and-plateaus',
    topicName: 'Physiography & Hills',
    title: 'Central Hills & Karbi-Barail Ranges',
    description: 'Explore the Karbi Anglong Plateau, North Cachar Hills, and Barail Range geology.',
    steps: [
      {
        type: 'hook',
        question: 'Why are the hills of Karbi Anglong geologically different from the Himalayas?',
        text: 'While the Himalayas are young fold mountains, Karbi Anglong is an extension of the ancient Deccan Peninsular Plateau, separated by the Garo-Rajmahal Gap.',
        VisualizerComponent: CentralPlateauVisual
      },
      {
        type: 'predict',
        question: 'Which range acts as the watershed boundary between the Brahmaputra Valley and Barak Valley?',
        options: {
          A: 'Patkai Range',
          B: 'Barail Range',
          C: 'Mikir Hills',
          D: 'Garo Hills'
        },
        correctAnswer: 'B',
        explanation: 'The Barail Range connects the Shillong Plateau with the Naga Hills and serves as the physical divide separating the Brahmaputra basin from the Barak basin.'
      },
      {
        type: 'exam_check',
        title: 'Highest Peak in Assam Exam Check',
        examBadge: 'ADRE & APSC MANDATORY FACT',
        examFact: 'The highest point in Assam is located in the Barail Range (Chenghehishon / Laike peak area in Dima Hasao), reaching an elevation of ~1,960 meters.',
        pastQuestionContext: 'Dima Hasao (North Cachar Hills) and Haflong (Assam\'s only hill station).'
      },
      {
        type: 'recap',
        title: 'Physiography Summary',
        highlights: [
          'Karbi Anglong Plateau: Geologically an outlier of Precambrian Peninsular Shield.',
          'Barail Range: Separates Brahmaputra Valley (North) from Barak Valley (South).',
          'Haflong: Headquarter of Dima Hasao and sole hill station in Assam.'
        ]
      }
    ]
  }
];
