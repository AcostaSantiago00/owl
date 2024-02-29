function validarUsuario(user) {
    var usuarioError = document.getElementById('username-error'); // Asegúrate de que este ID exista en tu HTML

    if (user.trim() === '') {
        usuarioError.textContent = 'Este campo es obligatorio.';
        usuarioError.classList.add('error-active');
        return false
    } else {
        usuarioError.classList.remove('error-active');
        return true
    }
}

function validarPassword(password, confirmPassword) {
    var passwordError = document.getElementById('password-error');

    // Verificación de longitud de la contraseña
    if (password === '' && confirmPassword === '') {
        passwordError.textContent = 'Este campo es obligatorio.';
        passwordError.classList.add('error-active');
        return false
    }
    else if (password.length < 8 || password.length > 16) {
        passwordError.textContent = 'La contraseña debe tener entre 8 y 16 caracteres.';
        passwordError.classList.add('error-active');
        return false
    }
    // Verificación de coincidencia de contraseñas
    else if (password !== confirmPassword) {
        passwordError.textContent = 'Las contraseñas deben coincidir.';
        passwordError.classList.add('error-active');
        return false
    }
    else {
        passwordError.classList.remove('error-active');
        return true
    }
}

function validarRol(rol) {
    var rolError = document.getElementById('rol-error');
    if (rol === '') {
        rolError.textContent = 'Seleccionar un rol es obligatorio.';
        rolError.classList.add('error-active');
        return false
    } else {
        rolError.classList.remove('error-active');
        return true
    }
}

function validarPreguntasDeSeguridad(campos) {
    var securityQuestionsError = document.getElementById('security-questions-error');
    var todasRespondidas = true;

    var i = 0;
    while (i <= 2) {
        if (campos[i] === '') {
            todasRespondidas = false;
        }
        i++;
    }

    if (!todasRespondidas) {
        securityQuestionsError.textContent = 'Por favor, responde todas las preguntas de seguridad.';
        securityQuestionsError.classList.add('error-active');
        return false
    } else {
        securityQuestionsError.classList.remove('error-active');
        return true
    }
}

function main() {
    document.getElementById('register-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Esto debe ir al principio para prevenir el envío del formulario
        var user = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
        var campos = [
            document.getElementById('pregunta1').value,
            document.getElementById('pregunta2').value,
            document.getElementById('pregunta3').value
        ];
        var rol = document.getElementById('rol').value;

        val1 = validarUsuario(user)
        val2 = validarPassword(password, confirmPassword)
        val3 = validarPreguntasDeSeguridad(campos)
        val4 = validarRol(rol)


        if (val1 && val2 && val3 && val4) {

            //petición AJAX
            var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
            xhr.open("POST", "/registrarse", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
            xhr.setRequestHeader('Content-Type', 'application/json'); //formato de la peticion
            xhr.send(JSON.stringify({
                username: user,
                password: password,
                confirm_password: confirmPassword,
                tipo_rol: rol,
                respuesta1: campos[0],
                respuesta2: campos[1],
                respuesta3: campos[2],
            }));

            // Manejar la respuesta del servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var usernameErrorElement = document.getElementById('username-error');
                    if (!response.registered) { //si la rta indica que el nombre de usuario ya existe
                        usernameErrorElement.textContent = 'El nombre de usuario ya existe.';
                        usernameErrorElement.classList.add('error-active'); // Añade la clase para mostrar el error
                    } else if (response.error) {
                        console.log("Error del servidor:", response.error);
                        // Aquí puedes manejar otros errores
                        // y usar una lógica similar para mostrar mensajes de error
                    } else {
                        window.location.href = '/'; // Redirigir a la página de inicio
                    }
                }
            }
        }
    });
}

main();