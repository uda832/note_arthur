import os
from os.path import join, dirname
import sqlite3 as sql
from flask import Flask, request, Response, json, jsonify, render_template
import uuid

app = Flask(__name__, template_folder='static', static_folder='static')

app.config["DEBUG"] = True

#Route for /
@app.route("/")
def hello():
    print("****************************************************************************************************DEBUG: hello called")
    return render_template('/index.html')


#Make SQL cursor return dictionary 
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


#Post request method for saving
@app.route('/save', methods=['POST'])
def save():
    print("****************************************************************************************************DEBUG: save called")
    # dataStoreJSON = request.form['dataStore'];
    # # parse the dataStore object
    # # saves
    # con = sql.connect("temp.db")
    # con.row_factory = dict_factory
    # cur = con.cursor()

    # cur.execute("SELECT * FROM users WHERE sectionId=?", (,))
    # temp = cur.fetchone()
    # cur.close()
    # print(temp)
    # if email == temp["email"] and password == temp["password"]:
        # return jsonify({
            # 'auth': True,
            # 'user': {
                # "email": email,
                # "firstName": temp["firstName"],
                # "lastName": temp["lastName"]
                # }
        # })
    # else:
        # return jsonify({
            # 'auth': False
        # })

