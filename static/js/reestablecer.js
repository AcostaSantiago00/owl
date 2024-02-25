function validarUsuario(user, event) {
    var usuarioError = document.getElementById('username-error'); // Asegúrate de que este ID exista en tu HTML

    if(user.trim() === '') {
        document.getElementById('username').classList.add('input-error'); // Cambia 'email' por 'username'
        usuarioError.textContent = 'Este campo es obligatorio.';
        usuarioError.classList.add('error-active');
        event.preventDefault();
    } else {
        document.getElementById('username').classList.remove('input-error');
        usuarioError.classList.remove('error-active');
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
        event.preventDefault(); // Previene el envío del formulario
    }else{
        securityQuestionsError.classList.remove('error-active');
    }
}

document.getElementById('recover-form').addEventListener('submit', function(event) {
    var user = document.getElementById('username').value;
    validarUsuario(user, event);

    var campos = [
        document.getElementById('pregunta1'),
        document.getElementById('pregunta2'),
        document.getElementById('pregunta3')
    ];
    validarPreguntasDeSeguridad(campos, event);
});