// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== PEGAR APP_ID DA URL =====
const params = new URLSearchParams(window.location.search);
const APP_ID = params.get("app_id");

// ===== LOGIN =====
async function loginHotel() {
  msg.innerText = "Entrando...";

  if (!APP_ID) {
    msg.innerText = "Hotel não identificado (app_id ausente).";
    return;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/admins?select=*`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY
      }
    }
  );

  const admins = await res.json();

  const admin = admins.find(a =>
    a.usuario === usuario.value &&
    a.senha === senha.value &&
    a.ativo === true &&
    a.app_id === APP_ID
  );

  if (!admin) {
    msg.innerText = "Usuário ou senha inválidos.";
    return;
  }

  // ===== SALVA SESSÃO =====
  localStorage.setItem(
    "admin_logado",
    JSON.stringify({
      id: admin.id,
      usuario: admin.usuario,
      app_id: admin.app_id,
      permissao: admin.permissao
    })
  );

  // ===== REDIRECIONA =====
  window.location.href = "dashboard.html";
}
