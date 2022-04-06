import json
from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from ..database import *

branchNameSpace = Namespace("branch", path="/branch")

db = Database(host="postgres", database="main", user="user", password="password")

@branchNameSpace.route("/")
class Branches(Resource):
	# Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@branchNameSpace.doc(description="Returns all branches in the database")
	def get(self):
		query = "SELECT * FROM branch"
		result = db.execute(query)
		dict = {}
		list = []
		if (len(result)!=0):
			for r in result:
				dict["branch_id"] = r[0]
				dict["city"] = r[1]
				list.append(dict)
				dict = {}
			return list
		else:
			return "No branches in the database"

@branchNameSpace.route("/<int:branch_id>/dentist")
@branchNameSpace.doc(params={"branch_id":"branch_id"}, description="branch_id of a branch")
class BranchID(Resource):
	@branchNameSpace.doc(description="Returns all the dentist in the databases that belong to the given branch_id")
	def get(self, branch_id):
		query = "SELECT person.ssn, employee.employee_type, employee.salary, employee.branch_id, employee.is_manager, person.first_name, person.middle_name, person.last_name  FROM person join employee on person.ssn=employee.ssn WHERE employee.branch_id = " + str(branch_id) + " and employee.employee_type='dentist'"
		result = db.execute(query)
		dict = {}
		list = []
		if (len(result)!=0):
			for r in result:
				dict["ssn"] = r[0]
				dict["employee_type"] = r[1]
				dict["salary"] = float(r[2])
				dict["branch_id"] = r[3]
				dict["is_manager"] = r[4]
				dict["first_name"] = r[5]
				dict["middle_name"] = r[6]
				dict["last_name"] = r[7]
				list.append(dict)
				dict = {}
			print(list, flush=True)
			return list
		else:
			return "No branches in the database"

