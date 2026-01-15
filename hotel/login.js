// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== ELEMENTOS =====
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const msg = document.getElementById("msg");

// ===== LOGIN =====
async function loginHotel() {
  msg.innerText = "Entrando...";

  const usuario = usuarioInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!usuario || !senha) {
    msg.innerText = "Preencha usuário e senha.";
    return;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/admins?select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const admins = await res.json();

    console.log("ADMINS DO BANCO:", admins);

    // 🔓 LOGIN SEM FILTRO FRÁGIL
    const admin = admins.find(a =>
      String(a.usuario ?? a.login ?? a.email).trim() === usuario &&
      String(a.senha).trim() === senha
    );

    if (!admin) {
      msg.innerText = "Usuário ou senha inválidos.";
      return;
    }

    // 🚀 SALVA SESSÃO
    localStorage.setItem("admin_logado", JSON.stringify({
      id: admin.id,
      usuario: admin.usuario ?? admin.login ?? admin.email,
      tipo: admin.tipo ?? "hotel",
      negocio_id: admin.negocio_id
    }));

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    msg.innerText = "Erro ao conectar.";
  }
}
