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
def index():
    if current_user.is_authenticated:
        return render_template('base2.html', title='Home')
    #return redirect(url_for('main_arthur'))
    
    return render_template('index.html', title='Home')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main_arthur'))
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
            next_page = url_for('main_arthur')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/arthur', methods=['GET', 'POST'])
@login_required
def main_arthur():
    '''
        Main page:
        - should be only accessible after the user successfully authenticates (signs in)
    '''
    userno = int(current_user.get_id())
    json = build_json_string(userno)

    # json = '[{"id":1,"title":"Python","notes":[{"id":1,"text":"do Python hw","tags":[], "status": 2}],"status":2}]' 

    return render_template('arthur.html', json=json)

@app.route('/register', methods=['GET', 'POST'])
def register():
    '''if current_user.is_authenticated:
        return redirect(url_for('index'))'''
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)
	
@app.route('/save', methods=['POST'])
@login_required
def save_request():
    '''
        Save request handler:
        - Takes the client's AJAX request and saves the content of the DataStore to the DB
    '''
    if not current_user.is_authenticated:
        # Save attempted from a non-logged in user!!
        print("Error: Save attempted from a non-logged in user.")
        return redirect(url_for('login'))

    dsJSON = request.form["json"]
    dsJSON = unquote(dsJSON)
    ds = json.loads(dsJSON)     # Build the DataStore object from the JSON
    
    try:
        print("DEBUG1: Calling update_db_from_datastore")
        result_ds = update_db_from_datastore(ds)

        return json.dumps(result_ds)
    except Exception as e:
        print("save_request failed: {}".format(e))
        raise

    return "failure"

@app.route('/queryall', methods=['GET', 'POST'])
def query_all_tables():
    print("Print all called") 
    # -----------------------------------------------------------
    con = db.engine.connect()
    sql_users = """
        SELECT * FROM User ORDER BY id
    """
    sql_sections = """
        SELECT * FROM Section ORDER BY id
    """
    sql_notes = """
        SELECT * FROM Note ORDER BY id
    """

    con = db.engine.connect()
    table_users = con.execute(sql_users)
    table_sections = con.execute(sql_sections)
    table_notes = con.execute(sql_notes)

    user_rows = table_users.fetchall()
    section_rows = table_sections.fetchall()
    notes_rows = table_notes.fetchall()
    
    str_users = "Selecting all user_rows: \n"
    str_users += "\n".join([str(elem) for elem in user_rows])

    str_sections = "Selecting all section_rows: {}".format(section_rows)
    str_sections += "\n".join([str(elem) for elem in section_rows])

    str_notes = "Selecting all notes_rows: {}".format(notes_rows)
    str_notes += "\n".join([str(elem) for elem in notes_rows])

    return str_users + "\n\n" + str_sections + "\n\n" + str_notes
#end-query_all_tables

@app.route('/deleter', methods=['GET', 'POST'])
def empty_sections_notes():
    con = db.engine.connect()
    sql_delete = """
        DELETE FROM Section
    """
    con.execute(sql_delete)
    db.session.commit()

    sql_delete = """
        DELETE FROM Note
    """
    con.execute(sql_delete)
    db.session.commit()
   
    return "deleted all notes and sections"
#end-query_all_tables


