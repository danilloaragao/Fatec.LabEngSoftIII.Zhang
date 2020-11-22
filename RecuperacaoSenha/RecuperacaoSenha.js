var email = document.querySelector('#input-email');
var btnEnviar = document.querySelector('#btn-enviar');
var msgErro = document.querySelector('#msg-erro');



btnEnviar.addEventListener('click', () => {
    postPassword(email.value);
});

email.addEventListener('keyup', () =>{
    if (!email.value){
        msgErro.innerHTML = "";
        email.style.borderBottomColor = "#7B2DAE"
    }
})


function validarEmail(emailValue){

    const regexp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!(regexp.test(emailValue))){
        msgErro.innerHTML = "Email inválido";
        email.style.borderBottomColor = "red";
        return false;
    }
    return true;
}


function postPassword(emailValue){

    if (validarEmail(emailValue)){

        let baseUrl = "https://zhang-api.herokuapp.com"

        var myHeaders = new Headers();
        myHeaders.append("Accept", "text/plain");
        myHeaders.append("Content-Type", "application/json-patch+json");
        myHeaders.append("origin", baseUrl);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: `"${emailValue}"`,
            redirect: 'follow'
        };

        fetch(`${baseUrl}/api/Usuario/RecuperacaoSenha`, requestOptions)
            .then(response => response.text()) 
            .then(data => {
                if (data == "Login ou Email não encontrado na base de dados"){
                    msgErro.innerHTML = "Email não cadastrado na base de dados!";
                    email.style.borderBottomColor = "red";
                }else{
                    mensagemFinal('Senha enviada com sucesso!')
                }
            }) 
            .catch(error => alert(error));
    }     
}


function mensagemFinal(mensagem){
    document.querySelector('.form').style.display = 'none';
    document.querySelector('.msg-final').style.display = 'flex'
    document.querySelector('.msg-final').innerHTML = mensagem ;      
}