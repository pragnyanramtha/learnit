'use client';

import { motion } from 'framer-motion';
import { Lock, Award, Atom, Palette, Lightbulb, BookOpen, Users, Globe, Scale, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Character {
  id: string;
  name: string;
  title: string;
  field: string;
  description: string;
  available: boolean;
  color: string;
  icon: React.ReactNode;
  achievements: string[];
  era: string;
  fullBio: string;
  expertise: string[];
  famousQuotes: string[];
  image: string;
}

const characters: Character[] = [
  // Science & Innovation
  {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    field: 'Physics',
    description: 'Revolutionary physicist who changed our understanding of space and time',
    available: true,
    color: 'from-blue-600 to-indigo-600',
    icon: <Atom className="w-5 h-5" />,
    achievements: ['Nobel Prize in Physics', 'Theory of Relativity', 'E=mc²'],
    era: '1879-1955',
    fullBio: 'Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His work is also known for its influence on the philosophy of science.',
    expertise: ['Relativity Theory', 'Quantum Mechanics', 'Statistical Mechanics', 'Cosmology'],
    famousQuotes: [
      'Imagination is more important than knowledge',
      'The important thing is not to stop questioning',
      'Try not to become a person of success, but rather try to become a person of value'
    ],
    image: '/images/characters/einstein.jpg'
  },
  {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    field: 'Science',
    description: 'Pioneer in radioactivity research and first woman to win a Nobel Prize',
    available: true,
    color: 'from-emerald-600 to-teal-600',
    icon: <Award className="w-5 h-5" />,
    achievements: ['Two Nobel Prizes', 'Discovered Polonium & Radium', 'First Female Nobel Winner'],
    era: '1867-1934',
    fullBio: 'Marie Curie was a Polish-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different scientific fields.',
    expertise: ['Radioactivity', 'Chemistry', 'Physics', 'Scientific Research Methods'],
    famousQuotes: [
      'Nothing in life is to be feared, it is only to be understood',
      'I was taught that the way of progress was neither swift nor easy',
      'In science, we must be interested in things, not in persons'
    ],
    image: '/images/characters/curie.jpg'
  },
  {
    id: 'feynman',
    name: 'Richard Feynman',
    title: 'Theoretical Physicist',
    field: 'Physics',
    description: 'Brilliant physicist known for quantum electrodynamics and teaching',
    available: true,
    color: 'from-purple-600 to-violet-600',
    icon: <Lightbulb className="w-5 h-5" />,
    achievements: ['Nobel Prize in Physics', 'Quantum Electrodynamics', 'Feynman Diagrams'],
    era: '1918-1988',
    fullBio: 'Richard Feynman was an American theoretical physicist known for his work in quantum electrodynamics, for which he shared the 1965 Nobel Prize in Physics. He was known for his ability to explain complex physics concepts in simple terms.',
    expertise: ['Quantum Electrodynamics', 'Particle Physics', 'Teaching & Communication', 'Problem Solving'],
    famousQuotes: [
      'If you can\'t explain it simply, you don\'t understand it well enough',
      'I learned very early the difference between knowing the name of something and knowing something',
      'I would rather have questions that can\'t be answered than answers that can\'t be questioned'
    ],
    image: '/images/characters/feynman.jpg'
  },
  {
    id: 'hawking',
    name: 'Stephen Hawking',
    title: 'Theoretical Physicist',
    field: 'Cosmology',
    description: 'Renowned cosmologist who studied black holes and the nature of time',
    available: true,
    color: 'from-slate-600 to-gray-600',
    icon: <Atom className="w-5 h-5" />,
    achievements: ['Black Hole Theory', 'A Brief History of Time', 'Hawking Radiation'],
    era: '1942-2018',
    fullBio: 'Stephen Hawking was an English theoretical physicist and cosmologist who made groundbreaking contributions to our understanding of black holes and the nature of time, despite living with ALS for most of his career.',
    expertise: ['Black Holes', 'Cosmology', 'Theoretical Physics', 'Science Communication'],
    famousQuotes: [
      'We are just an advanced breed of monkeys on a minor planet of a very average star',
      'Intelligence is the ability to adapt to change',
      'My goal is simple. It is a complete understanding of the universe'
    ],
    image: '/images/characters/hawking.jpg'
  },
  {
    id: 'davinci',
    name: 'Leonardo da Vinci',
    title: 'Renaissance Polymath',
    field: 'Art & Science',
    description: 'Ultimate Renaissance man combining art, science, and engineering',
    available: true,
    color: 'from-amber-600 to-orange-600',
    icon: <Palette className="w-5 h-5" />,
    achievements: ['Mona Lisa', 'The Last Supper', 'Flying Machine Designs'],
    era: '1452-1519',
    fullBio: 'Leonardo da Vinci was an Italian Renaissance polymath whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography.',
    expertise: ['Art & Painting', 'Engineering & Invention', 'Anatomy', 'Scientific Observation'],
    famousQuotes: [
      'Learning never exhausts the mind',
      'Obstacles cannot crush me; every obstacle yields to stern resolve',
      'The noblest pleasure is the joy of understanding'
    ],
    image: '/images/characters/davinci.jpg'
  },

  // Literature & Philosophy
  {
    id: 'angelou',
    name: 'Maya Angelou',
    title: 'Poet & Activist',
    field: 'Literature',
    description: 'Powerful voice for civil rights and human dignity through poetry',
    available: true,
    color: 'from-rose-600 to-pink-600',
    icon: <BookOpen className="w-5 h-5" />,
    achievements: ['I Know Why the Caged Bird Sings', 'Presidential Medal of Freedom'],
    era: '1928-2014',
    fullBio: 'Maya Angelou was an American memoirist, poet, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry, and is credited with a list of plays, movies, and television shows spanning over 50 years.',
    expertise: ['Poetry & Literature', 'Civil Rights', 'Autobiography', 'Human Resilience'],
    famousQuotes: [
      'I\'ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel',
      'If you don\'t like something, change it. If you can\'t change it, change your attitude',
      'There is no greater agony than bearing an untold story inside you'
    ],
    image: '/images/characters/angelou.jpg'
  },
  {
    id: 'twain',
    name: 'Mark Twain',
    title: 'Author & Humorist',
    field: 'Literature',
    description: 'Master of American humor and social commentary',
    available: true,
    color: 'from-orange-600 to-red-600',
    icon: <BookOpen className="w-5 h-5" />,
    achievements: ['The Adventures of Tom Sawyer', 'Huckleberry Finn', 'American Humor'],
    era: '1835-1910',
    fullBio: 'Mark Twain was an American writer, humorist, entrepreneur, publisher, and lecturer. He was praised as the "greatest humorist the United States has produced," and William Faulkner called him "the father of American literature."',
    expertise: ['American Literature', 'Humor & Satire', 'Social Commentary', 'Storytelling'],
    famousQuotes: [
      'The two most important days in your life are the day you are born and the day you find out why',
      'Kindness is the language which the deaf can hear and the blind can see',
      'It is better to keep your mouth closed and let people think you are a fool than to open it and remove all doubt'
    ],
    image: '/images/characters/twain.jpg'
  },
  {
    id: 'socrates',
    name: 'Socrates',
    title: 'Classical Philosopher',
    field: 'Philosophy',
    description: 'Father of Western philosophy and the Socratic method',
    available: true,
    color: 'from-stone-600 to-amber-600',
    icon: <Scale className="w-5 h-5" />,
    achievements: ['Socratic Method', 'Western Philosophy', 'Know Thyself'],
    era: '470-399 BCE',
    fullBio: 'Socrates was a classical Greek philosopher credited as one of the founders of Western philosophy. He is known for his contribution to the field of ethics and his method of inquiry known as the Socratic method.',
    expertise: ['Philosophy & Ethics', 'Critical Thinking', 'Socratic Method', 'Self-Knowledge'],
    famousQuotes: [
      'The unexamined life is not worth living',
      'I know that I know nothing',
      'Wisdom begins in wonder'
    ],
    image: '/images/characters/socrates.jpg'
  },

  // Leadership & Social Change
  {
    id: 'gandhi',
    name: 'Mahatma Gandhi',
    title: 'Independence Leader',
    field: 'Philosophy',
    description: 'Champion of non-violent resistance and human rights',
    available: true,
    color: 'from-green-600 to-emerald-600',
    icon: <Users className="w-5 h-5" />,
    achievements: ['Indian Independence', 'Non-violent Resistance', 'Satyagraha'],
    era: '1869-1948',
    fullBio: 'Mahatma Gandhi was an Indian lawyer, anti-colonial nationalist, and political ethicist who employed nonviolent resistance to lead the successful campaign for India\'s independence from British rule.',
    expertise: ['Non-violent Resistance', 'Civil Rights', 'Leadership', 'Spiritual Philosophy'],
    famousQuotes: [
      'Be the change that you wish to see in the world',
      'An eye for an eye only ends up making the whole world blind',
      'The weak can never forgive. Forgiveness is the attribute of the strong'
    ],
    image: '/images/characters/gandhi.jpg'
  },
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    title: 'Anti-Apartheid Leader',
    field: 'Leadership',
    description: 'Icon of reconciliation and human dignity',
    available: true,
    color: 'from-yellow-600 to-orange-600',
    icon: <Globe className="w-5 h-5" />,
    achievements: ['End of Apartheid', 'Nobel Peace Prize', 'Ubuntu Philosophy'],
    era: '1918-2013',
    fullBio: 'Nelson Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa from 1994 to 1999. He was the country\'s first black head of state.',
    expertise: ['Leadership', 'Reconciliation', 'Human Rights', 'Political Strategy'],
    famousQuotes: [
      'No one is born hating another person because of the color of his skin, or his background, or his religion',
      'If you want to make peace with your enemy, you have to work with your enemy. Then he becomes your partner',
      'Education is the most powerful weapon which you can use to change the world'
    ],
    image: '/images/characters/mandela.jpg'
  }
];

