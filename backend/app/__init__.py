# Initialise the Flask app and extensions

from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from config import Config

# Initialise extensions
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'  # Redirect to 'auth.login' when login is required
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialise extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # Enable CORS for the entire app
    CORS(app)

    # Testing root route
    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Welcome to the Flask application!'})

    # Register Blueprints
    from app.routes.api import api as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    from app.routes.auth import auth_bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app