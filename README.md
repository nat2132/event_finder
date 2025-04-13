# Event Finder Web Application

A full-stack web application for finding and managing events, built with React, Tailwind CSS, Django, and MySQL.

## Project Structure

- `frontend/` - React application with Tailwind CSS
- `backend/` - Django application with MySQL database

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Configure MySQL database in `backend/event_finder/settings.py`

6. Run migrations:
   ```
   python manage.py migrate
   ```

7. Start the Django server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Features

- User authentication and authorization
- Event creation, viewing, updating, and deletion
- Event search and filtering
- Responsive design with Tailwind CSS