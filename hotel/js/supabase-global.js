// ===============================
// Supabase Global Config Seguro
// ===============================
(function () {
  // Espera o Supabase SDK estar carregado
  if (typeof window.supabase === "undefined") {
    console.error("⚠️ Supabase SDK ainda não carregado. Verifique a ordem dos scripts.");
    return;
  }

  // Se ainda não existir um cliente global, cria um
  if (!window.supabaseClient) {
    const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
    const SUPABASE_KEY = "sb_publishable_LAtlFlcxk6IchHe3RNmfwA_9Oq4EsZw";
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("✅ Supabase global inicializado com sucesso.");
  } else {
    console.log("ℹ️ Supabase global já existente, reutilizando instância.");
  }
})();
