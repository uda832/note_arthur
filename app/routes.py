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
    return render_template('arthur.html')

@app.route('/save', methods=['POST'])
def save_request():
    # Grab the json
    dsJSON = request.form["json"]
    dsJSON = unquote(dsJSON)
    ds = json.loads(dsJSON)
    
    print("***DEBUG***: YAAAY")
    print(ds[0].id)


    return "success"
    
    # Build DataStore object


