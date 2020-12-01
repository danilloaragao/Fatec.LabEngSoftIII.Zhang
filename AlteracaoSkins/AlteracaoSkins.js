localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYW1laWQiOiJTdXBlclVzZXIiLCJpc2FkbSI6IjEifQ.22d5M8Zgg-Kh0CUAKVmntMuliEegGJ-MR4opvvfiQdk")

const skins = [];
const APIURL = "https://zhang-api.herokuapp.com/api/Administracao/Skins";
const IMGPATH = "data:image/png;base64,";
const SEARCHAPI = "https://zhang-api.herokuapp.com/api/Administracao/SkinsPorDescricao?descricaoSkin=";

const main = document.getElementById('main');
const form = document.getElementById('form');
const filterNav = document.getElementById('filterNav');
const cardBoard = document.getElementById('cardBoard');
const changingRoom = document.getElementById('changingRoom');

var selectedSkin;
var drawInterval;

let ida = true
let currentFrame = 0
let inicio = true

async function getSkins() {
    var myHeaders = new Headers()
    myHeaders.append("Accept", "text/plain")
    myHeaders.append("Content-Type", "application/json-patch+json")
    myHeaders.append("token", JSON.parse(localStorage.getItem('usuario')).token)

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    fetch(`https://zhang-api.herokuapp.com/api/Jogo/Skins`, requestOptions)
        .then(response => response.text())
        .then(result => {
            showSkins(JSON.parse(result));
        })
        .then(r => {
            selectSkin(JSON.parse(localStorage.getItem('usuario')).skins.find(s => !!s.ativo))
        })
}

function showSkins(skins) {
    cardBoard.innerHTML = '';
    skins.forEach((skin, index) => {
        const { id, sprite, descricao, nivel, isVip, ativo } = skin;
        const skinEl = document.createElement('div');

        skinEl.id = "skin" + skin.id;
        skinEl.addEventListener("click", (e) => {
            selectSkin(skin);
        });

        let tagVip = "";

        if (isVip) {
            tagVip = '<i class="fa fa-star chequed"></i>';
        }

        skinEl.classList.add('skin');

        if (ativo)
            skinEl.classList.add('skinSelected')

        // <img src="${IMGPATH + sprite}" alt="${descricao}">
        skinEl.innerHTML = `
        <canvas id="canvas${id}" class="canvas-thumbnail"></canvas>
        <div class="skin-info">
            <h5 ${ativo ? 'class="skin-ativa"' : ''}>${descricao}</h5> ${ativo ? '<i class="fa fa-check-circle"></i>' : ''}
            ${tagVip}
        </div>
        `;
        cardBoard.appendChild(skinEl);
        criarCanvas('div-canvas', `canvas${id}`, 30, 65)
        document.getElementById(`canvas${id}`).setAttribute("class", "canvas-thumbnail")
        skinThumbnail(IMGPATH + sprite, `canvas${id}`)
    });
}
criarCanvas('div-canvas', 'canvas', 600, 1150)
getSkins();

function selectSkin(skin) {
    const skinEl = document.getElementById(`skin${skin.id}`);
    if (selectedSkin != undefined) {
        selectedSkin.classList.remove('skinSelected');
    }
    selectedSkin = skinEl;
    skinEl.classList.add('skinSelected');

    skinMovement(`data:image/png;base64, ${skin.sprite}`);

    if (inicio)
        inicio = false
    else {
        var myHeaders = new Headers()
        myHeaders.append("Accept", "text/plain")
        myHeaders.append("Content-Type", "application/json-patch+json")
        myHeaders.append("token", JSON.parse(localStorage.getItem('usuario')).token)

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            redirect: 'follow'
        }

        fetch(`https://zhang-api.herokuapp.com/api/Jogo/Skins?idSkin=${skin.id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                localStorage.setItem('usuario', result)
                alert('Skin alterada!')
            })
    }
};

function skinMovement(path) {
    var srcX;
    var srcy;
    var sheetWidth = 3000;
    var sheetHeight = 5750;

    var width = sheetWidth / 5;
    var height = sheetHeight / 5;

    var maxWidth = width / 1;
    var maxHeight = height / 1;

    var character = new Image();

    character.src = path;

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
        srcy = 0 * height;

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

// function filterSkins(e) {
//     let color;
//     switch (e.id) {
//         case '1to20Filter':
//             color = "green";
//             break;
//         case '21to50Filter':
//             color = "orange";
//             break;
//     }

//     const filter = document.getElementById(e.id);
//     filter.style.color = color;
// };


// filterNav.addEventListener('click', e => {
//     filterSkins(e);
// });

function criarCanvas(destino, idCanvas, w, h) {
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
    can.setAttribute('id', idCanvas)

    document.getElementById(destino).appendChild(can)
}

// function skinThumbnail(path, idCanvas){
//     var character = new Image();

//     character.src = path;

//     var canvas = document.getElementById(idCanvas);
//     canvas.style.width = 150;
//     canvas.style.height = 325;
//     var ctx = canvas.getContext('2d');
//     console.log(ctx)
//     ctx.clearRect(0, 0, 300, 650);
//     ctx.drawImage(character, 1350, 200, 300, 650, 0, 0, 60, 115);
// }

function skinThumbnail(path, idCanvas) {
    var srcX;
    var srcy;
    var sheetWidth = 3000;
    var sheetHeight = 5750;

    var width = sheetWidth / 5;
    var height = sheetHeight / 5;

    var maxWidth = width / 2;
    var maxHeight = height / 7;

    var character = new Image();

    character.src = path;

    var canvas = document.getElementById(idCanvas);
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
        srcy = 0 * height;

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