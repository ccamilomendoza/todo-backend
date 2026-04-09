# PostgreSQL Database Optimization Plan

## Executive Summary

This document outlines a comprehensive optimization plan for the task management application's PostgreSQL database. The schema consists of 5 tables (user, project, board, column, task) with relationships forming a hierarchical project management structure.

**Database:** PostgreSQL (hosted on Neon)  
**ORM:** Drizzle ORM  
**Project Type:** Personal learning project with low data volume

---

## Current Schema Analysis

### Tables Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `user` | User accounts and authentication | 1:N with project (owner) |
| `project` | Project containers | N:1 with user, 1:N with board |
| `board` | Kanban boards within projects | N:1 with project, 1:N with column |
| `column` | Kanban columns within boards | N:1 with board, 1:N with task |
| `task` | Individual tasks/cards | N:1 with board, column, project |

### Issues Identified

| Issue | Severity | Impact |
|-------|----------|--------|
| Missing FK indexes | **Critical** | Full table scans on JOINs |
| Inconsistent column naming | Medium | `create_at` vs `created_at` |
| Missing updated_at defaults | Low | Inconsistent timestamp handling |
| Missing query indexes | Medium | Slow filtering on common columns |

---

## Phase 1: Critical Fixes (Foundation)

### 1.1 Foreign Key Indexes (Required)

PostgreSQL does **not** automatically create indexes on foreign key columns. Without these, every JOIN operation triggers a full table scan.

```sql
-- Project FK: owner_id
CREATE INDEX project_owner_id_idx ON project (owner_id);

-- Board FK: project_id
CREATE INDEX board_project_id_idx ON board (project_id);

-- Column FK: board_id
CREATE INDEX column_board_id_idx ON "column" (board_id);

-- Task FKs: project_id, board_id, column_id
CREATE INDEX task_project_id_idx ON task (project_id);
CREATE INDEX task_board_id_idx ON task (board_id);
CREATE INDEX task_column_id_idx ON task (column_id);
```

**Total: 6 indexes**

---

### 1.2 Schema Consistency Fixes

Fix inconsistent timestamp column naming and add missing defaults.

```sql
-- Rename create_at → created_at for consistency
ALTER TABLE project RENAME COLUMN create_at TO created_at;
ALTER TABLE board RENAME COLUMN create_at TO created_at;
ALTER TABLE "column" RENAME COLUMN create_at TO created_at;
ALTER TABLE task RENAME COLUMN create_at TO created_at;

-- Add updated_at defaults
ALTER TABLE project ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE board ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE "column" ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE task ALTER COLUMN updated_at SET DEFAULT now();
```

---

## Phase 2: Query Performance Indexes

### 2.1 User Table

```sql
-- Email lookups (login, password reset, invites)
CREATE INDEX user_email_idx ON "user" (email);

-- Active user filtering (common for user lists, admin panels)
-- Partial index: only index active users
CREATE INDEX user_is_active_idx ON "user" (is_active) 
  WHERE is_active = true;
```

**Use Cases:**
- Login queries: `WHERE email = 'user@example.com'`
- Active user lists: `WHERE is_active = true`

---

### 2.2 Project Table

```sql
-- Status filtering (ACTIVE, ARCHIVED, COMPLETED, ON_HOLD)
CREATE INDEX project_status_idx ON project (status);

-- Key lookups (project short identifiers like "PROJ-123")
CREATE INDEX project_key_idx ON project (key);

-- Composite: Owner's projects filtered by status
-- Covers: "Show my active projects" dashboard queries
CREATE INDEX project_owner_status_idx ON project (owner_id, status);
```

**Use Cases:**
- Project listing by status
- Key-based project lookup
- User dashboard: projects owned by current user

---

### 2.3 Board Table

```sql
-- Partial index: Find default board per project
-- Highly selective: only one default board per project
CREATE INDEX board_project_default_idx ON board (project_id, is_default) 
  WHERE is_default = true;
```

**Use Cases:**
- Load default board when opening a project
- Check if project has a default board

---

### 2.4 Column Table

```sql
-- Board columns ordered by position (Kanban view rendering)
CREATE INDEX column_board_position_idx ON "column" (board_id, position);

-- Covering index: Avoids table access for column listings
-- Includes commonly accessed columns
CREATE INDEX column_board_covering_idx ON "column" (board_id) 
  INCLUDE (name, position);
```

**Use Cases:**
- Render board with columns in correct order
- Column name tooltips, position calculations

---

### 2.5 Task Table (Most Complex)

#### Single-Column Filter Indexes

