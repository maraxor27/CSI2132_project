from flask import Flask

import psycopg2
import os

params = {
	'dbname': 'main',
	'username': 'user',
	'password': 'password',
	'host': 'postgres',
	'port': 5432
}

def create_flask_app():	
	app = Flask(__name__, static_url_path="/static")
	app.env = "development"
	app.app_context().push()
	
	conn = psycopg2.connect(host="postgres", database="main", user="user", password="password")
	cur = conn.cursor()

	print("PostgreSQL database version:")
	cur.execute("SELECT version()")

	db_version = cur.fetchone()
	print(db_version, flush=True)

	cur.close()
	return app


if __name__ == "myapp":
	app = create_flask_app()
	from .routes import *