import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const supabase = createClient(
  "https://auzdqapjetmhaokoynzo.supabase.co",
  "sb_publishable_36kXlyuKU8RMfgSx01h5mw_lOLp1lbX",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);
