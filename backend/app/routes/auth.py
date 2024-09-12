# Authentication routes

from flask import Blueprint, request, jsonify
from app import db, bcrypt
from app.models.user import User

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Get JSON data from request
    firstname = data.get("fname")
    lastname = data.get('lname')
    email = data.get('email')
    password = data.get('pass')
    print("Hello {} {} !!".format(firstname,lastname))
    # Hash the password
    #hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    #new_user = User(username=username, email=email, password=hashed_password)
    
    # Add user to the database
    #db.session.add(new_user)
    #db.session.commit()
    
    return jsonify({"message": "User {} registered successfully!".format(email)}), 200

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

