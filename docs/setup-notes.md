# Setup Notes

## Herramientas requeridas

- Node.js v22+
- PostgreSQL
- Git
- VS Code
- Expo Go

---

# Configuración Backend

## Instalar dependencias

```bash
cd backend
npm install
```

---

## Variables de entorno

Crear archivo `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

---

## Ejecutar migraciones

```bash
npx prisma migrate dev
```

---

## Ejecutar seed admin

```bash
npm run seed:admin
```

---

## Ejecutar servidor

```bash
npm run dev
```

---

# Configuración Mobile

## Instalar dependencias

```bash
cd mobile
npm install
```

---

## Ejecutar Expo

```bash
npx expo start
```

---

# Build APK Android

```bash
eas build -p android --profile preview
```

---

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

# Infraestructura

## Backend

- Railway

## Base de datos

- PostgreSQL Railway

## APK

- Expo EAS Build

## Calidad de código

- SonarCloud

---

# Variables importantes

## Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Mobile

```ts
API_BASE_URL=
```