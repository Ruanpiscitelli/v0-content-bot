require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkGallery() {
  try {
    console.log('🖼️ Checking gallery images...\n');

    const { data: images, error } = await supabase
      .from('generated_images_metadata')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching images:', error);
      return;
    }

    if (!images || images.length === 0) {
      console.log('📭 No images found in gallery');
      return;
    }

    console.log(`📸 Found ${images.length} images in gallery:\n`);

    for (const image of images) {
      const createdTime = new Date(image.created_at).toLocaleString();
      
      console.log(`🖼️ Image ${image.id}`);
      console.log(`   User: ${image.user_id}`);
      console.log(`   Prompt: ${image.prompt.substring(0, 50)}${image.prompt.length > 50 ? '...' : ''}`);
      console.log(`   URL: ${image.image_url.substring(0, 60)}...`);
      console.log(`   Created: ${createdTime}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
checkGallery().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 