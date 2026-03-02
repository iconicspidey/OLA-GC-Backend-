# OLA‑GC Backend 🏫💻

A **computer‑based testing (CBT)** system backend for *Our Lady Apostle Girls College, Akwanga*. This Node/Express application exposes a JSON REST API for managing students, teachers, questions, exams, timers and results. Data is persisted via **Sequelize** and a SQL database (PostgreSQL by default).

---

## 🚀 Features

- CRUD API for students, teachers (administrators), questions, exam timers and results
- Authentication for admins with JWT tokens
- Bulk import of students via CSV-like payload
- Sequelize models, migrations and configuration
- Basic middleware (CORS, body parsing, error handling)

---

## 📁 Project Structure

```
.
├── constants.js             # project constants
├── index.js                 # Express server setup
├── src/
│   ├── controllers/         # HTTP request handlers
│   ├── routes/              # Express route definitions
│   ├── database/
│   │   ├── config/          # Sequelize configuration files
│   │   ├── migrations/      # DB migration scripts
│   │   └── models/          # Sequelize model definitions
│   └── helpers/             # utility modules (e.g. messages.js)
└── package.json
```

---

## 🛠️ Prerequisites

- Node.js 14+ and npm
- PostgreSQL (or another SQL dialect supported by Sequelize)
- (Optional) Maven if using the provided `verify`/`test` tasks

---

## ✅ Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd olagc-backend-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the database**

   Edit `src/database/config/config.json` or set the appropriate environment variables (`DB_*`, etc.). See `src/database/config/config.js` for environment variable handling.

4. **Run migrations**

   ```bash
   npm run db:setup
   ```

   This applies Sequelize migrations located in `src/database/migrations`.

5. **(Optional) Empty the database**

   ```bash
   npm run db:empty
   ```

6. **Start the server**

   - Development (with nodemon):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

   The application listens on `process.env.PORT` or `3000` by default.

7. **Run tests**

   ```bash
   mvn -B test
   ```

   (The existing workspace includes Maven tasks; adapt or add Node.js tests as needed.)

---

## 🌐 API Endpoints

All routes use the `/api/v1` prefix. See `src/routes/index.js` for full definitions.

| Method | Path                      | Controller              | Purpose                         |
|--------|---------------------------|-------------------------|----------------------------------|
| GET    | `/api/v1/`                | —                       | API health check                |
| GET    | `/api/v1/student/:id?`    | studentController       | Retrieve single student         |
| POST   | `/api/v1/student/`        | studentController       | Create student                  |
| PUT    | `/api/v1/student/:id`     | studentController       | Update student                  |
| DELETE | `/api/v1/student/:id?`    | studentController       | Delete student                  |
| GET    | `/api/v1/students/`       | studentController       | List students                   |
| POST   | `/api/v1/students/`       | studentController       | Bulk import students            |
| GET    | `/api/v1/me`              | adminController         | Get own admin profile           |
| GET    | `/api/v1/classes`         | adminController         | List classes                    |
| GET    | `/api/v1/teacher/:id?`    | adminController         | Retrieve teacher/admin          |
| POST   | `/api/v1/teacher/`        | adminController         | Create teacher/admin            |
| PUT    | `/api/v1/teacher/:id?`    | adminController         | Update teacher/admin            |
| DELETE | `/api/v1/teacher/:id?`    | adminController         | Remove teacher/admin            |
| POST   | `/api/v1/teachers/`       | adminController         | Get multiple teachers (TODO: GET)|
| …      | additional exam, timer,   | examController, timerController, questionController, etc.


> ⚠️ `POST /api/v1/teachers/` is currently used for fetching multiple teachers; this should be changed to `GET` in a future release.

---

## 🗃️ Database Models

- **adminlogin** – administrators/teachers
- **students** – student records
- **questions** – question bank for exams
- **timer** – active exam timers
- **results** – exam outcomes

Models are defined under `src/database/models/*.js` and aggregated in `models/index.js`.

---

## 🔐 Authentication

The `authController.js` handles login and JWT issuance. Protected routes expect an `Authorization: Bearer <token>` header.

---

## 📝 Development Tips

- Add migrations with `npx sequelize-cli migration:generate --name <desc>`.
- Validate request payloads in controllers before database access.
- Follow existing naming conventions: snake_case in DB, camelCase in JavaScript.

---

## 📚 Resources

- [Sequelize Documentation](https://sequelize.org/master)
- [Express.js Guide](http://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## ❗ Roadmap / TODO

1. Change `POST /api/v1/teachers/` to `GET`.
2. Add request validation middleware (e.g. `express-validator`).
3. Implement comprehensive logging and error tracking.
4. Write unit/integration tests for controllers and models.
5. Dockerise application and database.



