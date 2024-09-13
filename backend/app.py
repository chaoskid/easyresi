# Any entry point to run the Flask app

from app import create_app
from app.models.database import create_database, create_tables


app = create_app()

if __name__ == '__main__':
    create_database()  # Create the database if it doesn't exist
    create_tables()  # Create the necessary tables
    app.run(debug=True)