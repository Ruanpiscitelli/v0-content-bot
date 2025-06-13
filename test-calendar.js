const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testCalendar() {
  console.log('📅 Testing calendar functionality...\n');

  try {
    // Check existing ideas with scheduled dates
    const { data: scheduledIdeas, error: ideasError } = await supabase
      .from('ideas')
      .select('*')
      .not('scheduled_date', 'is', null)
      .order('scheduled_date', { ascending: true });

    if (ideasError) {
      console.error('❌ Error fetching ideas:', ideasError);
      return;
    }

    console.log(`📅 Found ${scheduledIdeas?.length || 0} ideas with scheduled dates`);

    if (scheduledIdeas && scheduledIdeas.length > 0) {
      console.log('\n📋 Scheduled ideas:');
      scheduledIdeas.forEach(idea => {
        const date = new Date(idea.scheduled_date);
        console.log(`  - "${idea.title}" scheduled for ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
      });
      
      console.log('\n✅ Calendar has data and should display correctly!');
    } else {
      console.log('\n⚠️  No scheduled ideas found - calendar will appear empty');
    }

  } catch (error) {
    console.error('❌ Error testing calendar:', error);
  }
}

// Run the test
testCalendar(); 