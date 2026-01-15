async function getHotelId() {
  const user = verificarSessao();

  const { data } = await sb
    .from("hoteis")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  return data?.id || null;
}

async function listarQuartos() {
  const hotelId = await getHotelId();
  if (!hotelId) return [];

  const { data } = await sb
    .from("hotel_quartos")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("numero");

  return data || [];
}

async function criarQuarto(q) {
  return await sb.from("hotel_quartos").insert(q);
}
