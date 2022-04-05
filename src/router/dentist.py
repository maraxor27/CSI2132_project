from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields
from .. import db
from .appointment import Appointment, appointmentFormatParser

dentistNameSpace = Namespace("dentist", path="/dentist")

@dentistNameSpace.route("/<int:ssn>/appointment/<string:date>")
class DentistAppointment(Resource):
	# Each http request type can be define by using its name as the function name.
	# HTTP request type [get, post, put, delete, patch, options, head]. 

	@dentistNameSpace.doc(description="Returns all appointments of a dentist")
	def get(self, ssn, date):
		result = db.execute(f"SELECT * FROM appointment where appointment_date='{date}' and employeeSSN={ssn};")
		appointments = [Appointment(*args).__dict__ for args in result]
		return appointments