from database import *

db = Database(host="postgres", database="main", user="user", password="password")

table_names_list = ['person', 'guardian', 'patient', 'employee', 'branch', 'room', 'review', 'appointment', 'appointment_procedure', 
	'treatment', 'fee', 'invoice', 'patient_billing', 'insurance_claim' ]

# drop all tables
for name in table_names_list:
	db.execute(f"Drop Table {name} cascade")
	db.commit()

# create and commit all tables 
db.execute(person)
db.commit()
db.execute(guardian)
db.commit()
db.execute(patient)
db.commit()
db.execute(branch)
db.commit()
db.execute(employee)
db.commit()
db.execute(patient_record)
db.commit()
db.execute(review)
db.commit()
db.execute(room)
db.commit()
db.execute(appointment)
db.commit()
db.execute(invoice)
db.commit()
db.execute(fee)
db.commit()
db.execute(appointment_procedure)
db.commit()
db.execute(treatment)
db.commit()
db.execute(patient_billing)
db.commit()
db.execute(insurance_claim)
db.commit()


db.execute("INSERT INTO branch VALUES (0,'Hull');")

db.execute("INSERT INTO PERSON VALUES (0,'William',null,'Garcia',100,'Saint road','Hull','Ontario','m','william.garcia@email.com','password');")
db.execute("INSERT INTO PERSON VALUES (1,'Daniel',null,'Davis',101,'Saint road','Hull','Ontario','m','daniel.davis@email.com','password');")
db.execute("INSERT INTO PERSON VALUES (2,'Oliver',null,'Williams',102,'Saint road','Hull','Ontario','m','oliver.williams@email.com','password');")
db.execute("INSERT INTO PERSON VALUES (3,'Jack',null,'Brown',103,'Saint road','Hull','Ontario','m','jack.brown@email.com','password');")
db.execute("INSERT INTO PERSON VALUES (4,'James',null,'Miller',104,'Saint road','Hull','Ontario','m','james.miller@email.com','password');")
db.execute("INSERT INTO PERSON VALUES (5,'Harry',null,'Martinez',105,'Saint road','Hull','Ontario','m','harry.martinez@email.com','password');")
db.commit()

db.execute("INSERT INTO room VALUES (0,0,42);")

db.execute("INSERT INTO patient VALUES (0,'1234','1990-07-25',42);")
db.execute("INSERT INTO patient VALUES (1,'2345','1990-07-25',42);")
db.execute("INSERT INTO patient VALUES (2,'3456','1990-07-25',42);")

db.execute("INSERT INTO employee VALUES (3,'dentist','2000.00',0,true);")
db.execute("INSERT INTO employee VALUES (4,'dentist','2000.00',0,false);")
db.execute("INSERT INTO employee VALUES (5,'receptionist','2000.00',0,false);")
db.commit()

db.execute("INSERT INTO appointment VALUES (0,0,3,'TREATMENT','2022-04-04','13:30','14:30','COMPLETED',0)")
db.execute("INSERT INTO appointment VALUES (1,1,3,'TREATMENT','2022-04-04','14:30','15:30','COMPLETED',0)")
db.execute("INSERT INTO appointment VALUES (2,2,3,'PROCEDURE','2022-04-04','15:30','16:30','COMPLETED',0)")
db.execute("INSERT INTO appointment VALUES (3,2,3,'TREATMENT','2022-02-04','14:30','15:30','COMPLETED',0)")

db.execute("INSERT INTO patient_record VALUES (0)")
db.execute("INSERT INTO patient_record VALUES (1)")
db.execute("INSERT INTO patient_record VALUES (2)")
db.commit()

db.execute("INSERT INTO invoice VALUES (0,'2022-04-04','0.00','0.00',0)")
db.execute("INSERT INTO invoice VALUES (1,'2022-04-04','0.00','0.00',1)")
db.execute("INSERT INTO invoice VALUES (2,'2022-04-04','0.00','0.00',2)")
db.commit()

db.execute("INSERT INTO fee VALUES (0,'200.00',0)")
db.execute("INSERT INTO fee VALUES (1,'300.00',1)")
db.execute("INSERT INTO fee VALUES (2,'400.00',2)")
db.execute("INSERT INTO fee VALUES (3,'300.00',2)")
db.commit()

db.execute("INSERT INTO appointment_procedure VALUES (0,69,'standard','not much happen','t34','no med',2,2)")

db.execute("INSERT INTO treatment VALUES (0,'standard','not much happen','t34','pain','no med',0,0,0)")
db.execute("INSERT INTO treatment VALUES (1,'standard','not much happen','t34','pain','no med',1,1,1)")
db.execute("INSERT INTO treatment VALUES (2,'standard','not much happen','t34','pain','no med',3,3,2)")
db.commit()