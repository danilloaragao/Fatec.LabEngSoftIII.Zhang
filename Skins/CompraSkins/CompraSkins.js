localStorage.setItem ("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYW1laWQiOiJTdXBlclVzZXIiLCJpc2FkbSI6IjEifQ.22d5M8Zgg-Kh0CUAKVmntMuliEegGJ-MR4opvvfiQdk")

const skins = [];
const APIURL = "https://zhang-api.herokuapp.com/api/Administracao/Skins";
const IMGPATH = "data:image/png;base64,";
const SEARCHAPI = "https://zhang-api.herokuapp.com/api/Administracao/SkinsPorDescricao?descricaoSkin=";

const main = document.getElementById('main');
const skinsSpace = document.getElementById('skins-space')    

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
            const { sprite, descricao, nivel, isVip, valorCash} = skin;
            const skinEl = document.createElement('div');
            const canvasEl = document.createElement('canvas');

            skinEl.id = "skin" + index;
            skinEl.className = "skins";
            skinEl.addEventListener("click", (e) => {
                selectSkin(skinEl.id);
            });

            let tagVip = "";

            if(isVip){
                tagVip = '<i class="fa fa-star chequed"></i>';
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
                <button class="comprar-skin">
                    Comprar
                </button>
            </div>
            `;

            canvasEl.id = "canvas" + index;
            canvasEl.className = "canvas";
            skinEl.append(canvasEl);
            skinsSpace.appendChild(skinEl);
            configSkin(skinEl.id, canvasEl.id)
            count ++;
        }
    }); 
}

getSkins(APIURL, localStorage.getItem("token"));

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
        skinMovement(path, 1, cols, rows, sheetWidth, sheetHeight, canvasId);
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

function skinMovement (src, movement, cols, rows, sheetWidth, sheetHeight, canvasId) {
    var srcX;
    var srcy;
    //var sheetWidth = 864;
    //var sheetHeight = 280;

    //var cols = 8;
    //var rows = 2;

    var width = sheetWidth / cols;
    var height = sheetHeight / rows;

    var maxWidth = 250;
    var maxHeight = 150;    

    var currentFrame = 0;

    var character = new Image();

    character.src = src;

    var canvas = document.getElementById(canvasId);
    var canvasSize = canvas.getBoundingClientRect();

    canvas.style.width = maxWidth;
    canvas.style.height = maxHeight;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, maxWidth, maxHeight);

    function updateFrame () {
        currentFrame = ++currentFrame % cols;
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