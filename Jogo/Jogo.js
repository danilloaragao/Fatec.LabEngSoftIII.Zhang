let palavraJogo
let quantidadeErros
let dicasUsadas
let acertos
let skin = './../assets/Skin Vestido total.png'
let drawInterval
let currentFrame
let ida
let movimento = 0
let jumpScare = './../assets/jumpScare.png'
let pontosGanhos
let usuarioLogado = !!localStorage.getItem("usuario")

function iniciarTelaJogo() {
    criarCanvas()
    montarBotoesModal()
    pontosGanhos = 0
    quantidadeErros = 0
    dicasUsadas = 0
    acertos = 0
    currentFrame = 0
    ida = true

    let usuarioString = localStorage.getItem("usuario")
    let token = ''

    if (usuarioString) {
        let usuario = JSON.parse(usuarioString)
        token = usuario.token
        skin = `data:image/png;base64, ${usuario.skins.find(s => s.ativo).sprite}`
        jumpScare = `data:image/png;base64, ${usuario.skins.find(s => s.ativo).jumpScare}`
    }

    var myHeaders = new Headers()
    myHeaders.append("Accept", "text/plain")
    myHeaders.append("Content-Type", "application/json-patch+json")
    myHeaders.append("token", token)

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    fetch("https://zhang-api.herokuapp.com/api/Jogo/Palavra", requestOptions)
        .then(response => response.text())
        .then(result => {
            palavraJogo = JSON.parse(result)

            let containerLetras = document.getElementById('form')
            let areaLetras = document.getElementById('letters')

            for (let i = 0; palavraJogo.palavra.length > i; i++) {
                let letraPalavra = document.createElement('input')
                letraPalavra.setAttribute('type', 'text')
                letraPalavra.setAttribute('maxLength', '1')
                letraPalavra.setAttribute('size', '1')
                letraPalavra.setAttribute('min', '0')
                letraPalavra.setAttribute('max', '9')
                letraPalavra.setAttribute('pattern', '[0-9]{1}')
                letraPalavra.readOnly = true
                letraPalavra.setAttribute('id', `letra${i}`)
                containerLetras.appendChild(letraPalavra)
            }

            palavraJogo.letras.forEach((letra, i) => {
                if (i % 9 == 0) {
                    let quebra = document.createElement('br')
                    areaLetras.appendChild(quebra)
                }
                let noTexto = document.createTextNode(letra);
                let letraJogo = document.createElement('a')
                letraJogo.setAttribute('class', 'letter')
                letraJogo.setAttribute('id', `letraJogo${i}`)
                letraJogo.setAttribute('onclick', `clickLetra("letraJogo${i}")`)
                letraJogo.appendChild(noTexto)
                areaLetras.appendChild(letraJogo)
            })

            skinMovement()
        })
}

function clickLetra(idLetra) {
    let nodeLetra = document.getElementById(idLetra)
    let letra = nodeLetra.innerText
    if (palavraJogo.palavra.includes(letra)) {
        [...palavraJogo.palavra].forEach((letraPalavra, i) => {
            if (letraPalavra == letra) {
                let campoLetra = document.getElementById(`letra${i}`)
                campoLetra.value = letra
                acertos++
            }
        });
        nodeLetra.removeAttribute('class')
        nodeLetra.setAttribute('class', 'letter right')
        nodeLetra.removeAttribute('onclick')
    } else {
        quantidadeErros++
        skinMovement()
        nodeLetra.removeAttribute('class')
        nodeLetra.setAttribute('class', 'letter wrong')
        nodeLetra.removeAttribute('onclick')
    }

    if (acertos == palavraJogo.palavra.length) {
        apiAcertoPalavra()
    }

    if (quantidadeErros > 4) {
        gameOver()
    }
}

function mostrarDica(numeroDica) {
    let dica = document.getElementById(`dica${numeroDica}`)
    dica.innerText = palavraJogo[`dica${numeroDica}`]
    dica.removeAttribute('onclick')

    let proximaDica = document.getElementById(`dica${numeroDica + 1}`)
    if (proximaDica)
        proximaDica.setAttribute('class', 'theme')

    dicasUsadas++
}

function skinMovement() {
    var srcX;
    var srcy;
    var sheetWidth = 3000;
    var sheetHeight = 5750;

    var width = sheetWidth / 5;
    var height = sheetHeight / 5;

    var maxWidth = width / 1.5;
    var maxHeight = height / 1.5;

    var character = new Image();

    if (quantidadeErros < 5)
        movimento = quantidadeErros

    character.src = skin;

    var canvas = document.getElementById('canvas');

    canvas.style.width = maxWidth;
    canvas.style.height = maxHeight;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    function updateFrame() {
        if (ida) {
            currentFrame++
            if (currentFrame >= 4)
                ida = false
        } else {
            currentFrame--
            if (currentFrame <= 0)
                ida = true
        }
        srcX = currentFrame * width;
        srcy = movimento * height;

        ctx.clearRect(0, 0, maxWidth, maxHeight);
    };

    function drawImage() {
        updateFrame();
        ctx.drawImage(character, srcX, srcy, width, height, 0, 0, maxWidth, maxHeight);
    };

    clearInterval(drawInterval);
    drawImage()
    drawInterval = setInterval((e) => {
        drawImage();
    }, 500);
};

