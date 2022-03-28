from database import *

db = Database(host="postgres", database="main", user="user", password="password")

# create command to drop person table
db.execute("Drop Table PERSON")

# create person table
db.execute(person)
# commit table into db
db.commit()

# insert value into table
db.execute("INSERT INTO person VALUES (1, 'simon', NULL, 'Laureti', 204, 'Rue de la galene', 'Gatineau', 'Quebec', 'm', 'simon.laureti@gmail.com')")
db.commit()

# display values
rows = db.execute("SELECT * FROM person;")
for row in rows:
	print(row, flush=True)