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

// ================== CARREGAR QUARTOS ==================
async function carregarQuartos() {
  const { data, error } = await supabase
    .from("hotel_quartos")
    .select("*")
    .eq("negocio_id", negocioId);

  if (error) {
    console.error("Erro ao carregar quartos:", error);
    alert("Erro ao carregar quartos");
    return;
  }

  renderizarQuartos(data);
}

function renderizarQuartos(quartos) {
  const lista = document.getElementById("listaQuartos");
  lista.innerHTML = "";

  if (!quartos || quartos.length === 0) {
    lista.innerHTML = "<p>Nenhum quarto cadastrado</p>";
    return;
  }

  quartos.forEach(q => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>Quarto ${q.numero}</h3>
      <p>Tipo: ${q.tipo}</p>
      <p>Status: ${q.status}</p>
    `;
    lista.appendChild(div);
  });
}

// ================== INIT ==================
carregarQuartos();
