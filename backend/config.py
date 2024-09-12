# General configuration (development, production)

import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('COS60011_SECRET_KEY') or 'COS60011'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:password@localhost:5432/cos60011'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True # Set to False for productions