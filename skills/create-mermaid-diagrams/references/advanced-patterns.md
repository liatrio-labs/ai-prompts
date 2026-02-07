# Advanced Mermaid Patterns

Use these patterns when basic templates are insufficient and validation still passes.

## Sequence Conditionals (`alt` / `else`)

```mermaid
sequenceDiagram
    participant U as User
    participant API as API
    participant DB as Database
    U->>API: Request
    alt Authorized
        API->>DB: Read data
        DB-->>API: Data
        API-->>U: 200 OK
    else Unauthorized
        API-->>U: 401 Unauthorized
    end
```

## Sequence Loops

```mermaid
sequenceDiagram
    participant Worker
    participant Queue
    loop Poll every 5s
        Worker->>Queue: Pull job
        Queue-->>Worker: Job or empty
    end
```

## Complex Subgraphs

```mermaid
flowchart TD
    subgraph Edge["Edge Layer"]
        LB[Load Balancer]
        WAF[WAF]
        LB --> WAF
    end

    subgraph App["Application Layer"]
        API[API Service]
        Jobs[Worker Service]
        API --> Jobs
    end

    subgraph Data["Data Layer"]
        DB[(Primary DB)]
        Cache[(Cache)]
    end

    WAF --> API
    API --> DB
    API --> Cache
```

## Error-Resilient Authoring Notes

- Add one advanced construct at a time before validation.
- Validate after each structural edit, not only at the end.
- If advanced syntax fails repeatedly, downgrade to simpler constructs and preserve meaning.
