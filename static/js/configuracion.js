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

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/logout', true); // Asegúrate de que la ruta '/logout' esté definida en tu servidor Flask
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Redirigir al usuario a la página de inicio de sesión u otra página
            window.location.href = '/';
        }
    };
    xhr.send();
}

function main(){
    document.getElementById('actualizar-pass').addEventListener('submit', function(event) {
        event.preventDefault();
        var password = document.getElementById('new-password').value;
        var confirmPassword = document.getElementById('confirm-new-password').value;
        if (validarPassword(password, confirmPassword)) {

            //petición AJAX
            var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
            xhr.open("POST", "/configuracion", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
            xhr.setRequestHeader('Content-Type','application/json'); //formato de la peticion
            xhr.send(JSON.stringify({
                password: password,
                confirm_password: confirmPassword,
            }));

            // Manejar la respuesta del servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        console.log("Error del servidor:", response.error);
                        // Aquí puedes manejar otros errores
                        // y usar una lógica similar para mostrar mensajes de error
                    } else {
                        window.location.href = '/configuracion'; // Redirigir a la página de inicio
                    }
                }
            }
        }
    });

    document.getElementById('logout-button').addEventListener('click', function() { 
        logout();   // Llamar a una función para manejar el cierre de sesión
    });
}

main()