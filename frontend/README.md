React + Python Project
Project Structure
#React+Python_Test/ ├── backend/ # Python backend └── frontend/ # React frontend

Requirements
Python 3.x
Node.js
npm (Node Package Manager)
pip (Python Package Manager)
Virtual environment (optional but recommended)
Installation & Run
To simplify the installation and run process, a script setup.sh is provided. Run the following command:

sh setup.sh

#This script will install dependencies for both the backend and frontend, and start both servers.

#[Include license information here, if applicable]


### קובץ `setup.sh`:

```bash
#!/bin/bash

# Backend setup
echo "Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "Backend setup completed."

# Running backend server
echo "Running backend server..."
python app.py &

# Frontend setup
echo "Setting up frontend..."
cd ../frontend
npm install
echo "Frontend setup completed."

# Running frontend server
echo "Running frontend server..."
npm start
 # Place the setup.sh file in the root directory of the project (at the same level as the backend and frontend folders). Make the file executable with the following command:
 chmod +x setup.sh
sh setup.sh