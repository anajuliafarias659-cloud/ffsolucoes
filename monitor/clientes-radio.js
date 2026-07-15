// =======================================
// FF INFRA
// CLIENTES RÁDIO
// PARTE 1
// =======================================

// ----------------------------
// SUPABASE
// ----------------------------

const supabase = window.supabase.createClient(

    "https://pdajixsoowcyhnjwhgpc.supabase.co",

    "sb_publishable_LatlFlcxk6IchHe3RNmfwA_9Oq4EsZw"

);

// ----------------------------
// VARIÁVEIS
// ----------------------------

let clientes = [];

let gateways = [];

let clienteEditando = null;

// ----------------------------
// INICIAR
// ----------------------------

window.onload = async () => {

    await carregarGateways();

    await carregarClientes();

};

// ----------------------------
// CARREGA GATEWAYS
// ----------------------------

async function carregarGateways(){

    const { data, error } = await supabase

        .from("monitor_gateways")

        .select("*")

        .order("nome");

    if(error){

        console.log(error);

        return;

    }

    gateways = data || [];

    const select = document.getElementById("gateway");

    select.innerHTML="";

    gateways.forEach(g=>{

        select.innerHTML += `

        <option value="${g.id}">

            ${g.nome}

        </option>

        `;

    });

}

// ----------------------------
// CARREGA CLIENTES
// ----------------------------

async function carregarClientes(){

    const { data, error } = await supabase

        .from("monitor_clientes_radio")

        .select("*")

        .order("cliente");

    if(error){

        console.log(error);

        return;

    }

    clientes = data || [];

    desenharTabela();

    atualizarCards();

}

// ----------------------------
// ABRIR MODAL
// ----------------------------

function abrirNovo(){

    clienteEditando = null;

    document.getElementById("modalCliente").style.display="flex";

    document.getElementById("id").value="";

    document.getElementById("cliente").value="";

    document.getElementById("torre").value="";

    document.getElementById("equipamento").value="PowerBeam";

    document.getElementById("ip").value="";

    document.getElementById("mac").value="";

}

// ----------------------------
// FECHAR MODAL
// ----------------------------

function fecharModal(){

    document.getElementById("modalCliente").style.display="none";

}
// =======================================
// FF INFRA
// CLIENTES RÁDIO
// PARTE 2
// =======================================

// ----------------------------
// DESENHAR TABELA
// ----------------------------

function desenharTabela(lista = clientes){

    const tbody = document.getElementById("tabelaClientes");

    tbody.innerHTML = "";

    if(lista.length === 0){

        tbody.innerHTML = `

        <tr>

            <td colspan="11">

                Nenhum cliente cadastrado.

            </td>

        </tr>

        `;

        return;

    }

    lista.forEach(cli=>{

        const gateway = gateways.find(g=>g.id===cli.gateway_id);

        let classeStatus = "offline";

        if(cli.status==="online")
            classeStatus="online";

        if(cli.status==="warning")
            classeStatus="warning";

        let classeSinal="sinalBom";

        const sinal = Number(cli.sinal || -100);

        if(sinal <= -70)
            classeSinal="sinalRuim";

        else if(sinal <= -60)
            classeSinal="sinalMedio";

        tbody.innerHTML += `

<tr>

<td>

<span class="status ${classeStatus}"></span>

</td>

<td>

${cli.cliente || "-"}

</td>

<td>

${cli.torre || "-"}

</td>

<td>

${cli.equipamento || "-"}

</td>

<td>

${cli.ip || "-"}

</td>

<td class="${classeSinal}">

${cli.sinal ?? "-"}

${cli.sinal ? " dBm" : ""}

</td>

<td>

${cli.ccq ?? "-"}

${cli.ccq ? "%" : ""}

</td>

<td>

${cli.ping ?? 0}/3

</td>

<td>

${cli.latencia ?? "-"}

${cli.latencia ? " ms" : ""}

</td>

<td>

${gateway?.nome || "-"}

</td>

<td>

<div class="acoes">

<button

class="btnPing"

onclick="monitorar('${cli.id}')">

Ping

</button>

<button

class="btnEditar"

onclick="editar('${cli.id}')">

Editar

</button>

<button

class="btnExcluir"

onclick="excluirCliente('${cli.id}')">

Excluir

</button>

</div>

</td>

</tr>

`;

    });

}

