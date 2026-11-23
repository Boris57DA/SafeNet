# Актуална ER диаграма — Етап 2

```mermaid
erDiagram
  AUTH_USERS ||--o{ ATTEMPTS : owns
  SCENARIOS ||--|{ CHOICES : offers
  SCENARIOS ||--o{ ATTEMPTS : receives
  CHOICES ||--o{ ATTEMPTS : selected
  SCENARIOS {
    integer id PK
    jsonb category
    jsonb title
    jsonb description
    text sender
    jsonb message
    text fake_link
    smallint difficulty_level
    smallint minutes
    text icon
    timestamptz created_at
  }
  CHOICES {
    integer id PK
    integer scenario_id FK
    smallint position
    jsonb text
    boolean is_correct
    jsonb feedback
  }
  ATTEMPTS {
    uuid id PK
    uuid user_id FK
    integer scenario_id FK
    integer choice_id FK
    boolean is_correct
    integer points_earned
    jsonb feedback
    timestamptz attempted_at
  }
```

Три приложни таблици плюс системната auth.users. JSONB съдържа bg/en. Допълнителни ограничения: UNIQUE(user_id, scenario_id) в attempts; UNIQUE(scenario_id, position) и UNIQUE(id, scenario_id) в choices; съставен FK attempts(choice_id,scenario_id) → choices(id,scenario_id). Системната auth.users не се създава от schema.sql.

Схемата е проектен артефакт, а не експорт от вече създаден Supabase проект. За действителния експорт изпълнете verify.sql след настройката. Обосновка за отложените profiles/progress: PROJECT_PLAN.md.
