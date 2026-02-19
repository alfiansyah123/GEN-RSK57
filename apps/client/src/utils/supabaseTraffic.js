import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtlwptockofzbllnsyrg.supabase.co'
const supabaseAnonKey = 'sb_publishable_0MWvjujUhXVBNq7P-30baA_Jqr1SYsm'

export const supabaseTraffic = createClient(supabaseUrl, supabaseAnonKey)
