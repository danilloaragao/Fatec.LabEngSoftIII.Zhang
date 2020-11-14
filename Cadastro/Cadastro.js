
// 
function cadastro() {


    // pegue como login o id: nome ( do html)
    let Login = document.getElementById('name').value;

    // pegue como senha pelo id: password ( do html)
    let Senha = document.getElementById('password').value;

    // pegue como email pelo id: email ( do html)
    let Email = document.getElementById('email').value;

    // linha 16 está criando o objeto que vai para o backend ( o payload) 
    // var raw = "{\n\"Login\": \"SuperUser\",\n\"Senha\": \"SuperUserGrupo2\"\n}";
    var raw = {
        Login,
        Senha,
        Email,
    }

    // AO HABILITAR AS 2 LINHAS ABAIXO VC SABERÁ SE O OBJETO ESTÁ SENDO MONTADO CORRETAMENTE
    // console.log(raw);
    // return;


    // OBS: SHIFT + ALT + F arruma a identação do código


    // cria o cabeçalho da requisição, ele irá aceitar texto ( linha 11)
    // linha 12 informa que vai aceitar formado json
    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");



    // cria a requisição POST, passando o header e informa que o corpo dessa requisição é o json do payload( linha 27 )
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    };

    // informa que vai jogar nessa url do backend o meu payload (que é o objeto em si)
    // após receber ele devolverá a msg se foi efetuado com sucesso ( status code 200 ou desta centena de 200) ou se foi barrado
    // a melhor forma de saber do erro é ver o status code que ele 
    // obs: o fetch é assincrono, ele envia o comando ao backend e não espera este concluí-lo.
    // se não tiver problema pode deixar assim, mas nesse caso precisamos da resposta do back end.
    fetch("https://zhang-api.herokuapp.com/api/Usuario/Cadastro", requestOptions)
        .then(response => response.text()) // vai esperar a resposta do backend
        .then(result => alert(result)) // espera o resultado nesta resposta, se for sucesso fica nesta linha
        .catch(error => alert(error)); // se der erro vai para esta linha

}

// validações do video youtube 


class Validator {
    constructor() {
        this.validations = [
            // segue a ordem de priopridade
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate',

        ]
    }

    contemErros = false;

    // iniciar a validação de todos os campos
    // o método validate vai iniciar a validação de todos os campos quando ativado.
    validate(form) {

        // resgata todas as validações
        // seleciona todos os elementos do form error-validation
        let currentValidations = document.querySelectorAll('form .error-validation');

        // se tiver validações presentes na tela          
        // chame o método cleanValidations e passe as validações
        this.cleanValidations(currentValidations);



        let inputs = form.getElementsByTagName('input');// pegar todos os inputs do formulario


        // transformo HTMLColletion em Array ( pega todos elementos do inputs acima e torna 1 array de vários elementos)
        // assim é possível separar o que precisa ser validado do que não precisa).
        let inputsArray = [...inputs];

        // loop nos inputs e validação mediante ao que for encontrado
        inputsArray.forEach(function (input) {

            // loop em todas as validações existentes
            for (let i = 0; this.validations.length > i; i++) {

                // verifica se a validação atual existe no input
                if (input.getAttribute(this.validations[i]) != null) {

                    // transforma data-min-length em minlength
                    // ou seja estou limpando a string para virar um método
                    // no caso pega data- e o substitui por nada
                    let method = this.validations[i].replace('data-', '').replace('-', '');

                    // pega o valor do input para poder manipular quando precisar
                    let value = input.getAttribute(this.validations[i]);

                    // invocar o método
                    // ou seja, invoca o método do minlenght ou os demais enviando o input e o value

                    this[method](input, value);

                }
            }

        }, this);

    }

