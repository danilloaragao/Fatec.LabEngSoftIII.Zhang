function login(){
   let login = document.getElementById('nome').value;
   let senha = document.getElementById('senha').value;
   let lembrar = document.getElementById('lembrar').checked

   if (!login || !senha || senha.length < 6){
       alert("Login ou Senha inválida");
   } else {
    var raw = {
        login,
        senha,
        lembrar
    }

    var baseURL = "https://zhang-api.herokuapp.com"

    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("origem",baseURL);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    };

    let statusCode = 0
    fetch(`${baseURL}/api/Usuario/Login`, requestOptions)
        .then(response => {
            statusCode = response.status
            return response.text()
        })
        .then(result => {
            if (statusCode==200){
            localStorage.setItem('usuario',result);
            localStorage.setItem('token',JSON.parse(result).token)
            localStorage.setItem('dadosLogin',JSON.stringify(raw))
            window.location.href = "./../Inicial/Inicial.html"
        } else {
            alert(result)
        }
        
        })
        .catch(error => alert(error))
   }
}

function iniciar(){
    let dadosLogin = JSON.parse(localStorage.getItem('dadosLogin'))
    localStorage.removeItem('usuario')
    if (dadosLogin && dadosLogin.lembrar){
        document.getElementById('nome').value = dadosLogin.login;
        document.getElementById('senha').value = dadosLogin.senha;
        document.getElementById('lembrar').checked = dadosLogin.lembrar
    }else{
        localStorage.clear()
    }
}

function entrarConvidado(){
    window.location.href = "./../Jogo/Jogo.html"
}