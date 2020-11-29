let fonteMenu = 'MenuConvidado'

function criarMenu() {
  fetch(`./../Shared/${fonteMenu}.html`)
    .then(response => {
      return response.text()
    })
    .then(data => {
      document.getElementById("menu").innerHTML = data;
    })
}

function verificarLogin() {
  let usuarioStr = localStorage.getItem("usuario")
  if (usuarioStr) {
    let usuario = JSON.parse(usuarioStr)
    if (usuario.skins && usuario.token) {
      fonteMenu = 'Menu'
    }
  }
}

function areaLogada() {
  let usuarioStr = localStorage.getItem("usuario")

  if (!usuarioStr) {
    alert('Você precisa estar logado para acessar essa página.')
    window.location.href = "./../Login/Login.html"
    return
  }
  let usuario = JSON.parse(usuarioStr)
  if (!usuario.skins || !usuario.token) {
    alert('Você precisa estar logado para acessar essa página.')
    window.location.href = "./../Login/Login.html"
    return
  }
}

document.addEventListener('DOMContentLoaded', function () {
  verificarLogin()
  criarMenu()
}, false);