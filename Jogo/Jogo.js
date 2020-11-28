let palavraJogo
let quantidadeErros
let dicasUsadas
let acertos

function carregarPalavra() {
    quantidadeErros = 0
    dicasUsadas = 0
    acertos = 0

    let usuarioString = localStorage.getItem("usuario")
    let token = ''

    if (usuarioString) {
        let usuario = JSON.parse(usuarioString)
        token = usuario.token
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

            console.log(palavraJogo)

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
                if (i % 7 == 0) {
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
            });
        })
        .catch(error => {
            alert(error)
        });
}

function clickLetra(idLetra) {
    let nodeLetra = document.getElementById(idLetra)
    let letra = nodeLetra.innerText
    if (palavraJogo.palavra.includes(letra)) {
        [...palavraJogo.palavra].forEach((letraPalavra, i) => {
            if(letraPalavra == letra){
                let campoLetra = document.getElementById(`letra${i}`)
                campoLetra.value = letra
                acertos ++
            }
        });



        nodeLetra.removeAttribute('class')
        nodeLetra.setAttribute('class', 'letter right')
        nodeLetra.removeAttribute('onclick')
    } else {
        quantidadeErros++
        nodeLetra.removeAttribute('class')
        nodeLetra.setAttribute('class', 'letter wrong')
        nodeLetra.removeAttribute('onclick')
    }

    if(acertos == palavraJogo.palavra.length){
        alert('ganhou')
    }

    if(quantidadeErros > 4){
        alert('perdeu')
    }
}

function mostrarDica(numeroDica){
    let dica = document.getElementById(`dica${numeroDica}`)
    dica.innerText = palavraJogo[`dica${numeroDica}`]
    dica.removeAttribute('onclick')
    dicasUsadas++
}