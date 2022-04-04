from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
import json
from ..database import *

patientNameSpace = Namespace("patient", path="/patient")

db = Database(host="postgres", database="main", user="user", password="password")


patientFormatParser = patientNameSpace.model('Patient', {
		"SSN": fields.Integer(required=True),
		"first_name": fields.String(required=True),
		"middle_name": fields.String(required=False, default = None),
		"last_name": fields.String(required=True),
		"house_number": fields.Integer(required=True, default = 1),
		"street_name": fields.String(required=True),
		"city": fields.String(required=True),
		"province": fields.String(required=True),
		"gender": fields.String(required=True, default ='m'),
		"email": fields.String(required=True, default = "name@email.com"),
		"password": fields.String(required=True),
		"insurance":fields.String(required=True),
		"date_of_birth": fields.String(required=True, default='2022-04-06',description="Must follow format 'YYYY-MM-DD'"), 
		"age": fields.Integer(required=True),
		"guardianSSN": fields.Integer(required=False, default = None)
	})

@patientNameSpace.route("/")
class Patients(Resource):
	# Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@patientNameSpace.doc(description="Returns all patients")
	def get(self):
		# Query to select all patients from db
		dbQuery = db.execute("""Select * from person natural join patient""")
		print(dbQuery, flush=True)
		temp_dict = {}
		temp_list = []
		for elem in dbQuery:
			temp_dict["SSN"] = elem[0]
			temp_dict["first_name"] = elem[1]
			temp_dict["middle_name"] = elem[2]
			temp_dict["last_name"] = elem[3]
			temp_dict["house_number"] = elem[4]
			temp_dict["street_name"] = elem[5]
			temp_dict["city"] = elem[6]
			temp_dict["province"] = elem[7]
			temp_dict["gender"] = elem[8]
			temp_dict["email"] = elem[9]
			temp_dict["password"] = elem[10]
			temp_dict["insurance"] = elem[11]
			temp_dict["date_of_birth"] = elem[12].isoformat()
			temp_dict["age"] = elem[13]
			temp_dict["guardianSSN"] = elem[14]
			temp_list.append(temp_dict)
			temp_dict = {}
		print(temp_list, flush=True)
		return temp_list
	
	@patientNameSpace.expect(patientFormatParser, validate=True)
	def post(self):
		# get data to update or add
		data_patient = request.json
		dbQuery = db.execute(f"select * from person where ssn = {data_patient.get('SSN')}")
		
		# mechanism to deal with null
		middle_name =''
		if (data_patient.get("middle_name") != None):
			middle_name = (f"""'{data_patient.get("middle_name")}'""")
		else:
			middle_name = 'null'
		
		guardian =''
		if (data_patient.get("guardianSSN") != None):
			guardian = (f"""{data_patient.get("guardianSSN")}""")
		else:
			guardian = 'null'


		if (len(dbQuery) != 0):
			# sequence of instructions to update patient 
			db.execute(f"""update person set 
				first_name = '{data_patient.get("first_name")}',
				middle_name = {middle_name},
				last_name = '{data_patient.get("last_name")}',
				house_number = {data_patient.get("house_number")},
				street_name = '{data_patient.get("street_name")}',
				city = '{data_patient.get("city")}',
				province = '{data_patient.get("province")}',
				gender = '{data_patient.get("gender")}',
				email = '{data_patient.get("email")}',
				password = '{data_patient.get("password")}'
				where ssn = {data_patient.get("SSN")};""")
			db.execute(f"""update patient set 
				insurance = '{data_patient.get("insurance")}',
				date_of_birth = '{data_patient.get("date_of_birth")}',
				age = {data_patient.get("age")},
				guardianSSN = {guardian}
				where ssn = {data_patient.get("SSN")};""")
			db.commit()
		else :
			# sequence of instructions to add patient			
			temp_string = (f"""insert into person values
			(
				{data_patient.get("SSN")},
				'{data_patient.get("first_name")}',
				{middle_name},
				'{data_patient.get("last_name")}',
				{data_patient.get("house_number")},
				'{data_patient.get("street_name")}',
				'{data_patient.get("city")}',
				'{data_patient.get("province")}',
				'{data_patient.get("gender")}',
				'{data_patient.get("email")}',
				'{data_patient.get("password")}'
			);""")

			db.execute(f"""insert into person values
			(
				{data_patient.get("SSN")},
				'{data_patient.get("first_name")}',
				{middle_name},
				'{data_patient.get("last_name")}',
				{data_patient.get("house_number")},
				'{data_patient.get("street_name")}',
				'{data_patient.get("city")}',
				'{data_patient.get("province")}',
				'{data_patient.get("gender")}',
				'{data_patient.get("email")}',
				'{data_patient.get("password")}'
			);""")
			db.commit()
			db.execute(f"""insert into patient values
			(
				{data_patient.get("SSN")},
				'{data_patient.get("insurance")}',
				'{data_patient.get("date_of_birth")}',
				{data_patient.get("age")},
				{guardian}
			);""")
			db.commit()
		

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
