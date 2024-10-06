# Any entry point to run the Flask app

from create_app import createApp
from app.models.database import create_database, create_tables


app = createApp()

if __name__ == '__main__':
    create_database()  # Create the database if it doesn't exist
    create_tables()  # Create the necessary tables
    app.run(port=5002,debug=True)