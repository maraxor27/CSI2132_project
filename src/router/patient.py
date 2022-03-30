from flask import Blueprint, request, abort
from flask_restx import Namespace, Resource, fields

patient = Namespace("patient", path="/patient")

