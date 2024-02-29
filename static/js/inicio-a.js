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

function main() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('logout-button').addEventListener('click', function() {
            // Llamar a una función para manejar el cierre de sesión
            logout();
        });
        
    });
}

main();