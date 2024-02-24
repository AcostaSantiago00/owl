import os #se utiliza para interactuar con el sistema operativo
from flask import Flask, session #clase principal de la aplicacion web
from route import route #archivo que contiene rutas de la app web
 
def main():
    app = Flask(__name__,template_folder='templates',static_folder='static')
    """__name__: indica nombre del modulo o paquete de la app.
    template_folder: indica donde flask buscara arch HTML (solo html)
    static_folder: indica donde buscara los arch estaticos (css, js o img)
    """

    app.config['SECRET_KEY'] = 'piolin.tia.pierna' 
    #clave secreta de la app. Se usa  para mantener seguridad de las sesiones de usuario.

    route(app)
    #llama a la fun route que esta en el arch route.py y le pasa la instancia de la app para registrar todas las rutas y sus funciones asociadas.
    
    app.run('0.0.0.0', 5000, debug=True)
    """inicia la app.
    0.0.0.0: le dice a mi servidor que otros dispositivos pueden conectarse a mi servidor a traves de red
    5000: numero de puerto en el que se ejecuta la app.
    debug=true: activa modo depuracion que da info de depuracion en la consola y recarga el servidor automaticamente al hacer cambios en el cod."""
main()