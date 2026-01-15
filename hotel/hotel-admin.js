const { createClient } = supabase;

const db = createClient(
  "https://pdajixsoowcyhnjwhgpc.supabase.co",
  "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"
);

const admin = JSON.parse(localStorage.getItem("admin_logado"));

if (!admin || !admin.id) {
  alert("Sessão inválida");
  location.href = "login.html";
  throw new Error("Sem sessão");
}

/* ========= QUARTOS ========= */
async function listarQuartos() {
  const { data, error } = await db
    .from("hotel_quartos")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

async function criarQuarto(payload) {
  return await db.from("hotel_quartos").insert([payload]);
}
