const { GoogleGenAI } = require('@google/genai');

async function generateEmbedding(text) {
  try {
    if (!text || text.trim() === '') return [];
    
    // Initialize inside the function so process.env is guaranteed to be loaded
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Call the embedding model
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: text,
    });
    
    // The response contains an array of numbers representing the semantic meaning of the text
    return response.embeddings[0].values;
  } catch (error) {
    console.error('Failed to generate embedding:', error.message);
    return [];
  }
}

module.exports = { generateEmbedding };
