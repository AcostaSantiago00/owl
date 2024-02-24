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
    var campos = [
        document.getElementById('pregunta1'),
        document.getElementById('pregunta2'),
        document.getElementById('pregunta3')
    ];
    
    validarPreguntasDeSeguridad(campos, event);
});