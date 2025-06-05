# NeighbourNet

A community-focused platform connecting citizens with local NGOs to address and resolve community issues through collaborative volunteering.

## 🌟 Features

- 📝 Issue Reporting: Citizens can report community issues with location details and media
- 🤝 NGO Management: NGOs can claim and manage community issues
- 🏃 Volunteer System: Users can register for volunteer jobs and track their progress
- 💬 Real-time Chat: Communication between volunteers and NGOs
- 💰 Donation System: Platform for NGOs to showcase achievements and gather donations
- 📊 Analytics Dashboard: Monitor platform performance and community impact

## 🏗️ Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- Tailwind CSS
- Socket.IO for real-time features
- React Router for navigation
- Firebase integration
- Various UI libraries (Framer Motion, React Icons, etc.)

### Backend
- Node.js with Express
- MongoDB/Mongoose
- Socket.IO
- Stripe for payments
- Cloudinary for file storage
- Bcrypt for password hashing
- JWT for authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env` in both frontend and backend directories
- Fill in required environment variables

4. Start the development servers
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd ../backend
npm run dev
```

## 📁 Project Structure

```
NeighbourNet/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   └── public/
├── backend/            # Node.js backend server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── README.md
```

## 📝 Documentation

### User Roles
- **Regular Users**: Report issues and volunteer
- **NGOs**: Manage issues, volunteers, and donations
- **Admin**: Monitor platform performance and statistics

### Workflow
1. Users report community issues
2. NGOs claim and assign these issues
3. NGOs create volunteer jobs
4. Users register for volunteer positions
5. NGOs assign tasks to volunteers
6. Volunteers complete tasks and submit proofs
7. NGOs verify task completion
8. Issues are marked as resolved

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- Cookie-based session management
- CORS configuration
- Environment-based configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


