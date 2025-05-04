# PDF Chat Backend

This is the backend server for a PDF chat application that allows users to upload PDF documents and interact with them using AI.

---

## 🔧 Features

- File upload endpoint for PDF documents
- Integration with Qdrant vector database
- Redis queue for processing uploaded files
- Chat functionality powered by OpenAI or HuggingFace

---

## 📦 Prerequisites

- Node.js (v18 or higher)
- Redis (for queue management)
- Qdrant (for vector storage)
- Docker (optional, for running services)

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory with the following values:

```env
HUGGING_FACE_API=your_huggingface_api_key
QUDRANT_URL=http://your_qdrant_url
VALKEY_URL=your_redis_url
HUGGING_FACE_BASE_URL=https://router.huggingface.co/nebius/v1
```
🚀 Installation

git clone https://your-repo-url.git

cd server

npm install


---

### ✅ `client/README.md` – **Frontend**

```markdown
# PDF Chat Frontend

This is the frontend application for a PDF chat interface that allows users to upload PDF documents and interact with them using AI.

---

## 🧩 Features

- Modern, responsive UI built with React and Shadcn UI
- Real-time chat interface with loading states
- File upload functionality for PDF documents
- Clerk authentication integration
- Connection to backend API

---

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- React development environment

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `client` directory with the following values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
BACKEND_URL=http://your_backend_url
