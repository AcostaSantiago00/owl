import os #proporciona una forma portatil de utilizar funcionalidades dependientes del sistema operativo
from flask import Flask, render_template, request, redirect, session, flash, url_for, jsonify
"""
render_template: para renderizar plantillas HTML
request: obtener datos de las solicitudes HTTP
redirect: redirigir el usuario a otra ruta
session: manejar sesiones de usuario
flash: mostrar mensajes temporales al usuario
url_for: generar URLs para una funcion especifica
"""
from _mysql_db import(
  iniciar_sesion, obtener_conexion, usuario_existe, registrar_usuario, reestablecer_usuario, cargar_curso, cambiar_informacion, cambiar_contrasena
) #importa funcion del modulo personalizado

from werkzeug.utils import secure_filename #para asegurar un nombre de arch que no afecte al sistema de archivos del servidor
error="" #donde se almacenara mensajes de error

def route(app): #toma objeto de app flask como argumento
  @app.route("/", methods=["GET"])
  def home(): #sera llamada cuando se acceda a la ruta raiz
      return render_template("login/login.html") #renderiza y devuelve plantilla HTML

  @app.route("/login", methods=["GET", "POST"]) 
  def login(): #sera llamada cuando se acceda a la ruta /login
      if request.method == "POST": #si el usuario mando un formulario
        username = request.json.get('username')
        password = request.json.get('password')

        res = iniciar_sesion(username, password) #verifica el usuario
        if res != None: #inicio de sesion exitoso
          session['user'] = res #almacena al usuario en la sesion 
          if res['rol'] == 'alumno':
            return jsonify({'role': 'alumno'})
          elif res['rol'] == 'profesor':
            return jsonify({'role': 'profesor'})
        else:
          return jsonify({'role': 'null'}) #de vuelta al inicio de sesion
  
  @app.route("/registrarse", methods=['GET', 'POST'])
  def registrarse():
    if request.method == 'POST':
      username = request.json.get('username')
      password = request.json.get('password')
      confirm_password = request.json.get('confirm_password')
      rol = request.json.get('tipo_rol')
      respuesta1 = request.json.get('respuesta1')
      respuesta2 = request.json.get('respuesta2')
      respuesta3 = request.json.get('respuesta3')
      foto_perfil = 'static/img/perfil.jpg'
      
      if password != confirm_password: #verifica que coincidan
        return jsonify({'error': 'Las contraseñas deben coincidir'})

      if usuario_existe(username):
        return jsonify({'registered': False}) #nombre de usuario ya existente
      else:
        registrar_usuario(username, password, rol, respuesta1, respuesta2, respuesta3, foto_perfil)
        return jsonify({'registered': True}) #registro exitoso
    else:
      return render_template('login/registrarse.html')
    
  @app.route("/reestablecer", methods=['GET', 'POST'])
  def reestablecer():
    if request.method == 'POST':
      username = request.json.get('username')
      respuesta1 = request.json.get('respuesta1')
      respuesta2 = request.json.get('respuesta2')
      respuesta3 = request.json.get('respuesta3')
      
      if reestablecer_usuario(username, respuesta1, respuesta2, respuesta3):
        session['temp_username']=username
        print(session['temp_username'])
        return jsonify({'respuesta': True})
      else:
        return jsonify({'respuesta': False})
    else:
      return render_template('login/reestablecer.html')
    
  @app.route("/reestablecer-2", methods=['GET', 'POST'])
  def reestablecer_2():
    print(session['temp_username'])
    if request.method == 'POST':
      password = request.json.get('password')
      confirm_password = request.json.get('confirm_password')
      if password != confirm_password:
        return jsonify({'error': 'Las contraseñas deben coincidir'})
      elif 'temp_username' in session:
        exito = cambiar_contrasena(password, session['temp_username'])
        if exito:
          session.pop('temp_username', None)
          return jsonify({'cambio_exitoso': True})
        else:
          return jsonify({'error': 'Error al cambiar la contraseña'})
      else:
        return jsonify({'error': 'Sesión no válida o expirada'})
    else:
      return render_template('login/reestablecer-2.html')

  @app.route("/interfaz_alumno")
  def interfaz_alumno():
    if 'user' not in session or session['user']['rol']!='alumno': # Asegura de que el usuario esté autenticado antes de mostrar la página de inicio
      return redirect(url_for('home'))
    return render_template("interfaz-a/inicio-a.html")
  
  @app.route("/interfaz_profesor", methods=['GET', 'POST'])
  def interfaz_profesor():
    if 'user' not in session or session['user']['rol']!='profesor': # Asegura de que el usuario esté autenticado antes de mostrar la página de inicio
      return redirect(url_for('home'))
    else:
      if request.method == 'POST':
        print(session['user']['id'])
        nombre_curso = request.form.get('nombre_curso')
        descripcion_curso = request.form.get('descripcion_curso')
        foto_curso = request.files['foto_curso']
        id_profesor = session['user']['id']

        if foto_curso:
                filename = secure_filename(foto_curso.filename) #sanitizar el nombre del archivo
                foto_ruta = os.path.join('static/img', filename)  # Construye la ruta del archivo 
                foto_curso.save(os.path.join('static/img', filename))
        carga_exitosa = cargar_curso(nombre_curso, descripcion_curso, foto_ruta, id_profesor)
        if carga_exitosa:
          return jsonify({'creacion_curso': True})
        else:
            return jsonify({'creacion_curso': False})
    return render_template("interfaz-p/inicio-p.html")
  
  @app.route("/configuracion", methods=['GET', 'POST'])
  def configuracion():
    if 'user' not in session:
      return redirect(url_for('home'))
    if request.method == 'POST':
      password = request.form.get('password')
      confirm_password = request.form.get('confirm_password')
      foto_perfil = request.files['foto_perfil']

      if foto_perfil:
        filename = secure_filename(foto_perfil.filename) #sanitizar el nombre del archivo
        foto_ruta = os.path.join('static/img', filename)  # Construye la ruta del archivo 
        foto_perfil.save(os.path.join('static/img', filename))

      if password != confirm_password:
        return jsonify({'error': 'Las contraseñas deben coincidir'})
      elif 'user' in session:
        if cambiar_informacion(password, session['user']['nombre_usuario'], foto_ruta):
          return jsonify({'cambio_exitoso': True})
        else:
          return jsonify({'error': 'Error al cambiar la contraseña'})
      else:
        return jsonify({'error': 'Sesión no válida o expirada'})
    else:
      user_data = {
        'username': session['user']['nombre_usuario'],
        'rol': session['user']['rol']
        }
      return render_template('interfaz-p/configuracion-p.html', user_data=user_data)
  
  @app.route('/logout')
  def logout():
     session.clear()
     return redirect(url_for('home'))
  