from flask import Flask, request, Response, json, jsonify, render_template, flash, redirect, url_for
from urllib.parse import unquote
import json

from app import app
from app.forms import LoginForm


@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Rohan'}
    posts = [
        {
            'author': {'username': 'Rohan1'},
            'body': 'This should be the first textfile, username should show Rohan1'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'This should be the second textfile, username should show Rohan2'
        }
    ]
    return render_template('index.html', title='Home', user=user, posts=posts)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for user {}, remember_me={}'.format(
            form.username.data, form.remember_me.data))
        return redirect(url_for('index'))
    return render_template('login.html',  title='Sign In', form=form)


@app.route('/arthur', methods=['GET', 'POST'])
def main_arthur():
    '''
        Main page:
        - should be only accessible after the user successfully authenticates (signs in)
    '''

    return render_template('arthur.html')

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
    # update_db_from_datastore_demo(ds)

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
