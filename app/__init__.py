from flask import Flask,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

if __name__=="__main__":
    app.run()

#Route for /
@app.route("/")
def main():
    return "aaaaaaaaaaaaaaaaaaa"
