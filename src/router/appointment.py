from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from .. import db

appointmentNameSpace = Namespace("appointment", path="/appointment")

appointmentFormatParser = appointmentNameSpace.model('appointment', {
		"patientSSN": fields.Integer(required=True),
		"employeeSSN": fields.Integer(required=True),
		"type": fields.String(required=True),
		"appoitment_date": fields.Date(required=True),
		"start_time": fields.FormatedString(required=True),
		"end_time": fields.FormatedString(required=True),
		"status": fields.String(required=True),
		"invoice_id": fields.Integer(required=True),
		"room_id": fields.Integer(required=True),
	})

procedureFormatParser = appointmentNameSpace.model('procedure', {
		"procedure_code": fields.Integer(required=True),
		"procedure_type": fields.String(required=True),
		"description": fields.String(required=True),
		"tooth_involved": fields.String(required=True),
		"medication": fields.String(required=True),
		"status": fields.String(required=True),
		"fee": fields.Float(required=True)
	})

treatmentFormatParser = appointmentNameSpace.model('treatment', {
		"treatment_type": fields.String(required=True),
		"comments": fields.String(required=True),
		"tooth_involved": fields.String(required=True),
		"symptoms": fields.String(required=True),
		"medication": fields.String(required=True),
		"status": fields.String(required=True),
		"fee": fields.Float(required=True)
	})

class Appointment:
	def __init__(self, apt_id, p_ssn, e_ssn, apt_type, start, end, status, invoice_id, room_id):
		self.appointment_id = apt_id
		self.patientSSN = p_ssn
		self.employeeSSN = e_ssn
		self.appointment_type = apt_type
		self.start_time = start
		self.end_time = end
		self.status = status
		self.room_id = room_id


class Procedure:
	def __init__(self, proc_id, proc_code, proc_type, description, tooths, med, apt_id, fee_id):
		self.procedure_id = proc_id
		self.procedure_code = proc_code
		self.procedure_type = proc_type
		self.description = description
		self.tooth_involved = tooths
		self.medication = med
		self.appointment_id = apt_id
		self.fee_id = fee_id

class Treatment:
	def __init__(self, treat_id, treat_type, comments, tooths, symptoms, med, apt_id, fee_id):
		self.treatment_id = treat_id
		self.treatment_type = treat_type
		self.comments = comments
		self.tooth_involved = tooths
		self.symptoms = symptoms
		self.medication = med
		self.appointment_id = apt_id
		self.fee_id = fee_id 

@appointmentNameSpace.route("/")
class Appointments(Resource):
	# Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@appointmentNameSpace.doc(description="Returns all appointments")
	def get(self):
		result = db.execute("SELECT * FROM appointment;")
		appointments = [Appointment(*args).__dict__ for args in result]
		return appointments

	@appointmentNameSpace.doc(description="Add a new appointment")
	@appointmentNameSpace.expect(appointmentFormatParser, validate=True)
	def post(self):

		if request.json.get('patientSSN') == request.json.get('employeeSSN'):
			abort(406, "Can't create a appointment where patient & employee are the same person")

		if len(db.execute(f"SELECT * FROM patient WHERE ssn={request.json.get('patientSSN')}")) != 1:
			abort(406, "Invalide patientSSN")

		if len(db.execute(f"SELECT * FROM employee WHERE ssn={request.json.get('employeeSSN')})")) != 1:
			abort(406, "Invalide patientSSN")

		apt_id = db.execute("SELECT MAX(appointment_id) as max_id FROM appointment;")[0]

		result = db.execute(f"""INSERT INTO appointment VALUES 
({apt_id+1},{request.json.get("patientSSN")},{request.json.get("employeeSSN")},'{request.json.get('type')}',
'{request.json.get('appointment_date')}','{request.json.get('start_time')}','{request.json.get('end_time')}',
'{request.json.get('status')}',{request.json.get('room_id')});""")

		if result is None:
			db.rollback()
			abort(500, "Internal error while inserting an appointment")

		inv_id = db.execute("SELECT MAX(invoice_id) as max_id FROM invoice;")[0]

		result = db.execute(f"""INSERT INTO invoice VALUES ({inv_id+1}, CAST(GETDATE() AS Date), '0.00', '0.00', {apt_id+1})""")
		
		if result is None:
			db.rollback()
			abort(500, "Internal error while inserting an invoice")

		db.commit()

		result = db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id+1}")

		if len(result) != 1:
			abort(500, "Internal error while getting previously added appointment")

		return	Appointment(*(result[0])).__dict__

@appointmentNameSpace.route("appointment/<int:id>/procedure")
class AppointmentId(Resource):
	@appointmentNameSpace.doc(description="Returns all procedure for an appointment")
	def get(apt_id):
		result = db.execute(f"SELECT * FROM procedure WHERE appointment_id={apt_id}")
		if result is None:
			abort()
		return [Procedure(*args) for args in result]




