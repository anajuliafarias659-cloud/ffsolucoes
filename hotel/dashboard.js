// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== SESSÃO =====
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || admin.tipo !== "hotel") {
  window.location.href = "login.html";
}

// ===== ELEMENTOS =====
const elQuartos = document.getElementById("total-quartos");
const elReservas = document.getElementById("total-reservas");
const elHospedagens = document.getElementById("total-hospedagens");
const elUltimas = document.getElementById("ultimas-reservas");

// ===== FUNÇÃO GENÉRICA DE CONTAGEM =====
async function contar(tabela, filtroExtra = "") {
  const url = `${SUPABASE_URL}/rest/v1/${tabela}?select=id&app_id=eq.${admin.app_id}${filtroExtra}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) return 0;

  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

// ===== CARREGAR DASHBOARD =====
async function carregarDashboard() {
  try {
    // cards
    elQuartos.innerText = await contar("hotel_quartos", "&ativo=eq.true");
    elReservas.innerText = await contar("hotel_reservas");
    elHospedagens.innerText = await contar("hotel_hospedagens", "&status=eq.ativa");

    // últimas reservas
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/hotel_reservas?select=*&app_id=eq.${admin.app_id}&order=created_at.desc&limit=5`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const reservas = await res.json();

    if (!Array.isArray(reservas) || reservas.length === 0) {
      elUltimas.innerHTML = "<p>Nenhuma reserva.</p>";
      return;
    }

    elUltimas.innerHTML = reservas.map(r => `
      <div class="reserva">
        <strong>${r.nome_cliente}</strong><br>
        Quarto ${r.quarto} • ${r.data_entrada}
      </div>
    `).join("");

  } catch (err) {
    console.error("Erro no dashboard:", err);
  }
}

// ===== START =====
document.addEventListener("DOMContentLoaded", carregarDashboard);
