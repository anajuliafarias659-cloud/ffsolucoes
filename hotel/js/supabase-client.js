// ============================
// CLIENTE GLOBAL DO SUPABASE
// Sistema do Hotel — FF Soluções
// ============================

// URL e KEY do seu projeto Supabase
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// Criar cliente único (sem conflito com outros módulos)
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tudo no sistema usa sb.*
// Exemplo:
// sb.auth.getUser()
// sb.from("tabela").select("*")
