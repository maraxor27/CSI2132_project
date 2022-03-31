from flask import Flask
from flask_login import LoginManager
from .database import Database
import os

params = {
	'dbname': 'main',
	'username': 'user',
	'password': 'password',
	'host': 'postgres',
	'port': 5432
}

db = Database(host="postgres", database="main", user="user", password="password")

from .router import *

def create_flask_app():	
	app = Flask(__name__, static_url_path="/static")
	app.env = "development"
	app.app_context().push()

	loginManager = LoginManager()
	loginManager.init_app(app)
	app.secret_key = os.urandom(24)

	@loginManager.user_loader
	def load_user(SSN):
		result = db.execute(f"""SELECT SSN, email, password FROM person 
		WHERE SSN={SSN}""")
		if len(result) == 1:
			return User(*result[0])
		return None

	app.register_blueprint(loginBlueprint)
	app.register_blueprint(apiv2Blueprint)
	return app


if __name__ == "myapp":
	app = create_flask_app()
	from .routes import *