rm -rf migrations/
rm app.db
export FLASK_APP=app.py
python3 -m flask db init
python3 -m flask db migrate
python3 -m flask db upgrade
python3 -m flask run --host='0.0.0.0'
