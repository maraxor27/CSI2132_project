import json
from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from ..database import *

branchNameSpace = Namespace("branch", path="/branch")

db = Database(host="postgres", database="main", user="user", password="password")

appointmentroom = branchNameSpace.model('Room', {
		"room_num": fields.Integer(required=True),
	})

class Room:
	def __init__(self, room_id, room_num):
		self.room_id = room_id
		self.room_num = room_num

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
class BranchDenstis(Resource):
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

@branchNameSpace.route("/<int:branch_id>/room")
@branchNameSpace.doc(params={"branch_id":"branch_id"}, description="branch_id of a branch")
class BranchRooms(Resource):
	@branchNameSpace.doc(description="Returns all the rooms in the databases that belong to the given branch_id")
	def get(self, branch_id):

		result = db.execute(f"SELECT room_id, room_num FROM room WHERE branch_id={branch_id}")

		return [Room(*args).__dict__ for args in result]
		

	@branchNameSpace.expect(appointmentroom, validate=True)
	def post(self, branch_id):
		(max_id,) = db.execute("SELECT MAX(room_id) as max FROM room")[0]
		if len(db.execute(f"SELECT * FROM room WHERE branch_id={branch_id} and room_num={request.json.get('room_num')}")) != 0:
			abort(400, "Room number already exist!")

		db.execute(f"INSERT INTO room VALUES ({max_id+1},{branch_id},{request.json.get('room_num')})")
		db.commit()
		result = db.execute(f"SELECT room_id, room_num FROM room WHERE room_id={max_id+1}")[0]
		return Room(*result).__dict__
