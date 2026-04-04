# 💰 Expense Tracker

A full-stack Expense Tracker application built using Spring Boot, Hibernate, PostgreSQL, and JavaScript.
This application allows users to manage their daily expenses efficiently.

---

## 🚀 Live Demo

🔗 Backend API: https://expense-tracker-bkur.onrender.com

---

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Hibernate (JPA)
* REST API

### Frontend

* HTML
* CSS
* JavaScript

### Database

* PostgreSQL (Neon)

### Deployment

* Backend: Render
* Database: Neon
* Frontend: Netlify (if deployed)

---

## 📌 Features

* ➕ Add new expenses
* 📋 View all expenses
* ✏️ Update expenses
* ❌ Delete expenses
* 🌐 REST API integration
* ☁️ Cloud deployment

---

## 📂 Project Structure

```
Expense-Tracker/
│── src/
│── target/
│── pom.xml
│── Dockerfile
│── README.md
```

---

## ⚙️ Setup Instructions (Local)

### 1. Clone the repository

```
git clone https://github.com/Madhanpagidi/Expense-Tracker.git
cd Expense-Tracker
```

---

### 2. Configure Database

Update `application.properties`:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/your_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

### 3. Run the application

```
mvn spring-boot:run
```

---

## 🌍 API Endpoints

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | /api/expenses      | Get all expenses |
| POST   | /api/expenses      | Add new expense  |
| PUT    | /api/expenses/{id} | Update expense   |
| DELETE | /api/expenses/{id} | Delete expense   |

---

## 🐳 Docker Support

To build and run using Docker:

```
docker build -t expense-tracker .
docker run -p 8080:8080 expense-tracker
```

---

## 📌 Future Improvements

* User authentication (login/signup)
* Expense categories
* Charts & analytics
* Mobile responsive UI

---

## 👨‍💻 Author

**Madhan Mohan**

* GitHub: https://github.com/Madhanpagidi

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
