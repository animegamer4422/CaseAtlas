const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Case = require('../models/Case');
const { generateEmbedding } = require('../utils/embeddings');

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const runBackfill = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Find all cases that either don't have the embedding field,
    // or the embedding array is empty.
    const casesToUpdate = await Case.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } },
      ]
    });

    console.log(`Found ${casesToUpdate.length} cases needing embeddings.`);

    for (let i = 0; i < casesToUpdate.length; i++) {
      const caseItem = casesToUpdate[i];
      console.log(`[${i + 1}/${casesToUpdate.length}] Generating embedding for Case: ${caseItem.caseId}`);

      const embeddingText = `Title: ${caseItem.title}. Description: ${caseItem.description}. Category: ${caseItem.category || 'other'}. Location: ${caseItem.location || 'unknown'}.`;
      
      const embedding = await generateEmbedding(embeddingText);
      
      if (embedding && embedding.length > 0) {
        caseItem.embedding = embedding;
        await caseItem.save();
        console.log(`  -> Successfully saved embedding for ${caseItem.caseId}`);
      } else {
        console.log(`  -> Failed to generate embedding for ${caseItem.caseId}`);
      }
      
      // Sleep briefly to avoid hitting rate limits on the free tier
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Backfill complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during backfill:', error);
    process.exit(1);
  }
};

runBackfill();
