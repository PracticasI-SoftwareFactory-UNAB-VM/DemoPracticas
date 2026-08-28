# Demo: React + FastAPI + MySQL con Docker

Proyecto de ejemplo para mostrar un stack full-stack containerizado, pensado para clase. Cada componente corre en su propio contenedor Docker y se orquestan con Docker Compose.

## Stack

- **Frontend**: React (servido con Nginx en producción)
- **Backend**: FastAPI (Python) + SQLAlchemy
- **Base de datos**: MySQL 8 (todo lo relacionado vive en [`database/`](database/))

La app es un **gestor de historias de usuario** (crear, listar, marcar como implementada y eliminar) para demostrar la comunicación entre las tres capas, usando el formato ágil estándar:

- **Como** (rol) / **Quiero** (necesidad) / **Para qué** (beneficio)
- **Criterios de aceptación** (lista)
- **Priorización MoSCoW**: Must / Should / Could / Won't

## Estructura

```
.
├── docker-compose.yml
├── backend/          # API FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── frontend/         # SPA en React
│   ├── Dockerfile
│   ├── package.json
│   ├── nginx/
│   └── src/
└── database/         # Todo lo relacionado a la base de datos
    └── init.sql      # Esquema, se ejecuta al crear el contenedor de MySQL
```

## Cómo correr la demo

Requisitos: Docker y Docker Compose instalados.

```bash
docker compose up --build
```

Esto construye y levanta 3 contenedores:

| Servicio | URL                          | Descripción                        |
|----------|------------------------------|-------------------------------------|
| frontend | http://localhost:3000        | Interfaz React                      |
| backend  | http://localhost:8001/docs   | Documentación interactiva (Swagger) |
| db       | localhost:3307                | MySQL (usuario: `demo_user`)        |

> Si alguno de estos puertos ya está en uso en tu equipo, cámbialo en `docker-compose.yml` (y en `REACT_APP_API_URL` si tocas el del backend).

Para detener todo:

```bash
docker compose down
```

Para borrar también los datos persistidos de MySQL:

```bash
docker compose down -v
```

## Notas para la clase

- El esquema de la base de datos vive en [`database/init.sql`](database/init.sql) y MySQL lo ejecuta solo al crear el contenedor por primera vez. El backend también espera a que MySQL esté listo (`wait_for_db`) y verifica las tablas con SQLAlchemy al arrancar — no hace falta ejecutar migraciones a mano.
- El frontend se compila en un contenedor Node y se sirve como archivos estáticos con Nginx, mostrando un build multi-stage típico de producción.
- La URL de la API se inyecta en tiempo de build vía la variable `REACT_APP_API_URL` (ver `docker-compose.yml`).
- Las credenciales están hardcodeadas en `docker-compose.yml` solo para fines didácticos; en un proyecto real irían en variables de entorno/secretos.
# DemoPracticas
