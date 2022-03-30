from flask import Flask

from .database import Database
import os
from .router import *

params = {
	'dbname': 'main',
	'username': 'user',
	'password': 'password',
	'host': 'postgres',
	'port': 5432
}

db = Database(host="postgres", database="main", user="user", password="password")

def create_flask_app():	
	app = Flask(__name__, static_url_path="/static")
	app.env = "development"
	app.app_context().push()
	app.register_blueprint(loginBlueprint)
	app.register_blueprint(apiv2Blueprint)
	return app


if __name__ == "myapp":
	app = create_flask_app()
	from .routes import *