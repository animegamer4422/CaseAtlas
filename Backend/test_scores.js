const mongoose = require('mongoose');
const { generateEmbedding } = require('./utils/embeddings');
const Case = require('./models/Case');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const q = await generateEmbedding("pune hit");
  const cases = await Case.aggregate([
    { $vectorSearch: { index: 'vector_index', path: 'embedding', queryVector: q, numCandidates: 50, limit: 10 } },
    { $project: { title: 1, score: { $meta: 'vectorSearchScore' } } }
  ]);
  console.log(cases);
  process.exit(0);
}
test();
