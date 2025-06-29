// Character UUID mapping for Sensay API
export const CHARACTER_UUIDS: Record<string, string> = {
  // Successfully trained characters with Sensay API
  'curie': '9ee507a5-380e-4fbb-8032-c93dcfcbddc0',
  'davinci': '14ca5f8c-ef13-4be2-adf6-16781238f608',
  'feynman': '59a698c2-587c-4386-9516-3e58d9470d69',
  'angelou': 'c3007642-393f-4d0e-80f8-dd790f50f061',
  'gandhi': '225667c5-1043-4143-9a19-068d17e3a526',
  'hawking': '1bf68dd5-5378-4d13-bdd9-2276c86f08f8',
  'socrates': '1c8d2864-3a34-4239-8c62-201067d3e5bf',
  'mandela': '02f90514-da37-4137-9337-ae3a02105cfd',
  
  // Additional trained characters
  'einstein': 'ac79c118-1ecc-4d32-8233-b024c1222f83',
  'twain': '276e026a-7297-4899-b1d5-c46b0291d01b',
};

// Helper function to get UUID for a character
export function getCharacterUUID(characterId: string): string {
  return CHARACTER_UUIDS[characterId] || characterId;
} 