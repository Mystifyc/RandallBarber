# Randall Barber

Sistema web para la gestión de una barbería desarrollado con Spring Boot (backend) y React con TypeScript (frontend).

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Características](#características)
3. [Tecnologías](#tecnologías)
4. [Instalación y ejecución](#instalación-y-ejecución)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Base de datos](#base-de-datos)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Recursos útiles](#recursos-útiles)
9. [Autor](#autor)

---

## Descripción

Aplicación web que permite administrar los barberos de una barbería mediante una arquitectura cliente-servidor. El backend expone una API REST construida con Spring Boot y Spring Data JPA, mientras que el frontend desarrollado en React muestra secciones de servicios, equipo, agenda y contacto. La base de datos H2 se inicializa automáticamente con datos de prueba al arrancar el servidor.

El proyecto fue desarrollado como ejercicio académico para practicar la integración entre un backend en Java y un frontend en TypeScript con Vite.

---

## Características

- CRUD completo de barberos (crear, leer, actualizar, eliminar)
- Consulta de barberos activos
- API REST con Spring Boot y Spring Data JPA
- Base de datos H2 en memoria con datos de prueba precargados
- Consola H2 habilitada para inspección de datos
- Interfaz de usuario con React y TypeScript
- CORS configurado para desarrollo local

---

## Tecnologías

### Backend

- Java 21+
- Spring Boot 3.5.11
- Spring Data JPA
- Spring Boot Validation
- H2 Database
- Lombok

### Frontend

- React 18.2.0
- TypeScript 5.2.2
- Vite 5.2.0
- Node.js v22.16.0

---

## Instalación y ejecución

### Requisitos previos

- Java 21 o superior
- Node.js v22.16.0 o superior
- npm

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

El servidor arrancará en `http://localhost:8080`.

En Windows usar `mvnw.cmd spring-boot:run`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Endpoints de la API

Base URL: `http://localhost:8080/api/barberos`

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/barberos` | Listar todos los barberos |
| GET | `/api/barberos/activos` | Listar barberos activos |
| GET | `/api/barberos/{id}` | Buscar barbero por ID |
| POST | `/api/barberos` | Crear un nuevo barbero |
| PUT | `/api/barberos/{id}` | Actualizar un barbero existente |
| DELETE | `/api/barberos/{id}` | Eliminar un barbero |

### Ejemplo de cuerpo (JSON)

```json
{
  "nombre": "Randall",
  "especialidad": "Fade",
  "telefono": "3001112233",
  "activo": true
}
```

---

## Base de datos

El proyecto utiliza H2 Database en memoria. La base de datos se crea desde cero al iniciar la aplicación y se puebla automáticamente con el archivo `data.sql`.

### Datos de prueba precargados

| Nombre | Especialidad | Telefono | Activo |
|---|---|---|---|
| Randall | Fade | 3001112233 | true |
| Kevin | Barba | 3001112244 | true |
| Santiago | Corte clasico | 3001112255 | false |

### Consola H2

Accesible en `http://localhost:8080/h2-console`.

- JDBC URL: `jdbc:h2:mem:randallbarber`
- User: `sa`
- Password: `123`

---

## Estructura del proyecto

```
RandallBarber/
├── backend/
│   ├── src/main/java/com/randalbarber/backend/
│   │   ├── BackendApplication.java
│   │   ├── controller/
│   │   │   └── BarberoController.java
│   │   ├── service/
│   │   │   ├── BarberoService.java
│   │   │   └── BarberoServiceImpl.java
│   │   ├── repository/
│   │   │   └── BarberoRepository.java
│   │   └── entity/
│   │       └── Barbero.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── pom.xml
└── Frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── index.html
    ├── vite.config.ts
    └── package.json
```

---

## Recursos utiles

- [Documentacion oficial de Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Documentacion de Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Consola H2](https://www.h2database.com/html/main.html)
- [Documentacion de React](https://react.dev/)
- [Documentacion de Vite](https://vitejs.dev/)
- [Documentacion de TypeScript](https://www.typescriptlang.org/docs/)

---

## Autor

Desarrollado por [Mystifyc](https://github.com/Mystifyc) como proyecto educativo.
