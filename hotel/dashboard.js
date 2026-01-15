console.log("DASHBOARD CARREGADO");

const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || !admin.negocio_id) {
  alert("Sessão inválida");
  window.location.href = "login.html";
  throw new Error("Sessão inválida");
}

const negocio_id = admin.negocio_id;

const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

async function contar(tabela, filtro = "") {
  const url = `${SUPABASE_URL}/rest/v1/${tabela}?select=id&negocio_id=eq.${negocio_id}${filtro}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) return 0;

  const data = await res.json();
  return data.length;
}

async function carregarDashboard() {
  document.getElementById("total-quartos").innerText =
    await contar("hotel_quartos");

  document.getElementById("total-reservas").innerText =
    await contar("hotel_reservas");

  document.getElementById("total-hospedagens").innerText =
    await contar("hotel_hospedagens", "&status=eq.ativa");
}

carregarDashboard();
