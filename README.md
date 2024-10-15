# Prueba tecnica eclass
Prueba tecnica enfocada en la creación de un microservicio con un mantenedor de usuarios.

Pasos a seguir para la ejecución del proyecto.

## Script de base de datos mysql

> [!NOTE]
> La base de datos se encuentra en rds, sin embargo esta fue la que se usó para la ejecución de pruebas locales y como base para la inserción de datos en aws.

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
    ('Andrés', 'Fernández', 'andres.fernandez@example.com', '$2b$10$hashedPassword5', 'admin', 'activo'),
    ('Admin', 'Admin', 'admin@gmail.com', '$2b$10$YSAUKprD7e.aZSwmqN.Gq.iHDo.rJSpw8uw1Zq41jf2.S.m79I5Km', 'admin', 'activo');
```

## Archivo API Postman
En este archivo se encuentran todos los endpoints correspondientes ademas de sus headers y querys. En el caso de estos últimos, se deben completar con el token obtenido en el caso del header y con el campo que se requiera para las querys. 

> [!IMPORTANT]
> Las credenciales de prueba para el login son:
> <li>Email: admin@gmail.com</li>
> <li>Contrasena: admin</li>

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
               "raw":"https://pruebaeclass.netlify.app/user/updatePassword?email=",
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
               "raw":"https://pruebaeclass.netlify.app/user/?email=string",
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
               "raw":"https://pruebaeclass.netlify.app/user/user-info?email=string",
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
            "url":"https://pruebaeclass.netlify.app/user/profile"
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
               "raw":"https://pruebaeclass.netlify.app/user/?email=string",
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
            "url":"https://pruebaeclass.netlify.app/user/"
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
            "url":"https://pruebaeclass.netlify.app/user/login"
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
               "raw":"https://pruebaeclass.netlify.app/user/search?nombre=string",
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
            "url":"https://pruebaeclass.netlify.app/user/registro"
         },
         "response":[
            
         ]
      }
   ]
}
```
