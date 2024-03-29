function validarFormulario() {
    var span_error = document.getElementById('span-error');

    var nombreCurso = document.getElementById('nombre-curso').value;
    var descripcionCurso = document.getElementById('descripcion-curso').value;

    if (nombreCurso.trim() === '' || descripcionCurso.trim() === '') {
        span_error.textContent = 'Por favor, rellena todos los campos antes de continuar.';
        span_error.classList.add('error-active');
        return false;
    }
    return true;
}

function enviarCurso() {
    console.log('Enviando petición'); // Para depuración

    var nombreCurso = document.getElementById('nombre-curso').value;
    var descripcionCurso = document.getElementById('descripcion-curso').value;
    var fotoCurso = document.getElementById('foto-curso').files[0]; // Asume que es un input de tipo file

    var formData = new FormData();
    formData.append('nombre_curso', nombreCurso);
    formData.append('descripcion_curso', descripcionCurso);
    formData.append('foto_curso', fotoCurso); // Agrega el archivo

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/interfaz_profesor', true);

    xhr.onload = function () {
        console.log('Respuesta recibida'); // Para depuración
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var span_error = document.getElementById('span-error');
            span_error.style.color = 'green';
            if (response.creacion_curso) {
                console.log("Curso cargado en la base de datos.");
                document.getElementById('form_id').remove();
                message.textContent = 'Curso creado con exito';
                message.classList.add('message-active');
                window.location.href = '/interfaz_profesor';
            }
        } else {
            // Manejar el error
            console.error('Error en la petición: ' + xhr.status);
            alert('Error al cargar el curso');
        }
    };

    xhr.onerror = function () {
        console.error('Error en la red o petición fallida');
    };

    xhr.send(formData);
}

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

function filtrar_calificacion_por_curso() {
    var id_curso = document.getElementById('select-curso').value;

    // Verifica que se haya seleccionado un curso
    if (id_curso) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/alumnos_curso/' + id_curso, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Procesa la respuesta
                var alumnos = JSON.parse(xhr.responseText);
                console.log(alumnos);
                actualizar_tabla_alumnos(alumnos);
            } else {
                // Manejar el error
                console.error('Error al obtener los alumnos: ', xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error('Error en la solicitud AJAX.');
        };
        xhr.send();
    }
}

function actualizar_tabla_alumnos(alumnos) {
    var tabla = document.getElementById('tabla-calificaciones');
    tabla.innerHTML = ''; // Limpiar la tabla actual

    // Comenzar la construcción de la tabla HTML
    var html = '<table>';
    html += '<tr>';
    html += '<th>ID Alumno</th>';
    html += '<th>Nombre de Usuario</th>';
    html += '<th>Nota Primer Parcial</th>';
    html += '<th>Nota Segundo Parcial</th>';
    html += '<th>Nota Recuperatorio</th>';
    html += '<th>Nota Final</th>';
    html += '</tr>';

    // Iterar sobre cada alumno y agregar sus datos a la tabla
    alumnos.forEach(function (alumno) {
        html += '<tr>';
        html += '<td>' + alumno[0] + '</td>';
        html += '<td>' + alumno[1] + '</td>';
        html += '<td><input type="number" class="nota-input" value="' + (alumno[2] || '') + '" data-id="' + alumno[0] + '" data-tipo="primer_p"></td>';
        html += '<td><input type="number" class="nota-input" value="' + (alumno[3] || '') + '" data-id="' + alumno[0] + '" data-tipo="segundo_p"></td>';
        html += '<td><input type="number" class="nota-input" value="' + (alumno[4] || '') + '" data-id="' + alumno[0] + '" data-tipo="recuperatorio"></td>';
        html += '<td><input type="number" class="nota-input" value="' + (alumno[5] || '') + '" data-id="' + alumno[0] + '" data-tipo="final"></td>';
        html += '<td><button onclick="guardar_nota(' + alumno[0] + ')">Guardar</button></td>';
        html += '</tr>';
    });

    html += '</table>';
    tabla.innerHTML = html;
}

