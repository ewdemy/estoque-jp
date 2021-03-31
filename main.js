
//URLs
const URLEstoque = "https://tb-final-web-estoque-api.herokuapp.com/estoque/"
const URLEntradas = "https://tb-final-web-estoque-api.herokuapp.com/entradas/"
const URLSaidas = "https://tb-final-web-estoque-api.herokuapp.com/saidas/"

//Configuração Menus

function abrirMenu(){
    document.getElementById("menu").style.width = "250px"
    document.getElementById("container").style.marginLeft = "250px"
    document.getElementById("btn-abrir").style.marginRight = "0px"
    document.getElementById("foot").style.marginLeft = "250px"
}

function fecharMenu(){
    document.getElementById("menu").style.width = "0px"
    document.getElementById("container").style.marginLeft = "0px"
    document.getElementById("btn-abrir").style.marginRight = "-250px"
    document.getElementById("foot").style.marginLeft = "0px"
}

function abrirConteudo(event, idItem){
    title = idItem.substring(0,1).toUpperCase().concat(idItem.substring(1))
    document.title ="SGE - " + title
    var conteudos = document.getElementsByClassName("conteudo")
    var itensMenu = document.getElementsByClassName("item-menu")

    for(var cont of conteudos){
        cont.style.display = "none"   
    }

    for(var item of itensMenu){
        item.classList.remove("ativo")   
    }

    document.getElementById(idItem).style.display = "flex"
    event.target.classList.add("ativo")
    
}

//Menus ---------------------------

//Utils

function formatarData(data){
    const date = new Date(data)

const dia = date.getDate().toString().padStart(2, '0')
const mes = (date.getMonth() + 1).toString().padStart(2, '0')
const ano = date.getFullYear()

const dataFormatada = `${dia}/${mes}/${ano}`

return dataFormatada
}

function carregarDataList(){
    let lista = document.querySelector('#lista-estoque')

    lista.innerHTML = ""
 
    var dataList = document.getElementById("produtos")
    dataList.innerHTML = ""

    fetch(URLEstoque).then((response) => {
        return response.json()
    }).then((data) => {

        for(var prod of data){
            carregarTabela(prod)
            var opt = document.createElement("option")
            opt.value = prod._id
            opt.innerHTML = prod.produto.toUpperCase()
            dataList.appendChild(opt)
        }
    })
}


function main(){
    document.getElementById("item-estoque").click()
    carregarDataList()
    loadEntradas()
    loadSaidas()
}


// Utils --------------------------


//Estoque

function adicionarEstoque(event){
    event.preventDefault()

    var produto = document.getElementById("produto").value

    if(produto == ""){
        alert("Preencha o campo produto!")
    } else{

        var prod ={
            produto: produto
        }
    
        fetch(URLEstoque, {
            method: "POST",
            body: JSON.stringify(prod),
            headers: {"Content-Type": "application/json; charset=utf-8"}
          
          }).then((response) => response.json()).then((data) =>{
              alert("Produto salvo com sucesso! ID: " + data._id)
              carregarDataList()
          }).catch((error) =>{
            alert("Erro ao salvar estoque!")
              console.log(error)
          })
    
          document.getElementById("produto").value = ""
          
    }
    
}

