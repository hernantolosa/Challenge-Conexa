# Introduction 

La api de peliculas permite al administrador, crear editar y borrar peliculas y al usuario regular ver detalle y listar las peliculas que hay disponibles

# Seteando el proyecto

Antes de empezar es importante autorizar via MongoDB la ip que va a consumir el cluster
En el .env se encunetra la mongodb uri
Inicializamos el proyecto ejecutando npm run start:dev

Podemos incluso darle play al debugger ya que adjuntamos el script para debugear la aplicacion en caso de ser necesario

# Tests
Los tests se encuentran en la carpeta test y pueden ejecutarse via npm test

# Guia
Para ejecutar un endpoint sera de la siguiente manera

Primer paso: ejecutar en postman: 
via POST la url: localhost:3000/api/auth/register y con el body: 

```json
{
    "username": "conexatest3",
    "email": "conex3a@gmail.com",
    "password": "password"
} 
```

Esto registrara un usuario

Segundo paso: Ejecutamos via POST la url: localhost:3000/api/auth/login

```json
{
    "username": "conexatest",
    "password": "password"
} 
```

enviando el body que registramos, esto respondera con un objeto de la siguiente manera:

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNvbmV4YXRlc3QiLCJzdWIiOiI2NTIwNzRjY2NlMTY2MzU0MzAwYmYyNjIiLCJyb2xlIjoiUmVndWxhciBVc2VyIiwiaWF0IjoxNjk2NjI1OTE2LCJleHAiOjE2OTY2Mjk1MTZ9.vaDr-QIVIfXQszKhqgTvrGrLemlXzEGSU7bWOGOXl5A"
}
```
Luego con ese token, lo utilizamos para los servicios descriptos en el challenge: (Usar como Bearer Token)

Para lo que es administrador, creamos al inicializarl la app un admin default que lo usaremos para las pruebas de la app:
```json
{
    "username": "admin",
    "password": "passwordAdmin"
} 
```
nos dara el token de admin y podremos probar los otros endpoints de creacion edicion y borrar peliculas.

Se adjunta carpeta para hacer ejecuciones via postman

# Librerias usadas

Bycript
Passport
jwt
mongoose
typeorm
dotenv
class-validator

# Informacion del proyecto

Se utilizo la arquitectura de modularizacion que propone nestjs aislando en tres carpetas por auth, movies y users. En auth implementa todo lo relacionado con autorizacion, jwt, passport. decorador para roles que luego sera utilizado para proteger las rutas segun el rol. Se utilizo ademas excecpiones custom y el filter de exceptions globales que provee NestJS, todos los errores fueron handleados respondiendo con la siguiente estructura
para el uso que sea necesario

Ejemplo: 
```json
{
    "statusCode": 401,
    "timestamp": "2023-10-07T16:35:38.020Z",
    "path": "/api/auth/login",
    "message": {
        "message": "Unauthorized",
        "statusCode": 401
    }
}
```
Un campo statusCode, timestamp, path y el message con la descripcion del error.

En la carpeta movies contiene toda la logica asociada al crud de peliculas y en users la logica de negocio relacionada, tambien se crearon dtos para utilizar con request y response, schemas para validar bodys.

El proyecto a su vez cuenta con ESLint para mantener un codigo limpio en cuanto a espacios.