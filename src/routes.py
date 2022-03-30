from flask import send_from_directory, send_file, request, abort
from . import app


@app.route("/")
def home():
	return send_from_directory("templates", "home.html")

@app.route("/patient")
def patientPage():
	return send_from_directory("templates", "patient.html")

@app.route("/dentist")
def dentistPage():
	return send_from_directory("templates", "dentist.html")

@app.route("/receptionist")
def receptionistPage():
	return send_from_directory("templates", "receptionist.html")