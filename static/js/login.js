function validarFormulario(username, password) {
    if (username.trim() === '' || password.trim() === '') {
        alert('Por favor, rellena todos los campos.');
        return false;
    }
    return true;
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var esValido = validarFormulario(username, password);

    if (!esValido) {
        event.preventDefault();
    }
});
