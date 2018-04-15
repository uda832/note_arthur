rm -rf migrations/
rm app.db
export FLASK_APP=app.py
export FLASK_DEBUG=1
python3 -m flask db init
python3 -m flask db migrate
python3 -m flask db upgrade
python3 -m flask run
