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
      a.ativo === true &&
      a.tipo === "hotel"
    );

    if (!admin) {
      msg.innerText = "Usuário ou senha inválidos.";
      return;
    }

    // ✅ SALVANDO O QUE O SISTEMA REALMENTE USA
    localStorage.setItem("admin_logado", JSON.stringify({
      id: admin.id,
      usuario: admin.usuario,
      tipo: "hotel",
      permissao: admin.permissao,
      negocio_id: admin.negocio_id // 🔑 CHAVE MESTRA
    }));

    window.location.href = "dashboard.html";

  } catch (e) {
    console.error(e);
    msg.innerText = "Erro ao conectar.";
  }
}
