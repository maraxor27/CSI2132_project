Vue.component("patient", {
	props: ["user"],
	data: function() { return {
		user_info: {},
		/*{
			SSN: 1,
			first_name: "<firstname>",
			middle_name: null,
			last_name: "<Lastname>",
			house_number: 1234,
			street_name: "<street_name>",
			city: "<city>",
			province: "<province>",
			gender: "<M/F>",
			email: "<email>",
			insurance: "<insurance>",
			date_of_birth: "<date_of_birth>",
			age: 42,
		},*/
		past_appointment: [],
		/*[
			{
				appointment_id: 1,
				employees: ["<employee name>", "<employee name>", "<employee name>"],
				type: "<type>",
				appointment_date: "<appointment_date>",
				start_time: "<start_time>",
				end_time: "<end_time>",
				status: "<status>",
			},
			{
				appointment_id: 2,
				employees: ["<employee name>", "<employee name>", "<employee name>"],
				type: "<type>",
				appointment_date: "<appointment_date>",
				start_time: "<start_time>",
				end_time: "<end_time>",
				status: "<status>",
			},
		],*/
		future_appointment: [],
		/*[
			{
				appointment_id: 3,
				employees: ["<employee name>", "<employee name>", "<employee name>"],
				type: "<type>",
				appointment_date: "<appointment_date>",
				start_time: "<start_time>",
				end_time: "<end_time>",
				status: "<status>",
			},
			{
				appointment_id: 4,
				employees: ["<employee name>", "<employee name>", "<employee name>"],
				type: "<type>",
				appointment_date: "<appointment_date>",
				start_time: "<start_time>",
				end_time: "<end_time>",
				status: "<status>",
			},
		],*/
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
				this.past_appointment = response.data
				console.log("medical_history:", this.past_appointment)
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
		<div>
			<div class="section section-gray">
				<div class="col-md-5" style="margin: auto; margin-top: 50px;">
					<div class="card card-patient">
						<div class="card-body">
							<h6 class="card-category">Patient Information</h6>
							<h1 class="card-title">{{user_info.first_name}}</h1>
							<ul>
								<li><b>SSN:</b> {{user_info.SSN}}</li>
								<li><b>Age</b> {{user_info.age}}</li>
							</ul>

							<hr />

							<h6 class="card-category">Past Appointment</h6>
							<br>
							<appointment v-for="(p_apt, index) in past_appointment" :info="p_apt"></appointment>
							<br>

							<h6 class="card-category">Future Appointment</h6>
							<br>
							<appointment v-for="(f_apt, index) in future_appointment" :info="f_apt"></appointment>
							<br>
						</div>
					</div>
				</div>
			</div>
		</div>
	`
})

Vue.component("appointment", {
	props: ["info"],
	methods: {},
	template:
	`
		<div style="margin-bottom:1rem;background-color:#ccc">
			APPOINTMENT INFO
			<br>
			appointment_id = {{info.appointment_id}}
			<br>
			employees = {{info.employees}}
			<br>
			type = {{info.type}}
			<br>
			appointment_date = {{info.appointment_date}}
			<br>
			start_time = {{info.start_time}}
			<br>
			end_time = {{info.end_time}}
		</div>
	`
})
