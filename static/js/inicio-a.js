function logout() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/logout', true); // Asegúrate de que la ruta '/logout' esté definida en tu servidor Flask
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Redirigir al usuario a la página de inicio de sesión u otra página
            window.location.href = '/';
        }
    };
    xhr.send();
}

function inscribir_a_curso(id_curso) {
    //petición AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/interfaz_alumno', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        id_curso: id_curso
    }));

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.estado_inscripcion) {
                console.log(id_curso)
                var divCurso = document.getElementById('curso-' + id_curso);
                if (divCurso) {
                    divCurso.parentNode.removeChild(divCurso);
                    window.location.href = '/interfaz_alumno';
                }
            }
        }
    };
}

function main() {
    window.onload = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/interfaz_alumno', true);
        xhr.send();
    }

    window.onload = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/cursos_inscritos', true);
        xhr.send();
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('logout-button').addEventListener('click', function () {
            // Llamar a una función para manejar el cierre de sesión
            logout();
        });

    });
}

main();