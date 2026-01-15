// config.js
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co",
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"

// função utilitária
function getUsuario() {
  return JSON.parse(sessionStorage.getItem("usuario"));
}
