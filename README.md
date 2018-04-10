# Note Arthur

A simple note taking web application.

Term Project for CEN 4020 - Software Engineering

#Database Information

The actual database schema is found in the app folder, in models.py. This file has the user, section, note, and tags categories. All the other files are set up to let flask use this schema and store information.


#Instructions for running the website on a local host

The commands you have to use in command prompt (assuming Windows) are:
      "set FLASK_APP = app.py"
This command makes all your future commands with the word flask recognize you want to interact with your app.py

The next command you want to use is: 
      "flask db init"
This command intializes a database. If you type in "flask db" you can see various commands to interact with the database, it can give you a clearer understanding of what's going on.

Then you want to type in:
      "flask db migrate"
This command migrates the database, which is when you want to update the database's schema. Since you just intitialized the database, you will of course have to migrate so it can get the current database schema. This command does not make a permanent saved change however, and to do that you must use the command:
      "flask db upgrade"
      
After all 4 of these commands, if you type in "flask run" in your terminal you should be able to access the website via local host. 
