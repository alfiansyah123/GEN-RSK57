import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from current directory or root
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('MISSING SUPABASE CREDENTIALS IN SERVER .ENV');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
