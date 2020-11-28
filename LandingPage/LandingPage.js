function iniciar(){
    let dadosLogin = JSON.parse(localStorage.getItem('dadosLogin'))
    if (!dadosLogin || !dadosLogin.lembrar)
        localStorage.clear()
}