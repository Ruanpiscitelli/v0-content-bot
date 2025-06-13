const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkJobTypes() {
  try {
    console.log('🔍 Verificando tipos de job na tabela generation_jobs...');
    
    const { data, error } = await supabase
      .from('generation_jobs')
      .select('job_type')
      .limit(100);
    
    if (error) {
      console.log('❌ Erro ao buscar jobs:', error.message);
      return;
    }
    
    const uniqueTypes = [...new Set(data.map(job => job.job_type))];
    console.log('📊 Tipos de job encontrados:', uniqueTypes);
    
    // Verificar se há tipos que não estão na constraint
    const allowedTypes = ['image_generation', 'video_generation', 'lip_sync'];
    const invalidTypes = uniqueTypes.filter(type => !allowedTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      console.log('⚠️ Tipos inválidos encontrados:', invalidTypes);
      
      // Contar quantos jobs de cada tipo inválido existem
      for (const type of invalidTypes) {
        const { count } = await supabase
          .from('generation_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('job_type', type);
        
        console.log(`   - ${type}: ${count} jobs`);
      }
    } else {
      console.log('✅ Todos os tipos são válidos');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
}

checkJobTypes(); 