    // verifica se um input tem um número mínimo de caracteres
    minlength(input, minValue) {
        // pega o input e vê o tamanho do valor do input ( conta os caracteres do input)
        let inputLength = input.value.length;

        // ${minValue} deveriam estar brancos
        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) { // se o comprimento o input for menor que o minValue

            // chame a mensagem do errorMessage para o campo input que foi utilizado
            this.printMessage(input, errorMessage);
        }

    }

    // verifica se um input passou do mínimo de caracteres
    maxlength(input, maxValue) {

        let inputLength = input.value.length;

        // ${maxValue} deveriam estar brancos
        let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

        if (inputLength > maxValue) {
            // se o comprimento o input for menor que o minValue

            // chame a mensagem do errorMessage
            this.printMessage(input, errorMessage);
        }

    }

    // valida emails
    emailvalidate(input) {

        // Deverá ter ( uma string )+ (@) + (outra string) + (.) + (uma última string)
        // ex: email@email.com.br
        let re = /\S+@\S+\.\S+/;

        // pega o valor do campo email
        let email = input.value;

        let errorMessage = `insira um e-mail no padrão meuemail@email.com`;

        // use o !(negação)retest (testar...se não for um email)
        if (!re.test(email)) {

            this.printMessage(input, errorMessage);

        }
    }

    //valida se o campo nome tem apenas letras
    onlyletters(input) {

        // ^e +$ deveriam estar brancos
        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let errorMessage = `Este campo não aceita números ou caracteres especiais. `;

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage);
        }
    }
    // metodo de imprimir mensagens de erro na tela
    printMessage(input, msg) {

        // verifica a quantidade de erros que o campo já possui
        // assim as msg de solicitação de um numero mínimo de caracteres e
        //...e de obrigatoriedade de preencher o campo não ficarão sobrepostas.
        let errorQty = input.parentNode.querySelector('.error-validation');

        // se não houver erros, 
        if (errorQty === null) {

            let template = document.querySelector('.error-validation').cloneNode(true);

            template.textContent = msg;

            // acha l local onde colocar a mensagem 
            let inputParent = input.parentNode;

            // remove a classe template para que ele possa aparecer na tela
            template.classList.remove('template');

            // verifica o filho que é o full-box ou half-box
            inputParent.appendChild(template);

            // o this procura a variável contémErros dentro da classe.
            this.contemErros = true;
        }
    }

    //verifica se o input é requerido
    required(input) {

        let inputValue = input.value;

        // se o valor do input for vazio
        if (inputValue === '') {
            let errorMessage = `Este campo é obrigatório`;

            this.printMessage(input, errorMessage);
        }

    }

    //verifica se dois campos são iguais, usaremos para a confirmação de senha
    equal(input, inputName) {

        let inputToCompare = document.getElementsByName(inputName)[0];

        let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

        if (input.value != inputToCompare.value) {

            this.printMessage(input, errorMessage);
        }
    }

    // valida o campo de senha
    passwordvalidate(input) {

        //para realizar a validação vamos explodir a string do input em array
        let charArr = input.value.split("");

        //contador de uppercases
        let uppercases = 0;

        // contador de números
        let numbers = 0;

        // a nossa validação é verificar se tem pelo menos 1 uppercase e 
        //...e pelo menos 1 numero também, então se não tiver nenhum dos dois dará erro
        for (let i = 0; charArr.length > i; i++) {

            //se o meu caracter atual do loop é igual ao caracter do loop uppercase
            // e não é um número 
            if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                // neste caso este uppercase++ é necessário para incrementar, mas não ficou mto claro pq
                uppercases++;
            } else if (!isNaN(parseInt(charArr[i]))) { // pra saber se tem algum numero na senha
                numbers++;
            }
        }
        // se não tiver numeros  ou letras maíusculas vai dar erro
        if (uppercases === 0 || numbers === 0) {
            let errorMessage = `A senha precisa de uma letra maiúscula e um número`;

            this.printMessage(input, errorMessage);
        }
    }

    // limpa as validações da tela
    cleanValidations(validations) {

        this.contemErros = false;

        // é uma Arrowfunction, é uma forma forma simplificada de escrever a função.
        // é o equivalente a escrever funcontion xpto(el){​​​​ el.remove();}​​​​ 
        validations.forEach(el => el.remove());
    }
}


let form = document.getElementById("register-form"); // pega o formulario 
let submit = document.getElementById("btn-submit"); // pega o que o botão cadastra pegou 
let validator = new Validator(); // cria objeto validator do tipo Validator 

// evento que dispara as validações 
submit.addEventListener('click', function (e) {

    e.preventDefault(); // impede o formulario de enviar p/ o servidor


    validator.validate(form); // passa o obj validator para o método validate
    // e mando o meu formulario para ele validar

    // SE NÃO (!) tiver erros vamos chamar o backend através do cadastro(form).
    if (!validator.contemErros) {
        cadastro()
    }
}
);