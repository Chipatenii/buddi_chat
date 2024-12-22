# Buddi Chat (Real-Time Chat Application)

## Overview

The Buddi Chat Application is a web-based platform that allows users to join chat rooms, exchange real-time messages, and personalize their profiles. Built with scalability and responsiveness in mind, this project leverages WebSocket technology to deliver seamless real-time communication.

### Features

- Real-time messaging via WebSocket.
- Room creation and joining.
- User authentication and profile customization.
- Chat history storage.
- Responsive design for mobile and desktop.
- Bonus Features:
  - Upload profile pictures.
  - View user bios in chat rooms.

---

## Project Architecture

### High-Level Components

1. **Frontend**:
   - Built with React.js for an interactive and responsive user interface.
   - Manages user authentication and WebSocket connections.
2. **Backend**:
   - Node.js server using Express.js framework.
   - Handles user authentication, WebSocket communication, and API requests.
3. **Database**:
   - MongoDB stores user data, chat history, and profile information.
4. **WebSocket Communication**:
   - Socket.IO enables real-time, bidirectional communication between the server and clients.

### System Flow

1. Users authenticate via JWT-based login.
2. Users join or create chat rooms.
3. WebSocket establishes a connection for real-time message exchange.
4. Messages are stored in MongoDB for chat history retrieval.
5. Optional: Profile data (including bios and pictures) is accessible in chat rooms.

---

## Setup Instructions

### Prerequisites

- Node.js and npm installed ([Download Node.js](https://nodejs.org/))
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- Git installed ([Download Git](https://git-scm.com/))

### Steps

1. **Clone the Repository**:

   ```bash
   git clone <https://github.com/Chipatenii/buddi_chat>
   cd <buddi_chat>
   ```bash

2. **Install Dependencies**:

   ```bash
   npm install
   ```plaintext

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root.
   - Add the following variables:

     ```env
     PORT=3000
     MONGO_URI
     JWT_SECRET
     ```

4. **Run the Server**:
   - For development:

     ```bash
     npm run dev
     ```

   - For production:

     ```bash
     npm start
     ```

5. **Access the Application**:
   - Open your browser and go to: `http://localhost:3000`

---

## Usage Guidelines

### Local Usage

1. Register or log in to your account.
2. Create a chat room or join an existing one.
3. Send messages and view user bios in real time.

### Adding Profile Customizations

- Navigate to the profile section.
- Upload a picture and write a bio to display in chat rooms.

### Deployment

To deploy the application:

1. Use services like Netlify (frontend) and Heroku (backend).
2. Set environment variables on your deployment platforms.
3. Build the React frontend using:

   ```bash
   npm run build
   ```

4. Deploy the backend and frontend according to their respective guides.

---

## Project Structure

```
buddi_chat
├── public                 # Static files
├── src
│   ├── components         # React components
│   ├── pages              # React pages
│   ├── services           # API services
│   ├── App.js             # Main React app file
│   └── index.js           # Entry point for React
├── server
│   ├── models             # Mongoose schemas
│   ├── routes             # API routes
│   ├── sockets            # WebSocket events
│   ├── server.js          # Main server file
│   └── config.js          # Configuration files
├── .env                   # Environment variables
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

---

## Contributing

Feel free to submit issues or pull requests for feature requests and bug fixes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
