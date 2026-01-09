/* ===== SUPABASE ===== */
const sb = supabase.createClient(
  "https://pdajixsoowcyhnjwhgpc.supabase.co",
  "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"
);

/* ===== CONTEXTO ===== */
const params = new URLSearchParams(location.search);
const mesaId = params.get("mesa");
const appId  = params.get("app_id");

let pedidoAtual = null;
let produtosCache = [];
let destinoSelecionado = "bar";

/* ===== MESA ===== */
async function carregarMesa(){
  const { data, error } = await sb
    .from("mesas")
    .select("numero_mesa")
    .eq("id", mesaId)
    .single();

  if (error) {
    console.log("Erro carregarMesa:", error);
    return;
  }

  // sem emoji no JS pra não dar BO de encoding
  document.getElementById("tituloMesa").innerText = "Mesa " + data.numero_mesa;
}

/* ===== PEDIDO ===== */
async function garantirPedidoAberto(){
  const { data, error } = await sb
    .from("pedidos")
    .select("*")
    .eq("mesa_id", mesaId)
    .eq("app_id", appId)
    .not("status","in",'("finalizado","pago")')
    .maybeSingle();

  if (error) console.log("Erro garantirPedidoAberto select:", error);
  if (data) return data;

  const { data: novo, error: err2 } = await sb
    .from("pedidos")
    .insert({
      app_id: appId,
      mesa_id: mesaId,
      status: "aberto",
      origem: "mesa"
    })
    .select()
    .single();

  if (err2) console.log("Erro criar pedido:", err2);
  return novo;
}

/* ===== PRODUTOS ===== */
async function carregarProdutos(){
  const { data, error } = await sb
    .from("produtos")
    .select("id,nome,preco,destino")
    .eq("app_id", appId)
    .eq("ativo", true)
    .order("nome");

  if (error) console.log("Erro carregarProdutos:", error);

  produtosCache = data || [];
  aplicarFiltros();
}

function renderProdutos(lista){
  const div = document.getElementById("listaProdutos");
  div.innerHTML = "";

  lista.forEach(p => {
    const bloqueado = pedidoAtual.status !== "aberto";

    div.innerHTML += `
      <div class="produto ${bloqueado ? "bloqueado" : ""}">
        <span>
          ${p.nome} - R$ ${Number(p.preco).toFixed(2)}
          <span class="tag ${p.destino}">${String(p.destino).toUpperCase()}</span>
        </span>
        <button onclick="addProduto('${p.id}')">➕</button>
      </div>
    `;
  });
}

/* ===== FILTROS ===== */
window.filtrarDestino = function(dest){
  destinoSelecionado = dest;

  document.querySelectorAll(".filtros button")
    .forEach(b => b.classList.remove("ativo"));

  document.getElementById(dest === "bar" ? "fBar" : "fCozinha")
    .classList.add("ativo");

  aplicarFiltros();
};

window.filtrarProdutos = function(){
  aplicarFiltros();
};

function aplicarFiltros(){
  const txt = document.querySelector("input").value.toLowerCase();
  renderProdutos(
    produtosCache.filter(p =>
      String(p.nome).toLowerCase().includes(txt) &&
      p.destino === destinoSelecionado
    )
  );
}

/* ===== ITENS ===== */
async function carregarPedido(){
  const { data, error } = await sb
    .from("pedido_itens")
    .select("*")
    .eq("pedido_id", pedidoAtual.id);

  if (error) console.log("Erro carregarPedido:", error);

  const div = document.getElementById("pedido");
  div.innerHTML = "";
  let total = 0;

  (data || []).forEach(i => {
    total += Number(i.preco) * Number(i.quantidade);

    const podeEditar = pedidoAtual.status === "aberto";

    div.innerHTML += `
      <div class="item">
        <div class="itemLinha">
          <div>
            ${i.nome_produto} x ${i.quantidade}
            <span class="tag ${i.destino}">${String(i.destino).toUpperCase()}</span>
          </div>

          ${podeEditar ? `
            <div class="itemBtns">
              <button class="btnMenos" onclick="diminuirItem(${i.id}, ${i.quantidade})">➖</button>
              <button class="btnRemover" onclick="removerItem(${i.id})">Remover</button>
            </div>
          ` : ``}
        </div>
      </div>
    `;
  });

  document.getElementById("totalPedido").innerText =
    "Total: R$ " + total.toFixed(2);

  const btn = document.getElementById("btnLiberar");
  if(btn){
    (data && data.length) ? btn.classList.add("bloqueado")
                          : btn.classList.remove("bloqueado");
  }
}

