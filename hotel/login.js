// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== ELEMENTOS =====
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");
const msg = document.getElementById("msg");

// ===== LOGIN =====
async function loginHotel() {
  msg.innerText = "Entrando...";

  if (!usuario.value.trim() || !senha.value.trim()) {
    msg.innerText = "Preencha usuário e senha.";
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
      a.ativo === true
    );

    if (!admin) {
      msg.innerText = "Usuário ou senha inválidos.";
      return;
    }

    // 🔥 APP_ID VEM DO ADMIN (IGUAL AO BAR)
    localStorage.setItem("app_id", admin.app_id);

    localStorage.setItem("admin_logado", JSON.stringify({
      id: admin.id,
      usuario: admin.usuario,
      app_id: admin.app_id,
      permissao: admin.permissao,
      tipo: "hotel"
    }));

    window.location.href = "dashboard.html";

  } catch (e) {
    console.error(e);
    msg.innerText = "Erro ao conectar.";
  }
}
