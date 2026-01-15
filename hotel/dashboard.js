console.log("DASHBOARD HOTEL CARREGADO");

const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || admin.tipo !== "hotel" || !admin.app_id) {
  window.location.replace("login.html");
}

// ===== FUNÇÃO DE CONTAGEM =====
async function contar(tabela, filtroExtra = "") {
  try {
    let url = `${SUPABASE_URL}/rest/v1/${tabela}?select=id&app_id=eq.${admin.app_id}`;
    if (filtroExtra) url += `&${filtroExtra}`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) return 0;

    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

// ===== CARREGAR DASHBOARD =====
async function carregarDashboard() {
  document.getElementById("total-quartos").innerText =
    await contar("hotel_quartos");

  document.getElementById("total-reservas").innerText =
    await contar("hotel_reservas");

  document.getElementById("total-hospedagens").innerText =
    await contar("hotel_hospedagens", "status=eq.ativa");
}

carregarDashboard();
