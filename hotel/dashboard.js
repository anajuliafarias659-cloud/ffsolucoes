console.log("DASHBOARD NOVO CARREGADO");

// ===== CONFIG =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== SESSÃO =====
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || !admin.negocio_id) {
  alert("Sessão inválida");
  window.location.href = "login.html";
}

// ===== FUNÇÃO CONTAR =====
async function contar(tabela) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tabela}?select=id&negocio_id=eq.${admin.negocio_id}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) throw new Error("Falha ao acessar " + tabela);

    const dados = await res.json();
    return dados.length;

  } catch (e) {
    console.warn(e.message);
    return 0;
  }
}

// ===== CARREGAR DASHBOARD =====
async function carregarDashboard() {
  document.getElementById("total-quartos").innerText =
    await contar("hotel_quartos");

  document.getElementById("total-reservas").innerText =
    await contar("hotel_reservas");

  // ⚠️ só chama se a tabela existir
  document.getElementById("total-hospedagens").innerText =
    await contar("hotel_hospedagens");
}

carregarDashboard();
