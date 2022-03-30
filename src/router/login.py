from flask import Blueprint, request, abort
from flask_login import login_user, logout_user, login_required, current_user

loginBlueprint = Blueprint("loginStuff", __name__, url_prefix="/")

def userTypes_required_decorator_factory(types):
	def decorator(func):
		def inner(*args, **kwargs):
			if current_user.userType in types:
				return func(*args, **kwargs)
			return abort(401, 'Unauthorized')
		return inner
	return decorator

@loginBlueprint.route('/login', methods=['GET'])
def login():
	# login_user()
	return {'name': 'Michael'}

@loginBlueprint.route('/logout')
@login_required
def logout():
	# logout_user()
	return 'ok'