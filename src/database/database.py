import psycopg2

class Database:
	def __init__(self, host, database, user, password):
		self.conn = psycopg2.connect(host="postgres", database="main", user="user", password="password")

	def execute(self, cmd):
		if not self.conn:
			raise Exception("Database no longuer conected")
		cur = self.conn.cursor()

		try:
			cur.execute(cmd)
			result = cur.fetchall()
			cur.close()
			return result	
		except Exception as e:
			print("DB exception:", e, flush=True)
			return
		

	def commit(self):
		if not self.conn:
			raise Exception("Database no longuer conected")
		self.conn.commit()

	def rollback(self):
		if not self.conn:
			raise Exception("Database no longuer conected")
		self.conn.rollback()

	def close(self):
		if not self.conn:
			raise Exception("Database no longuer conected")
		self.conn.close()
		self.conn = None