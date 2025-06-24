import { createClient } from '@supabase/supabase-js'


const SUPABASE_KEY=import.meta.env.VITE_SUPABASE_KEY
const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL

console.log('URL:', SUPABASE_URL); // should log actual URL
console.log('KEY:', SUPABASE_KEY); // should log actual key
        
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)