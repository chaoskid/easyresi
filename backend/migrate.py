import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float
from config import Config

# Step 1: Create a database engine
def get_db_engine():
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    return engine

# Step 2: Create the unicourse, cost_of_living, and occupation_shortage tables using raw SQL or SQLAlchemy
def create_custom_tables(engine):
    metadata = MetaData()

    unicourse = Table('unicourse', metadata,
                      Column('course_id', Integer, primary_key=True, nullable=False, autoincrement=True),
                      Column('course', String(100), nullable=False),
                      Column('sector', String(20), nullable=False),
                      Column('uni', String(50), nullable=False),
                      Column('state', String(20),nullable=False),
                      Column('course_type', String(20), nullable=False),
                      Column('duration', Float, nullable=False),
                      Column('fee', Integer, nullable=False),
                      Column('uni_rank', Integer, nullable=False))

    
    cost_of_living = Table('cost_of_living', metadata,
                           Column('city_id', Integer, primary_key=True, nullable=False, autoincrement=True),
                           Column('city_name', String(20), nullable=False),
                           Column('state', String(20), nullable=False),
                           Column('min_cost', Integer, nullable=False),
                           Column('max_cost', Integer, nullable=False))

    
    occupation_shortage = Table('occupation_shortage', metadata,
                                Column('anzsco', Integer, primary_key=True),
                                Column('occupation', String(255), nullable=False),
                                Column('nsw_shortage', Integer, nullable=False),
                                Column('vic_shortage', Integer, nullable=False),
                                Column('qld_shortage', Integer, nullable=False),
                                Column('sa_shortage', Integer, nullable=False),
                                Column('wa_shortage', Integer, nullable=False),
                                Column('tas_shortage', Integer, nullable=False),
                                Column('nt_shortage', Integer, nullable=False),
                                Column('act_shortage', Integer, nullable=False),
                                Column('sector', String(20), nullable=False))

    # Create the tables in the database
    metadata.create_all(engine)
    print("Custom tables created successfully")

# Step 3: Load data from CSVs and insert into the custom tables
def load_data(engine):
    # Load CSVs into dataframes
    unicourse_df = pd.read_csv('app/data_sets/unicourse.csv').dropna(axis=1, how='all')
    cost_of_living_df = pd.read_csv('app/data_sets/cost_of_living.csv').dropna(axis=1, how='all')
    occupation_shortage_df = pd.read_csv('app/data_sets/occupation_shortage.csv').dropna(axis=1, how='all')

    # Insert data into unicourse table
    unicourse_df.to_sql('unicourse', con=engine, if_exists='overwrite', index=False)

    # Insert data into cost_of_living table
    cost_of_living_df.to_sql('cost_of_living', con=engine, if_exists='overwrite', index=False)

    # Insert data into occupation_shortage table
    occupation_shortage_df.to_sql('occupation_shortage', con=engine, if_exists='overwrite', index=False)

    print("Data loaded successfully")

# Main function to create tables and load data
def main():
    engine = get_db_engine()

    # Create the custom tables
    create_custom_tables(engine)

    # Load data from CSV files and insert into the custom tables
    load_data(engine)

if __name__ == "__main__":
    main()
