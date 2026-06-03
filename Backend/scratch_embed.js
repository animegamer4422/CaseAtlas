const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: 'hello world',
    });
    console.log('gemini-embedding-2 works. len=', res.embeddings[0].values.length);
  } catch(e) {
    console.log('failed:', e.message);
  }
}
test();
