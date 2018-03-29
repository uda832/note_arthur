To run the app: set FLASK_APP=microblog.py    and then type in: flask run

To create the database:
    flask db init
    flask db migrate
    flask db upgrade

To interact with the database:
    flask shell

    u = User(username = 'rbhuyan1', email = 'hello')
    db.session.add(u)
    db.session.commit() #Makes permanent changes to the database

    u = User.query.get(1) #Gets the user who has the user ID of 1

    u #Will return the user at hand

    To refresh the database:  #This is in the flask shell
    users = User.query.all()
    for u in users:
         db.session.delete(u)