import { createClient } from '@supabase/supabase-js'

// Server-only client. Uses the service role key, so this must never be
// imported into a Client Component or exposed to the browser.
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
