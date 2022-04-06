Vue.component("receptionist", {
	props: ["user"],
	data: function() { return {
		tab: 'patient',
	}},
	methods: {

	},
	template:
	`
	<div>
		<div style="margin: 5rem 5rem 0 5rem">
			<b-nav tabs fill>
				<b-nav-item @click="tab='patient'"
				:active="tab=='patient'">
				Patients
			</b-nav-item>
			<b-nav-item @click="tab='appointment'"
				:active="tab=='appointment'">
				Appointments
			</b-nav-item>
			</b-nav>
		</div>
		<manage-patient v-if="tab=='patient'"></manage-patient>
		<manage-appointment v-if="tab=='appointment'"></manage-appointment>
	</div>
	`
})

Vue.component("manage-patient", {
	data: function() { return {
		patients: [
			{
				ssn: "123456789",
				first_name: "first",
				middle_name: "middle",
				last_name: "last",
				house_number: 100,
				street_name: "something rode",
				city: "Gatineau",
				province: "Quebec",
				gender: "m",
				email: "simon.laureti@gmail.com",
				insurance: "####",
				date_of_birth: "2000-02-20",
				// variables below must be added on the front end
				editing: false,
				temp: {},
			},
		],
		showOverlay: false,
		provinces: [{text: 'Provinces ...', value: null}, 
			'Alberta', 
			'British Colombia', 
			'Manitoba', 
			'New Brunswick', 
			'Newfoundland and Labrador', 
			'Nova Scotia', 
			'Ontario', 
			'Prince Edward Island', 
			'Quebec', 
			'Saskatchewan'
		],
	}},
	created: function() {
		this.getPatients()
	},
	methods: {
		edit(index) {
			this.patients[index].editing = true
			this.patients[index].temp.SSN = this.patients[index].SSN
			this.patients[index].temp.first_name = this.patients[index].first_name
			this.patients[index].temp.middle_name = this.patients[index].middle_name
			this.patients[index].temp.last_name = this.patients[index].last_name
			this.patients[index].temp.house_number = this.patients[index].house_number
			this.patients[index].temp.street_name = this.patients[index].street_name
			this.patients[index].temp.city = this.patients[index].city
			this.patients[index].temp.province = this.patients[index].province
			this.patients[index].temp.gender = this.patients[index].gender
			this.patients[index].temp.email = this.patients[index].email
			this.patients[index].temp.insurance = this.patients[index].insurance
			this.patients[index].temp.date_of_birth = this.patients[index].date_of_birth
		},
		confirmEdit(index) {
			this.patients[index].temp.password = this.patients[index].password
			this.patients[index].temp.age = this.patients[index].age
			if (this.patients[index].temp.middle_name == null) {
				delete this.patients[index].temp.middle_name
			}
			
			axios({
				method: "POST",
				url: "/api/v2/patient/",
				data: this.patients[index].temp
			}).then((response) => {
				this.patients[index] = this.patients[index].temp
				this.patients[index].editing = false
				this.patients[index].temp = {}
				this.getPatients()
			}, (error) => {
				console.log(error)
			})
			this.patients[index].editing = false
			this.patients[index].temp = {}
		},
		getPatients() {
			axios({
				method: "GET",
				url: "/api/v2/patient/"
			}).then((response) => {
				console.log(response.data)
				for (i = 0; i < response.data.length; i++) {
					response.data[i].editing = false
					response.data[i].temp = {}
				}
				this.patients = response.data
			}, (error) => {
				console.log(error)
			})
		}
	},
	template:
	`
	<div style="background-color:#ccc; padding: 5rem; margin: 0 5rem; min-height: 40rem">
		<b-overlay :show="showOverlay" rounded="sm">
			<h3>Patients</h3>
			<div style="background-color: #fff; padding: 1rem;">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">SSN</th>
							<th scope="col">Name</th>
							<th scope="col">Address</th>
							<th scope="col">Gender</th>
							<th scope="col">Email</th>
							<th scope="col">Insurance</th>
							<th scope="col">Date of Birth</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(patient, index) in patients">
							<td v-if="!patient.editing">{{patient.SSN}}</td>
							<td v-else>
								<b-input v-model="patient.temp.SSN"></b-input>
							</td>

							<td v-if="!patient.editing">{{patient.first_name}} {{patient.middle_name}} {{patient.last_name}}</td>
							<td v-else>
								<b-input v-model="patient.temp.first_name"></b-input>
								<b-input v-model="patient.temp.middle_name"></b-input>
								<b-input v-model="patient.temp.last_name"></b-input>
							</td>

							<td v-if="!patient.editing">{{patient.house_number}} {{patient.street_name}}, {{patient.city}}, {{patient.province}}</td>
							<td v-else>
								<b-input v-model="patient.temp.house_number" type="number"></b-input>
								<b-input v-model="patient.temp.street_name"></b-input>
								<b-input v-model="patient.temp.city"></b-input>
								<b-form-select
									v-model="patient.temp.province"
									:options="provinces"
									placeholder="province"
									required
								></b-form-select>
							</td>

							<td v-if="!patient.editing">{{patient.gender}}</td>
							<td v-else>
								<b-input v-model="patient.temp.gender"></b-input>
							</td>

							<td v-if="!patient.editing">{{patient.email}}</td>
							<td v-else>
								<b-input v-model="patient.temp.email"></b-input>
							</td>

							<td v-if="!patient.editing">{{patient.insurance}}</td>
							<td v-else>
								<b-input v-model="patient.temp.insurance"></b-input>
							</th>

							<td v-if="!patient.editing">{{patient.date_of_birth}}</td>
							<td v-else>
								<b-input v-model="patient.temp.date_of_birth"></b-input>
							</th>
							
							<td v-if="!patient.editing">
								<b-button @click="edit(index)">
									<b-icon icon="pencil-square"></b-icon>
								</b-button>
							</td>
							<td v-else style="width: 8rem;">
								<b-button variant="success" @click="confirmEdit(index)">
									<b-icon icon="check-circle-fill"></b-icon>
								</b-button>
								<b-button variant="danger" @click="patient.editing = false">
									<b-icon icon="x-circle-fill"></b-icon>
								</b-button>
							</td>
						</tr>
					</tbody>
				</table>
				<b-button variant="primary" @click="showOverlay = !showOverlay">Add New Patient</b-button>
			</div>

			<template #overlay>
				<patient-form @close="showOverlay = !showOverlay"></patient-form>
			</template>
		</b-overlay>	
	</div>
	`
})

