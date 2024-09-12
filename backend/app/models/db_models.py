from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime


Base = declarative_base()

# User table
class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    user_type = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)

    profiles = relationship('UserProfile', backref='user')
    scores = relationship('UserScore', backref='user')

# UserProfile table
class UserProfile(Base):
    __tablename__ = 'userprofiles'
    
    profile_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    
    visa_type = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    english_proficiency = Column(String(50), nullable=False)
    overseas_experience = Column(String(50), nullable=False)
    australian_experience = Column(String(50), nullable=False)
    qualification = Column(String(255), nullable=False)
    australian_education = Column(Boolean, nullable=False)
    community_lang = Column(Boolean, nullable=False)
    regional_area = Column(Boolean, nullable=False)
    marital_status = Column(String(255), nullable=False)
    professional_year = Column(Boolean, nullable=False)
    nomination = Column(String(255), nullable=False)
    preferred_qualifications = Column(String(50), nullable=False)
    preferred_course = Column(String(100), nullable=False)
    preferred_industry = Column(String(100), nullable=False)
    preferred_location = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    scores = relationship('UserScore', backref='profile')

# UserScore table
class UserScore(Base):
    __tablename__ = 'userscore'

    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True, nullable=False)
    profile_id = Column(Integer, ForeignKey('userprofiles.profile_id'), primary_key=True, nullable=False)

    age_score = Column(Integer, nullable=False)
    english_score = Column(Integer, nullable=False)
    overseas_work_score = Column(Integer, nullable=False)
    aus_work_score = Column(Integer, nullable=False)
    quail_score = Column(Integer, nullable=False)
    aus_edu_score = Column(Integer, nullable=False)
    com_lang_score = Column(Integer, nullable=False)
    regional_score = Column(Integer, nullable=False)
    marital_score = Column(Integer, nullable=False)
    py_score = Column(Integer, nullable=False)
    nom_score = Column(Integer, nullable=False)
    total_score = Column(Integer, nullable=False)
