from flask import Blueprint, jsonify, request, session
from create_app import db
from app.models.db_models import *
from app.routes.auth import admin_login_required
from app.routes.utils import *

# Create a Blueprint for authentication routess
admin = Blueprint('admin', __name__)

# Dashboard Route
@admin.route('/dashboard', methods=['GET'])
@admin_login_required
def Dashboard():
    print(session)
    user = db.session.query(User).filter_by(user_id=session['user_id']).first()
    return jsonify({'message': 'Welcome to the admin Dashboard {}!'.format(user.first_name)})