Vue.component("patient-form", {
	props: ["patient"],
	data: function() {return {
		form: {
			firstname: "",
			middlename: null,
			lastname: "",
			house_number: null,
			street_name: "",
			city: "",
			province: null,
			gender: "",
			email: "",
			password: "",
			insurance: "",
			date_of_birth: "",
		},
		provinces: [{text: 'Provinces ...', value: null}, 
			'Alberta', 
			'British Colombia', 
			'Manitoba', 
			'New Brunswick', 
			'Newfoundland and Labrador', 
			'Nova Scotia', 
			'Ontario', 
			'Prince Edward Island', 
			'Quebec', 
			'Saskatchewan'
		],
	}},
	created: function() {
		if (this.patient != null) {
			this.form = this.patient
		}
	},
	computed: {
		dateValidation() {
			if (this.form.date_of_birth.length == 0) 
				return null
			return /^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/gm.test(this.form.date_of_birth)
		},
	},
	methods: {
		submit(event) {
			if (this.form.middlename == "")
				this.form.middlename = null;
			event.preventDefault()
			console.log("TODO submit the form data to the api")
			// console.log(this.form)
		},
		close() {
			this.$emit("close")
		},
	},
	template:
	`
	<div style="background-color:#bbb; border:1rem; border-radius:5px;">
		<div style="text-align:right">
			<b-button variant="danger" @click="close">
				X
			</b-button>
		</div>
		<div style="padding: 0rem 2rem 2rem 2rem;">
			<h3 style="text-align:center;">Patient Form</h3>
			<br>
			<b-form @submit="submit" style="height:40rem; overflow:auto; padding:1rem; width:30rem; background-color:#fff;">
				<b-form-group id="input-group-1" label="First Name:" label-for="input-1">
					<b-form-input
						id="input-1"
						v-model="form.firstname"
						placeholder="first name"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-2" label="Middle Name:" label-for="input-2">
					<b-form-input
						id="input-2"
						v-model="form.middlename"
						placeholder="middle name">
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-3" label="Last Name:" label-for="input-3">
					<b-form-input
						id="input-3"
						v-model="form.lastname"
						placeholder="last name"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-4" label="Address:" label-for="input-4">
					<b-form-input
						id="input-4"
						v-model="form.house_number"
						type="number"
						placeholder="house number"
						required>
					</b-form-input>
					<b-form-input
						id="input-4"
						v-model="form.street_name"
						placeholder="street name"
						required>
					</b-form-input>
					<b-form-input
						id="input-4"
						v-model="form.city"
						placeholder="city"
						required>
					</b-form-input>
					<b-form-select
							id="input-4"
							v-model="form.province"
							:options="provinces"
							placeholder="province"
							required
						></b-form-select>
				</b-from-group>
				<br>
				<br>
				<b-form-group id="input-group-5" label="Email Address:" label-for="input-5">
					<b-form-input
						id="input-5"
						v-model="form.email"
						placeholder="email"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-6" label="Temporary Password:" label-for="input-6">
					<b-form-input
						id="input-6"
						v-model="form.password"
						type="password"
						placeholder="temporary password"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-7" label="Date of Birth:" label-for="input-7">
					<b-form-input
						id="input-7"
						v-model="form.date_of_birth"
						placeholder="YYYY-MM-DD"
						required>
					</b-form-input>
					<b-form-invalid-feedback :state="dateValidation">
						Please input the date with the following format YYYY-MM-DD
					</b-form-invalid-feedback>
				</b-from-group>
				<br>
				<b-form-group id="input-group-8" label="Insurance Number:" label-for="input-8">
					<b-form-input
						id="input-8"
						v-model="form.insurance"
						placeholder="Insurance number"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-button variant="primary" type="submit">Submit</b-button>
				<b-button variant="danger" type="reset">Reset</b-button>
			</b-form>
		</div>
	</div>
	`
})

