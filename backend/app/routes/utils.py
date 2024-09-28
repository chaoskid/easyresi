from create_app import db
from app.models.db_models import *

points_table = {
    'age': {
        "18-25":25,
        "25-33":30,
        "33-40":25,
        "40-45":15
    },
    "english_proficiency" : {
        "competent" : 0,
        "proficient" : 10,
        "superior": 20
    },
    "overseas_experience" : {
        "0":0,
        "3-5":5,
        "5-8":10,
        "8+":15
    },
    "australian_experience" : {
        "0":0,
        "1-3":5,
        "3-5":10,
        "5-8":15,
        "8+":20
    },
    "qualification": {
        "phd":20,
        "bachelor":15,
        "diploma":10,
        "qualification":10
    },
    "specialist_education": {
        "yes":10,
        "no":0
    },
    "australian_education" : {
        "yes":5,
        "no":0
    },
    "professional_year": {
        "yes":5,
        "no":0
    },
    "community_lang" : {
        "yes":5,
        "no":0
    },
    "regional_area" : {
        "yes":5,
        "no":0
    },
    "marital_status": {
        "single":10,
        "married_skilled":10,
        "married_unskilled":5
    },
    "nomination" : {
        "yes":5,
        "no":0
    }
}

'''

def calculate_points(input_user_id):

    #get user inputs from database
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

    #setting industry value
    job=db.session.query(JobsShortage).filter_by(anzsco=prfile.preferred_occupation).first()
    preferred_state = getattr(JobsShortage, profile.preferred_location)
    industry_score=job.preferred_state
    sol = db.session.query(SolList).filter_by(anzsco=prfile.preferred_occupation).first()
    sol_score = sol.sol_score
    total_score = age_group_score + english_proficiency_score + overseas_experience_score + australian_experience_score + qualification_score \
        australian_education_score + specialist_education_score + community_lang_score + regional_area_score + marital_status_score + \
        professional_year_score + nomination_score + industry_score + sol_score
    
    new_entry = UserScore(
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

    return "User profile updated successfully"

'''