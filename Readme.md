# MindForge 🌌

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

**MindForge** is an AI-powered learning assistant that provides context-aware doubt resolution. It allows students to upload their syllabus and course materials, then interacts with them using a grounded RAG (Retrieval-Augmented Generation) system to ensure accurate, hallucination-free answers.

## 📸 Dashboard Preview

![MindForge Dashboard](mindforge-frontend/public/images/dashboard.png)

## 🚀 Key Features

- **Context-Aware Doubt Resolution**: Answers are strictly grounded in your uploaded PDF materials.
- **Multilingual Support**: Interact with the AI in multiple languages (English, Hindi, etc.).
- **Firebase Authentication**: Secure login via Google and Phone OTP with a modern Glassmorphism UI.
- **Adaptive Explanations**: Choose between "Quick Answer" or "Step-by-Step" modes and adjust difficulty levels.
- **No Hallucinations**: Built-in logic to ensure the AI only answers based on provided syllabus materials.

---

## 🛠️ Tech Stack

**Frontend:**

- **React (Vite)**: Modern component-based UI.
- **Tailwind CSS**: Premium Glassmorphism styling.
- **Firebase Auth**: Secure user management.

**Backend:**

- **FastAPI**: High-performance Python backend.
- **Groq API (Llama 3.3)**: State-of-the-art LLM for fast reasoning.
- **ChromaDB**: Vector database for semester-wide material indexing.

---

## 📥 Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Groq API Key

### Setup

1. **Clone and Install Backend**:

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Setup Frontend**:
   ```bash
   cd mindforge-frontend
   npm install
   npm run dev
   ```

---

## 👥 Team Members

- **Sourav Lenka** (23cse115) - _Team Leader_
- **Binita Swain** (23cse071)
- **Biswajit Swain** (23cse168)
- **Shivam Patro** (23cse192)

---

<p align="center">
  Built with ❤️ by the MindForge Team
</p>
