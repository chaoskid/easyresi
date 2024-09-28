from flask import Blueprint, jsonify, request, session
from create_app import db

from app.models.db_models import *
from app.routes.auth import login_required

from app.routes.utils import points_table

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
@api.route('/questionnaire', methods=['POST','GET'])
@login_required
def create_questionnaire():
    if request.method == 'POST':
        data = request.get_json()  # Receive JSON data from the front-end
        print(session)
        # Extract and validate data
        visa_type = data.get('visaType')
        age_group = data.get('age')
        english_proficiency = data.get('englishProficiency')
        overseas_experience = data.get('overseasExperience')
        australian_experience = data.get('australiaExperience')
        qualification = data.get('education')
        australian_education = data.get('australianStudy')
        specialist_education = data.get('specialistEducation')
        community_lang = str(data.get('communityLanguage')[0])
        professional_year = data.get('professionalYear')
        regional_area = str(data.get('regionalStudy')[0])
        marital_status = data.get('maritalStatus')
        nomination = data.get('nomination')
        preferred_location = data.get('statePreferred')
        preferred_industry = data.get('preferredIndustry')
        preferred_qualifications = data.get('courseLevel')
        preferred_course = data.get('preferredCourse')
        preferred_occupation = data.get('preferredOccupation')
        # Validate required fields
        required_fields = [age_group, english_proficiency, overseas_experience, australian_experience,qualification, australian_education, specialist_education, community_lang, professional_year, regional_area, marital_status, nomination, preferred_location, preferred_industry, preferred_qualifications, preferred_course, preferred_occupation]
        print(required_fields)
        if not all(required_fields):
            return jsonify({'error': 'Missing data'}), 400

        # Create a new Questionnaire entry
        new_entry = UserProfile(
            user_id=session['user_id'],
            visa_type = visa_type,
            age_group=age_group,
            english_proficiency=english_proficiency,
            overseas_experience=overseas_experience,
            australian_experience=australian_experience,
            qualification=qualification,
            australian_education=australian_education,
            specialist_education=specialist_education,
            community_lang=community_lang,
            professional_year=professional_year,
            regional_area=regional_area,
            marital_status=marital_status,
            nomination=nomination,
            preferred_location=preferred_location,
            preferred_industry=preferred_industry,
            preferred_qualifications=preferred_qualifications,
            preferred_course=preferred_course,
            preferred_occupation=preferred_occupation
        )

        # Add to the database
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({'message': 'Questionnaire submitted successfully!', 'id': new_entry.user_id}), 201
    loggedin_user = session['user_id']
    user = db.session.query(User).filter_by(user_id=loggedin_user).first()
    return jsonify({'message': 'user is logged in', 'user_id': user.user_id, 'user_fname':user.first_name}), 201

# Retrieve a specific questionnaire by ID
@api.route('/userprofile/<int:user_id>', methods=['GET'])
def userprofile(user_id):
    entry = db.session.query(UserProfile).filter_by(user_id=user_id).first()
    return jsonify({
        "user_id": entry.user_id,
        "age": entry.age_group,
        "english_proficiency": entry.english_proficiency,
        "overseas_experience": entry.overseas_experience,
        "australian_experience": entry.australian_experience,
        "qualification": entry.qualification,
        "australian_education": entry.australian_education,
        "specialist_education": entry.specialist_education,
        "community_lang": entry.community_lang,
        "professional_year": entry.professional_year,
        "regional_area": entry.regional_area,
        "marital_status": entry.marital_status,
        "nomination": entry.nomination,
        "preferred_location": entry.preferred_location,
        "preferred_industry": entry.preferred_industry,
        "preferred_qualifications": entry.preferred_qualifications,
        "preferred_course": entry.preferred_course,
        "preferred_occupation": entry.preferred_occupation
    })


@api.route('/update_points/<int:input_user_id>', methods=['GET'])
def update_points(input_user_id):

    profile = db.session.query(UserProfile).filter_by(user_id=input_user_id).first()
    age_group_score = points_table["age"][profile.age_group]
    english_proficiency_score = points_table["english_proficiency"][profile.english_proficiency]
    overseas_experience_score = points_table["overseas_experience"][profile.overseas_experience]
    australian_experience_score = points_table["australian_experience"][profile.australian_experience]
    qualification_score = points_table["qualification"][profile.qualification]
    australian_education_score = points_table["australian_education"][profile.australian_education]
    specialist_education_score = points_table["specialist_education"][profile.specialist_education]
    community_lang_score = points_table["community_lang"][profile.community_lang]
    regional_area_score = points_table["regional_area"][profile.regional_area]
    marital_status_score = points_table["marital_status"][profile.marital_status]
    professional_year_score = points_table["professional_year"][profile.professional_year]
    nomination_score = points_table["nomination"][profile.nomination]

    job = db.session.query(JobsShortage).filter_by(anzsco=profile.preferred_occupation).first()

    preferred_state_value = getattr(job, str(profile.preferred_location).lower() + "_shortage")

    industry_score=preferred_state_value
    #sol = db.session.query(SolList).filter_by(anzsco=prfile.preferred_occupation).first()
    #sol_score = sol.sol_score
    sol_score = 5
    total_score = age_group_score + english_proficiency_score + overseas_experience_score + australian_experience_score + qualification_score +\
        australian_education_score + specialist_education_score + community_lang_score + regional_area_score + marital_status_score +\
        professional_year_score + nomination_score + industry_score + sol_score

    new_entry = UserScore(
        user_id=profile.user_id,
        profile_id=profile.profile_id,
        age_group_score=age_group_score,
        english_proficiency_score=english_proficiency_score,
        overseas_experience_score=overseas_experience_score,
        australian_experience_score=australian_experience_score,
        qualification_score=qualification_score,
        australian_education_score=australian_education_score,
        specialist_education_score=specialist_education_score,
        community_lang_score=community_lang_score,
        regional_area_score=regional_area_score,
        marital_status_score=marital_status_score,
        professional_year_score=professional_year_score,
        nomination_score=nomination_score,
        industry_score=industry_score,
        sol_score=sol_score,
        total_score=total_score
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify({"age_group_score":age_group_score,
    "english_proficiency_score":english_proficiency_score,
    "overseas_experience_score: ":overseas_experience_score,
    "australian_experience_score: ":australian_experience_score,
    "qualification_score: ":qualification_score,
    "australian_education_score: ":australian_education_score,
    "specialist_education_score: ":specialist_education_score,
    "community_lang_score: ":community_lang_score,
    "regional_area_score: ":regional_area_score,
    "marital_status_score: ":marital_status_score,
    "professional_year_score: ":professional_year_score,
    "nomination_score: ":nomination_score,
    "industry_score: ":industry_score,
    "sol_score: ":sol_score,
    "total_score: ":total_score})



'''
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
'''