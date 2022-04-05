from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from .. import db
from datetime import date

appointmentNameSpace = Namespace("appointment", path="/appointment")

appointmentFormatParser = appointmentNameSpace.model('appointment', {
		"patientSSN": fields.Integer(required=True),
		"employeeSSN": fields.Integer(required=True),
		"type": fields.String(required=True, description="Can be one of the following [TREATMENT, PROCEDURE]", default="PROCEDURE"),
		"appointment_date": fields.Date(required=True, default=date.today().isoformat()),
		"start_time": fields.String(required=True, default="12:00"),
		"end_time": fields.String(required=True, default="13:00"),
		"status": fields.String(required=True, description="Can be one of the following [CANCEL, NO SHOW, COMPLETED, SCHEDULED]", default="SCHEDULED"),
		"room_id": fields.Integer(required=True),
	})

procedureFormatParser = appointmentNameSpace.model('procedure', {
		"procedure_code": fields.Integer(required=True),
		"procedure_type": fields.String(required=True),
		"description": fields.String(required=True),
		"tooth_involved": fields.String(required=True),
		"medication": fields.String(required=True),
		"status": fields.String(required=True),
		"fee": fields.String(required=True, default="0.00")
	})

treatmentFormatParser = appointmentNameSpace.model('treatment', {
		"treatment_type": fields.String(required=True),
		"comments": fields.String(required=True),
		"tooth_involved": fields.String(required=True),
		"symptoms": fields.String(required=True),
		"medication": fields.String(required=True),
		"status": fields.String(required=True),
		"fee": fields.String(required=True , default="0.00")
	})

class Appointment:
	def __init__(self, apt_id, p_ssn, e_ssn, apt_type, date, start, end, status, room_id):
		self.appointment_id = apt_id
		self.patient = self.getPersonInfo(p_ssn)
		self.employee = self.getPersonInfo(e_ssn)
		self.type = apt_type
		self.appointment_date = date.isoformat()
		self.start_time = start.isoformat()
		self.end_time = end.isoformat()
		self.status = status
		self.room_id = room_id

	def getPersonInfo(self, p_ssn):
		result = db.execute(f"SELECT ssn, first_name, middle_name, last_name FROM person WHERE ssn={p_ssn}")[0]
		return {'ssn': result[0], 'first_name': result[1], 'middle_name': result[2], 'last_name': result[3]}

class Procedure:
	def __init__(self, proc_id, proc_code, proc_type, description, tooths, med, apt_id, fee_id):
		self.procedure_id = proc_id
		self.procedure_code = proc_code
		self.procedure_type = proc_type
		self.description = description
		self.tooth_involved = tooths
		self.medication = med
		self.appointment_id = apt_id
		self.fee = self.getFeeAmount(fee_id)

	def getFeeAmount(self, fee_id):
		result = db.execute(f"SELECT amount FROM fee WHERE fee_id={fee_id}")[0]
		return str(result[0])


class Treatment:
	def __init__(self, treat_id, treat_type, comments, tooths, symptoms, med, apt_id, fee_id, record):
		self.treatment_id = treat_id
		self.treatment_type = treat_type
		self.comments = comments
		self.tooth_involved = tooths
		self.symptoms = symptoms
		self.medication = med
		self.appointment_id = apt_id
		self.fee = self.getFeeAmount(fee_id)
		self.record_id = record

	def getFeeAmount(self, fee_id):
		result = db.execute(f"SELECT amount FROM fee WHERE fee_id={fee_id}")[0]
		return str(result[0])

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

		r = db.execute(f"SELECT * FROM patient WHERE ssn={request.json.get('patientSSN')};")
		if not r or len(r) != 1:
			abort(406, "Invalide patientSSN")

		r = db.execute(f"SELECT * FROM employee WHERE ssn={request.json.get('employeeSSN')};")
		if not r or len(r) != 1:
			abort(406, "Invalide patientSSN")

		(apt_id,) = db.execute("SELECT MAX(appointment_id) as max_id FROM appointment;")[0]

		result = db.execute(f"""INSERT INTO appointment VALUES 
			({apt_id+1},{request.json.get("patientSSN")},{request.json.get("employeeSSN")},'{request.json.get('type')}',
			'{request.json.get('appointment_date')}','{request.json.get('start_time')}','{request.json.get('end_time')}',
			'{request.json.get('status')}',{request.json.get('room_id')});""")


		(inv_id,) = db.execute("SELECT MAX(invoice_id) as max_id FROM invoice;")[0]

		result = db.execute(f"""INSERT INTO invoice VALUES ({inv_id+1}, '{request.json.get('appointment_date')}', '0.00', '0.00', {apt_id+1})""")

		db.commit()

		result = db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id+1}")[0]

		return	Appointment(*result).__dict__


