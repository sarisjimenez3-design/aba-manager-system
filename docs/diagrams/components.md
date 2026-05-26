# Diagrama de Componentes

```mermaid
flowchart TB
    User[Usuario]
    Mobile[React Native App]
    API[Express API]
    DB[(PostgreSQL)]
    Railway[Railway]
    Sonar[SonarCloud]

    User --> Mobile
    Mobile --> API
    API --> DB
    API --> Railway
    API --> Sonar
```