interface CharacterGridProps {
  onCharacterSelect: (characterId: string) => void;
}

export default function CharacterGrid({ onCharacterSelect }: CharacterGridProps) {
  const [selectedCharacterDetail, setSelectedCharacterDetail] = useState<string | null>(null);

  const availableCharacters = characters.filter(char => char.available);
  const selectedCharacter = selectedCharacterDetail ? characters.find(c => c.id === selectedCharacterDetail) : null;

  return (
    <div className="space-y-16">
      {/* Available Characters Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {availableCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setSelectedCharacterDetail(character.id)}
            >
              <div className="bg-black rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:shadow-lg p-6 text-center">
                {/* Character Avatar */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${character.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden`}>
                  <img 
                    src={character.image} 
                    alt={character.name} 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Character Info */}
                <h3 className="text-lg font-bold text-white mb-1">
                  {character.name}
                </h3>
                <p className="text-sm text-neutral-300 mb-2">{character.title}</p>
                <p className="text-xs text-neutral-400 mb-3">{character.era}</p>
                
                {/* Field Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${character.color} text-white`}>
                  {character.field}
                </div>

                {/* Available Indicator */}
                <div className="mt-3 flex justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCharacterDetail(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black rounded-2xl border border-neutral-800 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center space-x-6 mb-6">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden`}>
                <img 
                  src={selectedCharacter.image} 
                  alt={selectedCharacter.name} 
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedCharacter.name}</h2>
                <p className="text-lg text-neutral-300 mb-2">{selectedCharacter.title}</p>
                <p className="text-sm text-neutral-400">{selectedCharacter.era}</p>
              </div>
            </div>

            {/* Biography */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-neutral-200 leading-relaxed">{selectedCharacter.fullBio}</p>
            </div>

            {/* Expertise */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-neutral-800 text-white rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Famous Quotes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Famous Quotes</h3>
              <div className="space-y-3">
                {selectedCharacter.famousQuotes.map((quote, index) => (
                  <blockquote key={index} className="border-l-4 border-neutral-700 pl-4 text-neutral-200 italic">
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSelectedCharacterDetail(null);
                  onCharacterSelect(selectedCharacter.id);
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
              >
                <span>Start Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedCharacterDetail(null)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}