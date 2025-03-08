
---

## **🔹 Backend (README.md)**  

📍 **Location:** `hashed-password-cracker-backend/README.md`  

```md
# 🛡️ Hashed Password Cracker - Backend (Node.js + Express + MongoDB)

This is the **backend** of the Hashed Password Cracker, built with **Node.js and Express.js**. It provides API endpoints to crack passwords using **Brute Force, Dictionary Attack, and Rainbow Table Attack**.

## Features
**User Signup & Login** (MongoDB Authentication)  
**Crack Hashed Passwords** (Brute Force, Dictionary, Rainbow Table)  
**MongoDB Storage** (Stores Users & Cracked Passwords)  
**REST API Endpoints** for Connecting with Frontend  
**Environment Variables** for Security  

## Tech Stack
- **Node.js** (Backend Framework)  
- **Express.js** (API Framework)  
- **MongoDB** (Database)  
- **Mongoose** (MongoDB ODM)  
- **Bcrypt.js** (For Password Hashing)  
- **Cors & Body-Parser** (Middleware)  
- **Render / Railway** (For Deployment)  

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|------------|
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | User login authentication |
| `POST` | `/crack` | Crack a password using Brute Force / Dictionary / Rainbow Table |

##  How to Run Locally  
```sh
git clone https://github.com/your-username/hashed-password-cracker-backend.git
cd hashed-password-cracker-backend
npm install
npm start
