from flask import Flask, request, Response, json, jsonify, render_template, flash, redirect, url_for
from urllib.parse import unquote
from flask_login import current_user, login_user, logout_user, login_required
from flask_login import UserMixin
from app.models import User
from werkzeug.urls import url_parse
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
import jinja2
import json

from app import app, db
from app.forms import LoginForm, RegistrationForm


@app.route('/')
@app.route('/index')
@login_required
def index():
    user = {'username': 'Rohan'}
    posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('index.html', title='Home', posts=posts)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    con = db.engine.connect()
    if form.validate_on_submit():
        user = con.execute('SELECT * FROM User WHERE username=="{0}"'.format(form.username.data))
        theUser = user.fetchone()
        if not theUser:
            flash("Invalid username or password")
            return redirect(url_for('login'))
        if not check_password_hash(theUser[3],form.password.data):
            flash("Invalid username or password")
            return redirect(url_for('login'))
        loginUser = User.query.filter_by(username=theUser[1]).first()
        login_user(loginUser,remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/arthur', methods=['GET', 'POST'])
def main_arthur():
    '''
        Main page:
        - should be only accessible after the user successfully authenticates (signs in)
    '''
    userno = 1
    json = build_json_string(userno)
    

    return render_template('arthur.html', json=json)

@app.route('/register', methods=['GET', 'POST'])
def register():
    '''if current_user.is_authenticated:
        return redirect(url_for('index'))'''
    form = RegistrationForm()
    con = db.engine.connect()
    if form.validate_on_submit():
        '''user = User(username=form.username.data, email=form.email.data)'''
        '''user.set_password(form.password.data)'''
        username=form.username.data
        email=form.email.data
        password_hash=generate_password_hash(form.password.data)
        '''db.session.add(user)'''
        con.execute('INSERT INTO User (username,email,password_hash) VALUES ("{0}","{1}","{2}")'.format(username,email,password_hash))
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)
	
@app.route('/save', methods=['POST'])
def save_request():
    '''
        Save request handler:
        - Takes the client's AJAX request and saves the content of the DataStore to the DB
    '''
    dsJSON = request.form["json"]
    dsJSON = unquote(dsJSON)
    ds = json.loads(dsJSON)     # Build the DataStore object from the JSON
    

    # Note to Bo, Rohan, etc. (everyone that's setting up the DB access logic)
    #   At this point, you can access the exact DataStore object which contains the new notes 
    #   I've written a demo function that iterates over the DataStore and accesses each information
    #   Please reference this and write the function to run the INSERT sql statements
    #update_db_from_datastore_demo(ds)

    return "success"
"""
def update_db_from_datastore_demo(ds):
    '''
        Example function to demonstrate how we will access the DataStore object
    '''
    user_name = "Uda Yeruultsengel" # Note: this should probably be set somewhere globally for each request
    
    for section in ds:
        # Check if the current section already exists
        my_sql = '''
            SELECT TOP 1 FROM dataSections A INNER JOIN dataUsers as B ON A.uID = B.uID
            WHERE A.uID = ''' + user_name + ''' AND A.Title = ''' + section['title'] + '''
            '''
        # Note: this is a pseudo function 
        section_exists = check_if_sql_returns_a_record(my_sql)

        # Section already exists. So iterate over notes and perform UPDATE statements
        if section_exists:
            for note in section['notes']:
                # Perform the same check for notes 

                # If it already exists, perform UPDATE statement

                # Else, if it it doesn't exist, create a new record

        # Section does not exist. Run a INSERT INTO statement
        else:
            my_sql_1 = '''
                DECLARE @NEXTKEY as int = ''' + grab_next_key() + '''
                DECLARE @title as nvarchar(max) = ''' + section['title'] +'''
                DECLARE @uid as int = ''' + grab_user_pk() +'''
                DECLARE @tags as nvarchar(max) = ''' + ','.join(section['tags']) +'''

                INSERT INTO dataSections
                (sID, Title, uID, Tags, GETDATE(), GETDATE())
                VALUES
                (@NEXTKEY, @title, @uid, @tags)
                '''
            run_the_real_execute_function(my_sql_1)

            # Do the same check and insertion or update for the dataNoteTags

            # Then insert the notes into dataNotes
            my_sql_2 = ''' the real sql to insert each notes'''
            run_the_real_execute_function(my_sql_1)
"""


# class UserInfo:
#     def __init__(self, current_user):
#         self.current_user = 
#     #end-init



def build_json_string(userno):
    '''
    This function builds the JSON string from the DB for the current user.
    '''

    '''
    0 -- id
    1 -- body
    2 -- timestamp
    3 -- user_id
    4 -- notes
    5 -- tags
    '''

    sql_sections = 'SELECT * FROM Section WHERE user_id = {0}'.format(userno)
    '''
        SELECT * 
        FROM Section 
        WHERE user_id = {0}
    .format(userno)'''

    con = db.engine.connect()
    table = con.execute(sql_sections)
    sections_rows = table.fetchall()

    data_store = []

    # Populate the DataStore with sections
    for row in sections_rows:
        cur_section = {}
        cur_section.id = row[0]
        cur_section.title = row[1]
        cur_section.notes = []

        sql_notes = 'SELECT * FROM Note WHERE section_id = "{0}"'.format(cur_section.id)
        '''
            SELECT * 
            FROM Note 
            WHERE section_id = {0} 
        ''' .format(cur_section.id)

        con = db.engine.connect()
        table = con.execute(sql_notes)
        notes_rows = table.fetchall()

        # Populate current section's notes array
        for row in notes_rows:
            cur_note.id = row[0]
            cur_note.text = row[1]
            cur_note.tags = []  # Default to empty right now

            cur_section.notes.append(cur_note)
        #end-for-notes

        # Add this to the 
        data_store.append(cur_section)
    #end-for-sections


    return json.dumps(data_store)