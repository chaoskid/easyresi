from flask import Blueprint, jsonify, request, session
from create_app import db, bcrypt
import pickle
from app.models.db_models import *
from app.routes.auth import login_required
from app.routes.utils import *

api = Blueprint('api', __name__)

# Testing root route
@api.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to the Flask application!'})

# Dashboard Route
@api.route('/dashboard', methods=['GET'])
@login_required
def Dashboard():
    user = db.session.query(User).filter_by(user_id=session['user_id']).first()
    return jsonify({'message': 'Welcome to the Dashboard {}!'.format(user.first_name)})

# Create a new questionnaire entry
@api.route('/questionnaire', methods=['POST','GET'])
@login_required
def create_questionnaire():
    if request.method == 'GET':
        try:
            ques_data = get_ques_data(db)
            existing_profile_entry = db.session.query(UserProfile).filter_by(user_id=session['user_id']).first()
            if existing_profile_entry:
                prefill_data=prefill_ques(existing_profile_entry)
            else:
                prefill_data = None

            return jsonify({
                            'type':'success',
                            'message': 'occupations fetched successfully!', 
                            'data':{'occupations':ques_data, 'prefill_data':prefill_data}}), 201
        except Exception as e:
                print(e)
                return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500
    
    if request.method == 'POST':
        data = request.get_json()  # Receive JSON data from the front-end
        input_json = get_input_json(data)
        profile_entry = get_or_update_profile_entry(input_json,db)
        try:
            existing_profile_entry = db.session.query(UserProfile).filter_by(user_id=session['user_id']).first()
            if existing_profile_entry:
                get_or_update_profile_entry(input_json,db,existing_profile_entry)
            else:
                db.session.add(profile_entry)
                db.session.commit()
            existing_score_entry = db.session.query(UserScore).filter_by(user_id=session['user_id']).first()
            if existing_score_entry:
                get_or_update_points(profile_entry,db,existing_score_entry)
            else:
                user_score_entry = get_or_update_points(profile_entry,db)
                db.session.add(user_score_entry)
                db.session.commit()
            return jsonify({'type':'success','message': 'Questionnaire and points submitted and successfully!'}), 201
        except Exception as e:
            print(e)
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500

# Retrieve a specific questionnaire by ID
@api.route('/userprofile', methods=['GET'])
@login_required
def userprofile():
    try:
        user_id=session['user_id']
        entry = db.session.query(UserProfile).filter_by(user_id=user_id).first()
        return jsonify({
            'type':'success',
            'message': 'Questionnaire retreived successfully',
            'data': {
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
        }}), 200
    except Exception as e:
        return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500

# preview results
@api.route('/preview_results', methods=['POST','GET'])
@login_required
def preview_results():
    if request.method == 'POST':
        data = request.get_json()
        input_json = get_input_json(data)
        profile_entry = get_or_update_profile_entry(input_json,db)
        try:
            with open('app/models/resipro', 'rb') as f:
                model = pickle.load(f)
            user_score_entry = get_or_update_points(profile_entry,db)
            model_inputdf=generate_model_input(profile_entry,user_score_entry)
            pr_prob = get_pr_prob(model,model_inputdf)
            prob_for_other_states=get_pr_prob_for_states(profile_entry,model_inputdf,model)
            prob_for_other_occupations = get_pr_prob_for_jobs(model,model_inputdf,db,profile_entry)
            uni_recommendations=recommend_uni(db,profile_entry)
            return jsonify({
                'type' : 'success',
                'message': 'Permanent residency recommendations calculated successfully',
                'data' : {
                        'probability_of_permanent_residency': pr_prob,
                        'probability_of_other_states':prob_for_other_states,
                        'probability_of_other_jobs':prob_for_other_occupations,
                        'uni_recommendations_based_on_fee':uni_recommendations["by_fee"],
                        'uni_recommendations_based_on_rank':uni_recommendations["by_rank"],
                        'user_input_for_prefill_or_save':data
                    }
                })
        except Exception as e:
            print(e)
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500

@api.route('/recommendations/<int:input_user_id>', methods=['GET'])
@login_required
def recommendations(input_user_id):
    try:
        profile = db.session.query(UserProfile).filter_by(user_id=input_user_id).first()
        scores = db.session.query(UserScore).filter_by(user_id=input_user_id).first()
        with open('app/models/resipro', 'rb') as f:
            model = pickle.load(f)
        model_inputdf=generate_model_input(profile,scores)
        pr_prob = get_pr_prob(model,model_inputdf)
        prob_for_other_occupations = get_pr_prob_for_jobs(model,model_inputdf,db,profile)
        prob_for_other_states=get_pr_prob_for_states(profile,model_inputdf,model)
        uni_recommendations=recommend_uni(db,profile)
        cost_of_living = cost_of_living(profile) # call cost of living function
        return jsonify({
                'type' : 'success',
                'message': 'Permanent residency recommendations calculated successfully',
                'data' : {
                        'probability_of_permanent_residency': pr_prob,
                        'probability_of_other_states':prob_for_other_states,
                        'probability_of_other_jobs':prob_for_other_occupations,
                        'uni_recommendations_based_on_fee':uni_recommendations["by_fee"],
                        'uni_recommendations_based_on_rank':uni_recommendations["by_rank"],
                        # add cost of living
                        'cost_of_living': cost_of_living
                    }
                })
    except Exception as e:
        return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500
    
@api.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'GET':
        try:
            user_id=session['user_id']
            print(user_id)
            entry = db.session.query(User).filter_by(user_id=user_id).first()
            if entry:
                return jsonify({
                        'type' : 'success',
                        'message': 'User detail retreived successfully',
                        'data' : {
                                'first_name':entry.first_name,
                                'last_name':entry.last_name,
                                'email': entry.email
                            }
                        })
            else:
                return jsonify({'type':'error','message': 'User not found'}), 404
        except Exception as e:
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        try:
            user_id=session['user_id']
            print(user_id)
            user = db.session.query(User).filter_by(user_id=user_id).first()
            hashed_new_password = bcrypt.generate_password_hash(data.get('new_password')).decode('utf-8')
            if user:
                user.first_name = data.get('first_name')
                user.last_name = data.get('last_name')
                user.email = data.get('email')
                if data.get('new_password'):
                    print('request to change pw')
                    hashed_new_password = bcrypt.generate_password_hash(data.get('new_password')).decode('utf-8')
                    if bcrypt.check_password_hash(user.password_hash, hashed_new_password):
                        user.password_hash = hashed_new_password
                        db.session.commit()
                    else:
                        return jsonify({'type':'error','message': 'Invalid Credentials'}), 409
                else:
                    db.session.commit()
                    print('updated changes to db')

                return jsonify({
                        'type' : 'success',
                        'message': 'User detail updated successfully',
                        'data' : {
                                'first_name':user.first_name,
                                'last_name':user.last_name,
                                'email': user.email
                            }
                        })
            else:
                return jsonify({'type':'error','message': 'User not found'}), 404
        except Exception as e:
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500
        
