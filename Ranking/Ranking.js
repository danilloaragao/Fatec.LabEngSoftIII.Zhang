var senha = document.getElementById('nova-senha');
var senhaConf = document.getElementById('nova-senha-conf');
var msgErroSenha = document.getElementById('erro-senha');
var btnRedefinirSenha = document.getElementById('btn-enviar');
var btnAbrirModal = document.getElementById('lnk-red-senha');
var btnFecharModal = document.getElementById('btn-fechar');


btnAbrirModal.addEventListener('click', abrirModal)

btnFecharModal.addEventListener('click', function(){
    document.getElementById('modal-container').style.display = "none";
    document.querySelector('.modal-content').style.display = 'flex';
    document.querySelector('.msg-modal').style.display = 'none';
    senha.value = "";
    senhaConf.value = "";
    senha.style.borderBottomColor = "#942fd8"
    senhaConf.style.borderBottomColor = "#942fd8";
    msgErroSenha.innerHTML = "";
 
})
       
senha.addEventListener('keyup', validarSenha);


 senhaConf.addEventListener('focus', function(){
     senhaConf.addEventListener('keyup', validarSenha)
 })

btnRedefinirSenha.addEventListener('click', putNovaSenha)
    
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

function mensagemModal(mensagem){
    document.querySelector('.modal-content').style.display = 'none';
    document.querySelector('.msg-modal').style.display = 'flex'
    document.querySelector('.msg-modal').innerHTML = mensagem ;      
}


function putNovaSenha(){
    //TODO: Remover essa linha ao integrar sistema
    localStorage.setItem('usuario','{"id": 1,"login": "teste","email": "teste@asdf","experiencia": 0,"experienciaProximoNivel": 200,"nivel": 0,"skins": [], "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYW1laWQiOiJTdXBlclVzZXIiLCJpc2FkbSI6IjEifQ.22d5M8Zgg-Kh0CUAKVmntMuliEegGJ-MR4opvvfiQdk"}')
     //--------------------------------------------

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

