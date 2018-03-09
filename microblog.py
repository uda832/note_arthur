from app import app, db
from app.models import User, Section, Note


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Section': Section, 'Note': Note}