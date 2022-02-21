from flask import send_from_directory, send_file, request, abort
from . import app


@app.route("/")
def home():
	return send_from_directory("templates", "home.html")