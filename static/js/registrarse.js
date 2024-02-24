function validarEmail(email, emailError, emailRegex, event) {
    if (email.trim() === '') {
        document.getElementById('email').classList.add('input-error');
        emailError.textContent = 'El campo de correo electrónico es obligatorio.';
        emailError.classList.add('error-active');
        event.preventDefault(); // Previene el envío del formulario
    }
    // Verificación de formato de correo electrónico
    else if (!emailRegex.test(email)) {
        emailError.textContent = 'Debe ser un correo electrónico válido.';
        emailError.classList.add('error-active');
        event.preventDefault();
    }
    else {
        emailError.classList.remove('error-active');
    }
}


function validarPassword(password, confirmPassword, passwordError, event){
    // Verificación de longitud de la contraseña
    if (password === '' && confirmPassword === ''){
        passwordError.textContent = 'Este campo es obligatorio.';
        passwordError.classList.add('error-active');
        event.preventDefault();
    }
    else if (password.length < 8 || password.length > 16) {
        passwordError.textContent = 'La contraseña debe tener entre 8 y 16 caracteres.';
        passwordError.classList.add('error-active');
        event.preventDefault();
    }
    // Verificación de coincidencia de contraseñas
    else if (password !== confirmPassword) {
        passwordError.textContent = 'Las contraseñas deben coincidir.';
        passwordError.classList.add('error-active');
        event.preventDefault();
    } 
    else {
        passwordError.classList.remove('error-active');
    }
}

function validarRol(event) {
    var rol = document.getElementById('rol').value;
    var rolError = document.getElementById('rol-error');

    if (rol === '') {
        rolError.textContent = 'Seleccionar un rol es obligatorio.';
        rolError.classList.add('error-active');
        event.preventDefault();
    } else {
        rolError.classList.remove('error-active');
    }
}

function validarPreguntasDeSeguridad(campos, event) {
    var todasRespondidas = true;
    var securityQuestionsError = document.getElementById('security-questions-error');

    campos.forEach(function(campo) {
        if (campo.value.trim() === '') {
            todasRespondidas = false;
        }
    });

    if (!todasRespondidas) {
        securityQuestionsError.classList.add('error-active');
        event.preventDefault();
    }else{
        securityQuestionsError.classList.remove('error-active');
    }
}

document.getElementById('register-form').addEventListener('submit', function(event) {
    var email = document.getElementById('email').value;
    var emailError = document.getElementById('email-error');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correo electrónico

    validarEmail(email, emailError, emailRegex, event);

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    var passwordError = document.getElementById('password-error');

    validarPassword(password, confirmPassword, passwordError, event);

    var campos = [
        document.getElementById('pregunta1'),
        document.getElementById('pregunta2'),
        document.getElementById('pregunta3')
    ];
    validarPreguntasDeSeguridad(campos, event);

    validarRol(event);
});
