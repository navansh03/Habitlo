# HabitLo — Full-Stack Habit Tracker (Go Fiber + React Native)

HabitLo is a lightweight, streak-based habit tracking application built with:

- **Go Fiber** backend (REST API)
- **React Native (Expo)** frontend
- **Axios** for client-server communication

The project demonstrates a clean full-stack architecture suitable for rapid prototyping, mobile learning, and production-ready extension.

---

## 🚀 Features

- Add new habits
- Daily check-in with automatic **streak tracking**
- Real-time updates on mobile
- Persistent API layer with clear separation of concerns
- Responsive UI built with React Native components (`FlatList`, `Pressable`, `TextInput`)
- CORS-enabled Go Fiber backend to support Expo on real devices

---

## 🏗 Tech Stack

### **Frontend (Mobile)**
- React Native (Expo)
- TypeScript
- Axios
- FlatList-based performant rendering

### **Backend**
- Go Fiber v2
- REST API routing
- In-memory data store (zero-config, extendable)
- CORS middleware

---

## 📱 Mobile App Screens

> - Add habit  
> - List all habits  
> - Check-in to increase streak  
> - Updated UI with native components  

(Screenshots coming soon)

---

## 📦 Project Structure

habitlo/
├── mobile/ # Expo React Native frontend
└── backend/ # Go Fiber backend


---

## ⚙️ Local Development

### 1. Clone repo

git clone https://github.com/
<your-username>/habitlo.git


### 2. Backend Setup (Go Fiber)



cd backend
go mod tidy
go run main.go


Server runs at:



http://localhost:8080


### 3. Mobile Setup (Expo)



cd mobile
npm install
npx expo start


Open Expo Go on your iPhone and scan the QR.

---

## 🌐 Networking (Important)

When using a real device, replace `localhost` with your **local machine IP**:



http://192.168.x.x:8080


Update in:



mobile/api/habits.ts


---

## 🔮 Future Improvements

- SQLite or PostgreSQL persistence  
- Push notifications for habits  
- Authentication & user profiles  
- Weekly analytics screen  
- Offline-first caching  

---
