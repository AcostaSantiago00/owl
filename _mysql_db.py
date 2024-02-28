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

def iniciar_sesion(username, password):
    conexion = obtener_conexion() #establece conexion con la base de datos
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        cursor.execute("SELECT * FROM usuario WHERE nombre_usuario = %s", (username,)) #ejecuta consulta donde usuario coincide con el cargado
        usuario = cursor.fetchone() #recupera 1ra fila del res de la consulta
        if usuario and usuario[2] == password:
            info_usuario = {
                'id': usuario[0],
                'nombre_usuario': usuario[1],
                'rol': usuario[3]  # Asumiendo que el rol está en la cuarta columna
            }
            return info_usuario
        else:
            return None #no hay coincidencias
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
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO usuario (nombre_usuario, pass, rol, rta_1, rta_2, rta_3) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (username, password, rol, rta_1, rta_2, rta_3)
        cursor.execute(query, valores)
        conexion.commit()
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
        return False
    finally:
        cerrar_conexion(cursor, conexion)

def reestablecer_usuario(username, rta_1, rta_2, rta_3):
    conexion = obtener_conexion() #establece conexion con la base de datos
    if conexion is None:
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        cursor.execute("SELECT * FROM usuario WHERE nombre_usuario = %s", (username,)) #ejecuta consulta donde usuario coincide con el cargado
        usuario = cursor.fetchone() #recupera 1ra fila del res de la consulta
        if usuario and (usuario[4] == rta_1 and usuario[5] == rta_2 and usuario[6] == rta_3):
            return True
        return False
    finally:
        cerrar_conexion(cursor, conexion)

def cargar_curso(nombre_curso, descripcion_curso, foto_curso, id_profesor):
    conexion = obtener_conexion() #establece conexion con la base de datos
    if conexion is None:
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        query = "INSERT INTO curso (nombre_curso, descripcion_curso, foto_curso, id_profesor) VALUES (%s, %s, %s, %s)"
        valores = (nombre_curso, descripcion_curso, foto_curso, id_profesor)
        cursor.execute(query, valores)
        conexion.commit()  # Asegúrate de hacer commit de la transacción
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
        return False
    finally:
        cerrar_conexion(cursor, conexion)