```sql
-- Status filtering (to-do, in-progress, done, blocked, cancelled)
CREATE INDEX task_status_idx ON task (status);

-- Priority filtering (critical, high, medium, low)
CREATE INDEX task_priority_idx ON task (priority);

-- Type filtering (bug, story, epic, subtask, task)
CREATE INDEX task_type_idx ON task (type);

-- Due date range queries (exclude nulls for efficiency)
CREATE INDEX task_due_date_idx ON task (due_date) 
  WHERE due_date IS NOT NULL;
```

#### Composite Indexes for Common Patterns

```sql
-- Board + column positioning (Kanban drag-and-drop)
CREATE INDEX task_board_column_idx ON task (board_id, column_id);

-- Project task listings with status filter
CREATE INDEX task_project_status_idx ON task (project_id, status);

-- Partial index: Overdue tasks (dashboard widget)
-- Only indexes tasks that are actually overdue
CREATE INDEX task_overdue_idx ON task (due_date, status) 
  WHERE due_date < CURRENT_DATE AND status != 'done';
```

**Use Cases:**
- Kanban board: tasks by board and column
- Task filtering by priority, type, status
- Overdue task dashboard widget
- Project task lists with status

---

## Phase 3: Drizzle ORM Updates

Update ORM definitions to match optimized schema.

### 3.1 Update `user.orm.ts`

Add email index and ensure updatedAt has default:

```typescript
export const userTable = pgTable(
  "user",
  {
    avatar: varchar("avatar", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    id: uuid("id").defaultRandom().primaryKey(),
    isActive: boolean("is_active").notNull().default(true),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    username: varchar("username", { length: 255 }).notNull().unique(),
  },
  (table) => [
    uniqueIndex("username_idx").on(table.username),
    uniqueIndex("email_idx").on(table.email),  // Add this
    index("is_active_idx").on(table.isActive), // Add this
  ],
);
```

### 3.2 Update `project.orm.ts`

Fix timestamp naming and add indexes:

```typescript
export const projectTable = pgTable(
  "project",
  {
    color: varchar("color", { length: 7 }),
    createdAt: timestamp("created_at").notNull().defaultNow(), // Fixed name
    description: varchar("description", { length: 255 }),
    endDate: timestamp("end_date"),
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 10 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id),
    startDate: timestamp("start_date"),
    status: varchar("status", {
      enum: ["ACTIVE", "ARCHIVED", "COMPLETED", "ON_HOLD"],
    })
      .default("ACTIVE")
      .notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Added default
  },
  (table) => [
    index("owner_id_idx").on(table.ownerId),               // Add FK index
    index("status_idx").on(table.status),                 // Add filter index
    index("key_idx").on(table.key),                       // Add lookup index
    index("owner_status_idx").on(table.ownerId, table.status), // Add composite
  ],
);
```

### 3.3 Update `board.orm.ts`

```typescript
export const boardTable = pgTable(
  "board",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(), // Fixed name
    description: varchar("description", { length: 255 }),
    id: uuid("id").defaultRandom().primaryKey(),
    isDefault: boolean("is_default").notNull().default(false),
    name: varchar("name", { length: 255 }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectTable.id),
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Added default
  },
  (table) => [
    index("project_id_idx").on(table.projectId),          // Add FK index
    index("project_default_idx")                          // Add partial index
      .on(table.projectId, table.isDefault)
      .where(eq(table.isDefault, true)),
  ],
);
```

### 3.4 Update `column.orm.ts`

Note: `column` is a reserved word, use quotes in raw SQL.

```typescript
export const columnTable = pgTable(
  "column",
  {
    boardId: uuid("board_id")
      .notNull()
      .references(() => boardTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(), // Fixed name
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    position: numeric().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Added default
  },
  (table) => [
    index("board_id_idx").on(table.boardId),                // Add FK index
    index("board_position_idx").on(table.boardId, table.position), // Add composite
  ],
);
```

### 3.5 Update `task.orm.ts`

