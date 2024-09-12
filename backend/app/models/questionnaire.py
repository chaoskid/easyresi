# Contains the Questionnaire model definition

from app import db  # Import SQLAlchemy instance from the main app

class Questionnaire(db.Model):
    __tablename__ = 'questionnaires'  # Name of the table in the PostgreSQL database

    # Define columns in the 'questionnaires' table
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer, nullable=False)
    english_proficiency = db.Column(db.String(64), nullable=False)
    skilled_work_experience_overseas = db.Column(db.Integer, nullable=False)
    skilled_work_experience_aus = db.Column(db.Integer, nullable=False)
    educational_qualification = db.Column(db.String(256), nullable=False)
    professional_year_in_aus = db.Column(db.Boolean, nullable=False)
    credentialled_community_language = db.Column(db.String(64), nullable=True)
    study_in_regional_aus = db.Column(db.Boolean, nullable=False)
    marital_status = db.Column(db.String(64), nullable=False)
    spouse_skills = db.Column(db.String(256), nullable=True)
    area_of_work_occupation = db.Column(db.String(256), nullable=False)
    course_preferences = db.Column(db.String(256), nullable=False)
    preferred_location = db.Column(db.String(256), nullable=False)
    intended_budget = db.Column(db.Float, nullable=False)
    skills_work_experience_details = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Questionnaire {self.id}>'
