import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL="https://lgknpdrciwiyfcbjhwoq.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna25wZHJjaXdpeWZjYmpod29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTY2ODUsImV4cCI6MjAyNjg3MjY4NX0.X341X8DwquRn94DCeOJ3_ZsdU9Gm7JMphqm4mixYHCs"
        
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)