def update_db_from_datastore(ds):
    '''
        Take the DataStore object sent from the Client, and write to the DB
    '''
    userno = int(current_user.get_id())
    try:

        print("DEBUG2: inside update_db_from_datastore")
        print("DataStore:".format(ds))
        for section in ds:
            # Check if the current section already exists

            sql_section = None
            con = db.engine.connect()
           
            print("DEBUG3: ")

            if section['status'] == 0:   # Untouched -- skip
                continue
            elif section['status'] == 1: # Modified
                sql_section = """
                    UPDATE Section
                    SET body = '""" + section["title"] + """'
                    WHERE id = """ + str(section["id"]) + """
                """
                section["status"] = 0

                # Iterate over notes and perform the same op
                for note in section['notes']:
                    sql_note = None
                    if note['status'] == 0: # Untouched -- do nothing
                        continue
                    elif note['status'] == 1: # Modified
                        sql_note = """
                            UPDATE Note
                            SET body = '""" + note["text"] + """'
                            WHERE id = """ + str(note["id"]) + """
                        """
                        note["status"] = 0
                    elif note['status'] == 2: # Newly Created
                        # INSERT the Note records
                        sql_note = "INSERT INTO Note (body, user_id, section_id) VALUES ('" + note['text'] + "', " + str(userno) + ", " + str(section['id']) + ") "
                        con.execute(sql_note)
                        db.session.commit()
                        sql_note = None

                        # Grab the id of the new Section
                        sql_note_id = "SELECT id FROM Note WHERE section_id = " + str(section["id"]) + " ORDER BY id DESC LIMIT 1"
                        new_note_id = con.execute(sql_note_id).fetchone()[0]
                        note['id'] = new_note_id
                        note['status'] = 0

                    elif note['status'] == -1:
                        sql_note = """
                            DELETE FROM Note
                            WHERE id = """ + str(note["id"]) + """
                            """
                        con.execute(sql_note)
                        db.session.commit()
                        sql_note = None
                    else:
                        # Treat it as 0 -- do nothing
                        continue

                    if sql_note:
                        con.execute(sql_note)
                        db.session.commit()
                #end-for-notes

            elif section['status'] == 2:  # Created
                print("DEBUG4: ")
                # Note: because this is a new record, the id will be a junk value
                #   This junk id is IGNORED and gets updated with the correct id below

                # INSERT a new Section record
                sql_section = " INSERT INTO Section (body, user_id) VALUES ('" + section["title"] + "'," + str(userno) + ")"
                con.execute(sql_section)
                db.session.commit()
                sql_section = None

                # Grab the id of the new Section
                sql_section_get_id = "SELECT id FROM Section WHERE user_id = " + str(userno) + " ORDER BY id DESC LIMIT 1"
                new_section_id = con.execute(sql_section_get_id).fetchone()[0]
                section["id"] = new_section_id
                section["status"] = 0
                print("DEBUG5: ")

                # INSERT the Note records
                for note in section['notes']:
                    sql_note = "INSERT INTO Note (body, user_id, section_id) VALUES ('" + note['text'] + "', " + str(userno) + ", " + str(section['id']) + ") "
                    con.execute(sql_note)
                    db.session.commit()

                     # Grab the id of the new Section
                    sql_note_id = "SELECT id FROM Note WHERE section_id = " + str(section["id"]) + "ORDER BY id DESC LIMIT 1"
                    new_note_id = con.execute(sql_section_get_id).fetchone()[0]
                    note['id'] = new_note_id
                    note['status'] = 0

                #end-for-notes
            elif section['status'] == -1: # Deleted
                sql_section = """
                    DELETE FROM Section
                    WHERE id = """ + str(section["id"]) + """;
                    """
                con.execute(sql_section)
                db.session.commit()
                sql_section = None

                sql_note = """
                    DELETE FROM Note
                    WHERE section_id = """ + str(section['id']) + """
                    """
                con.execute(sql_note)
                db.session.commit()
                sql_note = None
            else:
                # Treat it as 0
                continue
            #end-if-else

            if sql_section: 
                con.execute(sql_section)
                db.session.commit()

        #end-for-section
        datastore = [section for section in ds if section["status"] != -1]
        return datastore

    except Exception as e:
        print("Error: update_db_from_datastore failed")
        print(e)
        raise
#end-update_db_from_datastore failed


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

    sql_sections = '''
        SELECT * 
        FROM Section 
        WHERE user_id = {0}
    ''' .format(userno)

    con = db.engine.connect()
    table = con.execute(sql_sections)
    sections_rows = table.fetchall()

    data_store = []

    # Populate the DataStore with sections
    for row in sections_rows:
        cur_section = {}
        cur_section["id"] = row[0]
        cur_section["title"] = row[1]
        cur_section["notes"] = []
        cur_section["status"] = 0

        sql_notes = '''
            SELECT * 
            FROM Note 
            WHERE section_id = {0} 
            ORDER BY id
        ''' .format(cur_section["id"])

        con = db.engine.connect()
        table = con.execute(sql_notes)
        notes_rows = table.fetchall()

        # Populate current section's notes array
        for row in notes_rows:
            cur_note = {}
            cur_note["id"] = row[0]
            cur_note["text"] = row[1]
            cur_note["tags"] = []  # Default to empty right now
            cur_note["status"] = 0

            cur_section["notes"].append(cur_note)
        #end-for-notes

        # Add this to the 
        data_store.append(cur_section)
    #end-for-sections

    return json.dumps(data_store)

