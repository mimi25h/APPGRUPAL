Objetivo:
Realizar aplicación Backend y Frontend para gestionar las entidades descritas en el diagrama sobre una base de datos en MongoDB.

La aplicación consta de 4 entidades:

- people
- users
- organizations
- modalities

La aplicación debe contar con un sistema de autenticación a través de usuario y contraseña para poder acceder a los métodos CRUD de las entidades mencionadas (ninguna debe ser de caracter público sin autenticación).

Gestionar la comunicación y control de autenticación entre Backend y Frontend con JWT.
Gestionar de forma responsable la custodia del JWT considerando la expiración del mismo.

Los usuarios poseen un atributo llamado role de valor numérico que corresponde a los siguientes valores:
1 - Administrador
2 - Visor

El usuario Administador debe ser el único que pueda llevar adelante las operaciones CRUD de todos los modelos.
El usuario Visor solo debe poder acceder a un listado de la entidad modalities.

El servidor backend tiene que ser quien controle por roles y no permitir llevar adelante operaciones que no correspondan con el rol del usuario que se encuentre autenticado (payload JWT).

Ejemplo de body para `POST /auth/bootstrap-admin`:

```json
{
  "person": {
    "document": "12345678",
    "name_01": "Maria",
    "surname_01": "Mar",
    "birth_date": "1990-01-01"
  },
  "username": "admiMaria",
  "password": "admin123",
  "email": "admin@gmail.com"
}
```

Las operaciones de CRUD deben ser cuidadas, validadas y parseadas en sus tipos de datos en caso de ser necesario.

Desde el contexto de Frontend sobre las operaciones CRUD debe validarse la información antes de ser enviada al servidor Backend más allá de que el mismo cuente con sus propios validadores (prevenir comunicación que se sepa con antelación que su destino sea un error).

Es importante que tengan en cuenta:
Estructuración de directorios y archivos del proyecto.
La misma debe intentar avisorar de la mejor forma posible la escalabilidad del mismo, intentar prevenir practicas DRY y basarse en modelos, convenciones y buenas prácticas para determinar las mejores opciones donde los escenarios puedan ser ambiguos.

Mantener identaciones cuidadas (no necesariamente estrictas) comentando en puntos de utilidad del código, que favorezcan la lectura del proyecto para ustedes, el resto del equipo y quienes puedan leerlo en comunidades abiertas el día de mañana.

Apoyarse en todos los conceptos vistos y manejados hasta el momento:
Backend (Sync, Async, Promesas, Callbacks, Awaits, HTTP Server, Express, Validators, Mongoose, JWT, Argon2, YAML, Dotenv).
Frontend (Componentes, Routers, Servicios, Pipes, Bindings, HTTPClients, JWT Helpers, RxJS|Signals, Interceptors, Guards, Local Storage, Path Alias).
