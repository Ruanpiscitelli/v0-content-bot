require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if ideas table exists and get its structure
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing ideas table:', error);
      return;
    }

    console.log('✅ Ideas table exists');
    
    if (data && data.length > 0) {
      const sampleIdea = data[0];
      console.log('\n📊 Ideas table columns:');
      Object.keys(sampleIdea).forEach(column => {
        const value = sampleIdea[column];
        const type = typeof value;
        console.log(`  - ${column}: ${type} (example: ${value === null ? 'null' : JSON.stringify(value)})`);
      });
    } else {
      console.log('\n⚠️  Ideas table is empty, cannot determine schema from data');
      
      // Try to get schema information directly
      console.log('\n🔍 Attempting to get schema information...');
      
      // This query might work on some Supabase setups
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_columns', { table_name: 'ideas' })
        .single();
        
      if (schemaError) {
        console.log('❌ Could not get schema info via RPC');
        console.log('💡 Try adding some test data to see the table structure');
      } else {
        console.log('✅ Schema info:', schemaData);
      }
    }

    // Check for scheduled_date column specifically
    console.log('\n🎯 Checking for scheduled_date column...');
    
    const testQuery = await supabase
      .from('ideas')
      .select('scheduled_date')
      .limit(1);
      
    if (testQuery.error) {
      console.log('❌ scheduled_date column does NOT exist');
      console.log('📝 You need to add this column to the ideas table');
      console.log('\n🛠️  SQL to add the column:');
      console.log('ALTER TABLE ideas ADD COLUMN scheduled_date TIMESTAMP WITH TIME ZONE;');
    } else {
      console.log('✅ scheduled_date column exists');
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

// Run the check
checkSchema(); 