```typescript
export const taskTable = pgTable(
  "task",
  {
    actualHours: numeric("actual_hours"),
    boardId: uuid("board_id")
      .notNull()
      .references(() => boardTable.id),
    columnId: uuid("column_id")
      .notNull()
      .references(() => columnTable.id),
    completedDate: timestamp("completed_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(), // Fixed name
    description: varchar("description", { length: 255 }),
    dueDate: timestamp("due_date"),
    estimatedHours: numeric("estimated_hours"),
    id: uuid("id").defaultRandom().primaryKey(),
    priority: varchar("priority", {
      enum: ["critical", "high", "low", "medium"],
      length: 255,
    }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projectTable.id),
    startDate: timestamp("start_date"),
    status: varchar("status", {
      enum: ["blocked", "cancelled", "done", "in-progress", "to-do"],
      length: 255,
    }),
    title: varchar("title", { length: 255 }).notNull(),
    type: varchar("type", {
      enum: ["bug", "epic", "story", "subtask", "task"],
      length: 255,
    }).notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Added default
  },
  (table) => [
    // FK indexes
    index("task_project_id_idx").on(table.projectId),
    index("task_board_id_idx").on(table.boardId),
    index("task_column_id_idx").on(table.columnId),
    // Filter indexes
    index("status_idx").on(table.status),
    index("priority_idx").on(table.priority),
    index("type_idx").on(table.type),
    // Composite indexes
    index("board_column_idx").on(table.boardId, table.columnId),
    index("project_status_idx").on(table.projectId, table.status),
  ],
);
```

---

## Implementation Order

| Phase | Description | Priority | Risk |
|-------|-------------|----------|------|
| 1.1 | Foreign key indexes (6) | **P0 - Critical** | None |
| 1.2 | Schema consistency fixes | P1 - High | Low |
| 2.x | Query performance indexes | P2 - Medium | None |
| 3.x | ORM definition updates | P3 - Low | Low |

### Recommended Approach

1. **Execute Phase 1.1 first** - These are non-breaking and immediately improve performance
2. **Test your application** - Ensure everything works with FK indexes
3. **Execute Phase 1.2** - Schema consistency fixes
4. **Generate Drizzle migration** - Capture schema changes
5. **Execute Phase 2** - Add query indexes based on actual usage patterns
6. **Update ORM definitions** - Keep code and database in sync

---

## Complete SQL Script

```sql
-- =====================================================
-- DATABASE OPTIMIZATION SCRIPT
-- Phase 1: Critical Fixes
-- =====================================================

-- 1.1 Foreign Key Indexes
CREATE INDEX project_owner_id_idx ON project (owner_id);
CREATE INDEX board_project_id_idx ON board (project_id);
CREATE INDEX column_board_id_idx ON "column" (board_id);
CREATE INDEX task_project_id_idx ON task (project_id);
CREATE INDEX task_board_id_idx ON task (board_id);
CREATE INDEX task_column_id_idx ON task (column_id);

-- 1.2 Schema Consistency
ALTER TABLE project RENAME COLUMN create_at TO created_at;
ALTER TABLE board RENAME COLUMN create_at TO created_at;
ALTER TABLE "column" RENAME COLUMN create_at TO created_at;
ALTER TABLE task RENAME COLUMN create_at TO created_at;

ALTER TABLE project ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE board ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE "column" ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE task ALTER COLUMN updated_at SET DEFAULT now();

-- =====================================================
-- Phase 2: Query Performance Indexes
-- =====================================================

-- User table
CREATE INDEX user_email_idx ON "user" (email);
CREATE INDEX user_is_active_idx ON "user" (is_active) WHERE is_active = true;

-- Project table
CREATE INDEX project_status_idx ON project (status);
CREATE INDEX project_key_idx ON project (key);
CREATE INDEX project_owner_status_idx ON project (owner_id, status);

-- Board table
CREATE INDEX board_project_default_idx ON board (project_id, is_default) WHERE is_default = true;

-- Column table
CREATE INDEX column_board_position_idx ON "column" (board_id, position);
CREATE INDEX column_board_covering_idx ON "column" (board_id) INCLUDE (name, position);

-- Task table
CREATE INDEX task_status_idx ON task (status);
CREATE INDEX task_priority_idx ON task (priority);
CREATE INDEX task_type_idx ON task (type);
CREATE INDEX task_due_date_idx ON task (due_date) WHERE due_date IS NOT NULL;
CREATE INDEX task_board_column_idx ON task (board_id, column_id);
CREATE INDEX task_project_status_idx ON task (project_id, status);
CREATE INDEX task_overdue_idx ON task (due_date, status) WHERE due_date < CURRENT_DATE AND status != 'done';
```

---

## Rollback Procedures

### Remove All Indexes (if needed)

