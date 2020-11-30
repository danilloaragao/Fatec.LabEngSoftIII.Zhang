localStorage.setItem ("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYW1laWQiOiJTdXBlclVzZXIiLCJpc2FkbSI6IjEifQ.22d5M8Zgg-Kh0CUAKVmntMuliEegGJ-MR4opvvfiQdk")

const allSkins = [];
const APIURLSkins = "https://zhang-api.herokuapp.com/api/Administracao/Skins";
const APIURLBuyCash = "https://zhang-api.herokuapp.com/api/Jogo/CompraCash";
const APIURLBuySkin = "https://zhang-api.herokuapp.com/api/Jogo/CompraSkin";
const IMGPATH = "data:image/png;base64,";
const SEARCHAPI = "https://zhang-api.herokuapp.com/api/Administracao/SkinsPorDescricao?descricaoSkin=";
const user = JSON.parse(localStorage.getItem("usuario"));
const main = document.getElementById('main');
const skinsSpace = document.getElementById('skins-space')
const btn20 = document.getElementById('btn20');
const btn40 = document.getElementById('btn40');
const btn100 = document.getElementById('btn100');
const btn300 = document.getElementById('btn300');
let btnSkin0 = "", btnSkin1 = "", btnSkin2 = "", btnSkin3 = "";

var selectedSkin;
var drawInterval;

async function getSkins (url, token){  
    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("token", token)

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    
    //load();
    const resp = await fetch(url, requestOptions);
    const respData = await resp.json();

    showSkins(respData);
}

function showSkins (skins) {    
    var count = 0; 
    clearInterval(drawInterval);
    skinsSpace.innerHTML = '';   
    skins.forEach((skin, index) => {
        if (count < 4) {
            allSkins.push(skin);
            const { sprite, descricao, nivel, isVip, valorCash} = skin;
            const skinEl = document.createElement('div');
            const canvasEl = document.createElement('canvas');

            skinEl.id = "skin" + index;
            skinEl.className = "skins";

            let tagVip = "";
            let tagBtn = "";

            if(isVip){
                tagVip = '<i class="fa fa-star chequed"></i>';
            }

            if(purchasedSkin(skin.id) == true){                    
                tagBtn = '<i class="fa fa-check"> Comprado </i>'
            }
            else{
                tagBtn = `<button id="btn${skinEl.id}" class="comprar-skin d-flex justify-content-center align-items-center">
                            Comprar
                        </button>`
            }

            skinEl.classList.add('skin');
            skinEl.innerHTML = `
            <div class="skin-info">
                <div class="info-valor">
                    <h4>Valor:&nbsp;</h4>
                    <h5>${valorCash}</h5>
                </div>
                <div class="info-vip">
                    <h4>VIP:&nbsp;</h4>
                    ${tagVip}
                </div>
                ${tagBtn}
            </div>
            `;

            canvasEl.id = "canvas" + index;
            canvasEl.className = "canvas";
            skinEl.append(canvasEl);
            skinsSpace.appendChild(skinEl);
            skinMovement (`data:image/png;base64, ${skin.sprite}`, 0, canvasEl.id)
            count ++;
        }
    }); 
    btnSkin0 = document.getElementById('btnskin0');
    btnSkin1 = document.getElementById('btnskin1');
    btnSkin2 = document.getElementById('btnskin2');
    btnSkin3 = document.getElementById('btnskin3');
    /*
    if(allSkins[0] != undefined)
        btnSkin0.onclick = comprarSkin(allSkins[0].id);
    if(allSkins[1] != undefined)
        btnSkin1.onclick = comprarSkin(allSkins[1].id);
    if(allSkins[2] != undefined)
        btnSkin2.onclick = comprarSkin(allSkins[2].id);
    if(allSkins[3] != undefined)
        btnSkin3.onclick = comprarSkin(allSkins[3].id);*/
}

getSkins(APIURLSkins, localStorage.getItem("token"));
/*
function configSkin (skinId, canvasId) {
    const skin = document.getElementById(skinId);
    var path, cols, rows, sheetWidth, sheetHeight;

    if(selectedSkin != undefined){
        selectedSkin.classList.remove('skinSelected');
    }
    selectedSkin = skin;
    skin.classList.add('skinSelected');

    if(skinId == "skin0") {
        path = "megamen.png";
        rows = 2;
        cols = 5;
        sheetWidth = 864;
        sheetHeight = 346;
        skinMovement(path, 0, cols, rows, sheetWidth, sheetHeight, canvasId);
    }
    else if (skinId == "skin1") {
        path = "character.png";
        cols = 8;
        rows = 2;
        sheetWidth = 864;
        sheetHeight = 280;
        skinMovement(path, 1, cols, rows, sheetWidth, sheetHeight, canvasId);
    }
    else {
        path = "normalguy.png";
        rows = 4;
        cols = 4;
        sheetWidth = 800;
        sheetHeight = 1198;
        skinMovement(path, Math.floor(Math.random() * 2), cols, rows, sheetWidth, sheetHeight, canvasId);
    }    
};
*/

function skinMovement (src, movement, canvasId) {
    var srcX;
    var srcy;
    var sheetWidth = 3000;
    var sheetHeight = 5750;

    var width = sheetWidth / 5;
    var height = sheetHeight / 5;

    var maxWidth = width / 2.5;
    var maxHeight = height / 6;   

    var currentFrame = 0;

    var character = new Image();

    character.src = src;

    var canvas = document.getElementById(canvasId);

    canvas.style.width = maxWidth;
    canvas.style.height = maxHeight;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    function updateFrame () {
        currentFrame = ++currentFrame % 5;
        srcX = currentFrame * width;
        srcy = movement * height;

        ctx.clearRect(0, 0, maxWidth, maxHeight);
    };

    function drawImage () {
        updateFrame();
        ctx.drawImage(character, srcX, srcy, width, height, 0, 0, maxWidth, maxHeight);
    };    

    drawInterval = setInterval((e) => {
        drawImage();
    }, 100);
};

function getSaldo () {
    var saldo = document.getElementById("saldo");
    saldo.innerHTML = '';
    saldo.innerHTML = `<h2>SALDO:&nbsp;${user.cash}</h2>`;
    localStorage.setItem("usuario", JSON.stringify(user));
}

getSaldo();

async function buyCash(url, token, qtdCoins) {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("token", token)

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: qtdCoins    
    };
    //load();
    const resp = await fetch(url, requestOptions);
    user.cash = await resp.json();
    getSaldo();
}

function comprarCash(qtdeMoedas) {
    buyCash(APIURLBuyCash, user.token, qtdeMoedas);
    getSaldo();
}

btn20.onclick = function() {
    comprarCash(20);
};
btn40.onclick = function() {
    comprarCash(40);
};
btn100.onclick = function() {
    comprarCash(100);
};
btn300.onclick = function() {
    comprarCash(300);
};

function purchasedSkin (skinID) {
    user.skins.forEach((skin, index) => {
        if(skin.id == skinID) {
            return true;
        }
        return false;
    });
}
/*
async function buySkin(url, token, skinID) {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");
    myHeaders.append("token", token)

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: skinID    
    };
    //load();
    const resp = await fetch(url, requestOptions);
    const respData = await resp.json();
    //console.log(respData);
    //user.skins.push(respData);
    //localStorage.setItem("usuario", JSON.stringify(user));
}

function comprarSkin(skinID) {
    buySkin(APIURLBuySkin, user.token, skinID);
}
*/
