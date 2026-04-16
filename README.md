# RandallBarber

Sistema web para la gestión de una barbería, desarrollado con **Spring Boot** en el backend y **React + TypeScript + Vite** en el frontend.

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Objetivo del proyecto](#objetivo-del-proyecto)
3. [Características principales](#características-principales)
4. [Roles del sistema](#roles-del-sistema)
5. [Tecnologías utilizadas](#tecnologías-utilizadas)
6. [Arquitectura del proyecto](#arquitectura-del-proyecto)
7. [Estructura del proyecto](#estructura-del-proyecto)
8. [Instalación y ejecución](#instalación-y-ejecución)
9. [Configuración de la base de datos](#configuración-de-la-base-de-datos)
10. [Autenticación](#autenticación)
11. [Módulos implementados](#módulos-implementados)
12. [Endpoints principales](#endpoints-principales)
13. [Flujo general del sistema](#flujo-general-del-sistema)
14. [Estado actual del proyecto](#estado-actual-del-proyecto)
15. [Posibles mejoras futuras](#posibles-mejoras-futuras)
16. [Autores](#autores)

---

## Descripción

**RandallBarber** es una aplicación web orientada a la administración de una barbería.  
El sistema fue construido como un proyecto académico con el objetivo de integrar un **backend robusto en Spring Boot** con un **frontend moderno en React + TypeScript**, aplicando conceptos de arquitectura por capas, consumo de APIs REST, manejo de estados, persistencia de datos y diseño visual de una landing page funcional.

La aplicación permite gestionar la información esencial de una barbería, incluyendo:

- barberos
- clientes
- servicios
- citas
- autenticación por roles
- visualización de agenda
- panel administrativo
- panel del barbero
- reserva de citas desde la landing page

El sistema está diseñado para simular el flujo básico de un negocio real: un cliente se registra, inicia sesión, agenda una cita, el administrador supervisa la operación general y el barbero puede consultar sus citas y su jornada de trabajo.

---

## Objetivo del proyecto

El objetivo principal de **RandallBarber** es representar digitalmente el funcionamiento de una barbería mediante una aplicación web full stack, permitiendo poner en práctica conocimientos de desarrollo backend, frontend, conexión entre capas, persistencia de datos y organización modular del código.

De manera más específica, el proyecto busca:

- administrar la información básica del negocio
- registrar clientes dentro del sistema
- permitir inicio de sesión por rol
- gestionar reservas y citas
- organizar la agenda de los barberos
- mostrar servicios y personal disponible desde una landing page atractiva
- demostrar la integración real entre frontend y backend
- aplicar una arquitectura escalable para futuras mejoras

---

## Características principales

El proyecto cuenta actualmente con las siguientes características funcionales:

- Landing page con:
  - hero principal
  - sección de servicios
  - sección de barberos
  - agenda
  - contacto

- Sistema de autenticación con roles:
  - administrador
  - barbero
  - cliente

- Registro real de clientes desde frontend hacia backend

- Login conectado al backend

- CRUD de citas desde el panel de administrador

- Consulta de horas disponibles por barbero y fecha

- Prevención de conflicto de horarios al crear o actualizar citas

- Restricción para evitar reservas los domingos

- Panel del barbero con:
  - citas del día
  - próxima cita
  - estado de disponibilidad
  - resumen rápido
  - vista de perfil

- Panel del administrador con:
  - resumen general
  - gestión de citas
  - visualización de clientes
  - visualización de barberos
  - visualización de servicios

- Datos iniciales cargados desde `data.sql`

- Persistencia temporal con base de datos en memoria H2

- Consumo de API REST mediante Axios

- Manejo de sesión con Context API y `localStorage`

- Interfaz visual con CSS puro

---

## Roles del sistema

El sistema maneja tres roles principales: **Administrador**, **Barbero** y **Cliente**.  
Cada rol tiene una finalidad distinta dentro del flujo de negocio.

### 1. Administrador

El administrador representa el rol encargado del control general del sistema.  
Desde este perfil se supervisan las citas y se visualiza la información del negocio.

Puede:

- iniciar sesión como administrador
- visualizar el panel administrativo
- consultar clientes
- consultar barberos
- consultar servicios
- ver el listado de citas
- crear nuevas citas
- editar citas existentes
- eliminar citas

### 2. Barbero

El rol de barbero permite acceder a una vista personalizada enfocada en la operación diaria del profesional.

Puede:

- iniciar sesión como barbero
- visualizar su panel de trabajo
- revisar sus citas del día
- consultar su próxima cita
- ver su estado de disponibilidad
- revisar un resumen rápido de su jornada
- visualizar una sección de perfil

### 3. Cliente

El cliente es el usuario final del sistema.  
Puede registrarse y reservar citas desde la landing page.

Puede:

- registrarse en la plataforma
- iniciar sesión como cliente
- reservar citas desde el formulario de agenda
- seleccionar servicio, barbero, fecha y hora
- asociar la reserva a su cuenta real dentro del sistema

---

## Tecnologías utilizadas

El proyecto está dividido en dos grandes partes: backend y frontend.

### Backend

Tecnologías y dependencias utilizadas:

- **Java 21**
- **Spring Boot 3.5.11**
- **Spring Web**
- **Spring Data JPA**
- **Spring Validation**
- **Hibernate**
- **H2 Database**
- **Maven**
- **Lombok**

Estas herramientas permiten desarrollar la API REST, conectar con la base de datos, mapear entidades, validar información y organizar la lógica del sistema.

### Frontend

Tecnologías y herramientas del cliente web:

- **React 18**
- **TypeScript**
- **Vite 5**
- **Axios**
- **CSS puro**

Estas tecnologías se encargan de la interfaz, el consumo del backend, el control de estado de sesión y la construcción visual del sitio.

### Herramientas de desarrollo

Durante el desarrollo del proyecto se emplearon:

- **Visual Studio Code**
- **Git / GitHub**
- **H2 Console**
- **PowerShell / terminal**
- **Navegador web para pruebas**

---

## Arquitectura del proyecto

El sistema sigue una **arquitectura por capas** tanto en backend como en frontend, separando responsabilidades para facilitar el mantenimiento y la escalabilidad del proyecto.

### Arquitectura del backend

El backend se organiza principalmente en las siguientes capas:

#### Controller
Recibe las peticiones HTTP provenientes del frontend y devuelve respuestas al cliente.  
Aquí se definen los endpoints REST del sistema.

Controladores existentes:

- `AdministradorController`
- `AuthController`
- `BarberoController`
- `CitaController`
- `ClienteController`
- `ServicioController`

#### DAO
Contiene la lógica de acceso y parte de la lógica del negocio.  
Esta capa intermedia permite encapsular operaciones como guardar, actualizar, listar y validar datos del sistema.

DAOs existentes:

- `AdministradorDao` / `AdministradorDaoImp`
- `BarberoDao` / `BarberoDaoImpl`
- `CitaDao` / `CitaDaoImp`
- `ClienteDao` / `ClienteDaoImp`
- `ServicioDao` / `ServicioDaoImp`

#### Repository
Permite la comunicación con la base de datos mediante Spring Data JPA.  
Aquí se aprovechan métodos derivados y consultas automáticas sobre las entidades.

Repositorios existentes:

- `AdministradorRepository`
- `BarberoRepository`
- `CitaRepository`
- `ClienteRepository`
- `ServicioRepository`

#### Entity
Representa las tablas del sistema en forma de clases Java.

Entidades existentes:

- `Usuario`
- `Administrador`
- `Barbero`
- `Cliente`
- `Servicio`
- `Cita`

#### DTO
Se utilizan para encapsular datos en procesos específicos como login y registro.

DTOs existentes:

- `LoginRequest`
- `LoginResponse`
- `RegisterClienteRequest`

### Arquitectura del frontend

El frontend también está organizado por responsabilidades:

#### `api`
Contiene los servicios para consumir el backend mediante Axios.

Archivos:

- `axios.ts`
- `authApi.ts`
- `barberosApi.ts`
- `citasApi.ts`
- `clientesApi.ts`
- `serviciosApi.ts`

#### `components`
Aquí se encuentran los componentes visuales reutilizables y las pantallas funcionales del sistema.

#### `components/auth`
Contiene la lógica visual para autenticación.

#### `components/dashboard`
Contiene los paneles del administrador y del barbero.

#### `context`
Maneja el contexto global de autenticación y sesión.

#### `types`
Define las interfaces TypeScript del frontend.

#### `assets`
Contiene imágenes y recursos visuales utilizados en la landing page.

---

## Estructura del proyecto

```bash
RandallBarber/
├── backend/
│   ├── .mvn/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/randalbarber/backend/
│       │   │   ├── BackendApplication.java
│       │   │   ├── controller/
│       │   │   │   ├── AdministradorController.java
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── BarberoController.java
│       │   │   │   ├── CitaController.java
│       │   │   │   ├── ClienteController.java
│       │   │   │   ├── ServicioController.java
│       │   │   │   └── dto/
│       │   │   │       ├── LoginRequest.java
│       │   │   │       ├── LoginResponse.java
│       │   │   │       └── RegisterClienteRequest.java
│       │   │   ├── model/
│       │   │   │   ├── dao/
│       │   │   │   │   ├── AdministradorDao.java
│       │   │   │   │   ├── AdministradorDaoImp.java
│       │   │   │   │   ├── BarberoDao.java
│       │   │   │   │   ├── BarberoDaoImpl.java
│       │   │   │   │   ├── CitaDao.java
│       │   │   │   │   ├── CitaDaoImp.java
│       │   │   │   │   ├── ClienteDao.java
│       │   │   │   │   ├── ClienteDaoImp.java
│       │   │   │   │   ├── ServicioDao.java
│       │   │   │   │   └── ServicioDaoImp.java
│       │   │   │   └── entity/
│       │   │   │       ├── Usuario.java
│       │   │   │       ├── Administrador.java
│       │   │   │       ├── Barbero.java
│       │   │   │       ├── Cliente.java
│       │   │   │       ├── Servicio.java
│       │   │   │       └── Cita.java
│       │   │   └── repository/
│       │   │       ├── AdministradorRepository.java
│       │   │       ├── BarberoRepository.java
│       │   │       ├── CitaRepository.java
│       │   │       ├── ClienteRepository.java
│       │   │       └── ServicioRepository.java
│       │   └── resources/
│       │       ├── application.properties
│       │       └── data.sql
│       └── test/
│           └── java/com/randalbarber/backend/
│               └── BackendApplicationTests.java
│
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── App.css
        ├── index.css
        ├── main.tsx
        ├── vite-env.d.ts
        ├── api/
        │   ├── axios.ts
        │   ├── authApi.ts
        │   ├── barberosApi.ts
        │   ├── citasApi.ts
        │   ├── clientesApi.ts
        │   └── serviciosApi.ts
        ├── assets/
        │   ├── hero-barber.png
        │   ├── barbero-juan.png
        │   ├── barbero-carlos.png
        │   ├── barbero-mateo.png
        │   ├── servicio-corte.jpg
        │   ├── servicio-fade.jpg
        │   ├── servicio-barba.jpg
        │   ├── servicio-combo.png
        │   └── react.svg
        ├── components/
        │   ├── AgendaForm.tsx
        │   ├── AgendaForm.css
        │   ├── auth/
        │   │   ├── LoginModal.tsx
        │   │   └── LoginModal.css
        │   └── dashboard/
        │       ├── AdminPanel.tsx
        │       ├── BarberPanel.tsx
        │       ├── DashboardLayout.tsx
        │       └── DashboardLayout.css
        ├── context/
        │   └── Authcontext.tsx
        └── types/
            ├── Usuario.ts
            └── Barbero.ts
```

### Explicación general de la estructura

- **backend**: contiene toda la lógica del servidor, la API, las entidades y la base de datos.
- **Frontend**: contiene la aplicación del cliente, la interfaz, el contexto de autenticación y la comunicación con el backend.
- **resources/data.sql**: precarga datos de prueba al arrancar la aplicación.
- **application.properties**: define el puerto, H2, consola H2 y configuración JPA.

---

## Instalación y ejecución

### Requisitos previos

Antes de ejecutar el proyecto, se recomienda tener instalado:

- Java 21
- Node.js
- npm
- Maven, o usar el wrapper incluido en el backend

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd RandallBarber
```

### 2. Ejecutar el backend

Entrar a la carpeta del backend:

```bash
cd backend
```

En Windows con Maven Wrapper:

```bash
.\mvnw.cmd spring-boot:run
```

O si Maven está instalado globalmente:

```bash
mvn spring-boot:run
```

El backend se ejecutará en:

```bash
http://localhost:8081
```

### 3. Ejecutar el frontend

Abrir otra terminal y entrar a la carpeta del frontend:

```bash
cd Frontend
npm install
npm run dev
```

El frontend normalmente estará disponible en:

```bash
http://localhost:5173
```

### 4. Flujo recomendado de arranque

Para que el proyecto funcione correctamente:

1. primero se levanta el backend
2. luego se levanta el frontend
3. después se accede desde el navegador a `http://localhost:5173`

---

## Configuración de la base de datos

El proyecto usa **H2 Database en memoria**, lo cual facilita pruebas rápidas sin necesidad de instalar un motor externo como MySQL o PostgreSQL.

### Configuración encontrada en `application.properties`

```properties
spring.application.name=backend
server.port=8081

spring.datasource.url=jdbc:h2:mem:randallbarber
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=123

spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.show-sql=true
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.jpa.properties.hibernate.format_sql=true

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### Consola H2

Con el backend encendido, se puede ingresar a la consola en:

```bash
http://localhost:8081/h2-console
```

Usando:

- **JDBC URL:** `jdbc:h2:mem:randallbarber`
- **User Name:** `sa`
- **Password:** `123`

### Comportamiento actual de la base

La configuración actual usa:

```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

Esto implica que:

- las tablas se crean al iniciar la aplicación
- los datos se cargan automáticamente desde `data.sql`
- al detener el backend, la base se destruye porque está en memoria

### Datos iniciales cargados

El archivo `data.sql` inserta:

- clientes
- barberos
- administradores
- servicios
- citas

Esto permite probar el sistema sin necesidad de crear todo manualmente desde cero.

---

## Autenticación

La autenticación del proyecto es funcional pero básica, pensada para fines académicos y demostrativos.

### Flujo de autenticación

El sistema maneja login desde el endpoint:

```http
POST /api/auth/login
```

El usuario debe enviar:

- correo
- password
- rol

El backend valida el rol recibido y consulta en la tabla correspondiente:

- `ADMIN` → `AdministradorRepository`
- `BARBERO` → `BarberoRepository`
- `CLIENTE` → `ClienteRepository`

Si las credenciales coinciden, retorna un objeto con:

- id
- nombre
- correo
- rol

### Registro de cliente

También existe un endpoint para registrar clientes:

```http
POST /api/auth/register/cliente
```

El backend valida que:

- ningún campo venga vacío
- el correo no exista previamente en clientes, barberos o administradores

Si todo es correcto, crea el cliente y devuelve la sesión lista para usar.

### Manejo de sesión en frontend

En el frontend, el contexto `Authcontext.tsx` se encarga de:

- iniciar sesión
- registrar clientes
- mantener el usuario autenticado
- guardar la sesión en `localStorage`
- restaurar la sesión cuando se recarga la página
- cerrar sesión

### Limitaciones actuales

La autenticación actual:

- no usa JWT
- no usa Spring Security
- no cifra contraseñas
- no protege rutas de forma avanzada
- no maneja refresh tokens
- no implementa autorización real por middleware

Aun así, cumple correctamente su propósito académico y funcional dentro del proyecto.

---

## Módulos implementados

El proyecto se encuentra dividido en módulos funcionales que responden tanto al backend como al frontend.

### 1. Módulo de autenticación

Encargado de:

- login por rol
- registro de clientes
- validación de credenciales
- control de sesión en frontend

Archivos principales:

- `AuthController.java`
- `LoginRequest.java`
- `LoginResponse.java`
- `RegisterClienteRequest.java`
- `authApi.ts`
- `Authcontext.tsx`
- `LoginModal.tsx`

### 2. Módulo de barberos

Gestiona la información relacionada con los barberos y permite listarlos, consultarlos y administrarlos.

Funciones implementadas:

- listar todos
- listar activos
- buscar por id
- crear
- actualizar
- eliminar

Archivos principales:

- `BarberoController.java`
- `BarberoDao.java`
- `BarberoDaoImpl.java`
- `BarberoRepository.java`
- `Barbero.java`
- `barberosApi.ts`

### 3. Módulo de clientes

Gestiona la información de los clientes registrados.

Funciones implementadas:

- listar clientes
- buscar por id
- crear
- actualizar
- eliminar

Archivos principales:

- `ClienteController.java`
- `ClienteDao.java`
- `ClienteDaoImp.java`
- `ClienteRepository.java`
- `Cliente.java`
- `clientesApi.ts`

### 4. Módulo de servicios

Gestiona los servicios ofrecidos por la barbería.

Funciones implementadas:

- listar servicios
- buscar por id
- crear
- actualizar
- eliminar

Archivos principales:

- `ServicioController.java`
- `ServicioDao.java`
- `ServicioDaoImp.java`
- `ServicioRepository.java`
- `Servicio.java`
- `serviciosApi.ts`

### 5. Módulo de citas

Es uno de los módulos principales del sistema.  
Permite registrar y gestionar las citas entre clientes, barberos y servicios.

Funciones implementadas:

- listar citas
- crear cita
- actualizar cita
- eliminar cita
- consultar horas disponibles por barbero y fecha
- evitar conflictos de horario por barbero, fecha y hora

Reglas de negocio implementadas en la capa DAO:

- no se puede guardar una cita con datos incompletos
- cliente, barbero y servicio deben existir
- no se puede crear una cita si el barbero ya tiene una en esa misma fecha y hora
- al actualizar una cita, se vuelve a validar que no exista choque de horario
- se calcula una lista de horas disponibles entre las 9:00 y las 17:00

Archivos principales:

- `CitaController.java`
- `CitaDao.java`
- `CitaDaoImp.java`
- `CitaRepository.java`
- `Cita.java`
- `citasApi.ts`
- `AgendaForm.tsx`
- `AdminPanel.tsx`

### 6. Módulo de landing page

Es la parte pública del sistema y sirve como presentación visual del negocio.

Incluye:

- hero principal
- servicios
- barberos
- agenda
- contacto
- botón de login

Archivos principales:

- `App.tsx`
- `App.css`
- carpeta `assets/`

### 7. Módulo de agenda

Permite al cliente autenticado reservar una cita desde el frontend.

Funciones implementadas en `AgendaForm.tsx`:

- cargar servicios
- cargar barberos activos
- cargar clientes
- detectar el cliente autenticado
- seleccionar servicio, barbero, fecha y hora
- consultar horarios disponibles
- impedir citas en domingo
- mostrar resumen previo de la reserva
- crear la cita real en el backend

### 8. Módulo de dashboard

Gestiona la experiencia del usuario administrador o barbero luego de iniciar sesión.

#### Dashboard del administrador

Permite:

- ver resumen general
- acceder a secciones del panel
- gestionar citas
- consultar servicios
- consultar barberos
- consultar clientes

#### Dashboard del barbero

Permite:

- ver sus citas del día
- consultar su próxima cita
- ver estado de disponibilidad
- revisar su perfil

Archivos principales:

- `DashboardLayout.tsx`
- `AdminPanel.tsx`
- `BarberPanel.tsx`
- `DashboardLayout.css`

---

## Endpoints principales

A continuación se listan los endpoints disponibles según el backend actual.

### Autenticación

```http
POST /api/auth/login
POST /api/auth/register/cliente
```

### Administradores

```http
POST /api/administrador
PUT /api/administrador/{id}
DELETE /api/administrador/{id}
```

### Barberos

```http
GET /api/barberos
GET /api/barberos/activos
GET /api/barberos/{id}
POST /api/barberos
PUT /api/barberos/{id}
DELETE /api/barberos/{id}
```

### Clientes

```http
GET /api/clientes
GET /api/clientes/{id}
POST /api/clientes
PUT /api/clientes/{id}
DELETE /api/clientes/{id}
```

### Servicios

```http
GET /api/servicios
GET /api/servicios/{id}
POST /api/servicios
PUT /api/servicios/{id}
DELETE /api/servicios/{id}
```

### Citas

```http
GET /api/citas
POST /api/citas
PUT /api/citas/{id}
DELETE /api/citas/{id}
GET /api/citas/disponibles?barberoId={id}&dia={yyyy-mm-dd}
```

### Observación sobre los endpoints

Aunque en el frontend existe una función `obtenerCitaPorId`, en el backend actual no está implementado un `GET /api/citas/{id}`.  
Por tanto, este README refleja los endpoints realmente expuestos por los controladores.

---

## Flujo general del sistema

El flujo general del sistema funciona de la siguiente manera:

### 1. Acceso a la landing page

El usuario entra a la página principal y puede visualizar:

- presentación del negocio
- servicios disponibles
- barberos activos
- sección de agenda
- datos de contacto

### 2. Inicio de sesión o registro

Si el usuario quiere reservar una cita, debe autenticarse como cliente.  
También puede registrarse si aún no tiene cuenta.

### 3. Carga de datos para la agenda

Al entrar al formulario de agenda, el sistema consulta:

- servicios disponibles
- barberos activos
- clientes registrados

Luego identifica al cliente autenticado a partir del correo guardado en sesión.

### 4. Selección de cita

El cliente elige:

- servicio
- barbero
- fecha
- hora

### 5. Validación de disponibilidad

Antes de reservar, el frontend consulta al backend las horas disponibles del barbero en la fecha seleccionada.  
Además:

- no se permite reservar domingos
- no se permite reservar horarios ya ocupados

### 6. Registro de la cita

Si todo es válido, la cita se guarda en la base de datos y queda asociada al cliente, barbero y servicio correspondientes.

### 7. Supervisión administrativa

El administrador puede iniciar sesión y gestionar las citas del sistema, así como revisar clientes, barberos y servicios.

### 8. Consulta del barbero

El barbero puede iniciar sesión y revisar sus citas del día, su próxima cita y un resumen general de su jornada.

---

## Estado actual del proyecto

Actualmente, RandallBarber se encuentra en una fase funcional académica, con una integración real entre frontend y backend.

### Lo que ya está funcionando

- backend construido con Spring Boot
- frontend construido con React + TypeScript + Vite
- conexión real entre frontend y backend
- autenticación básica por roles
- registro de clientes
- carga inicial de datos con `data.sql`
- CRUD funcional de citas
- consulta de horas disponibles por barbero y fecha
- validación de conflictos de horario
- restricción de reservas los domingos
- landing page funcional
- panel del administrador
- panel del barbero
- persistencia temporal con H2
- almacenamiento de sesión en `localStorage`

### Lo que se puede demostrar con el proyecto

Este proyecto permite evidenciar:

- desarrollo full stack
- consumo de APIs REST
- uso de JPA/Hibernate
- separación en capas
- formularios funcionales
- control de sesión básico
- manejo de entidades relacionadas
- construcción de interfaces modernas en React

### Alcance actual

El sistema está listo para ser presentado como un proyecto académico funcional.  
Su nivel actual permite demostrar la lógica principal del negocio, aunque todavía tiene espacio para mejoras de seguridad, persistencia y experiencia de usuario.

---

## Posibles mejoras futuras

El proyecto puede evolucionar hacia una versión más robusta con mejoras tanto técnicas como funcionales.

Entre las mejoras futuras posibles están:

- implementar Spring Security
- autenticación con JWT
- cifrado de contraseñas
- protección real de rutas por rol
- CRUD completo de servicios, barberos y clientes desde la interfaz
- formulario real de edición de perfil con persistencia
- filtros por fecha, barbero o cliente en el panel administrativo
- historial de citas por cliente
- cancelación de citas por parte del cliente
- confirmación visual y notificaciones
- validaciones globales y manejo centralizado de errores
- base de datos persistente con PostgreSQL o MySQL
- despliegue en producción
- panel administrativo más completo
- indicadores y estadísticas reales del negocio
- disponibilidad por bloques horarios más flexibles
- diseño responsive más avanzado

---

## Autores

**Autores del proyecto:**

- Juan David Vanegas
- Steven Velasquez
- Jhonatan González
- Juan José Luquez
