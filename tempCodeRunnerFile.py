
def main():
    app = Flask(__name__,template_folder='templates',static_folder='static')
    """__name__: indica nombre del modulo o paquete de la app.
    template_folder: indica donde flask buscara arch HTML (solo html)