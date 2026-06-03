const mongoose = require('mongoose');

const uri = 'mongodb+srv://animegamer4422_db_user:3gzzsqHFoums4x1d@caseatlascluster.yfwam5x.mongodb.net/caseatlas?retryWrites=true&w=majority&appName=CaseAtlasCluster';

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
