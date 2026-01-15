const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

async function loginHotel() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  if (!usuario || !senha) {
    msg.innerText = "Preencha usuário e senha.";
    return;
  }

  msg.innerText = "Entrando...";

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

  const admin = admins.find(a =>
    a.usuario === usuario &&
    a.senha === senha &&
    a.ativo === true
  );

  if (!admin) {
    msg.innerText = "Usuário ou senha inválidos.";
    return;
  }

  // 🔥 LIMPA E SALVA DO JEITO CERTO
  localStorage.clear();

  localStorage.setItem("admin_logado", JSON.stringify({
    id: admin.id,
    usuario: admin.usuario,
    negocio_id: admin.negocio_id,
    tipo: admin.tipo
  }));

  console.log("LOGIN OK:", admin);

  window.location.href = "dashboard.html";
}
