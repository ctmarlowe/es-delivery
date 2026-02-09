# Delivery Plan App — PROJECT_SPEC

## 1. Purpose

Build a modern web application for **Expert Services teams** to collaboratively design, manage, and track **delivery plans** for fixed-hour consulting engagements.

A delivery plan consists of structured **sessions**, drawn from a reusable **library**, with strict accounting of **planned vs remaining hours**.  
The application must prevent scope ambiguity while remaining fast and pleasant to use.

This document is the **single source of truth** for product behavior, data model, and UI expectations.

---

## 2. Tech Stack

### Core
- **Next.js (latest stable, App Router)**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Vercel** (hosting)

### UI
- **Tailwind CSS**
- **shadcn/ui**
- **lucide-react**

### Authentication
- **None (for now)**
- App is assumed to be internal or protected externally
- Optional `createdByName` fields are used instead of users

---

## 3. Core Concepts

- **Customer**  
  Organization receiving Expert Services.

- **Engagement**  
  Commercial consulting package with a fixed number of hours.

- **Delivery Plan**  
  Structured breakdown of how engagement hours are used.

- **Session**  
  A unit of delivery (workshop, review, meeting).

- **Library Item**  
  Reusable session template.

- **Topic**  
  Tag for categorization and suggestion logic.

---

## 4. Functional Requirements

### 4.1 Delivery Plans
- Create, edit, archive delivery plans
- Each plan:
  - Belongs to one engagement
  - Has a title and status
- Status values:
  - `DRAFT`
  - `ACTIVE`
  - `COMPLETED`
  - `ARCHIVED`

---

## 5. Engagements

- Each engagement has:
  - Customer
  - Name
  - `packageHours` (Decimal, required)
  - Optional start and end dates
- Delivery plans **must account for packageHours**

