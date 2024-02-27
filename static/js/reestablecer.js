function validarUsuario(user, event) {
    var usuarioError = document.getElementById('username-error'); // asegurar siempre  que este ID este en html

    if (user.trim() === '') {
        usuarioError.textContent = 'Este campo es obligatorio.';
        usuarioError.classList.add('error-active');
        event.preventDefault();
    } else {
        usuarioError.classList.remove('error-active');
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
        securityQuestionsError.textContent = 'Por favor, responde todas las preguntas de seguridad.';
        securityQuestionsError.classList.add('error-active');
        event.preventDefault();
    } else {
        securityQuestionsError.classList.remove('error-active');
    }
}

document.getElementById('recover-form').addEventListener('submit', function (event) {
    event.preventDefault();

    var user = document.getElementById('username').value;
    validarUsuario(user, event);

    var campos = [
        document.getElementById('pregunta1'),
        document.getElementById('pregunta2'),
        document.getElementById('pregunta3')
    ];
    validarPreguntasDeSeguridad(campos, event);

    //petición AJAX
    var respuesta1 = document.getElementById('pregunta1').value;
    var respuesta2 = document.getElementById('pregunta2').value;
    var respuesta3 = document.getElementById('pregunta3').value;

    var xhr = new XMLHttpRequest(); //objeto que interactua con servidor, y envia/recibe datos de forma asincronica.
    xhr.open("POST", "/reestablecer", true); //tipo de peticion enviada (POST), donde se envia (/registrar), especificando que debe ser asincronica (true)
    xhr.setRequestHeader('Content-Type', 'application/json'); //formato de la peticion
    xhr.send(JSON.stringify({
        username: user,
        respuesta1: respuesta1,
        respuesta2: respuesta2,
        respuesta3: respuesta3
    }));

    // Manejar rta servidor
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var errorRespuestas = document.getElementById('security-questions-error');
            if (response.respuesta) { //si la rta indica que el nombre de usuario ya existe
                console.log(response.respuesta)
                window.location.href = '/'; // Redirigir a la página de inicio
            } else{
                errorRespuestas.textContent = 'Los datos son incorrectos.';
                errorRespuestas.classList.add('error-active'); // Añade la clase para mostrar el error
            }
        }
    }

});