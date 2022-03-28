from database import *

db = Database(host="postgres", database="main", user="user", password="password")

table_names_list = ['person', 'guardian', 'patient', 'employee', 'branch', 'room', 'review', 'appointment', 'appointment_procedure', 
	'treatment', 'fee', 'invoice', 'patient_billing', 'insurance_claim' ]

# drop all tables
for name in table_names_list:
	db.execute(f"Drop Table {name}")
db.commit()

# create all tables 
db.execute(person)
db.commit()
db.execute(guardian)
db.commit()
db.execute(patient)
db.commit()
db.execute(employee + branch)
db.commit()
db.execute(room)
db.commit()
db.execute(review)
db.commit()
db.execute(appointment)
db.commit()
db.execute(appointment_procedure)
db.commit()
db.execute(treatment)
db.commit()
db.execute(fee)
db.commit()
db.execute(invoice)
db.commit()
db.execute(patient_billing)
db.commit()
db.execute(insurance_claim)


# commit all tables into db
db.commit()



# display values
rows = db.execute("SELECT * FROM person;")
for row in rows:
	print(row, flush=True)