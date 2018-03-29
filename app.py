from app import app, db
from app.models import User, Section, Note, Tag


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Section': Section, 'Note': Note, 'Tag': Tag}

#To try to run the website type in: set FLASK_APP=app.py    and then type in: flask run