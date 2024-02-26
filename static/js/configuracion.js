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

document.getElementById('register-form').addEventListener('submit', function(event) {
    var password = document.getElementById('new-password').value;
    var confirmPassword = document.getElementById('confirm-new-password').value;
    var passwordError = document.getElementById('password-error');
    validarPassword(password, confirmPassword, passwordError, event);
});