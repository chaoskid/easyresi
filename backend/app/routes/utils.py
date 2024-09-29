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

def get_pr_prob_for_states(model,df):
    prob_for_states = {}
    states = {1:"NSW",2:"VIC",3:"QLD",4:"SA",5:"WA",6:"TAS",7:"NT",8:"ACT"}
    for state in points_table["state"].values():
        df['state'] = state
        #print(df)
        y_proba=model.predict_proba(df)
        prob_class_1 = round(float(y_proba[:, 1][0]*100),3)
        print("Probability of PR in {}:".format(states[state]),prob_class_1)
        prob_for_states[states[state]] = prob_class_1
    return prob_for_states
