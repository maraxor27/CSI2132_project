from flask import Blueprint, request, abort
from flask_login import login_user, logout_user, login_required, current_user
from .. import db
loginBlueprint = Blueprint("loginStuff", __name__, url_prefix="/")

def userTypes_required_decorator_factory(types):
	def decorator(func):
		def inner(*args, **kwargs):
			if current_user.userType in types:
				return func(*args, **kwargs)
			return abort(401, 'Unauthorized')
		return inner
	return decorator

@loginBlueprint.route('/login', methods=['POST'])
def login():
	if current_user is not None and current_user.is_authenticated:
		return current_user.__dict__
	
	if request is None or request.json is None:
		abort(400, "Empty request") 
	
	if not request.json.get('email') or not request.json.get('password'):
		abort(400, "email or password is missing in the json")

	query = f"SELECT SSN, email, password FROM person \
WHERE email='{request.json.get('email')}' and password='{request.json.get('password')}';"
	result = db.execute(query)
	
	
	if len(result) != 1:
		abort(400, "Invalide email password") 
	
	user = User(*(result[0])) 
	login_user(user)
	return user.__dict__
	

@loginBlueprint.route('/logout')
@login_required
def logout():
	logout_user()
	return 'ok'

class User:
	def __init__(self, SSN, email, password):
		self.SSN = SSN
		self.email = email
		self.password = password

	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.SSN


	