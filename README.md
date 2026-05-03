# Kanban Board

# Description

This is a full-stack Kanban Board application built with React and Prisma. It allows users to manage tasks across different stages such as Backlog, Todo, In Progress, and Done.

## 🚀 Features

- Create, update, and delete tasks
- Drag and drop tasks between columns
- Status-based task organization (Backlog → Done)

### Frontend

- React
- JavaScript
- Tailwind
- @dnd-kit/react (Drag and Drop)

### Backend

- Node.js
- Express.js
- Prisma ORM

## ⚙️ How It Works

- Tasks are stored in a database using Prisma ORM
- Backend APIs handle CRUD operations
- Frontend fetches and updates data via API calls
- Drag and drop updates task status and persists changes in the database
