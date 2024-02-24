import os #proporciona una forma portatil de utilizar funcionalidades dependientes del sistema operativo
from flask import Flask, render_template, request, redirect, session, flash, url_for
"""
render_template: para renderizar plantillas HTML
request: obtener datos de las solicitudes HTTP
redirect: redirigir el usuario a otra ruta
session: manejar sesiones de usuario
flash: mostrar mensajes temporales al usuario
url_for: generar URLs para una funcion especifica
"""
from _mysql_db import IniciarSeccion #importa funcion del modulo personalizado
from werkzeug.utils import secure_filename #para asegurar un nombre de arch que no afecte al sistema de archivos del servidor
error="" #donde se almacenara mensajes de error

def route(app): #toma objeto de app flask como argumento
  @app.route("/", methods=["GET"])
  def home(): #sera llamada cuando se acceda a la ruta raiz
      return render_template("login/login.html") #renderiza y devuelve plantilla HTML

  @app.route("/login", methods=["GET", "POST"]) 
  def login(): #sera llamada cuando se acceda a la ruta /login
      if request.method == "POST": #si el usuario mando un formulario
        emaill = request.form.get('emaill')
        passl = request.form.get('passl')

        user = IniciarSeccion(emaill, passl) #verifica el usuario
        if user != -1: #inicio de sesion exitoso
          session['user'] = user #almacena al usuario en la sesion 
          if user[5] == 'alumno':
            return redirect(url_for('interfaz_alumno'))
          elif user[5] == 'profesor':
            return redirect(url_for('interfaz_profesor'))
        else:
          return redirect(url_for('home')) #de vuelta al inicio de sesion
  
  @app.route('/reestablecer')
  def reestablecer():
    return render_template('login/reestablecer.html')
  
  @app.route('/registrarse')
  def registrarse():
    return render_template('login/registrarse.html')

#hasta aca.
  @app.route("/interfaz_alumno")
  def interfaz_alumno():
    if 'user' not in session: # Asegura de que el usuario esté autenticado antes de mostrar la página de inicio
      return redirect(url_for('home'))
    return render_template("interfaz-a/inicio-a.html")
  
  @app.route("/interfaz_profesor")
  def interfaz_profesor():
    if 'user' not in session: # Asegura de que el usuario esté autenticado antes de mostrar la página de inicio
      return redirect(url_for('home'))
    return render_template("interfaz-p/inicio-p.html")
  
  @app.route('/logout')
  def logout():
     session.clear()
     return redirect(url_for('home'))