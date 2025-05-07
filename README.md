# 🧾 Invoice Management System

A full-stack web application to manage and update invoice data with an intuitive interface.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (with TailwindCSS & HeroIcons)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB Atlas

### 🚀 Deployment

- **Frontend:** Netlify  
- **Backend:** AWS EC2  
- **Database:** MongoDB Atlas

---

## 📋 Features

- View and manage a table of invoices.
- Inline editing of invoice fields with auto-calculation:
  - `CGST = 2.5% of taxable value`
  - `SGST = 2.5% of taxable value`
  - `Invoice value = taxable + CGST + SGST`
- Prevents editing of inactive invoices.
- Real-time updates to MongoDB Atlas.
- Clean UI with responsive design.
- Print-friendly table view.

---

## 🚀 Live Demo

🔗 **Frontend URL:** [your-netlify-url]  
🔗 **Backend API:** [your-EC2-IP or domain]

---

## 🔧 Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/invoice-management-system.git
cd invoice-management-system
```
### 2. Environment Variables
Create a .env file in both frontend/ and backend/ folders with appropriate keys.

### 3. Frontend Setup(ReactJS)
```bash
cd frontend
npm install
npm start
```

### 4. Backend Setup(FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🌐 Deployment Overview

- Frontend: Pushed to GitHub and connected to Netlify.
- Backend: Hosted on AWS EC2 with Nginx reverse proxy and Gunicorn.
- MongoDB Atlas: Used as cloud NoSQL database (ensure EC2 IP is whitelisted).