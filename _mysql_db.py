import mysql.connector #permite conexion e interaccion con base de datos
from mysql.connector import Error #

def IniciarSeccion(email, password):
    try: #ejecuta operaciones que pueden lanzar expeciones
        conexion = mysql.connector.connect(
            host="localhost", 
            user="root", 
            password="", 
            database="owldatabase"
        ) #se establece conexion con la base de datos
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        cursor.execute("SELECT * FROM usuario WHERE email = %s", (email,)) #ejecuta consulta donde email, pass coincide con el cargado
        usuario = cursor.fetchone() #recupera 1ra fila del res de la consulta
        if usuario and usuario[2] == password:
            return usuario  # Retorna el id si la contraseña coincide
        else:
            return -1 #no hay coincidencias
    except Error as e: #cualquier error ocurrido durante la ejecucion try
        print(f"Error al conectar a MySQL: {e}")
        return -1
    finally: #despues de ejecutar try y except, y verifica si bd esta abierta para cerrar cursor y la conexion
        if conexion.is_connected():
            cursor.close()
            conexion.close()
