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

function main() {
    document.getElementById('recover-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Esto debe ir al principio para prevenir el envío del formulario
        var password = document.getElementById('new-password').value;
        var confirmPassword = document.getElementById('new-confirm-password').value;

        val = validarPassword(password, confirmPassword)

        if (val) {

            //petición AJAX
            var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
            xhr.open("POST", "/reestablecer-2", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
            xhr.setRequestHeader('Content-Type', 'application/json'); //formato de la peticion
            xhr.send(JSON.stringify({
                password: password,
                confirm_password: confirmPassword
            }));

            // Manejar la respuesta del servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var usernameErrorElement = document.getElementById('username-error');
                    if (response.registered) { //si la rta indica que el nombre de usuario ya existe
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