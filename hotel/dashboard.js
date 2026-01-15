console.log("DASHBOARD NOVO CARREGADO");

// CONFIG
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";

// SESSION
const admin = JSON.parse(localStorage.getItem("admin_logado"));
if (!admin || !admin.negocio_id) {
  alert("Sessão inválida");
  location.href = "login.html";
}

const NEGOCIO_ID = admin.negocio_id;

// ELEMENTOS
const elQuartos = document.getElementById("total-quartos");
const elReservas = document.getElementById("total-reservas");
const elHospedagens = document.getElementById("total-hospedagens");
const listaReservas = document.getElementById("lista-reservas");

// FUNÇÃO SEGURA
async function buscar(tabela) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tabela}?select=*&negocio_id=eq.${NEGOCIO_ID}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function carregarDashboard() {
  // QUARTOS
  const quartos = await buscar("hotel_quartos");
  elQuartos.innerText = quartos.length;

  // RESERVAS
  const reservas = await buscar("hotel_reservas");
  elReservas.innerText = reservas.length;

  // HOSPEDAGENS (se não existir, fica 0 sem erro)
  const hospedagens = await buscar("hotel_hospedagens");
  elHospedagens.innerText = hospedagens.length || 0;

  // ÚLTIMAS RESERVAS
  if (!reservas.length) {
    listaReservas.innerHTML = "<p>Nenhuma reserva.</p>";
  } else {
    listaReservas.innerHTML = reservas
      .slice(0, 5)
      .map(r => `<p>Reserva #${r.id}</p>`)
      .join("");
  }
}

carregarDashboard();
