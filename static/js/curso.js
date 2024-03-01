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

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('formulario-agregar-contenido');

        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevenir el envío normal del formulario.

            var formData = new FormData(form);

            fetch('{{ url_for("agregar_contenido", id_curso=curso.id_curso) }}', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Error del servidor:", data.error);
                    } else {
                        console.log("Contenido agregado con éxito:", data.mensaje);
                        window.location.href = '/curso/' + data.curso;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });

}
main()