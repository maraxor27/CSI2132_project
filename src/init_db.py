from database import Database, Person

db = Database(host="postgres", database="main", user="user", password="password")

db.execute(f"DROP TABLE {Person.tablename};")
db.execute(Person.schema)
db.commit()

db.execute("INSERT INTO person VALUES (1, 'simon', NULL, 'Laureti', 204, 'Rue de la galene', 'Gatineau', 'Quebec', 'm', 'simon.laureti@gmail.com')")
db.commit()

rows = db.execute("SELECT * FROM person;")
for row in rows:
	print(Person(*row), flush=True)

