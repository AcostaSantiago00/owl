function validarFormulario(username, password) {
    var loginError = document.getElementById('login-error')
    if (username.trim() === '' || password.trim() === '') {
        loginError.textContent = 'Rellene todos los campos para poder iniciar sesion.';
        loginError.classList.add('error-active');
        return false
    } else {
        loginError.classList.remove('error-active');
        return true
    }
}

document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    val = validarFormulario(username, password)

    if (val) {
        //petición AJAX
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/login', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            username: username,
            password: password,
        }));

        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var loginError = document.getElementById('login-error')
                if (response.role === 'alumno') {
                    console.log(response.role)
                    window.location.href = '/interfaz_alumno';
                } else if (response.role === 'profesor') {
                    window.location.href = '/interfaz_profesor';
                } else {
                    loginError.textContent = 'Los datos son incorrectos o no esta registrado.';
                    loginError.classList.add('error-active');
                }
            }
        };
    }
});
