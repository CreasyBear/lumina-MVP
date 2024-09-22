# Lumina AI-Assisted Consulting Tool

## Project Overview

Lumina is an AI-powered tool designed to assist in problem decomposition, analysis, and solution generation for complex consulting projects. It focuses on maintaining context throughout the development process and provides a comprehensive suite of features for consultants and business analysts.

## Key Features

1. Problem input interface
2. LLM-driven problem decomposition
3. Interactive visualization of problem segments and dependencies
4. Data capture and management for each segment
5. Progress tracking and reporting
6. Assumption management and impact analysis
7. Integration of literature reviews and data analysis
8. Modular AI model selection

## Technical Stack

- Frontend: Next.js with TypeScript
- Backend: Python with FastAPI
- Database: PostgreSQL
- AI Integration: LlamaIndex for multiple LLM support
- Deployment: Docker and Digital Ocean

## Project Status

The project has made significant progress in implementing key features and meeting technical requirements. The core functionality for problem management, analysis, and literature review is in place. Recent improvements include:

- Implementation of Clerk authentication for secure user management
- Creation of sign-in and sign-up pages using Clerk components
- Development of a custom user profile page
- Updated layout to include navigation with authentication-aware components
- Implementation of protected routes and API endpoints using Clerk middleware

## Setup and Installation

### Backend Setup

1. Clone the repository:
   ```
   git clone [repository_url]
   cd lumina-backend
   ```

2. Set up a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.lock
   ```

4. Set up environment variables:
   Create a `.env` file in the `lumina-backend` directory with the following variables:
   ```
   DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database_name]
   SECRET_KEY=[your_secret_key]
   ```

5. Run database migrations:
   ```
   alembic upgrade head
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ../lumina-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `lumina-frontend` directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Running the Application

### Backend
From the `lumina-backend` directory, run: