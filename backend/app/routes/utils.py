from create_app import db
from app.models.db_models import *
import pandas as pd

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
    },
    "state": {
        "nsw": 1,
        "vic": 2,
        "qld":3,
        "sa":4,
        "wa":5,
        "tas":6,
        "nt":7,
        "act":8
    }
}

def generate_model_input(profile,scores):
    input_data = {
        "age_group_score": scores.age_group_score,
        "english_proficiency_score": scores.english_proficiency_score,
        "overseas_experience_score": scores.overseas_experience_score,
        "australian_experience_score": scores.australian_experience_score,
        "qualification_score": scores.qualification_score,
        "specialist_education_score": scores.specialist_education_score,
        "australian_education_score": scores.australian_education_score,
        "professional_year_score": scores.professional_year_score,
        "community_lang_score": scores.community_lang_score,
        "regional_area_score": scores.regional_area_score,
        "marital_status_score": scores.marital_status_score,
        "nomination_score": scores.nomination_score,
        "industry_score": scores.industry_score,
        "state": points_table["state"][str(profile.preferred_location).lower()],
        "sol_score": scores.sol_score,
        "total_score": scores.total_score,
        "anzco": int(profile.preferred_occupation)
    }
    model_inputdf = pd.DataFrame([input_data], columns=[
    'age_group_score',
    'english_proficiency_score',
    'overseas_experience_score',
    'australian_experience_score',
    'qualification_score',
    'specialist_education_score',
    'australian_education_score',
    'professional_year_score',
    'community_lang_score',
    'regional_area_score',
    'marital_status_score',
    'nomination_score',
    'industry_score',
    'state',
    'sol_score',
    'total_score',
    'anzco'
    ])

    return model_inputdf

def get_pr_prob(model,df):
    y_proba=model.predict_proba(df)
    pr_prob = round(float(y_proba[:, 1][0]*100),3)
    return pr_prob

def get_pr_prob_for_states(model,df):
    prob_for_states = {}
    states = {1:"NSW",2:"VIC",3:"QLD",4:"SA",5:"WA",6:"TAS",7:"NT",8:"ACT"}
    for state in points_table["state"].values():
        df['state'] = state
        y_proba=model.predict_proba(df)
        prob_class_1 = round(float(y_proba[:, 1][0]*100),3)
        prob_for_states[states[state]] = prob_class_1
    return prob_for_states

def get_pr_prob_for_jobs(model,df,db,profile):
    prob_for_jobs={}

    industry=db.session.query(JobsShortage.sector).filter_by(anzsco=int(df['anzco'][0])).first()

    column_to_select = getattr(JobsShortage, str(profile.preferred_location).lower() + "_shortage")
    jobs = db.session.query(JobsShortage.anzsco).filter_by(sector=industry[0]).order_by(column_to_select).limit(5).all()

    for job in jobs:
        df['anzco']=job[0]
        y_proba=model.predict_proba(df)
        prob_class_1 = round(float(y_proba[:, 1][0]*100),3)
        prob_for_jobs[job[0]] = prob_class_1
    
    return prob_for_jobs

