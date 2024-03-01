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

function cargar_calificaciones() {
    var id_curso = document.getElementById('select-curso').value;
    if (id_curso) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/calificaciones_alumno/' + id_curso, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var calificaciones = JSON.parse(xhr.responseText);
                console.log(calificaciones);
                mostrar_calificaciones(calificaciones);
            } else {
                console.error('Error al obtener las calificaciones: ', xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error('Error en la solicitud AJAX.');
        };
        xhr.send();
    }
}

function mostrar_calificaciones(calificaciones) {
    var tabla = document.getElementById('tabla-calificaciones');
    tabla.innerHTML = ''; // Limpiar la tabla actual

    var html = '<table>';
    html += '<tr><th>Nota Primer Parcial</th><th>Nota Segundo Parcial</th><th>Nota Recuperatorio</th><th>Nota Final</th></tr>';

    calificaciones.forEach(function (calificacion) {
        html += '<tr>';
        html += '<td>' + (calificacion[0] || '-') + '</td>';
        html += '<td>' + (calificacion[1] || '-') + '</td>';
        html += '<td>' + (calificacion[2] || '-') + '</td>';
        html += '<td>' + (calificacion[3] || '-') + '</td>';
        html += '</tr>';
    });

    html += '</table>';
    tabla.innerHTML = html;
}


function main() {
    window.onload = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/interfaz_alumno', true);
        xhr.send();
    }

    window.onload = function () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/cursos_inscriptos', true);
        xhr.send();
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('logout-button').addEventListener('click', function () {
            // Llamar a una función para manejar el cierre de sesión
            logout();
        });

    });

    document.addEventListener('DOMContentLoaded', function() {
        cargar_calificaciones();
    });
    
}

main();