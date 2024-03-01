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
                'rol': usuario[3],  # Asumiendo que el rol está en la cuarta columna
                'foto_perfil': usuario[7]
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


def registrar_usuario(username, password, rol, rta_1, rta_2, rta_3, foto_perfil):
    conexion = obtener_conexion()
    if conexion is None:
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO usuario (nombre_usuario, pass, rol, rta_1, rta_2, rta_3, foto_perfil) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        valores = (username, password, rol, rta_1, rta_2, rta_3, foto_perfil)
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
    
def cambiar_contrasena(password, nombre_usuario):
    conexion = obtener_conexion() #establece conexion con la base de datos
    if conexion is None:
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor() #se utiliza para ejecutar consultas en bd
        cursor.execute("UPDATE usuario SET pass = %s WHERE nombre_usuario = %s", (password, nombre_usuario))
        conexion.commit()  # Asegúrate de hacer commit de la transacción
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
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

def cambiar_informacion(password, nombre_usuario, foto_ruta):
    conexion = obtener_conexion() #establece conexion con la base de datos
    if conexion is None:
        print("No se pudo conectar a la base de datos")
        return False
    try:
        cursor = conexion.cursor() 
        cursor.execute("UPDATE usuario SET pass = %s, foto_perfil = %s WHERE nombre_usuario = %s", (password, foto_ruta, nombre_usuario))
        conexion.commit() 
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
        return False
    finally:
        cerrar_conexion(cursor, conexion)

def informacion_curso(id_profesor):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT id_curso, nombre_curso, foto_curso FROM curso WHERE id_profesor = %s", (id_profesor,)) 
        curso = cursor.fetchall() 
        if curso:
            return curso
        else:
            return None #no hay coincidencias
    finally:
        cerrar_conexion(cursor, conexion)

def obtener_curso_por_id(id_curso):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM curso WHERE id_curso = %s", (id_curso,)) 
        curso = cursor.fetchone()
        if curso:
            return curso
        else:
            return None #no hay coincidencias
    finally:
        cerrar_conexion(cursor, conexion)

def buscar_cursos(id_alumno):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        consulta_sql = """SELECT c.id_curso, c.nombre_curso, c.foto_curso 
                          FROM curso c 
                          WHERE c.id_curso 
                          NOT IN (SELECT i.id_curso FROM inscripcion i 
                          WHERE i.id_alumno = %s)"""
        cursor.execute(consulta_sql, (id_alumno,))
        cursos_no_inscriptos = cursor.fetchall()
        return cursos_no_inscriptos
    except Exception as e:
        print(f"Ocurrió un error al obtener los cursos no inscritos: {e}")
        return []
    finally:
        cerrar_conexion(cursor, conexion)


def inscripcion_curso(id_alumno, id_curso):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO inscripcion (id_alumno, id_curso) VALUES (%s, %s)"
        valores = (id_alumno, id_curso)
        cursor.execute(query, valores)
        conexion.commit()  # Asegúrate de hacer commit de la transacción
        return True
    except Error as e:
        print(f"Error al insertar en MySQL: {e}")
        return False
    finally:
        cerrar_conexion(cursor, conexion)

def informacion_inscripcion(id_alumno):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        consulta_sql = """ SELECT c.id_curso, c.nombre_curso, c.foto_curso 
                       FROM curso c
                       JOIN inscripcion i
                       ON c.id_curso = i.id_curso
                       WHERE i.id_alumno = %s
                       """
        cursor.execute(consulta_sql, (id_alumno,)) 
        cursos = cursor.fetchall() 
        return cursos if cursos else None
    except Exception as e:
        print(f"Ocurrió un error: {e}")
        return None
    finally:
        cerrar_conexion(cursor, conexion)

def obtener_alumnos_inscritos(id_curso):
    conexion = obtener_conexion()
    if conexion is None:
        print("Error al conectarse a la base de datos")
        return []
    try:
        with conexion.cursor() as cursor:
            consulta_sql = """
            SELECT 
                u.id AS id_alumno, 
                u.nombre_usuario, 
                i.nota_primer_p, 
                i.nota_segundo_p, 
                i.nota_recuperatorio, 
                i.nota_final
            FROM inscripcion i
            JOIN usuario u ON i.id_alumno = u.id
            WHERE i.id_curso = %s;
            """
            cursor.execute(consulta_sql, (id_curso,))
            resultado = cursor.fetchall()
            return resultado
    except Exception as e:
        print(f"Ocurrió un error al obtener la información de inscripción: {e}")
        return []
    finally:
        if conexion is not None:
            conexion.close()

def actualizar_notas_en_db(id_alumno, datos_notas):
    conexion = obtener_conexion()
    if conexion is None:
        return False
    try:
        cursor = conexion.cursor()
        consulta_sql = """
        UPDATE inscripcion
        SET nota_primer_p = %s, nota_segundo_p = %s, nota_recuperatorio = %s, nota_final = %s
        WHERE id_alumno = %s AND id_curso = %s;
        """
        cursor.execute(consulta_sql, (
            datos_notas['primer_p'], 
            datos_notas['segundo_p'], 
            datos_notas['recuperatorio'], 
            datos_notas['final'], 
            id_alumno, 
            datos_notas['id_curso']
        ))
        conexion.commit()
        return True
    except Exception as e:
        print(f"Ocurrió un error al actualizar las notas en la base de datos: {e}")
        return False
    finally:
        conexion.close()

def obtener_calificaciones_alumno(id_alumno, id_curso):
    print(f"Obteniendo calificaciones para alumno {id_alumno} en curso {id_curso}")
    conexion = obtener_conexion()
    if conexion is None:
        return []
    try:
        with conexion.cursor() as cursor:
            consulta_sql = """
            SELECT nota_primer_p, nota_segundo_p, nota_recuperatorio, nota_final
            FROM inscripcion
            WHERE id_alumno = %s AND id_curso = %s;
            """
            cursor.execute(consulta_sql, (id_alumno, id_curso))
            calificaciones = cursor.fetchall()
            return calificaciones
    except Exception as e:
        print(f"Ocurrió un error al obtener las calificaciones: {e}")
        return []
    finally:
        conexion.close()
