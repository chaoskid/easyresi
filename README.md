# EasyResi

EasyResi is a web application designed to predict the probability of achieving permanent residency through various Australian visas. It provides users with insights based on their specific profiles and visa options.

## Features
- **User Profile**: Input personal and professional information.
- **Visa Options**: Explore different Australian visa pathways.
- **Prediction Model**: Get probability estimates for successful residency outcomes.

## Tech Stack
- **Frontend**: JavaScript, HTML, CSS, ChakraUI
- **Backend**: Python

## Installation

1. Clone the repository:
   - `git clone https://github.com/chaoskid/easyresi.git`
   
2. Navigate to the project directory:
   - `cd easyresi`
   
3. Install dependencies:
   - `cd frontend`
   - `npm install`

## Usage

1. Start the virtual environment and backend:
   - `cd backend`
   - `python -m venv venv`
   - `venv\Scripts\activate`
   - `pip install -r requirements.txt`
   - `python migrate.py`
   - `python add_users.py`
   - `python app.py`
   
   
2. Start the frontend:
   - `npm run start`
   
3. Open your browser at `http://localhost:3000`.
   
4. Interact with the project! 