/* ===== ADD PRODUTO ===== */
window.addProduto = async function(produtoId){
  if (pedidoAtual.status !== "aberto") return;

  const p = produtosCache.find(x => String(x.id) === String(produtoId));
  if(!p) {
    console.log("Produto nao encontrado no cache:", produtoId);
    return;
  }

  const { data, error } = await sb
    .from("pedido_itens")
    .select("id,quantidade")
    .eq("pedido_id", pedidoAtual.id)
    .eq("produto_id", p.id)
    .maybeSingle();

  if (error) console.log("Erro addProduto select item:", error);

  if (data) {
    const { error: errUp } = await sb.from("pedido_itens")
      .update({ quantidade: Number(data.quantidade) + 1 })
      .eq("id", data.id);

    if (errUp) console.log("Erro update quantidade:", errUp);
  } else {
    const { error: errIns } = await sb.from("pedido_itens").insert({
      app_id: appId,
      pedido_id: pedidoAtual.id,
      produto_id: p.id,
      nome_produto: p.nome,
      preco: p.preco,
      quantidade: 1,
      destino: p.destino,
      status: "novo"
    });

    if (errIns) console.log("Erro insert item:", errIns);
  }

  carregarPedido();
};

/* ===== REMOVER/DIMINUIR (SÓ ANTES DE ENVIAR) ===== */
window.diminuirItem = async function(itemId, qtd){
  if (pedidoAtual.status !== "aberto") return;

  const q = Number(qtd);

  if (q > 1) {
    const { error } = await sb.from("pedido_itens")
      .update({ quantidade: q - 1 })
      .eq("id", itemId);

    if (error) console.log("Erro diminuirItem update:", error);
  } else {
    const { error } = await sb.from("pedido_itens")
      .delete()
      .eq("id", itemId);

    if (error) console.log("Erro diminuirItem delete:", error);
  }

  carregarPedido();
};

window.removerItem = async function(itemId){
  if (pedidoAtual.status !== "aberto") return;

  if (!confirm("Remover este item do pedido?")) return;

  const { error } = await sb.from("pedido_itens")
    .delete()
    .eq("id", itemId);

  if (error) console.log("Erro removerItem:", error);

  carregarPedido();
};

/* ===== AÇÕES ===== */
window.enviarPedido = async function(){
  if (pedidoAtual.status !== "aberto") return;

  const { error } = await sb.from("pedidos")
    .update({ status: "enviado" })
    .eq("id", pedidoAtual.id);

  if (error) {
    console.log("Erro enviarPedido:", error);
    alert("Falha ao enviar pedido (veja o console).");
    return;
  }

  pedidoAtual.status = "enviado";
  alert("Pedido enviado");
  aplicarFiltros();
  carregarPedido();
};

window.pedirConta = async function(){
  const { data } = await sb
    .from("pedido_itens")
    .select("id")
    .eq("pedido_id", pedidoAtual.id);

  if (!data || !data.length) {
    alert("Nao ha pedidos.");
    return;
  }

  const { error } = await sb.from("pedidos")
    .update({ status: "conta_solicitada" })
    .eq("id", pedidoAtual.id);

  if (error) console.log("Erro pedirConta:", error);

  alert("Conta solicitada");
};

window.liberarMesa = async function(){
  const { data } = await sb
    .from("pedido_itens")
    .select("id")
    .eq("pedido_id", pedidoAtual.id);

  if (data && data.length) {
    alert("Mesa possui pedidos ativos.");
    return;
  }

  if (!confirm("Tem certeza que deseja liberar esta mesa?")) return;

  const { error } = await sb.from("pedidos")
    .update({ status: "finalizado" })
    .eq("id", pedidoAtual.id);

  if (error) {
    console.log("Erro liberarMesa:", error);
    alert("Falha ao liberar mesa (veja o console).");
    return;
  }

  alert("Mesa liberada");
  location.href = "mesas.html";
};

/* ===== START ===== */
(async () => {
  await carregarMesa();
  pedidoAtual = await garantirPedidoAberto();
  await carregarProdutos();
  await carregarPedido();
})();
