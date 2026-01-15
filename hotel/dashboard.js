const usuario = getUsuario();

if (!usuario) {
  alert("Sessão inválida");
  window.location.href = "login.html";
}

const APP_ID = usuario.app_id;

async function carregarDashboard() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/hotel_quartos?app_id=eq.${APP_ID}&select=id`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  document.getElementById("qtdQuartos").innerText = data.length;
}

carregarDashboard();