Vue.component("manage-appointment", {
	data: function() { return {
		date: "", // string of the follwing format YYYY-MM-DD
		branch: null,
		branches: [],
		dentist: null,
		dentists: [{text: "Select a dentist", value: null}],
		appointments: [],
		showOverlay: false,
	}},
	created: function() {
		today = new Date()
		this.date = "" + today.getFullYear() + "-" + ( ((today.getMonth()+1)>10)?((today.getMonth()+1)):("0"+(today.getMonth()+1)) ) + "-" + ( (today.getDate()>10)?(today.getDate()):("0"+today.getDate()) )		
		this.getBranch()
		//this.branches = [{text: "Select a branch", value: null}, 'branch 1', 'branch 2', 'branch 3']
	},
	methods: {
		getBranch() {
			axios({
				method: "GET",
				url: "/api/v2/branch/"
			}).then((response) => {
				for (i = 0; i < response.data.length; i++) {
					response.data[i].text = response.data[i].city
					response.data[i].value = response.data[i].branch_id
				}
				this.branches = [{text: "Select a branch", value: null}].concat(response.data)
			}, (error) => {
				console.log(error)
			})
		},
		getDentists(branch) {
			if (branch == null) {
				this.appointments = []
				return
			}
			axios({
				method: "GET",
				url: "/api/v2/branch/"+branch+"/dentist"
			}).then((response) => {
				var dentists = response.data
				buffer = [{text: "Select a dentist", value: null}]
				for (i = 0; i < dentists.length; i++) {
					buffer.push(
						{
							text: ""+dentists[i].ssn+": "+dentists[i].first_name+" "+dentists[i].last_name,
							value: dentists[i]
						}
					)
				}
				this.dentists = buffer
			}, (error) => {
				console.log(error)
			})
			
		},
		getAppointments(date, branch, dentist) {
			if (dentist == null || branch == null) {
				this.appointments = []
				return
			}
			axios({
				method: 'get',
				url: '/api/v2/dentist/'+dentist.ssn+"/appointment/"+date,
			}).then((response) => {
				this.appointments = response.data
			}, (error) => {
				console.log(error)
			})
		}
	},
	watch: {
		branch: function(newBranch, oldBranch) {
			this.getDentists(newBranch)
		},
		dentist: function(newDentist, oldDentist) {
			this.getAppointments(this.date, this.branch, newDentist)
		},
		date: function(newDate, oldDate) {
			this.getAppointments(newDate, this.branch, this.dentist)
		}
	},
	template:
	`
	<div style="background-color:#ccc; padding: 5rem; margin: 0 5rem; min-height: 40rem">
		<b-overlay :show="showOverlay" rounded="sm">
			<h3>Appointments</h3>
			<b-form-select v-model="branch" :options="branches"></b-form-select>
			<b-form-select v-model="dentist" :options="dentists" :disabled="branch==null"></b-form-select>
			<b-form-datepicker v-model="date" class="mb-2" :disabled="dentist==null"></b-form-datepicker>
			<div style="background-color: #fff; padding: 1rem;" v-if="dentist!=null && branch!=null">
				<h5>Schedule of the day</h5>
				<table class="table">
					<thead>
						<tr>
							<th scope="col">Start Time</th>
							<th scope="col">End Time</th>
							<th scope="col">Dentist</th>
							<th scope="col">Patient</th>
							<th scope="col">Type</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="appointment in appointments">
							<td>{{appointment.start_time}}</td>
							<td>{{appointment.end_time}}</td>
							<td>{{appointment.employee.ssn}}: {{appointment.employee.first_name}} {{appointment.employee.last_name}}</td>
							<td>{{appointment.patient.ssn}}: {{appointment.patient.first_name}} {{appointment.patient.last_name}}</td>
							<td>{{appointment.type}}</td>
							<td>{{appointment.status}}</td>
						</tr>
					</tbody>
				</table>
				<b-button variant="primary" @click="showOverlay = !showOverlay">Add New Appointment</b-button>
			</div>
			<template #overlay>
				<appointment-form :date="date" :dentist="dentist" :branch="branch" @close="showOverlay = !showOverlay"></appointment-form>
			</template>
		</b-overlay>	
	</div>
	`
})

