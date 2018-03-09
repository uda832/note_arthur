from datetime import datetime
from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    sections = db.relationship('Section', backref='user', lazy='dynamic')
    notes = db.relationship('Note', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    notes = db.relationship('Note', backref='section', lazy='dynamic')
    tags = db.relationship('Tag', backref='section', lazy='dynamic')

    def __repr__(self):
        return '<Section {}>'.format(self.body)


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    note_id = db.Column(db.Integer, db.ForeignKey('section.id'))
    tags = db.relationship('Tag', backref='note', lazy='dynamic')
    parent = db.Column(db.Integer, db.ForeignKey('self'))

    def __repr__(self):
        return '<Note {}>'.format(self.body)


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.column(db.String(140))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    note_id = db.Column(db.Integer, db.ForeignKey('note.id'))
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'))

    def __repr__(self):
        return '<Note {}>'.format(self.body)