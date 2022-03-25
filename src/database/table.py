class Table(type):
	def __new__(cls, name, bases, dct):
		if dct.get("tablename") is None:
			raise Exception("A subclass of Table must have a tablename!")

		if dct.get("schema") is None:
			raise Exception("A subclass of Table must have a schema! The schema is the query to create the table")
			
		return super().__new__(cls, name, bases, dct)