function abrirModalAcerto() {
    let linha1 = ''
    let linha2 = ''
    let linha3 = ''
    let linha4 = ''

    linha1 = `Você acertou a palavra ${palavraJogo.palavra}`

    switch (quantidadeErros) {
        case 0:
            linha2 = `Não errou nenhuma letra!`
            break
        case 1:
            linha2 = `Errou ${quantidadeErros} letra`
            break
        default:
            linha2 = `Errou ${quantidadeErros} letras`
    }

    switch (dicasUsadas) {
        case 0:
            linha3 = `Não usou nenhuma dica!`
            break
        case 1:
            linha3 = `Usou ${dicasUsadas} dica`
            break
        default:
            linha3 = `Usou ${dicasUsadas} dicas`
    }
    if (usuarioLogado) {
        if (pontosGanhos > 0) {
            linha4 = `Você ganhou ${pontosGanhos} pontos!`
        }
    } else {
        linha4 = 'Faça o login para que seus pontos sejam contabilizados!'
    }

    document.getElementById('modal-container').style.display = "flex";
    let modal = document.getElementById('conteudo-modal')

    let noTitulo = document.createElement('div')
    let noTextoTitulo = document.createTextNode('PARABÉNS!')
    noTitulo.setAttribute('class', 'titulo-modal')
    noTitulo.appendChild(noTextoTitulo)

    let noLinha1 = document.createElement('p')
    let noTextoLinha1 = document.createTextNode(linha1)
    noLinha1.setAttribute('class', 'mensagem-modal')
    noLinha1.appendChild(noTextoLinha1)

    let noLinha2 = document.createElement('p')
    let noTextoLinha2 = document.createTextNode(linha2)
    noLinha2.setAttribute('class', 'mensagem-modal')
    noLinha2.appendChild(noTextoLinha2)

    let noLinha3 = document.createElement('p')
    let noTextoLinha3 = document.createTextNode(linha3)
    noLinha3.setAttribute('class', 'mensagem-modal')
    noLinha3.appendChild(noTextoLinha3)

    let noLinha4 = document.createElement('p')
    let noTextoLinha4 = document.createTextNode(linha4)
    noLinha4.setAttribute('class', 'mensagem-modal')
    noLinha4.appendChild(noTextoLinha4)

    modal.appendChild(noTitulo)
    modal.appendChild(noLinha1)
    modal.appendChild(noLinha2)
    modal.appendChild(noLinha3)
    modal.appendChild(noLinha4)
}

function abrirModalGameOver() {
    document.getElementById('modal-container').style.display = "flex";
    document.getElementById('game-over').setAttribute('src', './../assets/game-over.png')
}

function fecharModal() {
    document.getElementById('modal-container').style.display = "none";
    document.querySelector('.modal-content').style.display = 'flex';
    document.querySelector('.msg-modal').style.display = 'none';
}

function apiAcertoPalavra() {
    let token = ''
    let usuario

    let usuarioString = localStorage.getItem("usuario")
    if (usuarioString) {
        usuario = JSON.parse(usuarioString)
        token = usuario.token
    }

    var myHeaders = new Headers()
    myHeaders.append("Accept", "text/plain")
    myHeaders.append("Content-Type", "application/json-patch+json")
    myHeaders.append("token", token)
    myHeaders.append("origin", "https://zhang-api.herokuapp.com")

    var raw = {
        palavra: palavraJogo.palavra,
        erros: quantidadeErros,
        dicasUsadas
    }
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    }

    fetch("https://zhang-api.herokuapp.com/api/Jogo/Acerto", requestOptions)
        .then(resp => resp.text())
        .then(data => {
            if (data != 'Jogador convidado.') {
                if (usuario) {
                    let usuarioAtual = JSON.parse(data)
                    pontosGanhos = usuarioAtual.experiencia - usuario.experiencia

                    localStorage.setItem("usuario", data)

                }
            }
        })
        .then(resul =>
            abrirModalAcerto()
        )
}

function jogarNovamente() {
    document.location.reload(true)
}

function voltar() {
    window.location.href = "./../Inicial/Inicial.html"
}

function gameOver() {
    let corpo = document.getElementById('corpo')
    corpo.setAttribute('class', 'corpo-jump-scare')
    let container = document.getElementById('container')
    let menu = document.getElementById('menu')
    let noImagem = document.createElement('img')
    noImagem.setAttribute('class', 'imagem-jump-scare')
    noImagem.setAttribute('src', jumpScare)
    container.innerText = ''
    menu.innerText = ''
    container.appendChild(noImagem)

    setTimeout(() => {
        abrirModalGameOver()
    }, 2000);

}

function criarCanvas() {
    let w = 600
    let h = 1150
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    let ratio = dpr / bsr;

    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    can.setAttribute('id', 'canvas')

    document.getElementById('div-canvas').appendChild(can)
}

function telaLogin() {
    window.location.href = "./../Login/Login.html"
}

function montarBotoesModal() {
    let divBtn = document.getElementById('div-botao')
    let botao = document.createElement('button')
    let noTexto=document.createTextNode('')
    botao.setAttribute('id', 'btn-voltar')
    botao.setAttribute('class', 'btn-enviar')
    
    if (usuarioLogado) {
        botao.setAttribute('onclick', 'voltar()')
        noTexto = document.createTextNode('Voltar')
    }else{
        botao.setAttribute('onclick', 'telaLogin()')
        noTexto = document.createTextNode('Login')
    }
    botao.appendChild(noTexto)
    divBtn.appendChild(botao)
}