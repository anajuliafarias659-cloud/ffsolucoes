const supabaseUrl = "https://pdajixsoowcyhnjwhgpc.supabase.co";
const supabaseKey = "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw";
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

async function getHotelId() {
  const user = (await supabase.auth.getUser()).data.user;

  const { data, error } = await supabase
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

async function listarQuartos() {
  const hotel_id = await getHotelId();
  if (!hotel_id) return [];

  const { data, error } = await supabase
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

async function criarQuarto(quarto) {
  const { data, error } = await supabase
    .from("hotel_quartos")
    .insert(quarto);

  if (error) {
    console.error("Erro ao criar quarto:", error);
    alert("Erro ao criar quarto: " + error.message);
    return null;
  }

  return data;
}
