import { supabase } from "./supabase.js";

// 🔒 Garante que o sistema já tenha definido o NEGOCIO_ID
function getNegocioId() {
  if (!window.NEGOCIO_ID) {
    throw new Error("NEGOCIO_ID não definido. auth.js precisa rodar primeiro.");
  }
  return window.NEGOCIO_ID;
}

// 📦 SELECT padrão
export function from(table) {
  return supabase
    .from(table)
    .select("*")
    .eq("negocio_id", getNegocioId());
}

// ➕ INSERT automático com negocio_id
export async function insert(table, data) {
  return await supabase
    .from(table)
    .insert({
      ...data,
      negocio_id: getNegocioId()
    });
}

// ✏ UPDATE protegido
export async function update(table, data, id) {
  return await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .eq("negocio_id", getNegocioId());
}

// ❌ DELETE protegido
export async function remove(table, id) {
  return await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .eq("negocio_id", getNegocioId());
}
