# Authentication routes

from flask import Blueprint, request, jsonify, session
from app import db, bcrypt
from app.models.db_models import *
from functools import wraps

#Custom decorator for login manager
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("login required", session)
        if "user_id" not in session:
            return jsonify({"error":"Unauthorized access, please log in"}),401
        return f(*args, **kwargs)
    return decorated_function

# Create a Blueprint for authentication routess
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
    data = request.get_json()  
    email = data.get('email')
    password = data.get('password')
    print("login", session)
    try:
        # Check if user exists
        user = db.session.query(User).filter_by(email=email).first()

        if user and bcrypt.check_password_hash(user.password_hash, password):
            session['user_id'] = user.user_id
            print("login", session)
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"message": "Invalid credentials. Please try again"}), 401
        
    except Exception as e:
        print(e);
        db.session.rollback()
        return jsonify({'error': 'An unexpected error occurred: {}'.format(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    print('Session before logout:', session)  # Check session state
    if 'user_id' not in session:
        print('No user logged in during logout attempt.')
        return jsonify({'message': 'No user logged in.'}), 400
    print("logout plz")

    session.pop('user_id', None)
    session.clear()
    response = jsonify({'message': 'Logged out successfully'})
    response.set_cookie('session', '', expires=0)  # Clear the cookie

    print('Session after logout:', session)
    return jsonify({'message': 'Logged out successfully!'}), 200