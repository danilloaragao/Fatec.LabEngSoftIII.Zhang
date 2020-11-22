//TODO: Remover essa linha ao implantar sistema
localStorage.setItem('usuario','{"id": 1,"login": "vitao_gamer666","email": "vitao_maneiro@gmail.com","experiencia": 0,"experienciaProximoNivel": 200,"nivel": 0,"skins": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjE0IiwibmFtZWlkIjoidGVzdGUiLCJpc2FkbSI6IjAifQ.IDrIWOz8SXQilW2eV5fPzfuyJ7Lg7SHyz6_rrZ4JMcI"}')
//--------------------------------------------

var username = document.getElementById('mc-username');
var email = document.getElementById('mc-email');
var senha = document.getElementById('nova-senha');
var senhaConf = document.getElementById('nova-senha-conf');
var msgErroSenha = document.getElementById('erro-senha');
var btnRedefinirSenha = document.getElementById('btn-enviar');
var btnAbrirModal = document.getElementById('lnk-red-senha');
var btnFecharModal = document.getElementById('btn-fechar');


document.addEventListener("DOMContentLoaded", function(){
    getLocalUserInformation();
    getRanking();
});


btnAbrirModal.addEventListener('click', abrirModal)

btnFecharModal.addEventListener('click', fecharModal)
       
senha.addEventListener('keyup', validarSenha);


 senhaConf.addEventListener('focus', function(){
     senhaConf.addEventListener('keyup', validarSenha)
 })

btnRedefinirSenha.addEventListener('click', putNovaSenha);

function getLocalUserInformation(){
    var usuario = JSON.parse(localStorage.getItem("usuario"))
    var usernameVar =  usuario.login;
    var emailVar = usuario.email;

    username.innerHTML = usernameVar;
    email.innerHTML = emailVar;
}

function validarSenha() {
    var novaSenha = senha.value;
    var novaSenhaConf = senhaConf.value;
    var teste = false;
    
    if(novaSenha.length === 0 || novaSenha.length < 6){
        msgErroSenha.innerHTML = "Senha deve ter no mínimo 6 caracteres";
        senha.style.borderBottomColor = "red";
    }else if(novaSenha != novaSenhaConf){
        senhaConf.style.borderBottomColor = "red";
        msgErroSenha.innerHTML = "Senhas não coicidem!";
    }else if(novaSenha && novaSenhaConf && novaSenha === novaSenhaConf){
        senha.style.borderBottomColor = "#942fd8";
        senhaConf.style.borderBottomColor = "#942fd8";
        msgErroSenha.innerHTML = "";
        teste = true;
    }

    return teste;
}

function abrirModal(){
    document.getElementById('modal-container').style.display = "flex";
}

function fecharModal(){
    document.getElementById('modal-container').style.display = "none";
    document.querySelector('.modal-content').style.display = 'flex';
    document.querySelector('.msg-modal').style.display = 'none';
    senha.value = "";
    senhaConf.value = "";
    senha.style.borderBottomColor = "#942fd8"
    senhaConf.style.borderBottomColor = "#942fd8";
    msgErroSenha.innerHTML = "";
}

function mensagemModal(mensagem){
    document.querySelector('.modal-content').style.display = 'none';
    document.querySelector('.msg-modal').style.display = 'flex'
    document.querySelector('.msg-modal').innerHTML = mensagem ;      
}


function putNovaSenha(){

if (validarSenha()){
    var usuario = JSON.parse(localStorage.getItem("usuario"))
    var token = usuario.token;
    var id = usuario.id;
    var novaSenha = senha.value; 

    var raw = {
        "Id": id,
        "Senha": novaSenha
    }    

    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("token", token);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    }
    
        fetch("https://zhang-api.herokuapp.com/api/Usuario/AlterarDados", requestOptions)
        .then(response => response.text()) 
        .then(result => {
            mensagemModal('Senha atualizada com sucesso!');
        }) 
        .catch(error => {
            mensagemModal('Erro ao redefinir senha, tente mais tarde');
        }); 
    }
}

function getRanking(){
    var usuario = JSON.parse(localStorage.getItem("usuario"))
    var token = usuario.token;

    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("token", token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }  
       

    fetch("https://zhang-api.herokuapp.com/api/Jogo/Ranking", requestOptions)
        .then(response => response.json()) 
        .then(data => { showRanking(data);}) 
        .catch(error => {});
}


function showRanking(rankingArray){
    var htmlRanking = rankingArray.map( user => {
       return `
                <li><div class="item-ranking">
                <span>${user.posicao}</span> 
                <span>${user.login}</span> 
                <span class="pontos">${user.experiencia} Pts</span>
                </div></li>`
    }).join("");

    document.querySelector(".lista-ranking").innerHTML = htmlRanking;
}