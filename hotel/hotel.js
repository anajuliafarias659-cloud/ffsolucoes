// ================== SUPABASE ==================
const supabase = supabase.createClient(
  "https://pdajixsoowcyhnjwhgpc.supabase.co",
  "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"
);

// ================== APP VIA URL ==================
const params = new URLSearchParams(window.location.search);
const negocioId = params.get("app");

if (!negocioId) {
  document.getElementById("lista-quartos").innerHTML =
    "<p>Hotel não identificado.</p>";
  throw new Error("Sem app_id");
}

// ================== CARREGAR QUARTOS ==================
async function carregarQuartos() {
  const { data, error } = await supabase
    .from("hotel_quartos")
    .select("*")
    .eq("negocio_id", negocioId)
    .eq("status", "disponivel");

  if (error) {
    console.error(error);
    document.getElementById("lista-quartos").innerHTML =
      "<p>Erro ao carregar quartos.</p>";
    return;
  }

  renderizarQuartos(data);
}

// ================== RENDER ==================
function renderizarQuartos(quartos) {
  const lista = document.getElementById("lista-quartos");
  lista.innerHTML = "";

  if (!quartos || quartos.length === 0) {
    lista.innerHTML = "<p>Nenhum quarto disponível.</p>";
    return;
  }

  quartos.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Quarto ${q.numero}</h3>
      <p>Tipo: ${q.tipo}</p>
      <p>Valor: R$ ${q.valor}</p>
      <a href="reserva.html?app=${negocioId}&quarto=${q.id}">
        Reservar
      </a>
      <hr>
    `;
    lista.appendChild(div);
  });
}

carregarQuartos();
