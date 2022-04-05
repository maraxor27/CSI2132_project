from flask import Blueprint
from flask_restx import Api

from .login import loginBlueprint, User
from .patient import patientNameSpace
from .appointment import appointmentNameSpace
from .branch import branchNameSpace
from .dentist import dentistNameSpace


apiv2Blueprint = Blueprint("apiv2", __name__, url_prefix="/api/v2")
api = Api(apiv2Blueprint, version='2.0', doc='/doc/')
api.add_namespace(patientNameSpace)
api.add_namespace(appointmentNameSpace)
api.add_namespace(branchNameSpace)
api.add_namespace(dentistNameSpace)