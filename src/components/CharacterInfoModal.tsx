'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Calendar, MapPin, BookOpen, Quote } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  title: string;
  color: string;
  field: string;
  avatar: string;
  era: string;
  fullBio: string;
  expertise: string[];
  famousQuotes: string[];
  achievements: string[];
  birthPlace?: string;
  nationality?: string;
}

const characterDetails: Record<string, Character> = {
  einstein: {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    color: 'from-blue-600 to-indigo-600',
    field: 'Physics',
    avatar: 'AE',
    era: '1879-1955',
    birthPlace: 'Ulm, Germany',
    nationality: 'German-American',
    fullBio: 'Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His work is also known for its influence on the philosophy of science. He received the Nobel Prize in Physics in 1921 for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect.',
    expertise: ['Relativity Theory', 'Quantum Mechanics', 'Statistical Mechanics', 'Cosmology', 'Philosophy of Science'],
    achievements: ['Nobel Prize in Physics (1921)', 'Theory of Special Relativity', 'Theory of General Relativity', 'Mass-Energy Equivalence (E=mc²)', 'Photoelectric Effect'],
    famousQuotes: [
      'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.',
      'The important thing is not to stop questioning. Curiosity has its own reason for existing.',
      'Try not to become a person of success, but rather try to become a person of value.',
      'God does not play dice with the universe.',
      'Life is like riding a bicycle. To keep your balance, you must keep moving.'
    ]
  },
  curie: {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    color: 'from-emerald-600 to-teal-600',
    field: 'Science',
    avatar: 'MC',
    era: '1867-1934',
    birthPlace: 'Warsaw, Poland',
    nationality: 'Polish-French',
    fullBio: 'Marie Curie was a Polish-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person to win Nobel Prizes in two different sciences, and the only person to win a Nobel Prize in multiple sciences.',
    expertise: ['Radioactivity', 'Chemistry', 'Physics', 'Scientific Research Methods', 'X-ray Technology'],
    achievements: ['Nobel Prize in Physics (1903)', 'Nobel Prize in Chemistry (1911)', 'Discovery of Polonium and Radium', 'First Female Professor at University of Paris', 'Mobile X-ray Units in WWI'],
    famousQuotes: [
      'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
      'I was taught that the way of progress was neither swift nor easy.',
      'In science, we must be interested in things, not in persons.',
      'One never notices what has been done; one can only see what remains to be done.',
      'I am among those who think that science has great beauty.'
    ]
  },
  feynman: {
    id: 'feynman',
    name: 'Richard Feynman',
    title: 'Theoretical Physicist',
    color: 'from-purple-600 to-violet-600',
    field: 'Physics',
    avatar: 'RF',
    era: '1918-1988',
    birthPlace: 'New York City, USA',
    nationality: 'American',
    fullBio: 'Richard Feynman was an American theoretical physicist known for his work in quantum electrodynamics, for which he shared the 1965 Nobel Prize in Physics. He was known for his ability to explain complex physics concepts in simple terms and his unconventional approach to both physics and life.',
    expertise: ['Quantum Electrodynamics', 'Particle Physics', 'Quantum Computing', 'Teaching & Communication', 'Problem Solving'],
    achievements: ['Nobel Prize in Physics (1965)', 'Feynman Diagrams', 'Manhattan Project Contributor', 'Challenger Disaster Investigation', 'Quantum Computing Pioneer'],
    famousQuotes: [
      'If you can\'t explain it simply, you don\'t understand it well enough.',
      'I learned very early the difference between knowing the name of something and knowing something.',
      'I would rather have questions that can\'t be answered than answers that can\'t be questioned.',
      'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
      'Science is a way of thinking much more than it is a body of knowledge.'
    ]
  },
  // Add more characters as needed...
};

interface CharacterInfoModalProps {
  characterId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CharacterInfoModal({ characterId, isOpen, onClose }: CharacterInfoModalProps) {
  const character = characterDetails[characterId];

  if (!character) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${character.color} p-6 text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                  {character.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{character.name}</h2>
                  <p className="text-lg opacity-90 mb-2">{character.title}</p>
                  <div className="flex items-center space-x-4 text-sm opacity-80">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{character.era}</span>
                    </div>
                    {character.birthPlace && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{character.birthPlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Biography */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-slate-600" />
                    Biography
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{character.fullBio}</p>
                </section>

                {/* Areas of Expertise */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 bg-gradient-to-r ${character.color} text-white rounded-full text-sm font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Major Achievements */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-slate-600" />
                    Major Achievements
                  </h3>
                  <div className="space-y-2">
                    {character.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${character.color} mt-2 flex-shrink-0`}></div>
                        <span className="text-slate-700">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Famous Quotes */}
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                    <Quote className="w-5 h-5 mr-2 text-slate-600" />
                    Famous Quotes
                  </h3>
                  <div className="space-y-4">
                    {character.famousQuotes.slice(0, 3).map((quote, index) => (
                      <blockquote key={index} className="border-l-4 border-slate-300 pl-4 text-slate-700 italic">
                        "{quote}"
                      </blockquote>
                    ))}
                  </div>
                </section>

                {/* Additional Info */}
                {character.nationality && (
                  <section>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-600">Nationality:</span>
                        <span className="ml-2 text-slate-700">{character.nationality}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-600">Field:</span>
                        <span className="ml-2 text-slate-700">{character.field}</span>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Learn more through direct conversation
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 