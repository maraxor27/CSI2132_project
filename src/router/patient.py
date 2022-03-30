from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields

patientNameSpace = Namespace("patient", path="/patient")

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
        "date_of_birth": fields.String(required=True, description="Must follow format 'DD/MM/YYYY"), 
        "age": fields.Integer(required=True),
        "guardianSSN": fields.Integer(required=True)
	})

@patientNameSpace.route("/")
class Patients():
    # Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@exampleNamespace.doc(description="Returns all patients")
    def get(self):
        # TODO : create function to get all patients
    
    @patientNameSpace.expect(patientFormatParser, validate=True)
    def post(self)
        # TODO: create function to add new patient to DB

@patientNameSpace.route("/<int:ssn>")
@patientNameSpace.doc(params={"ssn":"ssn",}, description="ssn of a patient")
class PatientsID():
    @exampleNamespace.doc(description="Returns patient information")
    def get(self):
        # TODO : create function to get specific patient based on ssn
    
    @exampleNamespace.doc(description="Delete patient with ssn")
    def delete(self):
        # TODO: add function to delete patient based on ssn 
    
    @patientNameSpace.expect(patientFormatParser, validate=True)
    def put(self):
        # TODO: add function to edit patient info based on ssn
