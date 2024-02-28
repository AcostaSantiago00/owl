-- Active: 1708908843027@@127.0.0.1@3306@owlbd
CREATE TABLE usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(30),
    pass VARCHAR(50),
    rol varchar(30),
    rta_1 VARCHAR(30),
    rta_2 VARCHAR(30),
    rta_3 VARCHAR(30)
);

CREATE TABLE curso(
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(30),
    descripcion_curso VARCHAR(200),
    foto_curso VARCHAR(255),
    id_profesor INT,
    CONSTRAINT fk_profesor
    FOREIGN KEY(id_profesor)
    REFERENCES usuario(id)
);

CREATE TABLE inscripcion(
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT,
    CONSTRAINT fk_alumno
    FOREIGN KEY(id_alumno)
    REFERENCES usuario(id),
    id_curso INT,
    CONSTRAINT fk_curso
    FOREIGN KEY(id_curso)
    REFERENCES curso(id_curso),
    nota_primer_p INT(2),
    nota_segundo_p INT(2),
    nota_recuperatorio INT(2),
    nota_final INT(2)
);

CREATE TABLE contenido(
    id_contenido INT AUTO_INCREMENT PRIMARY KEY,
    id_cur INT,
    CONSTRAINT id_curso_fk
    FOREIGN KEY(id_cur)
    REFERENCES curso(id_curso),
    contenido VARCHAR(100)
);