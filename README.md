# CaseAtlas

CaseAtlas is a modern web platform designed for tracking cases, providing persistent official updates, and fostering discussions. Built with a robust Next.js frontend and a Node.js/Express backend, it offers real-time notifications and a seamless user experience.

## 🌐 Live Demo

**Website:** [https://case-atlas-five.vercel.app](https://case-atlas-five.vercel.app)

## ✨ Features

- **Case Tracking & Subscriptions**: Subscribe to cases and stay informed.
- **Official Updates**: Persistent, moderator-driven official updates for each case.
- **Media Uploads**: Seamless image, video, and document uploads during case creation and updates.
- **Real-time Notifications**: Instant alerts for new updates and interactions via Socket.io.
- **Modern UI**: Fully responsive, accessible, and dynamic user interface.
- **Secure Authentication**: Robust user authentication system.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** [React](https://reactjs.org/)
- **Authentication:** [Next-Auth](https://next-auth.js.org/)
- **Real-time:** [Socket.io-client](https://socket.io/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-time:** [Socket.io](https://socket.io/)
- **Media Storage:** [Cloudinary](https://cloudinary.com/)
- **Security:** [Helmet](https://helmetjs.github.io/), JWT, Bcrypt

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) database
- [Cloudinary](https://cloudinary.com/) account for media storage

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/animegamer4422/CaseAtlas.git
   cd CaseAtlas
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory and add your environment variables (refer to `.env.example`).
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   ```
   Create a `.env.local` file in the `Frontend` directory with necessary variables (like backend API URL and NextAuth secret).
   
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
