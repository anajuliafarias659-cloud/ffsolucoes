if (!window.supabaseClient) {
  const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LAtlFlcxk6IchHe3RNmfwA_9Oq4EsZw";
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
