import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL="https://alfcqylqvqjcllezoike.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsZmNxeWxxdnFqY2xsZXpvaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4OTk4NjEsImV4cCI6MjA0NjQ3NTg2MX0.tE1Yfz2QcpFBPqK7_hVxsknWifwwU2qBigbB6sDGBNg"
        
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)