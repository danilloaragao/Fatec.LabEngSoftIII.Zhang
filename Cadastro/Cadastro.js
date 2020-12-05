pararLoading()

function cadastro() {
    inicarLoading()
    let Login = document.getElementById('name').value;
    let Senha = document.getElementById('password').value;
    let Email = document.getElementById('email').value;
    var raw = {
        Login,
        Senha,
        Email,
    }
    var myHeaders = new Headers();
    myHeaders.append("Accept", "text/plain");
    myHeaders.append("Content-Type", "application/json-patch+json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    };

    fetch("https://zhang-api.herokuapp.com/api/Usuario/Cadastro", requestOptions)
        .then(response => response.text())
        .then(result => {
            alert(result)
            window.location.href = "./../Login/Login.html"
        })
        .then(() => pararLoading())
        .catch(error => {
            pararLoading()
            alert(error)
        });

}

class Validator {
    constructor() {
        this.validations = [
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

    validate(form) {

        let currentValidations = document.querySelectorAll('form .error-validation');

        this.cleanValidations(currentValidations);

        let inputs = form.getElementsByTagName('input');

        let inputsArray = [...inputs];

        inputsArray.forEach(function (input) {

            for (let i = 0; this.validations.length > i; i++) {
                if (input.getAttribute(this.validations[i]) != null) {
                    let method = this.validations[i].replace('data-', '').replace('-', '');
                    let value = input.getAttribute(this.validations[i]);
                    this[method](input, value);
                }
            }
        }, this);
    }
    minlength(input, minValue) {
        let inputLength = input.value.length;

        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            this.printMessage(input, errorMessage);
        }
    }

    maxlength(input, maxValue) {

        let inputLength = input.value.length;
        let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;
        if (inputLength > maxValue) {
            this.printMessage(input, errorMessage);
        }
    }

    emailvalidate(input) {
        let re = /\S+@\S+\.\S+/;

        let email = input.value;

        let errorMessage = `insira um e-mail no padrão meuemail@email.com`;

        if (!re.test(email)) {
            this.printMessage(input, errorMessage);
        }
    }

    onlyletters(input) {
        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let errorMessage = `Este campo não aceita números ou caracteres especiais. `;

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage);
        }
    }
    printMessage(input, msg) {
        let errorQty = input.parentNode.querySelector('.error-validation');
        if (errorQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);
            template.textContent = msg;
            let inputParent = input.parentNode;
            template.classList.remove('template');
            inputParent.appendChild(template);
            this.contemErros = true;
        }
    }
    required(input) {
        let inputValue = input.value;

        if (inputValue === '') {
            let errorMessage = `Este campo é obrigatório`;

            this.printMessage(input, errorMessage);
        }
    }

    equal(input, inputName) {
        let inputToCompare = document.getElementsByName(inputName)[0];

        let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

        if (input.value != inputToCompare.value) {
            this.printMessage(input, errorMessage);
        }
    }

    passwordvalidate(input) {
        let charArr = input.value.split("");
        let uppercases = 0;
        let numbers = 0;
        for (let i = 0; charArr.length > i; i++) {
            if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                uppercases++;
            } else if (!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }

        if (uppercases === 0 || numbers === 0) {
            let errorMessage = `A senha precisa de uma letra maiúscula e um número`;
            this.printMessage(input, errorMessage);
        }
    }

    cleanValidations(validations) {
        this.contemErros = false;
        validations.forEach(el => el.remove());
    }
}


let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");
let validator = new Validator();

submit.addEventListener('click', function (e) {
    inicarLoading()
    e.preventDefault();

    validator.validate(form);
    pararLoading()
    if (!validator.contemErros) {
        cadastro()
    }
});

function inicarLoading() {
    document.getElementById('div-loading').style.display = 'flex';
    console.log('ini')
}

function pararLoading() {
    document.getElementById('div-loading').style.display = 'none';
    console.log('fim')
}
