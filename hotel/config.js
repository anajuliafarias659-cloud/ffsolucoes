// config.js
window.SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co",
window.SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"

window.getUsuario = function () {
  return JSON.parse(sessionStorage.getItem("usuario"));
};
