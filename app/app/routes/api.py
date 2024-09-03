# Other API routes
from flask import Blueprint, jsonify, request
from app.models.questionnaire import Questionnaire
from app import db

api = Blueprint('api', __name__)

# Testing root route
@api.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Flask application!'})


@api.route('/api/questionnaires', methods=['POST'])
def create_questionnaire():
    data = request.get_json() # Receive JSON data from the front-end

    # Validate data
    age = data.get('age')
    skills = data.get('skills')
    work_experience = data.get('work_experience')
    location_preference = data.get('location_preference')

    if not all([age, skills, work_experience, location_preference]):
        return jsonify({'error': 'Missing data'}), 400
    
    # Create a new Questionnaire entry
    new_entry = Questionnaire(
        age=age,
        skills=skills,
        work_experience=work_experience,
        location_preference=location_preference
    )

    # Add to the database
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Questionnaire submitted successfullly!', 'id': new_entry.id}), 201

@api.route('/api/questionnaires/<int:id>', methods=['GET'])
def get_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    return jsonify({
        "id": entry.id,
        "age": entry.age,
        "skills": entry.skills,
        "work_experience": entry.work_experience,
        "location_preference": entry.location_preference
    })

@api.route('/api/questionnaires', methods=['GET'])
def get_all_questionnaires():
    entries = Questionnaire.query.all()
    result = [{
        "id": entry.id,
        "age": entry.age,
        "skills": entry.skills,
        "work_experience": entry.work_experience,
        "location_preference": entry.location_preference
    } for entry in entries]
    return jsonify(result)

@api.route('/api/questionnaires/<int:id>', methods=['PUT'])
def update_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    data = request.get_json()

    entry.age = data.get('age', entry.age)
    entry.skills = data.get('skills', entry.skills)
    entry.work_experience = data.get('work_experience', entry.work_experience)
    entry.location_preference = data.get('location_preference', entry.location_preference)

    db.session.commit()
    return jsonify({'message': 'Questionnaire updated successfully!'})

@api.route('/api/questionnaires/<int:id>', methods=['DELETE'])
def delete_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Questionnaire deleted successfully!'})