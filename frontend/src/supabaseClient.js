import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Supabase URL or Anon Key is missing. ' +
    'Make sure you have set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env.local file.'
  );
  // Optionally throw an error or handle this case more gracefully
  // For now, creating the client will likely fail or result in a non-functional client.
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
