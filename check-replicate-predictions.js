require('dotenv').config({ path: '.env.local' });
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

async function checkReplicatePredictions() {
  console.log('🔍 Checking Replicate predictions...\n');

  // These are the prediction IDs from our recent test jobs
  const predictionIds = [
    'q7eys5cp89rmc0cq3hqb02p4yw', // audio job
    '9ym3av2dhsrma0cq3hq882d6fr', // image job
    'mz2t95f99srm80cq3hm8scj30c', // older audio job
    '8mj4m7d391rmc0cq3hmbcs32cc', // older image job
  ];

  for (const predictionId of predictionIds) {
    try {
      console.log(`🎯 Checking prediction ${predictionId}:`);
      const prediction = await replicate.predictions.get(predictionId);
      
      console.log(`   Status: ${prediction.status}`);
      console.log(`   Model: ${prediction.model}`);
      console.log(`   Created: ${new Date(prediction.created_at).toLocaleString()}`);
      
      if (prediction.started_at) {
        console.log(`   Started: ${new Date(prediction.started_at).toLocaleString()}`);
      }
      
      if (prediction.completed_at) {
        console.log(`   Completed: ${new Date(prediction.completed_at).toLocaleString()}`);
      }
      
      if (prediction.error) {
        console.log(`   Error: ${prediction.error}`);
      }
      
      if (prediction.output) {
        if (Array.isArray(prediction.output)) {
          console.log(`   Output: Array with ${prediction.output.length} items`);
          if (prediction.output.length > 0) {
            console.log(`   First URL: ${prediction.output[0].substring(0, 80)}...`);
          }
        } else if (typeof prediction.output === 'string') {
          console.log(`   Output URL: ${prediction.output.substring(0, 80)}...`);
        } else {
          console.log(`   Output: ${typeof prediction.output}`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error checking prediction ${predictionId}:`, error.message);
      console.log('');
    }
  }
}

checkReplicatePredictions().catch(console.error); 