function carregarTabela(produto) {
    let lista = document.querySelector('#lista-estoque')
    let linha = document.createElement('tr')

    linha.innerHTML = `
    <td hidden>${produto._id}</td>
    <td>${produto.produto}</td>
    <td class="cel-qtd">${produto.quantidade}</td>
    <td><img class="icon-atualizar atualizar" src="./img/edit.svg" alt="ícone atualizar"></td>
    <td><img class="icon-excluir excluir" src="./img/trash.svg" alt="ícone excluir"></td>
    `
    lista.appendChild(linha)
  }


  function deleteAtualiza(e) {
    let linhaSelecionada = e.target.parentElement.parentElement

    if(e.target.classList.contains('excluir')) {
        let id = linhaSelecionada.cells[0].innerHTML
      
        if (confirm('Tem certeza que deseja excluir esse registro?')){

            fetch(URLEstoque+id, {
                method: "DELETE",
                headers: {"Content-Type": "application/json; charset=utf-8"}
              }).then((response) => {
                  return response.ok
                }).then((res) =>{
                  if(res){
                    alert("Removido com sucesso!")
                    carregarDataList()
                  }
              }).catch((error) =>{
                alert("Erro ao excluir estoque!")
                  console.log(error)
              })   
        }
    }

    if(e.target.classList.contains('atualizar')) {
        let id = linhaSelecionada.cells[0].innerHTML
        let produto = linhaSelecionada.cells[1].innerHTML

        var produtoInput = document.getElementById("produto")
        produtoInput.value = produto
        var btnSalvarEstoque = document.getElementById("btn-salvar-estoque")
        var btnAtualizarEstoque = document.getElementById("btn-atualizar-estoque")

        btnSalvarEstoque.style.display = "none"
        btnAtualizarEstoque.style.display = "inline"

        btnAtualizarEstoque.addEventListener("click", (event) =>{
            event.preventDefault()
            produtoAtualizado = produtoInput.value

            if(produtoAtualizado == ""){
                alert("Preencha o campo produto!")
            }else{
                if (confirm('Tem certeza que deseja alterar esse registro?')){

                    fetch(URLEstoque+id, {
                        method: "PUT",
                        body: JSON.stringify({produto: produtoAtualizado}),
                        headers: {"Content-Type": "application/json; charset=utf-8"}
                      }).then((response) => {
                          return response.ok
                        }).then((res) =>{
                          if(res){
                            alert("Atualizado com sucesso!") 
                            produtoInput.value = ""
                            carregarDataList()
                          } else{alert("Erro ao atualizar estoque!") }
                      }).catch((error) =>{
                        alert("Erro ao atualizar estoque!")
                          console.log(error)
                      })
    
                    btnAtualizarEstoque.style.display = "none"
                    btnSalvarEstoque.style.display = "inline"   
                }
            }
    
         })
    }
  }


  function pesquisarProduto(event){
    event.preventDefault()
    var produtoInput = document.getElementById("produto").value
    let lista = document.querySelector('#lista-estoque')

    if(produtoInput == ""){
      alert("Preencha o campo produto!")
      } else{
          fetch(URLEstoque+"buscar/"+produtoInput).then((response) => {
              return response.json()
          }).then((data) => {
              lista.innerHTML = ""
              for(var prod of data){
                  carregarTabela(prod)
              }
              document.getElementById("produto").value = ""
          }).catch((error) =>{
            alert("Erro ao pesquisar estoque!")
              console.log(error)
            })
      }
}


//estoque --------------------------

//Entrada

function addEntrada(event){

    event.preventDefault()

    var entradaProduto = document.getElementById("pesquisar-produto")
    var entradaQauntidade = document.getElementById("quantidade-entrada")
    var listaData = document.getElementById("produtos")

    var present = false

    for(opt of listaData.options){
        if(opt.value == entradaProduto.value){
            present = true
        }
    }

    if(entradaProduto.value == "" || entradaQauntidade.value == ""){
        alert("Preencha todos os campos!")
    } else if(!present){
        alert("Selecione um produto da lista!")
        entradaProduto.value = ""
        entradaQauntidade.value = ""
    }else if(!(entradaQauntidade.value > 0 && entradaQauntidade.value < 999999)){
        alert("Digite uma quantidade válida entre 0 e 999999!")
        entradaQauntidade.value = ""
    }
    else{

        var entrada ={
            produto: entradaProduto.value,
            quantidade: entradaQauntidade.value
        }
    
        fetch(URLEntradas, {
            method: "POST",
            body: JSON.stringify(entrada),
            headers: {"Content-Type": "application/json; charset=utf-8"}
          
          }).then((response) => response.json()).then((data) =>{
              alert("Entrada salva com sucesso! ID: " + data._id)
              loadEntradas()
              carregarDataList()
          }).catch((error) =>{
            alert("Erro ao salvar entrada!")
              console.log(error)
          })
    
            entradaProduto.value = ""
            entradaQauntidade.value = ""
    }
}

function carregarTabelaEntradas(entrada) {
    let lista = document.querySelector('#lista-entradas')

    let linha = document.createElement('tr')

    linha.innerHTML = `
    <td hidden>${entrada._id}</td>
    <td>${entrada.produto.produto}</td>
    <td class="cel-qtd">${entrada.quantidade}</td>
    <td class="cel-qtd">${formatarData(entrada.data)}</td>
    <td><img class="icon-excluir excluir" src="./img/trash.svg" alt="ícone excluir"></td>
    `

    lista.appendChild(linha)
  }

    function loadEntradas(){
    let lista = document.querySelector('#lista-entradas')

    lista.innerHTML = ""

    fetch(URLEntradas).then((response) => {
        return response.json()
    }).then((data) => {

        for(var entrada of data){
            carregarTabelaEntradas(entrada)
        }
    })
}

