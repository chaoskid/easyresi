from flask import Blueprint, jsonify, request, session
from app import db

from app.models.db_models import *
from app.routes.auth import login_required

api = Blueprint('api', __name__)

# Testing root route
@api.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Flask application!'})

# Dashboard Route
@api.route('/dashboard', methods=['GET'])
@login_required
def Dashboard():
    print(session)
    user = db.session.query(User).filter_by(user_id=session['user_id']).first()
    return jsonify({'message': 'Welcome to the Dashboard {}!'.format(user.first_name)})

# Create a new questionnaire entry
@api.route('/questionnaires', methods=['POST'])
def create_questionnaire():
    if request.method == 'POST':
        data = request.get_json()  # Receive JSON data from the front-end
        print("Received POST request")
        return(data)

    # Extract and validate data
    age = data.get('age')
    english_proficiency = data.get('english_proficiency')
    skilled_work_experience_overseas = data.get('skilled_work_experience_overseas')
    skilled_work_experience_aus = data.get('skilled_work_experience_aus')
    educational_qualification = data.get('educational_qualification')
    professional_year_in_aus = data.get('professional_year_in_aus')
    credentialled_community_language = data.get('credentialled_community_language')
    study_in_regional_aus = data.get('study_in_regional_aus')
    marital_status = data.get('marital_status')
    spouse_skills = data.get('spouse_skills')
    area_of_work_occupation = data.get('area_of_work_occupation')
    course_preferences = data.get('course_preferences')
    preferred_location = data.get('preferred_location')
    intended_budget = data.get('intended_budget')
    skills_work_experience_details = data.get('skills_work_experience_details')

    # Validate required fields
    required_fields = [age, english_proficiency, skilled_work_experience_overseas, skilled_work_experience_aus,
                       educational_qualification, professional_year_in_aus, study_in_regional_aus, marital_status,
                       area_of_work_occupation, course_preferences, preferred_location, intended_budget,
                       skills_work_experience_details]
    
    if not all(required_fields):
        return jsonify({'error': 'Missing data'}), 400
    
    # Create a new Questionnaire entry
    new_entry = Questionnaire(
        age=age,
        english_proficiency=english_proficiency,
        skilled_work_experience_overseas=skilled_work_experience_overseas,
        skilled_work_experience_aus=skilled_work_experience_aus,
        educational_qualification=educational_qualification,
        professional_year_in_aus=professional_year_in_aus,
        credentialled_community_language=credentialled_community_language,
        study_in_regional_aus=study_in_regional_aus,
        marital_status=marital_status,
        spouse_skills=spouse_skills,
        area_of_work_occupation=area_of_work_occupation,
        course_preferences=course_preferences,
        preferred_location=preferred_location,
        intended_budget=intended_budget,
        skills_work_experience_details=skills_work_experience_details
    )

    # Add to the database
    db.session.add(new_entry)
    db.session.commit()

    return jsonify({'message': 'Questionnaire submitted successfully!', 'id': new_entry.id}), 201

# Retrieve a specific questionnaire by ID
@api.route('/questionnaires/<int:id>', methods=['GET'])
def get_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    return jsonify({
        "id": entry.id,
        "age": entry.age,
        "english_proficiency": entry.english_proficiency,
        "skilled_work_experience_overseas": entry.skilled_work_experience_overseas,
        "skilled_work_experience_aus": entry.skilled_work_experience_aus,
        "educational_qualification": entry.educational_qualification,
        "professional_year_in_aus": entry.professional_year_in_aus,
        "credentialled_community_language": entry.credentialled_community_language,
        "study_in_regional_aus": entry.study_in_regional_aus,
        "marital_status": entry.marital_status,
        "spouse_skills": entry.spouse_skills,
        "area_of_work_occupation": entry.area_of_work_occupation,
        "course_preferences": entry.course_preferences,
        "preferred_location": entry.preferred_location,
        "intended_budget": entry.intended_budget,
        "skills_work_experience_details": entry.skills_work_experience_details
    })

# Retrieve all questionnaires
@api.route('/questionnaires', methods=['GET'])
def get_all_questionnaires():
    entries = Questionnaire.query.all()
    result = [{
        "id": entry.id,
        "age": entry.age,
        "english_proficiency": entry.english_proficiency,
        "skilled_work_experience_overseas": entry.skilled_work_experience_overseas,
        "skilled_work_experience_aus": entry.skilled_work_experience_aus,
        "educational_qualification": entry.educational_qualification,
        "professional_year_in_aus": entry.professional_year_in_aus,
        "credentialled_community_language": entry.credentialled_community_language,
        "study_in_regional_aus": entry.study_in_regional_aus,
        "marital_status": entry.marital_status,
        "spouse_skills": entry.spouse_skills,
        "area_of_work_occupation": entry.area_of_work_occupation,
        "course_preferences": entry.course_preferences,
        "preferred_location": entry.preferred_location,
        "intended_budget": entry.intended_budget,
        "skills_work_experience_details": entry.skills_work_experience_details
    } for entry in entries]
    return jsonify(result)

# Update a specific questionnaire entry
@api.route('/questionnaires/<int:id>', methods=['PUT'])
def update_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    data = request.get_json()

    # Update fields with new data
    entry.age = data.get('age', entry.age)
    entry.english_proficiency = data.get('english_proficiency', entry.english_proficiency)
    entry.skilled_work_experience_overseas = data.get('skilled_work_experience_overseas', entry.skilled_work_experience_overseas)
    entry.skilled_work_experience_aus = data.get('skilled_work_experience_aus', entry.skilled_work_experience_aus)
    entry.educational_qualification = data.get('educational_qualification', entry.educational_qualification)
    entry.professional_year_in_aus = data.get('professional_year_in_aus', entry.professional_year_in_aus)
    entry.credentialled_community_language = data.get('credentialled_community_language', entry.credentialled_community_language)
    entry.study_in_regional_aus = data.get('study_in_regional_aus', entry.study_in_regional_aus)
    entry.marital_status = data.get('marital_status', entry.marital_status)
    entry.spouse_skills = data.get('spouse_skills', entry.spouse_skills)
    entry.area_of_work_occupation = data.get('area_of_work_occupation', entry.area_of_work_occupation)
    entry.course_preferences = data.get('course_preferences', entry.course_preferences)
    entry.preferred_location = data.get('preferred_location', entry.preferred_location)
    entry.intended_budget = data.get('intended_budget', entry.intended_budget)
    entry.skills_work_experience_details = data.get('skills_work_experience_details', entry.skills_work_experience_details)

    db.session.commit()
    return jsonify({'message': 'Questionnaire updated successfully!'})

# Delete a specific questionnaire entry
@api.route('/questionnaires/<int:id>', methods=['DELETE'])
def delete_questionnaire(id):
    entry = Questionnaire.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Questionnaire deleted successfully!'})