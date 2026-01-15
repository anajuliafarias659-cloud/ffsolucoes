// ================== SUPABASE ==================
const supabase = supabase.createClient(
  "SUA_URL_SUPABASE",
  "SUA_ANON_KEY"
);

// ================== SESSÃO ==================
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || !admin.app_id) {
  alert("Sessão inválida. Faça login novamente.");
  location.href = "../auth/login.html";
  throw new Error("Sem app_id");
}

const negocioId = admin.app_id;

// ================== RESERVAS ATIVAS ==================
async function carregarReservasAtivas() {
  const { data, error } = await supabase
    .from("hotel_reservas")
    .select("*")
    .eq("negocio_id", negocioId)
    .eq("status", "ativo");

  if (error) {
    console.error("Erro ao carregar reservas:", error);
    alert("Erro ao carregar reservas");
    return;
  }

  renderizarReservas(data);
}

// ================== ÚLTIMAS RESERVAS ==================
async function carregarUltimasReservas() {
  const { data, error } = await supabase
    .from("hotel_reservas")
    .select("id, hospede_nome, checkin, checkout, status")
    .eq("negocio_id", negocioId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Erro ao carregar últimas reservas:", error);
    return;
  }

  renderizarUltimas(data);
}

// ================== RENDER ==================
function renderizarReservas(reservas) {
  const lista = document.getElementById("listaReservas");
  lista.innerHTML = "";

  if (!reservas || reservas.length === 0) {
    lista.innerHTML = "<p>Nenhuma reserva ativa</p>";
    return;
  }

  reservas.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${r.hospede_nome}</h3>
      <p>Check-in: ${r.checkin}</p>
      <p>Check-out: ${r.checkout}</p>
      <p>Status: ${r.status}</p>
    `;
    lista.appendChild(div);
  });
}

function renderizarUltimas(reservas) {
  const lista = document.getElementById("ultimasReservas");
  lista.innerHTML = "";

  reservas.forEach(r => {
    const li = document.createElement("li");
    li.innerText = `${r.hospede_nome} • ${r.status}`;
    lista.appendChild(li);
  });
}

// ================== INIT ==================
carregarReservasAtivas();
carregarUltimasReservas();