@appointmentNameSpace.route("/<int:apt_id>/procedure")
class AppointmentProcedure(Resource):
	@appointmentNameSpace.doc(description="Returns all procedure for an appointment")
	def get(self, apt_id):
		if len(db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id}")) != 1:
			abort(400, "This appointment_id doesn't exist")

		result = db.execute(f"SELECT * FROM appointment_procedure WHERE appointment_id={apt_id}")
		if result is None:
			abort()
		return [Procedure(*args).__dict__ for args in result]

	@appointmentNameSpace.doc(description="Create a procedure for an appointment")
	@appointmentNameSpace.expect(procedureFormatParser, validate=True)
	def post(self, apt_id):
		if len(db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id}")) != 1:
			abort(400, "This appointment_id doesn't exist")

		(invoice_id,) = db.execute(f"SELECT invoice_id FROM invoice WHERE appointment_id={apt_id}")[0]
		(apt_type,) = db.execute(f"SELECT type FROM appointment WHERE appointment_id={apt_id}")[0]

		
		if apt_type != "PROCEDURE":
			abort(400, "Can't add treatment to an appointment that is not type PROCEDURE")

		(fee_id,) = db.execute("SELECT MAX(fee_id) AS max_id FROM fee")[0]
		db.execute(f"INSERT INTO fee VALUES ({fee_id+1},{request.json.get('fee')}, {invoice_id})")
		db.commit()

		(proc_id,) = db.execute("SELECT MAX(procedure_id) AS max_id FROM appointment_procedure;")[0]
		print(proc_id, flush=True)
		db.execute(f"""INSERT INTO appointment_procedure VALUES ({proc_id+1},'{request.json.get('procedure_code')}',
			'{request.json.get('procedure_type')}', '{request.json.get('description')}', 
			'{request.json.get('tooth_involved')}','{request.json.get('medication')}',{apt_id}, {fee_id+1})""")

		db.commit()
		
		result = db.execute(f"SELECT * FROM appointment_procedure WHERE procedure_id={proc_id+1}")[0]

		return Procedure(*result).__dict__

@appointmentNameSpace.route("/<int:apt_id>/treatment")
class AppointmentTreatment(Resource):
	@appointmentNameSpace.doc(description="Returns all treatment for an appointment")
	def get(self, apt_id):
		if len(db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id}")) != 1:
			abort(400, "This appointment_id doesn't exist")

		result = db.execute(f"SELECT * FROM treatment WHERE appointment_id={apt_id}")
		if result is None:
			abort()
		return [Treatment(*args).__dict__ for args in result]

	@appointmentNameSpace.doc(description="Create a procedure for an appointment")
	@appointmentNameSpace.expect(treatmentFormatParser, validate=True)
	def post(self, apt_id):
		if len(db.execute(f"SELECT * FROM appointment WHERE appointment_id={apt_id}")) != 1:
			abort(400, "This appointment_id doesn't exist")

		r = db.execute(f"SELECT * FROM treatment WHERE appointment_id={apt_id}")
		if not r or len(r) > 0:
			abort(400, "Can't create another treatment to this appointment")

		(invoice_id,) = db.execute(f"SELECT invoice_id FROM invoice WHERE appointment_id={apt_id}")[0]
		(patient_ssn, apt_type) = db.execute(f"SELECT patientSSN, type FROM appointment WHERE appointment_id={apt_id}")[0]

		if apt_type != "TREATMENT":
			abort(400, "Can't add treatment to an appointment that is not type TREATMENT")

		(fee_id,) = db.execute("SELECT MAX(fee_id) AS max_id FROM fee")[0]
		db.execute(f"INSERT INTO fee VALUES ({fee_id+1},{request.json.get('fee')}, {invoice_id})")
		db.commit()

		(treat_id,) = db.execute("SELECT MAX(treatment_id) AS max_id FROM treatment;")[0]
		db.execute(f"""INSERT INTO treatment VALUES ({treat_id+1},'{request.json.get('treatment_type')}',
			'{request.json.get('comments')}','{request.json.get('tooth_involved')}', 
			'{request.json.get('symptoms')}','{request.json.get('medication')}',{apt_id}, {fee_id+1}, {patient_ssn})""")

		db.commit()
		
		result = db.execute(f"SELECT * FROM treatment WHERE treatment_id={treat_id+1}")[0]

		return Treatment(*result).__dict__



