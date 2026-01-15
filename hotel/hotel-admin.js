/* =====================================================
   HOTEL ADMIN CORE
   Usar em TODAS as páginas ADMIN do hotel
   ===================================================== */

/* ========= SUPABASE ========= */
const SUPABASE_URL = "https://pdajixsoowcyhnjwhgpc.supabase.co",
const SUPABASE_KEY = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ========= SESSÃO ========= */
const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || !admin.app_id || admin.modulo !== "hotel") {
  alert("Sessão inválida. Faça login novamente.");
  localStorage.clear();
  location.href = "login.html";
  throw new Error("Sessão inválida");
}

const negocioId = admin.app_id;

/* ========= HELPERS ========= */
function formatarData(data) {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return "-";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* ========= QUARTOS ========= */
async function listarQuartos() {
  const { data, error } = await supabase
    .from("hotel_quartos")
    .select("*")
    .eq("negocio_id", negocioId)
    .order("numero");

  if (error) {
    console.error("Erro ao listar quartos:", error);
    return [];
  }

  return data;
}

async function criarQuarto(payload) {
  payload.negocio_id = negocioId;

  const { error } = await supabase
    .from("hotel_quartos")
    .insert([payload]);

  if (error) {
    console.error("Erro ao criar quarto:", error);
    throw error;
  }
}

async function atualizarQuarto(id, payload) {
  const { error } = await supabase
    .from("hotel_quartos")
    .update(payload)
    .eq("id", id)
    .eq("negocio_id", negocioId);

  if (error) {
    console.error("Erro ao atualizar quarto:", error);
    throw error;
  }
}

/* ========= RESERVAS ========= */
async function listarReservas(status = null) {
  let query = supabase
    .from("hotel_reservas")
    .select(`
      id,
      hospede_nome,
      documento,
      checkin,
      checkout,
      status,
      hotel_quartos ( numero )
    `)
    .eq("negocio_id", negocioId)
    .order("checkin");

  if (status && status !== "todas") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao listar reservas:", error);
    return [];
  }

  return data;
}

async function atualizarStatusReserva(id, status) {
  const { error } = await supabase
    .from("hotel_reservas")
    .update({ status })
    .eq("id", id)
    .eq("negocio_id", negocioId);

  if (error) {
    console.error("Erro ao atualizar status:", error);
    throw error;
  }
}

/* ========= LOGOUT ========= */
function logoutAdmin() {
  localStorage.clear();
  location.href = "login.html";
}

/* ========= DEBUG (opcional) ========= */
console.log("Hotel Admin carregado:", {
  usuario: admin.usuario,
  app_id: negocioId
});

