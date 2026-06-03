const Case = require('../models/Case');
const { generateEmbedding } = require('../utils/embeddings');

const searchCases = async (req, res) => {
  try {
    const { query, category, status, location } = req.query;
    let filter = {};

    // Standard filters
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' };

    // Check if the query is specifically a Case ID (e.g. CA-XXXX-XXXX)
    const isCaseId = query && query.match(/CA-[A-Z0-9]{4}-[A-Z0-9]{4}/i);

    // 1. Semantic Search (Default for natural language)
    if (query && !isCaseId) {
      const queryVector = await generateEmbedding(query);
      
      if (queryVector && queryVector.length > 0) {
        let pipeline = [
          {
            $vectorSearch: {
              index: 'vector_index',
              path: 'embedding',
              queryVector: queryVector,
              numCandidates: 100,
              limit: 30
            }
          }
        ];

        // Apply filters alongside semantic search
        if (Object.keys(filter).length > 0) {
          pipeline.push({ $match: filter });
        }

        pipeline.push({
          $project: {
            embedding: 0,
            score: { $meta: 'vectorSearchScore' }
          }
        });

        // Filter out completely irrelevant results (0.75 is a better threshold for short keyword queries)
        pipeline.push({
          $match: {
            score: { $gte: 0.75 }
          }
        });

        const cases = await Case.aggregate(pipeline);
        const populatedCases = await Case.populate(cases, { path: 'createdBy', select: 'username avatarInitials' });
        
        return res.json(populatedCases);
      }
    }

    // 2. Standard Search (For specific Case IDs, empty queries, or if Gemini API is unreachable)
    if (query) {
      filter.$or = [
        { caseId: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    const cases = await Case.find(filter)
      .populate('createdBy', 'username avatarInitials')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchCases };
