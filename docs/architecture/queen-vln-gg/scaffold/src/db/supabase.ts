import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. ' +
      'The API server talks to Supabase with the service role key and enforces ' +
      'org scoping in application code / RLS policies, not via the anon key.'
  );
}

export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
