# Diagrama de Secuencia

```mermaid
sequenceDiagram
    actor Usuario
    participant App
    participant API
    participant DB

    Usuario->>App: Inicia sesión
    App->>API: POST /auth/login
    API->>DB: Buscar usuario
    DB-->>API: Usuario encontrado
    API-->>App: JWT y datos
    App-->>Usuario: Acceso concedido
```