// ----------------------------
// CARDS
// ----------------------------

function atualizarCards(){

    const online = clientes.filter(c=>c.status==="online").length;

    const warning = clientes.filter(c=>c.status==="warning").length;

    const offline = clientes.filter(c=>c.status==="offline").length;

    let media = "-";

    const sinais = clientes.filter(c=>c.sinal!==null);

    if(sinais.length){

        media = (

            sinais.reduce((a,b)=>a+Number(b.sinal),0)

            /

            sinais.length

        ).toFixed(1);

    }

    document.getElementById("totalOnline").innerHTML=online;

    document.getElementById("totalAtencao").innerHTML=warning;

    document.getElementById("totalOffline").innerHTML=offline;

    document.getElementById("mediaSinal").innerHTML=

        media=="-" ? "-" : media+" dBm";

}

// ----------------------------
// FILTRO
// ----------------------------

function filtrarClientes(){

    const busca =

        document

        .getElementById("busca")

        .value

        .toLowerCase();

    const status =

        document

        .getElementById("filtroStatus")

        .value;

    const lista = clientes.filter(c=>{

        const okBusca=

            !busca ||

            (c.cliente || "")

            .toLowerCase()

            .includes(busca) ||

            (c.ip || "")

            .toLowerCase()

            .includes(busca) ||

            (c.mac || "")

            .toLowerCase()

            .includes(busca);

        const okStatus=

            !status ||

            c.status===status;

        return okBusca && okStatus;

    });

    desenharTabela(lista);

}
// =======================================
// FF INFRA
// CLIENTES RÁDIO
// PARTE 3
// =======================================

// ----------------------------
// SALVAR
// ----------------------------

async function salvarCliente(){

    const id = document.getElementById("id").value;

    const dados = {

        gateway_id: document.getElementById("gateway").value,

        cliente: document.getElementById("cliente").value,

        torre: document.getElementById("torre").value,

        equipamento: document.getElementById("equipamento").value,

        ip: document.getElementById("ip").value,

        mac: document.getElementById("mac").value.toUpperCase(),

        tecnologia:"radio"

    };

    if(!dados.cliente){

        alert("Informe o cliente.");

        return;

    }

    if(!dados.ip){

        alert("Informe o IP.");

        return;

    }

    let erro=null;

    if(id){

        ({error:erro}=await supabase

            .from("monitor_clientes_radio")

            .update(dados)

            .eq("id",id));

    }else{

        ({error:erro}=await supabase

            .from("monitor_clientes_radio")

            .insert(dados));

    }

    if(erro){

        console.log(erro);

        alert("Erro ao salvar.");

        return;

    }

    fecharModal();

    carregarClientes();

}

// ----------------------------
// EDITAR
// ----------------------------

function editar(id){

    const cli = clientes.find(c=>c.id===id);

    if(!cli) return;

    clienteEditando=cli;

    document.getElementById("modalCliente").style.display="flex";

    document.getElementById("id").value=cli.id;

    document.getElementById("cliente").value=cli.cliente||"";

    document.getElementById("gateway").value=cli.gateway_id||"";

    document.getElementById("torre").value=cli.torre||"";

    document.getElementById("equipamento").value=cli.equipamento||"";

    document.getElementById("ip").value=cli.ip||"";

    document.getElementById("mac").value=cli.mac||"";

}

// ----------------------------
// EXCLUIR
// ----------------------------

async function excluirCliente(id){

    if(!confirm("Excluir cliente?"))

        return;

    await supabase

        .from("monitor_clientes_radio")

        .delete()

        .eq("id",id);

    carregarClientes();

}

// ----------------------------
// MONITORAR
// ----------------------------

async function monitorar(id){

    const cli = clientes.find(c=>c.id===id);

    if(!cli) return;

    alert(

`Cliente: ${cli.cliente}

IP: ${cli.ip}

Status: ${cli.status}

Ping: ${cli.ping}/3

Latência: ${cli.latencia||"-"} ms

Sinal: ${cli.sinal||"-"} dBm

CCQ: ${cli.ccq||"-"} %`

    );

}

// ----------------------------
// AUTO UPDATE
// ----------------------------

setInterval(()=>{

    carregarClientes();

},30000);
