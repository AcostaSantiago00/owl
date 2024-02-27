import mysql.connector #permite conexion e interaccion con base de datos
from mysql.connector import Error 

def obtener_conexion():
    try:
        conexion = mysql.connector.connect(
            host="localhost", 
            user="root", 
            password="", 
            database="owlbd"
        )
        return conexion
    except Error as e:
        print(f"Error al conectar a MySQL: {e}")
        return None
    
def cerrar_conexion(cursor, conexion):
    if cursor is not None:
        cursor.close()
    if conexion is not None and conexion.is_connected():
        conexion.close()

def fallo_conexion(conexion):
    if conexion is None:
        return False  # O manejar el error como prefieras


def iniciar_sesion(username, password):
    conexion = obtener_conexion() #se establece conexion con la base de datos
    if conexion is None:
        return False  # O manejar el error como prefieras
    try:
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        cursor.execute("SELECT * FROM usuario WHERE nombre_usuario = %s", (username,)) #ejecuta consulta donde email, pass coincide con el cargado
        usuario = cursor.fetchone() #recupera 1ra fila del res de la consulta
        if usuario and usuario[2] == password:
            return usuario  # Retorna el id si la contraseña coincide
        else:
            return -1 #no hay coincidencias
    finally:
        cerrar_conexion(cursor, conexion)

def usuario_existe(username):
    conexion = obtener_conexion()
    if conexion is None:
        return {'error': 'No se pudo conectar a la base de datos'}  # Cambio aquí
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuario WHERE nombre_usuario = %s", (username,))
        return cursor.fetchone() is not None
    finally:
        cerrar_conexion(cursor, conexion)


def registrar_usuario(username, password, rol, rta_1, rta_2, rta_3):
    conexion = obtener_conexion()
    if conexion is None:
        return {'error': 'No se pudo conectar a la base de datos'}  # Cambio aquí
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO usuario (nombre_usuario, pass, rol, rta_1, rta_2, rta_3) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (username, password, rol, rta_1, rta_2, rta_3)
        cursor.execute(query, valores)
        conexion.commit()
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
        return {'error': str(e)}  # Cambio aquí
    finally:
        cerrar_conexion(cursor, conexion)
