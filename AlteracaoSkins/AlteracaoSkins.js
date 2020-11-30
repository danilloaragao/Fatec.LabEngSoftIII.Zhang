localStorage.setItem ("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYW1laWQiOiJTdXBlclVzZXIiLCJpc2FkbSI6IjEifQ.22d5M8Zgg-Kh0CUAKVmntMuliEegGJ-MR4opvvfiQdk")

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
    cardBoard.innerHTML = '';   
    skins.forEach((skin, index) => {
        const { sprite, descricao, nivel, isVip} = skin;
        const skinEl = document.createElement('div');

        skinEl.id = "skin" + index;
        skinEl.addEventListener("click", (e) => {
            selectSkin(skinEl.id);
        });

        let tagVip = "";

        if(isVip){
            tagVip = '<i class="fa fa-star chequed"></i>';
        }

        skinEl.classList.add('skin');
        skinEl.innerHTML = `
        <img src="${IMGPATH + sprite}" alt="${descricao}">
        <div class="skin-info">
            <h5>${descricao}</h5>
            ${tagVip}
        </div>
        `;
        cardBoard.appendChild(skinEl);
    });   
}

getSkins(APIURL, localStorage.getItem("token"));

function selectSkin () {

};

/*
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getSkins(SEARCHAPI + searchTerm, localStorage.getItem("token") )
        search.value = '';
    }

});
*/

function selectSkin (skinId) {
    const skin = document.getElementById(skinId);
    var path, cols, rows, sheetWidth, sheetHeight;

    if(selectedSkin != undefined){
        selectedSkin.classList.remove('skinSelected');
    }
    selectedSkin = skin;
    skin.classList.add('skinSelected');

    if(Math.floor(Math.random() * 2) == 1) {
        path = "character.png";
        cols = 8;
        rows = 2;
        sheetWidth = 864;
        sheetHeight = 280;
    }
    else if ((Math.floor(Math.random() * 2) == 1)) {
        path = "megamen.png";
        rows = 2;
        cols = 5;
        sheetWidth = 864;
        sheetHeight = 346;
    }
    else {
        path = "normalguy.png";
        rows = 4;
        cols = 4;
        sheetWidth = 800;
        sheetHeight = 1198;
    }

    skinMovement(path, Math.floor(Math.random() * 2), cols, rows, sheetWidth, sheetHeight);
};




function skinMovement (src, movement, cols, rows, sheetWidth, sheetHeight) {
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

    var canvas = document.getElementById('canvas');
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

    clearInterval(drawInterval);

    drawInterval = setInterval((e) => {
        drawImage();
    }, 100);
};

 function filterSkins (e) {
     let color;
     switch (e.id) {
         case '1to20Filter':
             color = "green";
             break;
        case '21to50Filter':
            color = "orange";
            break;        
     }

     const filter = document.getElementById(e.id);
     filter.style.color = color;
};


filterNav.addEventListener ('click', e => {
    filterSkins(e);
});