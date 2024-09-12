# Authentication routes

from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models.db_models import *

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get JSON data from request
    firstname = data.get("fname")
    lastname = data.get('lname')
    email = data.get('email')
    password = data.get('pass')
    
    # Check if the email exists in the database
    user = db.session.query(User).filter_by(email=email).first()
    if user:
        return jsonify({'error': 'User already exists for this email'}), 409
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = User(first_name=firstname, last_name=lastname, user_type="applicant", email=email, password_hash=hashed_password)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'message': 'User created successfully!',
            'user': {
                'id': new_user.user_id,
                'first_name': new_user.first_name,
                'last_name': new_user.last_name,
                'email': new_user.email
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An unexpected error occurred: {}'.format(e)}), 500
    
    

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get JSON data from request
    email = data.get('email')
    password = data.get('password')

    # Check if user exists
    user = User.query.filter_by(email=email).first()
    
    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Login failed!"}), 401

