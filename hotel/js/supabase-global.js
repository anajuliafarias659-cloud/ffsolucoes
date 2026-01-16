if (!window.supabaseClient) {
  const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co",
  const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"
  const { createClient } = window.supabase;
  window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("✅ Supabase global inicializado com sucesso.");
}