function guardar_nota(idAlumno) {
    var id_curso = document.getElementById('select-curso').value;
    var notas = document.querySelectorAll('.nota-input[data-id="' + idAlumno + '"]');
    var datosNota = { id_curso: id_curso }; // Agrega id_curso aquí
    notas.forEach(function(nota) {
        datosNota[nota.getAttribute('data-tipo')] = nota.value;

    });

    // Aquí, realiza una solicitud AJAX para enviar datosNota al servidor
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/actualizar_notas/' + idAlumno, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(datosNota));

    xhr.onload = function() {
        if (xhr.status === 200) {
            window.location.href = '/interfaz_profesor';
        } else {
            console.error('Error al guardar la nota: ', xhr.statusText);
        }
    };
}

function main() {
    document.addEventListener('DOMContentLoaded', function () {
        var botonCrearCurso = document.getElementById('crear-curso');  // Obtiene el botón por su ID

        var message = document.createElement('span');
        message.setAttribute('id', 'message');
        message.setAttribute('class', 'message-active');
        message.style.color = 'green';
        document.querySelector('.gestion-cursos').appendChild(message);



        var formularioCreado = false; // Variable de control

        // Agrega un event listener para el evento 'click'
        botonCrearCurso.addEventListener('click', function () {
            if (!formularioCreado) {
                // Crea un nuevo elemento de formulario
                var form = document.createElement('form');
                form.setAttribute('id', 'form_id');
                form.setAttribute('method', 'post'); // o 'get', dependiendo de tu backend
                form.setAttribute('enctype', 'multipart/form-data');

                // Crea y agrega el campo para el nombre del curso
                var nombreCurso = document.createElement('input');
                nombreCurso.setAttribute('type', 'text');
                nombreCurso.setAttribute('id', 'nombre-curso');
                nombreCurso.setAttribute('name', 'nombreCurso');
                nombreCurso.setAttribute('placeholder', 'Nombre del Curso');
                nombreCurso.style.width = '230px'; // Puedes ajustar el valor a lo que necesites
                form.appendChild(nombreCurso);

                // Crea y agrega el campo para la descripción del curso
                var descripcionCurso = document.createElement('textarea');
                descripcionCurso.setAttribute('id', 'descripcion-curso');
                descripcionCurso.setAttribute('name', 'descripcionCurso');
                descripcionCurso.setAttribute('placeholder', 'Descripción del Curso');
                descripcionCurso.setAttribute('rows', '10'); // Número de filas
                descripcionCurso.setAttribute('cols', '50'); // Número de columnas
                form.appendChild(descripcionCurso);



                // Crea y agrega el campo para la foto de perfil
                var fotoPerfil = document.createElement('input');
                fotoPerfil.setAttribute('id', 'foto-curso');
                fotoPerfil.setAttribute('type', 'file');
                fotoPerfil.setAttribute('name', 'fotoPerfil');
                form.appendChild(fotoPerfil);

                var span_error = document.createElement('span');
                span_error.setAttribute('id', 'span-error');
                span_error.setAttribute('class', 'error-active');
                span_error.style.color = 'red';
                form.appendChild(span_error); // Asegúrate de agregar el span al formulario

                // Crea y agrega el botón de envío del formulario
                var submitButton = document.createElement('button');
                submitButton.setAttribute('id', 'id-boton');
                submitButton.setAttribute('type', 'submit');
                submitButton.textContent = 'Confirmar';
                submitButton.className = 'crear-button';
                form.appendChild(submitButton);

                // Agrega el formulario al DOM, dentro de la sección de gestión de cursos
                var gestionCursosSection = document.querySelector('.gestion-cursos');
                gestionCursosSection.appendChild(form);
                formularioCreado = true; // Actualiza la variable de control


                var submitButton = document.getElementById('id-boton'); // Asegúrate de tener el ID correcto
                submitButton.addEventListener('click', function (event) {
                    event.preventDefault(); // Previene el envío por defecto del formulario
                    if (validarFormulario()) {
                        enviarCurso();
                        formularioCreado = false;
                    }
                });
            }
        });
        document.getElementById('logout-button').addEventListener('click', function () {
            // Llamar a una función para manejar el cierre de sesión
            logout();
        });

    });

    filtrar_calificacion_por_curso()

}

main();