// Test script to verify Sensay API integration
import * as dotenv from 'dotenv';
import { sensayAPI } from '../src/lib/sensay';

// Load environment variables
dotenv.config();

async function testChat() {
  console.log('Testing Sensay API integration...\n');
  
  const testCharacters = ['curie', 'feynman', 'einstein', 'twain', 'gandhi'];
  const testMessage = "What is your greatest discovery?";
  
  for (const characterId of testCharacters) {
    console.log(`=== Testing ${characterId} ===`);
    
    try {
      const response = await sensayAPI.chatWithCharacter(characterId, testMessage);
      console.log(`Response: ${response.content.substring(0, 200)}...`);
      console.log(`✅ Success for ${characterId}\n`);
    } catch (error) {
      console.log(`❌ Error for ${characterId}:`, error);
      console.log('');
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run the test
testChat().catch(console.error); 