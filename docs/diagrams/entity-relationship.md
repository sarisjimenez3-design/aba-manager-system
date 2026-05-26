# Diagrama Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Payment : has
    User ||--o{ Post : creates
    User ||--o{ SupportTicket : sends
    User ||--o{ Training : manages

    User {
        string id PK
        string firstName
        string lastName
        string email
        string passwordHash
        string phone
        string role
        boolean isActive
        datetime createdAt
    }

    Payment {
        string id PK
        string userId FK
        string month
        float amount
        string status
    }

    Post {
        string id PK
        string title
        string content
    }

    Training {
        string id PK
        string title
        string place
        string category
    }

    SupportTicket {
        string id PK
        string subject
        string message
        string status
    }
}
```