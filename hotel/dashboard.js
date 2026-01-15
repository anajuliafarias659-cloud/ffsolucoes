// ===== CONFIG SUPABASE =====
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// ===== SESSÃO =====
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || admin.tipo !== "hotel") {
  window.location.href = "login.html";
}

// 🔑 agora usamos negocio_id
const NEGOCIO_ID = admin.negocio_id;

// ===== ELEMENTOS =====
const elQuartos = document.getElementById("total-quartos");
const elReservas = document.getElementById("total-reservas");
const elHospedagens = document.getElementById("total-hospedagens");
const elUltimas = document.getElementById("ultimas-reservas");

// ===== CONTAR =====
async function contar(tabela) {
  const url = `${SUPABASE_URL}/rest/v1/${tabela}?select=id&negocio_id=eq.${NEGOCIO_ID}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    console.warn(`Tabela ${tabela} indisponível`);
    return 0;
  }

  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

// ===== DASHBOARD =====
async function carregarDashboard() {
  elQuartos.innerText = await contar("hotel_quartos");
  elReservas.innerText = await contar("hotel_reservas");
  elHospedagens.innerText = await contar("hotel_hospedagens");

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/hotel_reservas?select=*&negocio_id=eq.${NEGOCIO_ID}&order=created_at.desc&limit=5`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!res.ok) {
    elUltimas.innerHTML = "<p>Nenhuma reserva.</p>";
    return;
  }

  const reservas = await res.json();

  if (!Array.isArray(reservas) || reservas.length === 0) {
    elUltimas.innerHTML = "<p>Nenhuma reserva.</p>";
    return;
  }

  elUltimas.innerHTML = reservas.map(r => `
    <div class="reserva">
      <strong>${r.nome_cliente || "Cliente"}</strong><br>
      Quarto ${r.numero || "-"}
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", carregarDashboard);
