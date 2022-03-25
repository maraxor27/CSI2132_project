from .table import Table

class Person(metaclass=Table):
	tablename = "person"
	schema = """CREATE TABLE person ( 
		SSN integer NOT NULL,
		first_name varchar(50) NOT NULL,
		middle_name varchar(50),
		last_name varchar(50) NOT NULL,
		house_number integer NOT NULL,
		street_name varchar(50) NOT NULL,
		city varchar(50) NOT NULL,
		province varchar(50) NOT NULL,
		gender varchar(1) NOT NULL,
		email varchar(100) NOT NULL,
		PRIMARY KEY (SSN)
	);"""

	def __init__(self, SSN, first_name, middle_name, last_name, 
			house_number, street_name, city, province, gender, email):
		self.SSN = SSN
		self.first_name = first_name
		self.middle_name = middle_name
		self.last_name = last_name
		self.house_number = house_number
		self.street_name = street_name
		self.city = city
		self.province = province
		self.gender = gender
		self.email = email

	def __str__(self):
		return f"Person: {self.__dict__}"