function iniciar(){
    let dadosLogin = JSON.parse(localStorage.getItem('dadosLogin'))
    localStorage.removeItem('usuario')
    if (!dadosLogin || !dadosLogin.lembrar)
        localStorage.clear()
}