function deleteEntrada(e) {
    let linhaSelecionada = e.target.parentElement.parentElement
    
    if(e.target.classList.contains('excluir')) {
        let id = linhaSelecionada.cells[0].innerHTML
        if (confirm('Tem certeza que deseja excluir esse registro?')){

            fetch(URLEntradas+id, {
                method: "DELETE",
                headers: {"Content-Type": "application/json; charset=utf-8"}
              }).then((response) => {
                    if(response.ok){
                        return response.ok
                    } else{
                        return response.json()
                    }
                }).then((res) =>{
                  if(res === true){
                    alert("Removido com sucesso!")
                    loadEntradas()
                  }else{
                      alert(res.message)
                  }
              }).catch((error) =>{
                alert("Erro ao excluir entrada!")
                  console.log(error)
              })   
        }
    }

  }

//entrada ---------------------------


//Saida

function addSaida(event){

    event.preventDefault()

    var saidaProduto = document.getElementById("pesquisar-produto-saida")
    var saidaQuantidade = document.getElementById("quantidade-saida")
    var listaData = document.getElementById("produtos")

    var present = false

    for(opt of listaData.options){
        if(opt.value == saidaProduto.value){
            present = true
        }
    }

    if(saidaProduto.value == "" || saidaQuantidade.value == ""){
        alert("Preencha todos os campos!")
    } else if(!present){
        alert("Selecione um produto da lista!")
        saidaProduto.value = ""
        saidaQuantidade.value = ""
    }else if(!(saidaQuantidade.value > 0 && saidaQuantidade.value < 999999)){
        alert("Digite uma quantidade válida entre 0 e 999999!")
        saidaQuantidade.value = ""
    }
    else{

        var saida ={
            produto: saidaProduto.value,
            quantidade: saidaQuantidade.value
        }
    
        fetch(URLSaidas, {
            method: "POST",
            body: JSON.stringify(saida),
            headers: {"Content-Type": "application/json; charset=utf-8"}
          }).then((response) => {
                return response.json()
            }).then((data) => {
                var msg = data.message
                console.log(msg)
                if(!msg){
                    alert("Saída salva com sucesso! ID: " + data._id)
                }else{
                    alert(msg)
                }
              loadSaidas()
              carregarDataList()
          }).catch((error) =>{
            alert("Erro ao salvar saída!")
              console.log(error)
          })
    
            saidaProduto.value = ""
            saidaQuantidade.value = ""
    }
}

function carregarTabelaSaidas(saida) {
    let lista = document.querySelector('#lista-saidas')

    let linha = document.createElement('tr')

    linha.innerHTML = `
    <td hidden>${saida._id}</td>
    <td>${saida.produto.produto}</td>
    <td class="cel-qtd">${saida.quantidade}</td>
    <td class="cel-qtd">${formatarData(saida.data)}</td>
    <td><img class="icon-excluir excluir" src="./img/trash.svg" alt="ícone excluir"></td>
    `
    lista.appendChild(linha)
  }

    function loadSaidas(){
    let lista = document.querySelector('#lista-saidas')

    lista.innerHTML = ""

    fetch(URLSaidas).then((response) => {
        return response.json()
    }).then((data) => {

        for(var saida of data){
            carregarTabelaSaidas(saida)
        }
    })
}

function deleteSaida(e) {
    let linhaSelecionada = e.target.parentElement.parentElement
    
    if(e.target.classList.contains('excluir')) {
        let id = linhaSelecionada.cells[0].innerHTML
        if (confirm('Tem certeza que deseja excluir esse registro?')){

            fetch(URLSaidas+id, {
                method: "DELETE",
                headers: {"Content-Type": "application/json; charset=utf-8"}
              }).then((response) => {
                        return response.ok
                }).then((res) =>{
                  if(res === true){
                    alert("Removido com sucesso!")
                    loadSaidas()
                    carregarDataList()
                  }
              }).catch((error) =>{
                  alert("Erro ao excluir saída")
                  console.log(error)
              })   
        }
    }

  }

//saida ---------------------------

main()