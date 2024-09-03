# Contains the Questionnaire model definition

from app import db #Import SQLAlchemy instance from the main app.

class Questionnaire(db.Model):
    __tablename__ = 'questionnaires' # Name of the table in the PostgreSQL database

    # Define columns in the 'questionnaires' table
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer, nullable=False)
    skills = db.Column(db.String(256), nullable=False)
    work_experience = db.Column(db.Integer, nullable=False)
    location_preference = db.Column(db.String(64), nullable=False)

    def __repr__(self):
        return f'<Questionnaire {self.id}>' # Return a string representation of the object