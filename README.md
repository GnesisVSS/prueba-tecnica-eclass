# Prueba tecnica eclass
Prueba tecnica enfocada en la creación de un microservicio con un mantenedor de usuarios.

Pasos a seguir para la ejecución del proyecto.

## Script de base de datos mysql

```
-- creacion de la base de datos control usuarios
CREATE DATABASE IF NOT EXISTS control_usuarios;

-- creación de la tabla usuarios en la base de datos control de usuarios
CREATE TABLE control_usuarios.usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') DEFAULT 'usuario',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- inserción de datos por defecto en la tabla usuarios
INSERT INTO control_usuarios.usuarios (nombre, apellido, email, contrasena, rol, estado) VALUES
    ('Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$hashedPassword1', 'usuario', 'activo'),
    ('María', 'González', 'maria.gonzalez@example.com', '$2b$10$hashedPassword2', 'admin', 'activo'),
    ('Carlos', 'López', 'carlos.lopez@example.com', '$2b$10$hashedPassword3', 'usuario', 'activo'),
    ('Laura', 'Martínez', 'laura.martinez@example.com', '$2b$10$hashedPassword4', 'usuario', 'inactivo'),
    ('Andrés', 'Fernández', 'andres.fernandez@example.com', '$2b$10$hashedPassword5', 'admin', 'activo');
```


## Archivo .env
  
> [!IMPORTANT]
> Este archivo <strong>debe ser cargado en la raíz de la carpeta backend</strong> para poder utilizar el JWT y a su vez debe modificarse con los datos de conexion propios a la base de datos para poder utilizar de manera correcta la aplicación.

```
HOST="localhost"
PORT=3306
DATABASE="control_usuarios"
USER="root"
PASSWORD="password"
JWT_SECRET="f45dea7ba1582ddc8e2bb06416c840547a143789d6c999671d31fb319b733a75790118274c47e67e6a9a99d896243a409a25a50bb087b3a40f8a828dfced11b4"
```

## Archivo API Postman
En este archivo se encuentran todos los endpoints correspondientes ademas de sus headers y querys. En el caso de estos últimos, se deben completar con el token obtenido en el caso del header y con el campo que se requiera para las querys. 

> [!IMPORTANT]
> En el caso del filtro dinamico, el resto de las querys están desactivadas, recordar activarlas de acuerdo a los filtros que se quieran aplicar.

```
{
   "info":{
      "name":"prueba-eclass",
      "schema":"https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
   },
   "item":[
      {
         "name":"Cambio Contraseña",
         "request":{
            "method":"POST",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "body":{
               "mode":"raw",
               "raw":"{\r\n  \"contrasenaNueva\": \"string\",\r\n  \"contrasenaConfirmacion\": \"string\"\r\n}",
               "options":{
                  "raw":{
                     "language":"json"
                  }
               }
            },
            "url":{
               "raw":"http://localhost:3000/user/updatePassword?email=",
               "protocol":"http",
               "host":[
                  "localhost"
               ],
               "port":"3000",
               "path":[
                  "user",
                  "updatePassword"
               ],
               "query":[
                  {
                     "key":"email",
                     "value":""
                  }
               ]
            }
         },
         "response":[
            
         ]
      },
      {
         "name":"Modificar",
         "request":{
            "method":"PATCH",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "body":{
               "mode":"raw",
               "raw":"{\r\n    \"nombre\":\"string\",\r\n    \"apellido\":\"string\",\r\n    \"email\":\"string\",\r\n    \"rol\":\"enum (admin, usuario)\",\r\n    \"estado\":\"enum (activo, inactivo)\"\r\n}",
               "options":{
                  "raw":{
                     "language":"json"
                  }
               }
            },
            "url":{
               "raw":"http://localhost:3000/user/?email=string",
               "protocol":"http",
               "host":[
                  "localhost"
               ],
               "port":"3000",
               "path":[
                  "user",
                  ""
               ],
               "query":[
                  {
                     "key":"email",
                     "value":"string"
                  }
               ]
            }
         },
         "response":[
            
         ]
      },
      {
         "name":"Informacion de usario",
         "request":{
            "method":"GET",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "url":{
               "raw":"http://localhost:3000/user/user-info?email=string",
               "protocol":"http",
               "host":[
                  "localhost"
               ],
               "port":"3000",
               "path":[
                  "user",
                  "user-info"
               ],
               "query":[
                  {
                     "key":"email",
                     "value":"string"
                  }
               ]
            }
         },
         "response":[
            
         ]
      },
      {
         "name":"Perfil",
         "request":{
            "method":"GET",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "url":"http://localhost:3000/user/profile"
         },
         "response":[
            
         ]
      },
      {
         "name":"Eliminar",
         "request":{
            "method":"DELETE",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "url":{
               "raw":"http://localhost:3000/user/?email=string",
               "protocol":"http",
               "host":[
                  "localhost"
               ],
               "port":"3000",
               "path":[
                  "user",
                  ""
               ],
               "query":[
                  {
                     "key":"email",
                     "value":"string"
                  }
               ]
            }
         },
         "response":[
            
         ]
      },
      {
         "name":"Listar",
         "protocolProfileBehavior":{
            "disableBodyPruning":true
         },
         "request":{
            "method":"GET",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "body":{
               "mode":"raw",
               "raw":"{\r\n  \"email\":\"string\",\r\n  \"password\":\"string\"\r\n}",
               "options":{
                  "raw":{
                     "language":"json"
                  }
               }
            },
            "url":"http://localhost:3000/user/"
         },
         "response":[
            
         ]
      },
      {
         "name":"Login",
         "request":{
            "method":"POST",
            "header":[
               
            ],
            "body":{
               "mode":"raw",
               "raw":"{\r\n  \"email\":\"string\",\r\n  \"contrasena\":\"string\"\r\n}",
               "options":{
                  "raw":{
                     "language":"json"
                  }
               }
            },
            "url":"http://localhost:3000/user/login"
         },
         "response":[
            
         ]
      },
      {
         "name":"Filtro",
         "request":{
            "method":"GET",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "url":{
               "raw":"http://localhost:3000/user/search?nombre=string",
               "protocol":"http",
               "host":[
                  "localhost"
               ],
               "port":"3000",
               "path":[
                  "user",
                  "search"
               ],
               "query":[
                  {
                     "key":"nombre",
                     "value":"string"
                  },
                  {
                     "key":"apellido",
                     "value":"string",
                     "disabled":true
                  },
                  {
                     "key":"email",
                     "value":"string",
                     "disabled":true
                  },
                  {
                     "key":"rol",
                     "value":"string",
                     "disabled":true
                  },
                  {
                     "key":"estado",
                     "value":"string",
                     "disabled":true
                  }
               ]
            }
         },
         "response":[
            
         ]
      },
      {
         "name":"Registro",
         "request":{
            "method":"POST",
            "header":[
               {
                  "key":"Authorization",
                  "value":"Bearer <token>",
                  "type":"text"
               }
            ],
            "body":{
               "mode":"raw",
               "raw":"{\r\n  \"nombre\":\"string\",\r\n  \"apellido\":\"string\",\r\n  \"email\":\"string\",\r\n  \"contrasena\":\"string\"\r\n}",
               "options":{
                  "raw":{
                     "language":"json"
                  }
               }
            },
            "url":"http://localhost:3000/user/registro"
         },
         "response":[
            
         ]
      }
   ]
}
```
