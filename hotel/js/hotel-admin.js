// ===============================================
// HOTEL-ADMIN.JS
// CRUD de Quartos do Hotel
// Sistema FF Soluções
// ===============================================

// -------------------------
// OBTÉM O ID DO HOTEL DO USUÁRIO
// (Cada usuário só vê o seu próprio hotel)
// -------------------------
async function getHotelId() {
  const user = (await sb.auth.getUser()).data.user;

  if (!user) {
    console.error("Usuário não encontrado na sessão.");
    return null;
  }

  const { data, error } = await sb
    .from("hoteis")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (error) {
    console.error("Erro ao buscar hotel:", error);
    return null;
  }

  return data.id;
}

// -------------------------
// LISTAR QUARTOS DO HOTEL
// -------------------------
async function listarQuartos() {
  const hotel_id = await getHotelId();

  if (!hotel_id) {
    console.warn("Nenhum hotel encontrado para o usuário.");
    return [];
  }

  const { data, error } = await sb
    .from("hotel_quartos")
    .select("*")
    .eq("hotel_id", hotel_id)
    .order("numero", { ascending: true });

  if (error) {
    console.error("Erro ao listar quartos:", error);
    return [];
  }

  return data;
}

// -------------------------
// CRIAR NOVO QUARTO
// -------------------------
async function criarQuarto(quarto) {
  const { error } = await sb
    .from("hotel_quartos")
    .insert(quarto);

  if (error) {
    console.error("Erro ao criar quarto:", error);
    alert("Erro ao criar quarto: " + error.message);
    return null;
  }

  return true;
}
