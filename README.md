# 🚀 Cloud Storage Platform (Monolithic)

A **monolithic web application** built with modern technologies to provide secure authentication, subscription management, email automation, and advanced app protection.  

---

## ✨ Features

- 🔒 **JWT Authentication** – User CRUD operations, authentication, and subscription management.  
- 🛡 **Advanced Rate Limiting & Bot Protection** – Secured with [Arcjet](https://arcjet.com), protecting the entire app from malicious requests.  
- 🗄 **Database Modeling** – MongoDB with Mongoose models & relationships for efficient data handling.  
- ⚠️ **Global Error Handling** – Centralized input validation and middleware-driven error handling.  
- 📝 **Logging Mechanisms** – Improved debugging & monitoring with structured logs.  
- 📧 **Email Reminders** – Automated, smart reminders with workflows powered by [Upstash](https://upstash.com).  

---

## 🛠 Tech Stack

- **Frontend**: Next.js  
- **Backend**: Express.js (Monolithic Architecture)  
- **Database**: MongoDB + Mongoose  
- **Caching & Queue**: Redis  
- **Email Services**: Nodemailer + Upstash workflows  
- **Security**: Arcjet (Rate limiting & bot protection)  
- **Infrastructure**: Hostinger VPS  
- **Language**: JavaScript  

---

## ⚙️ Architecture

This project follows a **Monolithic Architecture** pattern where the frontend and backend logic are integrated.  

```text
Next.js (Frontend) → Express.js (Backend API) → MongoDB (Database)
                                  ↓
                              Redis (Cache)
                                  ↓
                      Nodemailer + Upstash (Emails)
                                  ↓
                             Arcjet (Security)
```
---

## Quick Start
git clone https://github.com/yourusername/your-repo.git
cd your-repo
npm install
npm run dev
npm run build && npm start

---

##Environment Variables
# Server
PORT=8080
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000

# MongoDB
MONGO_URI=your_mongo_connection

# Redis (Upstash)
REDIS_URL=your_redis_url

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
EMAIL_FROM="CloudIt <no-reply@yourdomain.com>"

# Arcjet
ARCJET_KEY=your_arcjet_key

# Upstash Workflows
UPSTASH_WORKFLOW_REST_URL=https://<region>.workflows.upstash.io
UPSTASH_WORKFLOW_REST_TOKEN=xxxx

---

## 📦 Deployment

- Hosted on **Hostinger VPS** with Node.js & Nginx.  
- Ensure **SSL (HTTPS)** setup for production security.  

---

## 🙏 Credits

This project was inspired and guided by this excellent video:  
▶️ [Complete Backend Course | Build and Deploy Your First Production-Ready API](https://www.youtube.com/watch?v=rOpEN1JDaD0)  

