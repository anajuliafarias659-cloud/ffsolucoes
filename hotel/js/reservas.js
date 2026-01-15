// ===============================================
// RESERVAS.JS
// CRUD de Reservas do Sistema do Hotel
// FF Soluções
// ===============================================

// -------------------------
// LISTAR RESERVAS POR STATUS
// -------------------------
async function listarReservas(status = "ativo", negocioId) {
  let query = sb
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
    .eq("negocio_id", negocioId);

  if (status !== "todas") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao listar reservas:", error);
    return [];
  }

  return data;
}

// -------------------------
// ALTERAR STATUS DA RESERVA
// -------------------------
async function mudarStatus(id, novoStatus, negocioId) {
  const { error } = await sb
    .from("hotel_reservas")
    .update({ status: novoStatus })
    .eq("id", id)
    .eq("negocio_id", negocioId);

  if (error) {
    console.error("Erro ao alterar status:", error);
    alert("Erro ao atualizar reserva!");
    return false;
  }

  return true;
}