Vue.component("appointment-form", {
	props: ["date", "dentist", "branch"],
	data: function() { return {
		form: {
			date: null,
			start_time: null,
			end_time: null,
			dentistSSN: "",
			patientSSN: "",
			type: null,
			status: "",
			procedures: [],
			treatment: {
				type: null,
				comments: null,
				tooth_involved: null,
				symptoms: null,
				medication: null,
				fee: null,
			},
		},
		show_treatment: false,
		statusList: [{text:"Select a status", value:null}, "Status 1", "Status 2", "..."]
	}},
	created: function() {
		this.form.date = this.date
		console.log("dentist:", this.dentist)
		this.form.dentistSSN = this.dentist.ssn
	},
	watch: {
		date: function(oldDate, newDate) {
			this.form.date = newDate
		},
	},
	methods: {
		submit(event) {
			event.preventDefault()
		},
		close() {
			this.$emit("close")
		},
		addProcedure() {
			this.form.procedures.push(
				{
					code: null,
					type: null,
					description: null,
					tooth_involved: null,
					medication: null,
					fee: null,
				}
			)
		},
		removeProcedure(index) {
			this.form.procedures.splice(index, 1)
		},
	},
	template:
	`
	<div style="background-color:#bbb; border:1rem; border-radius:5px;">
		<div style="text-align:right">
			<b-button variant="danger" @click="close">
				X
			</b-button>
		</div>
		<div style="padding: 0rem 2rem 2rem 2rem;">
			<h3 style="text-align:center;">Appointment Form</h3>
			<br>
			<b-form @submit="submit" style="height:40rem; overflow:auto; padding:1rem; width:30rem; background-color:#fff;">
				<b-form-group id="input-group-1" label="Date:" label-for="input-1">
					<b-form-datepicker
						id="input-1"
						v-model="form.date"
						required>
					</b-form-datepicker>
				</b-from-group>
				<br>
				<b-form-group id="input-group-2" label="Start Time:" label-for="input-2">
					<b-form-timepicker
						id="input-2"
						v-model="form.start_time"
						required>
					</b-form-timepicker>
				</b-from-group>
				<br>
				<b-form-group id="input-group-3" label="End Time:" label-for="input-3">
					<b-form-timepicker
						id="input-3"
						v-model="form.end_time"
						required>
					</b-form-timepicker>
				</b-from-group>
				<br>
				<b-form-group id="input-group-4" label="Dentist SNN:" label-for="input-4">
					<b-form-input
						id="input-4"
						v-model="form.dentistSSN"
						placeholder="Dentist SNN"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-5" label="Patient SSN:" label-for="input-5">
					<b-form-input
						id="input-5"
						v-model="form.patientSSN"
						placeholder="Patient SSN"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-6" label="Appointment Type:" label-for="input-6">
					<b-form-input
						id="input-6"
						v-model="form.type"
						placeholder="Type"
						required>
					</b-form-input>
				</b-from-group>
				<br>
				<b-form-group id="input-group-7" label="Appointment Status:" label-for="input-7">
					<b-form-select 
						style="display:block;"
						id="input-7"
						v-model="form.status"
						:options="statusList"
						required
					></b-form-select>
				</b-from-group>
				<br>
				<b-form-group id="input-group-8" label="Procedures:" label-for="input-8">
					<div style="background-color:#eee;border:1rem;border-radius:1rem;padding:1rem;margin-bottom:1rem;"
						v-for="(procedure, index) in form.procedures">
						<div style="display:flex;">
							<label class="form-label" style="display:inline-block">Code:</label>
							<ul style="flex-direction:row;display:inline-block;margin:0 0 1rem auto;width:auto;">
								<li style="display:block;width:auto;margin-right:0;margin-left:auto;">
									<b-button variant="danger" @click="removeProcedure(index)">X</b-button>
								</li>
							</ul>
						</div>
						<!-- <div style="display:inline-block;margin-left:auto;width:82%;text-align:right;">
							<b-button variant="danger" @click="removeProcedure(index)">X</b-button>
						</div> -->
						<b-form-input
							id="input-8"
							v-model="procedure.code"
							placeholder="Appointment Code"
							required
						></b-form-input>
						<label class="form-label">Type:</label>
						<b-form-input
							id="input-8"
							v-model="procedure.type"
							placeholder="Appointment Type"
							required
						></b-form-input>
						</b-form-input>
						<label class="form-label">Description:</label>
						<b-form-textarea
							id="input-8"
							style="height:120px;"
							v-model="procedure.description"
							placeholder="Appointment Type"
							required
						></b-form-textarea>
						<label class="form-label">Tooth Involved:</label>
						<b-form-input
							id="input-8"
							v-model="procedure.tooth_involved"
							placeholder="Tooth"
							required
						></b-form-input>
						<label class="form-label">Medications:</label>
						<b-form-textarea
							id="input-8"
							style="height:80px;"
							v-model="procedure.medication"
							placeholder="Medication"
							required
						></b-form-textarea>
						<label class="form-label">Fee:</label>
						<b-form-input
							id="input-8"
							type="number"
							v-model="procedure.fee"
							placeholder="Fee"
							required
						></b-form-input>
					</div>
					<b-button variant="primary" @click="addProcedure">Add Procedure</b-button>
				</b-from-group>
				<br>
				<b-form-group id="input-group-9">
					<label class="form-label" style="display:inline-block; margin-top:1.5rem;">Treatment:</label>
					<b-form-checkbox style="display:inline-block;" v-model="show_treatment"></b-form-checkbox>
					<br>
					<div v-if="show_treatment"
						style="background-color:#eee;border:1rem;border-radius:1rem;padding:1rem;">
						<label class="form-label">Type:</label>
						<b-form-input
							id="input-8"
							v-model="form.treatment.type"
							placeholder="Appointment Code"
							required
						></b-form-input>
						<label class="form-label">Comments:</label>
						<b-form-textarea
							id="input-8"
							style="height:120px;"
							v-model="form.treatment.comments"
							placeholder="Appointment Type"
							required
						></b-form-textarea>
						<label class="form-label">Tooth Involved:</label>
						<b-form-input
							id="input-8"
							v-model="form.treatment.tooth_involved"
							placeholder="Tooth"
							required
						></b-form-input>
						<label class="form-label">Symptoms:</label>
						<b-form-textarea
							id="input-8"
							style="height:80px;"
							v-model="form.treatment.symptoms"
							placeholder="Medication"
							required
						></b-form-textarea>
						<label class="form-label">Medications:</label>
						<b-form-textarea
							id="input-8"
							style="height:80px;"
							v-model="form.treatment.medication"
							placeholder="Medication"
							required
						></b-form-textarea>
						<label class="form-label">Fee:</label>
						<b-form-input
							id="input-8"
							type="number"
							v-model="form.treatment.fee"
							placeholder="Fee"
							required
						></b-form-input>
					</div>
				</b-from-group>
				<br>
				<div style="text-align:center;">
					<b-button variant="primary" type="submit">Submit</b-button>
					<b-button variant="danger" type="reset">
						<b-icon icon="trash"></b-icon>
					</b-button>
				</div>
			</b-form>
		</div>
	</div>
	`
})