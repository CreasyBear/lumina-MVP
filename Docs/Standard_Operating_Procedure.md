# Standard Operating Procedure (SOP) for Lumina AI-Assisted Consulting Tool

## 1. Setup and Installation

### 1.1 Backend Setup
1. Clone the repository: `git clone [repository_url]`
2. Navigate to the backend directory: `cd lumina-backend`
3. Install dependencies: `pip install -r requirements.txt`
4. Set up environment variables:
   - Create a `.env` file in the `lumina-backend` directory
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database_name]
     OPENAI_API_KEY=[your_openai_api_key]
     ```
5. Run database migrations: `alembic upgrade head`

### 1.2 Frontend Setup
1. Navigate to the frontend directory: `cd ../lumina-frontend`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env.local` file in the `lumina-frontend` directory
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

## 2. Running the Application

### 2.1 Backend
1. From the `lumina-backend` directory, run: `uvicorn main:app --reload`
2. The API will be available at `http://localhost:8000`

### 2.2 Frontend
1. From the `lumina-frontend` directory, run: `npm run dev`
2. The frontend will be available at `http://localhost:3000`

## 3. Usage

### 3.1 Creating a New Problem
1. Navigate to the "New Problem" page
2. Fill in the problem details:
   - Title
   - Description
   - Client
3. Submit the form to create a new problem

### 3.2 Analyzing a Problem
1. From the problem list, select a problem to analyze
2. Enter your query in the analysis input field
3. Click "Analyze" to start the AI-powered analysis
4. View the results, including:
   - Analysis steps
   - Final response
   - Reflection
   - Structured output

### 3.3 Viewing Problem Segments
1. From the problem details page, navigate to the "Segments" tab
2. View the list of segments generated during analysis

## 4. Deployment

### 4.1 Backend Deployment
1. Choose a Python-compatible hosting platform (e.g., Heroku, DigitalOcean)
2. Set up the necessary environment variables on the hosting platform
3. Deploy the backend code to the chosen platform
4. Run database migrations on the production database

### 4.2 Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the built files to a static hosting service (e.g., Vercel, Netlify)
3. Set up the production API URL as an environment variable

## 5. Maintenance

### 5.1 Database Backups
1. Set up regular database backups (daily recommended)
2. Store backups in a secure, off-site location

### 5.2 Monitoring
1. Set up application monitoring (e.g., Sentry, New Relic)
2. Configure alerts for critical errors

### 5.3 Updates
1. Regularly update dependencies for both frontend and backend
2. Test thoroughly after each update
3. Deploy updates during low-traffic periods

## 6. Troubleshooting

### 6.1 Common Issues
1. API Connection Errors: Check the API URL and ensure the backend is running
2. Database Connection Issues: Verify the DATABASE_URL environment variable
3. OpenAI API Errors: Check the OPENAI_API_KEY and ensure sufficient credits

### 6.2 Support
For additional support, contact the development team at [support_email@example.com]