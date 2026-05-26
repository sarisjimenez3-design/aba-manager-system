# ABA Manager System

Aplicación móvil y sistema backend desarrollado para la gestión administrativa y deportiva del Club ABA Basketball.

---

# Tabla de contenido

- [Contexto del problema](#contexto-del-problema)
- [Usuario final](#usuario-final)
- [Caso de uso principal](#caso-de-uso-principal)
- [Alcance final](#alcance-final)
- [Funcionalidades principales](#funcionalidades-principales)
- [Arquitectura del sistema](#arquitectura-del-sistema)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [API REST documentada](#api-rest-documentada)
- [Diseño de pantallas](#diseño-de-pantallas)
- [Modelo de monetización](#modelo-de-monetización)
- [Estrategia de visibilidad](#estrategia-de-visibilidad)
- [Riesgos y mitigaciones](#riesgos-y-mitigaciones)
- [Estudio de mercado](#estudio-de-mercado)
- [Roadmap y mejoras futuras](#roadmap-y-mejoras-futuras)
- [Seguridad implementada](#seguridad-implementada)
- [Calidad del software](#calidad-del-software)
- [Instalación local](#instalación-local)
- [APK Android](#apk-android)
- [Despliegue](#despliegue)
- [Autores](#autores)
# Diagramas del sistema

- [Diagrama de Secuencia o Flujo](docs/diagrams/sequence-flow.md)
- [Diagrama Entidad-Relación](docs/diagrams/entity-relationship.md)
- [Diagrama de Componentes](docs/diagrams/components.md)

---

# Contexto del problema

El Club ABA Basketball necesitaba una solución tecnológica que permitiera centralizar la administración de deportistas, entrenadores, pagos, entrenamientos y soporte interno.

Actualmente muchos procesos administrativos se realizan manualmente mediante mensajes de WhatsApp, hojas de cálculo y registros físicos, lo cual genera:

- Desorganización de la información
- Retrasos en la validación de pagos
- Dificultad para consultar entrenamientos
- Problemas de comunicación con los usuarios
- Falta de seguimiento administrativo

Por esta razón se desarrolló ABA Manager, una aplicación móvil conectada a una API REST y base de datos PostgreSQL para automatizar estos procesos.

---

# Usuario final

La aplicación está dirigida a:

## Administradores

- Gestión de pagos
- Publicación de comunicados
- Gestión administrativa
- Visualización de estadísticas

## Entrenadores

- Creación de entrenamientos
- Consulta de agenda deportiva

## Deportistas

- Consulta de pagos
- Consulta de entrenamientos
- Soporte y comunicación

## Padres de familia

- Seguimiento de pagos
- Consulta de agenda
- Comunicación con el club

---

# Caso de uso principal

El flujo principal del sistema consiste en:

1. El usuario inicia sesión.
2. El sistema valida credenciales mediante JWT.
3. El usuario accede según su rol.
4. El deportista consulta pagos y entrenamientos.
5. El administrador revisa y aprueba comprobantes.
6. Los entrenadores programan entrenamientos desde el calendario.
7. El sistema almacena toda la información en PostgreSQL.

---

# Alcance final

El sistema implementa:

- Autenticación segura con JWT
- Control por roles
- Gestión de usuarios
- Gestión de pagos
- Subida de comprobantes
- Agenda visual con calendario
- Gestión de entrenamientos
- Publicaciones internas
- Sistema de soporte
- Dashboard administrativo
- Modo oscuro
- Backend desplegado en Railway
- APK Android funcional
- Análisis de calidad con SonarCloud

---

# Funcionalidades principales

- Inicio de sesión
- Registro de usuarios
- Control por roles
- Gestión de pagos
- Subida de comprobantes
- Agenda deportiva
- Creación de entrenamientos
- Dashboard administrativo
- Publicaciones internas
- Soporte
- Perfil de usuario
- Modo oscuro

---

# Arquitectura del sistema

El sistema se divide en:

## Frontend

- React Native
- Expo
- TypeScript

## Backend

- Node.js
- Express
- Prisma ORM
- JWT

## Base de datos

- PostgreSQL

## Infraestructura

- Railway (Backend + DB)
- Expo EAS Build (APK)
- SonarCloud (Calidad)

---

# Tecnologías utilizadas

## Frontend

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Notifications
- React Native Calendars

## Backend

- Node.js
- Express
- Prisma
- JWT
- bcrypt
- Multer
- Swagger

## Base de datos

- PostgreSQL

## DevOps y calidad

- GitHub
- Git Flow
- Railway
- SonarCloud
- EAS Build

---

# API REST documentada

La API fue documentada utilizando Swagger.

## Tecnologías usadas

- swagger-jsdoc
- swagger-ui-express

## Endpoints principales

### Auth

- POST /auth/login
- POST /auth/register

### Payments

- GET /payments
- PATCH /payments/:id/status

### Trainings

- GET /trainings
- POST /trainings

### Posts

- GET /posts
- POST /posts

### Support

- GET /support
- POST /support

## Swagger URL

```text
https://aba-manager-system-production.up.railway.app/api-docs/
```

---

# Diseño de pantallas

Las interfaces fueron diseñadas siguiendo una línea moderna enfocada en experiencia móvil.

## Herramientas utilizadas

- Figma
- Referencias visuales tipo dashboard deportivo

## Prototipo Figma

https://www.figma.com/proto/GCCIHpZhyhdbHYKxxscYaE/Untitled?node-id=0-1&t=ClAMir3cyZZe3sre-1

## Pantallas principales

- Login
- Inicio
- Pagos
- Agenda
- Soporte
- Dashboard Admin
- Perfil

---

# Modelo de monetización

La aplicación podría mantenerse activa mediante:

- Pago mensual del club por uso del sistema
- Suscripción SaaS para otros clubes deportivos
- Integración futura con pagos automáticos
- Publicidad interna de eventos deportivos

---

# Estrategia de visibilidad

Para aumentar el alcance de la aplicación se plantea:

- Difusión en redes sociales del club
- Publicaciones en Instagram y Facebook
- Demostraciones durante torneos
- Invitación a otros clubes deportivos
- Marketing digital enfocado en academias deportivas

---

# Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Fallas del servidor | Uso de Railway y backups |
| Acceso no autorizado | JWT y control por roles |
| Pérdida de información | PostgreSQL en la nube |
| Problemas de conectividad | Validaciones y manejo de errores |
| Subida de archivos maliciosos | Validación de imágenes |

---

# Estudio de mercado

Actualmente existen plataformas similares orientadas a clubes deportivos, sin embargo muchas son complejas o costosas.

## Aplicaciones similares

- TeamSnap
- Heja
- Spond

## Diferencias de ABA Manager

- Adaptada específicamente a clubes de baloncesto
- Interfaz simple y moderna
- Dashboard administrativo
- Agenda visual personalizada
- Soporte interno

---

# Roadmap y mejoras futuras

## Corto plazo

- Notificaciones push
- Mejoras visuales

## Mediano plazo

- Chat en tiempo real
- Estadísticas deportivas
- Historial de pagos

## Largo plazo

- Integración con pasarelas de pago
- Version iOS
- Multi-club
- Inteligencia artificial para análisis deportivo

---

# Seguridad implementada

- Contraseñas encriptadas con bcrypt
- JWT para autenticación
- Middleware de autorización
- Validaciones backend
- Protección por roles
- Variables de entorno

---

# Calidad del software

El proyecto fue analizado mediante SonarCloud.

## Resultados

- Fiabilidad: A
- Seguridad: C
- Mantenibilidad: A
- Baja duplicación de código

## SonarCloud

```text
https://sonarcloud.io/project/overview?id=sarisjimenez3-design_aba-manager-system
```

---
# Instalación local

La documentación técnica y guía de instalación se encuentra en:

[Ver guía de instalación local](docs/setup-notes.md)

# Git Flow

## Ramas principales

- main
- develop

## Ramas feature

- feature/auth-module
- feature/dark-mode
- feature/calendar-agenda
- feature/admin-dashboard-advanced
- feature/posts-feed-images

---

# APK Android

La aplicación fue compilada mediante Expo EAS Build.

## Tecnologías

- Expo
- EAS Build
- React Native

## Instalación

Descargar APK y permitir instalaciones externas.

## APK URL

```text
https://expo.dev/accounts/sarajimenez/projects/mobile/builds/2701d4f9-dfc8-4004-98f3-a84ab0c6c6a9
```

---

# Despliegue

## Backend

Railway

## Base de datos

PostgreSQL Railway

## Calidad

SonarCloud

## Control de versiones

GitHub

---

# Estructura del proyecto

```text
aba-manager-system/
│
├── backend/
├── mobile/
├── docs/
├── .github/
└── README.md
```

---

# Autores

Proyecto desarrollado por:

- Sara Jimenez Restrepo

Universidad Pascual Bravo  
2026