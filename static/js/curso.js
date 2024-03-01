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


function main() {
    document.getElementById('logout-button').addEventListener('click', function () {
        // Llamar a una función para manejar el cierre de sesión
        logout();
    });

    document.addEventListener('DOMContentLoaded', function() {
        var form = document.getElementById('formulario-agregar-contenido');
    
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir el envío normal del formulario.
    
            var formData = new FormData(form);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', form.action, true); // Utiliza la acción del formulario para la URL
    
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.error) {
                        console.error("Error del servidor:", response.error);
                        // Aquí puedes manejar otros errores
                        // y usar una lógica similar para mostrar mensajes de error
                    } else {
                        console.log("Contenido agregado con éxito:", response.mensaje);
                        // Aquí puedes actualizar la página o la lista de contenidos.
                        // Si necesitas recargar la página para ver los cambios:
                        window.location.reload(); // Redirecciona a la página del curso
                    }
                } else {
                    // Manejar respuestas de estado distintas de 200
                    console.error('Error en la respuesta del servidor:', xhr.statusText);
                }
            };
    
            xhr.onerror = function() {
                // Manejar errores de red
                console.error('Error en la red o petición fallida');
            };
    
            xhr.send(formData); // Enviar el formulario al servidor
        });
    });
}
main()