function validarUsuario(user) {
    var usuarioError = document.getElementById('username-error'); // asegurar siempre  que este ID este en html

    if (user.trim() === '') {
        usuarioError.textContent = 'Este campo es obligatorio.';
        usuarioError.classList.add('error-active');
        return false
    } else {
        usuarioError.classList.remove('error-active');
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
    document.getElementById('recover-form').addEventListener('submit', function (event) {
        event.preventDefault();

        var user = document.getElementById('username').value;

        var campos = [
            document.getElementById('pregunta1').value,
            document.getElementById('pregunta2').value,
            document.getElementById('pregunta3').value
        ];

        val1 = validarUsuario(user, event);
        val2 = validarPreguntasDeSeguridad(campos);

        if (val1 && val2) {
            //petición AJAX
            var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
            xhr.open("POST", "/reestablecer", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
            xhr.setRequestHeader('Content-Type', 'application/json'); //formato de la peticion
            xhr.send(JSON.stringify({
                username: user,
                respuesta1: campos[0],
                respuesta2: campos[1],
                respuesta3: campos[2]
            }));

            // Manejar rta servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    var errorRespuestas = document.getElementById('security-questions-error');
                    if (response.respuesta) { //si la rta indica que el nombre de usuario ya existe
                        window.location.href = '/reestablecer-2'; // Redirigir a la página de inicio
                    } else {
                        errorRespuestas.textContent = 'Los datos son incorrectos.';
                        errorRespuestas.classList.add('error-active'); // Añade la clase para mostrar el error
                    }
                }
            }
        }
    });
}

main();