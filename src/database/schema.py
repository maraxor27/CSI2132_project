person = """CREATE TABLE person ( 
	SSN INTEGER NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	middle_name VARCHAR(50),
	last_name VARCHAR(50) NOT NULL,
	house_number integer NOT NULL,
	street_name VARCHAR(50) NOT NULL,
	city VARCHAR(50) NOT NULL,
	province VARCHAR(50) NOT NULL,
	gender VARCHAR(1) NOT NULL,
	email VARCHAR(100) NOT NULL,
	PRIMARY KEY (SSN)
);"""


guardian = """CREATE TABLE guardian (
	SSN INTEGER NOT NULL,
	date_of_birth DATE NOT NULL,
	age INTEGER GENERATED ALWAYS AS (extract(year FROM CURRENT_DATE) - extract(year FROM date_of_birth)) STORED,
	PRIMARY KEY (SSN),
	FOREIGN KEY (SSN) REFERENCES person(SSN) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);"""

# What do we do on deletion of the guardian?
patient = """CREATE TABLE patient (
	SSN INTEGER NOT NULL,
	insurance VARCHAR(50),
	date_of_birth DATE NOT NULL,
	age INTEGER GENERATED ALWAYS AS (extract(year FROM CURRENT_DATE) - extract(year FROM date_of_birth)) STORED,
	PRIMARY KEY (SSN),
	FOREIGN KEY (SSN) REFERENCES person(SSN) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (guardianSSN) REFERENCES guardian 
		ON UPDATE CASCADE
);"""

# We assume the salary won't exced $ 9 999 999.99 

# What do we do on deletion of the branch? Remove employee?

# branch_id can be null because we need to be able to create an employee 
# before creating the branch since a branch requires a manager.
employee = """CREATE TABLE employee (
	SSN INTEGER NOT NULL,
	employee_type VARCHAR(15) NOT NULL,
	salary NUMERIC(9,2),
	branch_id INTEGER,
	PRIMARY KEY (SSN),
	FOREIGN KEY (SSN) REFERENCES person(SSN) 
		ON UPDATE CASCADE,
	FOREIGN KEY (branch_id) REFERENCES branch 
		ON UPDATE CASCADE
);"""

patient_record = """CREATE TABLE patient_record (
	patientSSN INTEGER NOT NULL,
	PRIMARY KEY (patientSSN),
	FOREIGN KEY (patientSSN) REFERENCES patient(SSN)
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
);""" 

branch = """CREATE TABLE branch (
	branch_id INTEGER NOT NULL,
	city VARCHAR(50) NOT NULL,
	managerSSN NOT NULL,
	PRIMARY KEY (branch_id)
);"""

room = """CREATE TABLE room (
	room_id INTEGER NOT NULL,
	branch_id INTEGER NOT NULL,
	room_num INTEGER NOT NULL,
	PRIMARY KEY (room_id),
	FOREIGN KEY (branch_id) REFERENCES branch(branch_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);"""

# professionalism, communication,  are metrics that range from 0 to 5 
# A function may be needed
review = """CREATE TABLE review (
	patientSSN INTEGER NOT NULL,
	branch_id INTEGER NOT NULL,
	professionalism NUMERIC(1,0) NOT NULL,
	communication NUMERIC(1,0) NOT NULL,
	cleanliness NUMERIC(1,0) NOT NULL,
	value NUMERIC(1,0) NOT NULL,
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	PRIMARY KEY (patientSSN, branch_id),
	FOREIGN KEY (patientSSN) REFERENCES patient(SSN) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);"""

# Check that end_time is after start_time?
# Status enum (???). Default value for the status?
# Is type necessary since the information is in teh procedure and the treatment?
appointment = """CREATE TABLE appointment(
	appointment_id INTEGER NOT NULL,
	patientSSN INTEGER NOT NULL,
	employeeSSN INTEGER NOT NULL,
	type VARCHAR(20) NOT NULL,
	appointment_date DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	status VARCHAR(10) NOT NULL,
	invoice_id INTEGER NOT NULL, 
	room_id INTEGER NOT NULL,
	PRIMARY KEY (appointment_id),
	FOREIGN KEY (patientSSN) REFERENCES patient(SSN) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (employeeSSN) REFERENCES employe(SSN) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (room_id) REFERENCES room(room_id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
);"""

# procedure_date currently removed date already in appointment? otherwise foreign key?
# TEXT type is for sequence of character of unknown length. No maximum char count
# tooth_involved data type?
appointment_procedure = """CREATE TABLE appointment_procedure (
	procedure_id INTEGER NOT NULL,
	procedure_code INTEGER NOT NULL,
	procedure_type VARCHAR(20) NOT NULL,
	description TEXT NOT NULL,
	tooth_involved VARCHAR(10) NOT NULL,
	medication VARCHAR(100) NOT NULL,
	appointment_id INTEGER NOT NULL,
	fee_id INTEGER NOT NULL,
	PRIMARY KEY (procedure_id),
	FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) 
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (fee_id) REFERENCES fee(fee_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""

# Did not put patientSSN since that info is already in the appointment
# check symptoms type 
treatment = """CREATE TABLE treatment (
	treatment_id INTEGER NOT NULL,
	treatment_type VARCHAR(20) NOT NULL,
	comments TEXT NOT NULL,
	tooth_involved VARCHAR(10) NOT NULL,
	symptoms VARCHAR(50) NOT NULL,
	medication VARCHAR(100) NOT NULL,
	appointment_id INTEGER NOT NULL,
	fee_id INTEGER NOT NULL,
	FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) 
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (fee_id) REFERENCES fee(fee_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""

# We assume the amount can't be higher than 9 999.99
fee = """CREATE TABLE fee (
	fee_id INTEGER NOT NULL,
	amount NUMERIC(6, 2),
	invoice_id INTEGER NOT NULL,
	procedure_id INTEGER,
	treatment_id INTEGER,
	PRIMARY KEY (fee_id),
	FOREIGN KEY (procedure_id) REFERENCES procedure(procedure_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""

invoice = """CREATE TABLE invoice (
	invoice_id INTEGER NOT NULL,
	issued_date DATE NOT NULL,
	patient_charge NUMERIC(8, 2) NOT NULL,
	insurance_charge NUMERIC(8, 2) NOT NULL,
	patient_billing_id INTEGER NOT NULL,
	appointment_id INTEGER NOT NULL,
	PRIMARY KEY (invoice_id),
	FOREIGN KEY (patient_billing_id) REFERENCES patient_billing(patient_billing_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""

patient_billing = """CREATE TABLE patient_billing (
	patient_billing_id INTEGER NOT NULL,
	patient_portion NUMERIC(8, 2) NOT NULL,
	insurance_portion NUMERIC(8, 2) NOT NULL,
	total_amount NUMERIC(9, 2) GENERATED ALWAYS AS (patient_portion + insurance_portion) STORED,
	payment_type VARCHAR(20) NOT NULL,
	invoice_id INTEGER NOT NULL,
	insurance_claim_id INTEGER NOT NULL,
	PRIMARY KEY (patient_biling_id),
	FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (insurance_claim_id) REFERENCES insurance_claim(insurance_claim_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""

insurance_claim = """CREATE TABLE incusrance_claim (
	insurance_claim_id INTEGER NOT NULL,
	amount NUMERIC(8, 2),
	PRIMARY KEY (insurance_claim_id),
	patient_billing_id INTEGER NOT NULL,
	FOREIGN KEY (patient_billing_id) REFERENCES patient_billing(patient_billing_id)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
);"""