```sql
-- FK indexes
DROP INDEX IF EXISTS project_owner_id_idx;
DROP INDEX IF EXISTS board_project_id_idx;
DROP INDEX IF EXISTS column_board_id_idx;
DROP INDEX IF EXISTS task_project_id_idx;
DROP INDEX IF EXISTS task_board_id_idx;
DROP INDEX IF EXISTS task_column_id_idx;

-- Query indexes
DROP INDEX IF EXISTS user_email_idx;
DROP INDEX IF EXISTS user_is_active_idx;
DROP INDEX IF EXISTS project_status_idx;
DROP INDEX IF EXISTS project_key_idx;
DROP INDEX IF EXISTS project_owner_status_idx;
DROP INDEX IF EXISTS board_project_default_idx;
DROP INDEX IF EXISTS column_board_position_idx;
DROP INDEX IF EXISTS column_board_covering_idx;
DROP INDEX IF EXISTS task_status_idx;
DROP INDEX IF EXISTS task_priority_idx;
DROP INDEX IF EXISTS task_type_idx;
DROP INDEX IF EXISTS task_due_date_idx;
DROP INDEX IF EXISTS task_board_column_idx;
DROP INDEX IF EXISTS task_project_status_idx;
DROP INDEX IF EXISTS task_overdue_idx;
```

### Revert Schema Changes

```sql
-- Note: Cannot "un-rename" columns, but can rename back
ALTER TABLE project RENAME COLUMN created_at TO create_at;
ALTER TABLE board RENAME COLUMN created_at TO create_at;
ALTER TABLE "column" RENAME COLUMN created_at TO create_at;
ALTER TABLE task RENAME COLUMN created_at TO create_at;

-- Remove defaults
ALTER TABLE project ALTER COLUMN updated_at DROP DEFAULT;
ALTER TABLE board ALTER COLUMN updated_at DROP DEFAULT;
ALTER TABLE "column" ALTER COLUMN updated_at DROP DEFAULT;
ALTER TABLE task ALTER COLUMN updated_at DROP DEFAULT;
```

---

## Verification Queries

### Check Index Creation

```sql
-- List all indexes on a table
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'task';

-- Check index usage statistics
SELECT schemaname, relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE relname IN ('user', 'project', 'board', 'column', 'task')
ORDER BY relname, indexrelname;
```

### Verify Schema Changes

```sql
-- Check column names
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'project'
ORDER BY ordinal_position;

-- Check all tables for create_at/created_at consistency
SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name LIKE '%created%'
ORDER BY table_name;
```

### Performance Verification

```sql
-- Explain a query to verify index usage
EXPLAIN ANALYZE
SELECT * FROM task
WHERE project_id = 'uuid-here' AND status = 'in-progress';

-- Should show "Index Scan" instead of "Seq Scan"
```

---

## Index Summary

| Table | Index Name | Type | Purpose |
|-------|------------|------|---------|
| user | user_email_idx | B-tree | Email lookups |
| user | user_is_active_idx | Partial | Active user filtering |
| project | project_owner_id_idx | B-tree | FK - Owner reference |
| project | project_status_idx | B-tree | Status filtering |
| project | project_key_idx | B-tree | Key lookups |
| project | project_owner_status_idx | Composite | Owner + status queries |
| board | board_project_id_idx | B-tree | FK - Project reference |
| board | board_project_default_idx | Partial | Default board lookup |
| column | column_board_id_idx | B-tree | FK - Board reference |
| column | column_board_position_idx | Composite | Ordered column listing |
| column | column_board_covering_idx | Covering | Board column details |
| task | task_project_id_idx | B-tree | FK - Project reference |
| task | task_board_id_idx | B-tree | FK - Board reference |
| task | task_column_id_idx | B-tree | FK - Column reference |
| task | task_status_idx | B-tree | Status filtering |
| task | task_priority_idx | B-tree | Priority filtering |
| task | task_type_idx | B-tree | Type filtering |
| task | task_due_date_idx | Partial | Due date range queries |
| task | task_board_column_idx | Composite | Board + column queries |
| task | task_project_status_idx | Composite | Project + status queries |
| task | task_overdue_idx | Partial | Overdue tasks widget |

**Total Indexes:** 21 (6 FK + 15 query optimization)

---

## Notes

- **Neon-Specific:** All indexes use standard PostgreSQL features compatible with Neon serverless PostgreSQL
- **Reserved Words:** The `column` table requires double quotes in raw SQL queries
- **Partial Indexes:** Include `WHERE` clauses to reduce index size for selective queries
- **Covering Indexes:** Use `INCLUDE` to avoid table lookups for common queries
- **Naming Convention:** All indexes follow `{table}_{column}_idx` or `{table}_{columns}_idx` pattern

---

*Generated for: Task Management Application*  
*Date: April 7, 2026*  
*Database: PostgreSQL on Neon*