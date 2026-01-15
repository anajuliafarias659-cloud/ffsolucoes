// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== ELEMENTOS =====
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const msg = document.getElementById("msg");

// ===== APP_ID (URL → localStorage → fallback) =====
const params = new URLSearchParams(window.location.search);
let APP_ID = params.get("app_id") || localStorage.getItem("app_id");

if (!APP_ID) {
  msg.innerText = "Hotel não identificado.";
} else {
  localStorage.setItem("app_id", APP_ID);
}

// ===== LOGIN HOTEL =====
async function loginHotel() {
  msg.innerText = "Entrando...";

  if (!APP_ID) {
    msg.innerText = "Hotel não identificado (app_id ausente).";
    return;
  }

  try {
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
      a.usuario === usuario.value.trim() &&
      a.senha === senha.value.trim() &&
      a.ativo === true &&
      String(a.app_id) === String(APP_ID)
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
        permissao: admin.permissao,
        tipo: "hotel"
      })
    );

    // ===== REDIRECIONA =====
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    msg.innerText = "Erro ao conectar com o servidor.";
  }
}
