from flask import render_template, flash, redirect, url_for, request
from app import app, db
from app.forms import LoginForm, RegistrationForm
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from werkzeug.urls import url_parse
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
import jinja2


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
    '''if current_user.is_authenticated:
        return redirect(url_for('index'))'''
    form = LoginForm()
    if form.validate_on_submit():
        '''user = User.query.filter_by(username=form.username.data).first()'''
        name = form.username.data
        flash(name)
        sql=text('select * from User where username=="{0}"'.format(name))
        try:
            user=db.engine.execute(sql)
        except e:
            print(user.fetchone())
            print(e)
        if not user.fetchone():
            print("the user is not in the databse")
        if not user.fetchone() or not check_password_hash(user.fetchone()[3],form.password.data):
            '''
            record = user.fetchall()
            record[3]
            User.check_password(record[3])'''
            
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
        '''
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
		'''
        '''print(user.fetchmany())'''
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


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
    update_db_from_datastore_demo(ds)

    return "success"


		
	    
# def update_db_from_datastore_demo(ds):
#     '''
#         Example function to demonstrate how we will access the DataStore object
#     '''
#     user_name = "Uda Yeruultsengel" # Note: this should probably be set somewhere globally for each request
    
#     for section in ds:
#         # Check if the current section already exists
#         my_sql = '''
#             SELECT TOP 1 FROM dataSections A INNER JOIN dataUsers as B ON A.uID = B.uID
#             WHERE A.uID = ''' + user_name + ''' AND A.Title = ''' + section['title'] + '''
#             '''
#         # Note: this is a pseudo function 
#         section_exists = check_if_sql_returns_a_record(my_sql)

#         # Section already exists. So iterate over notes and perform UPDATE statements
#         if section_exists:
#             for note in section['notes']:
#                 # Perform the same check for notes 

#                 # If it already exists, perform UPDATE statement

#                 # Else, if it it doesn't exist, create a new record

#                 #

#                 for tag in note['tags']:


#                     sql = "SELECT Top 1 from datanotetags where ntID = 

#         # Section does not exist. Run a INSERT INTO statement
#         else:
#             my_sql_1 = '''
#                 DECLARE @NEXTKEY as int = ''' + grab_next_key() + '''
#                 DECLARE @title as nvarchar(max) = ''' + section['title'] +'''
#                 DECLARE @uid as int = ''' + grab_user_pk() +'''
#                 DECLARE @tags as nvarchar(max) = ''' + ','.join(section['tags']) +'''

#                 INSERT INTO dataSections
#                 (sID, Title, uID, Tags, GETDATE(), GETDATE())
#                 VALUES
#                 (@NEXTKEY, @title, @uid, @tags)
#                 '''
#             run_the_real_execute_function(my_sql_1)

#             # Do the same check and insertion or update for the dataNoteTags

#             # Then insert the notes into dataNotes
#             my_sql_2 = ''' the real sql to insert each notes'''
#             run_the_real_execute_function(my_sql_1)