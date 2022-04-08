Vue.component("patient", {
	props: ["user"],
	data: function() { return {
		user_info: {},
		med_history: [],
		future_appointment: [],
	}},
	watch: {
		user(newUser, oldUser) {
			this.getUser(newUser.ssn)
		}
	},
	methods: {
		getUser(ssn) {
			if (ssn == undefined || ssn == null)
				return

			axios({
				method: 'get',
				url: '/api/v2/patient/'+ssn,
			}).then((response) => {
				this.user_info = response.data
				// console.log("User data:", response.data)
				this.getFutureAppointments(ssn)
				this.getMedicalHistory(ssn)
			}, (error) => {
				console.log(error)
			})
		},
		getFutureAppointments(ssn) {
			axios({
				method: 'get',
				url: '/api/v2/patient/'+ssn+"/future_appointment",
			}).then((response) => {
				this.future_appointment = response.data
				console.log("future_appointment:", this.future_appointment)
			}, (error) => {
				console.log(error)
			})
		},
		getMedicalHistory(ssn) {
			axios({
				method: 'get',
				url: '/api/v2/patient/'+ssn+"/medical_history",
			}).then((response) => {
				this.med_history = response.data
				console.log("medical_history:", this.med_history)
			}, (error) => {
				console.log(error)
				this.error_message = "Invalid email password combination"
			})
		}
	},
	computed: {
	},
	template:
	`
	<div class="section section-gray">
		<div class="col-md-5" style="margin: auto; margin-top: 50px;">
			<div class="card card-patient">
				<div class="card-body">
					<h6 class="card-category">Patient Information</h6>
					<h1 class="card-title">{{user_info.first_name}}</h1>
					<ul>
						<li><b>SSN:</b> {{user_info.SSN}}</li>
						<li><b>Age:</b> {{user_info.age}}</li>
					</ul>

					<hr/>

					<h6 class="card-category">Future Appointment</h6>
					
					<div style="margin: 1rem 2rem;">
						<table class="table">
							<thead>
								<th scope="col">Employee</th>
								<th scope="col">Type</th>
								<th scope="col">Date</th>
								<th scope="col">Start Time</th>
								<th scope="col">End Time</th>
								<th scope="col">Status</th>
							</thead>
							<tbody>
								<tr v-for="apt in future_appointment">
									<td>{{apt.employee.first_name}} {{apt.employee.middle_name}} {{apt.employee.last_name}}</td>
									<td>{{apt.procedure_type}}</td>
									<td>{{apt.appointment_date}}</td>
									<td>{{apt.start_time}}</td>
									<td>{{apt.end_time}}</td>
									<td>{{apt.status}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<hr/>

					<h6 class="card-category">Medical History</h6>
					<div style="margin: 1rem 2rem;">
						<table class="table">
							<thead>
								<th scope="col">Date</th>
								<th scope="col">Type</th>
								<th scope="col">Comments</th>
								<th scope="col">Tooths</th>
								<th scope="col">Symptoms</th>
								<th scope="col">Medication</th>
							</thead>
							<tbody>
								<tr v-for="treatment in med_history">
									<td>{{treatment.date}}</td>
									<td>{{treatment.treatment_type}}</td>
									<td>{{treatment.comments}}</td>
									<td>{{treatment.tooth_involved}}</td>
									<td>{{treatment.symptoms}}</td>
									<td>{{treatment.medication}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<br>
				</div>
			</div>
		</div>
	</div>
	`
})