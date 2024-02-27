function validarUsuario(user, event) {
    var usuarioError = document.getElementById('username-error'); // Asegúrate de que este ID exista en tu HTML

    if (user.trim() === '') {
        usuarioError.textContent = 'Este campo es obligatorio.';
        usuarioError.classList.add('error-active');
        event.preventDefault();
    } else {
        document.getElementById('username').classList.remove('input-error');
        usuarioError.classList.remove('error-active');
        return true
    }
}

function validarPassword(password, confirmPassword, passwordError, event) {
    // Verificación de longitud de la contraseña
    if (password === '' && confirmPassword === '') {
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
        return true
    }
}

function validarRol(rol, event) {
    var rolError = document.getElementById('rol-error');
    if (rol === '') {
        rolError.textContent = 'Seleccionar un rol es obligatorio.';
        rolError.classList.add('error-active');
        event.preventDefault();
    } else {
        rolError.classList.remove('error-active');
        return true
    }
}

function validarPreguntasDeSeguridad(campos, event) {
    var todasRespondidas = true;
    var securityQuestionsError = document.getElementById('security-questions-error');

    campos.forEach(function (campo) {
        if (campo.value.trim() === '') {
            todasRespondidas = false;
        }
    });

    if (!todasRespondidas) {
        securityQuestionsError.classList.add('error-active');
        event.preventDefault();
    } else {
        securityQuestionsError.classList.remove('error-active');
        return true
    }
}

document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Esto debe ir al principio para prevenir el envío del formulario
    var user = document.getElementById('username').value;
    var val1 = validarUsuario(user, event);

    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    var passwordError = document.getElementById('password-error');
    var val2 = validarPassword(password, confirmPassword, passwordError, event);

    var campos = [
        document.getElementById('pregunta1'),
        document.getElementById('pregunta2'),
        document.getElementById('pregunta3')
    ];
    var val3 = validarPreguntasDeSeguridad(campos, event);

    var rol = document.getElementById('rol').value;
    var val4 = validarRol(rol, event);

    if (val1 == true && val2 == true && val3 == true && val4 == true) {
        var respuesta1 = document.getElementById('pregunta1').value;
        var respuesta2 = document.getElementById('pregunta2').value;
        var respuesta3 = document.getElementById('pregunta3').value;

        //petición AJAX
        var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
        xhr.open("POST", "/registrarse", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
        xhr.setRequestHeader('Content-Type', 'application/json'); //formato de la peticion
        xhr.send(JSON.stringify({
            username: user,
            password: password,
            confirm_password: confirmPassword,
            tipo_rol: rol,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3
        }));

        // Manejar la respuesta del servidor
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var usernameErrorElement = document.getElementById('username-error');
                if (response.usernameExists) { //si la rta indica que el nombre de usuario ya existe
                    usernameErrorElement.textContent = 'El nombre de usuario ya existe.';
                    usernameErrorElement.classList.add('error-active'); // Añade la clase para mostrar el error
                } else if (response.error) {
                    console.log("Error del servidor:", response.error);
                    // Aquí puedes manejar otros errores
                    // y usar una lógica similar para mostrar mensajes de error
                } else if (response.registered) {
                    window.location.href = '/'; // Redirigir a la página de inicio
                } else {
                    usernameErrorElement.classList.remove('error-active'); // Si no hay errores, a la clase de error
                }
            }
        }

    }
});