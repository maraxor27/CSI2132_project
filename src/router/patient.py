from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from ..database import *

patientNameSpace = Namespace("patient", path="/patient")

db = Database(host="postgres", database="main", user="user", password="password")


patientFormatParser = patientNameSpace.model('Patient', {
		"SSN": fields.Integer(required=True),
		"first_name": fields.String(required=True),
		"middle_name": fields.String(required=True),
		"last_name": fields.String(required=True),
		"house_number": fields.Integer(required=True),
		"street_name": fields.String(required=True),
		"city": fields.String(required=True),
		"province": fields.String(required=True),
		"gender": fields.String(required=True),
		"email": fields.String(required=True),
		"password": fields.String(required=True),
		"insurance":fields.String(required=True),
		"date_of_birth": fields.String(required=True, description="Must follow format 'YYYY-MM-DD"), 
		"age": fields.Integer(required=True),
		"guardianSSN": fields.Integer(required=True)
	})

@patientNameSpace.route("/")
class Patients(Resource):
	# Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@patientNameSpace.doc(description="Returns all patients")
	def get(self):
		# TODO : create function to get all patients
		return
	
	@patientNameSpace.expect(patientFormatParser, validate=True)
	def post(self):
		# TODO: create function to add new patient to DB
		return

@patientNameSpace.route("/<int:ssn>")
@patientNameSpace.doc(params={"ssn":"ssn"}, description="ssn of a patient")
class PatientsID(Resource):
	@patientNameSpace.doc(description="Returns patient information")
	def get(self):
		# TODO : create function to get specific patient based on ssn
		return
	
	@patientNameSpace.doc(description="Delete patient with ssn")
	def delete(self):
		# TODO: add function to delete patient based on ssn 
		return
	
	@patientNameSpace.expect(patientFormatParser, validate=True)
	def put(self):
		# TODO: add function to edit patient info based on ssn
		return
