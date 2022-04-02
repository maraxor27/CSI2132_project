Vue.component("receptionist", {
	props: ["user"],
	data: function() { return {
		
	}},
	methods: {

	},
	template:
	`
	<div>
		<h2>Receptionist</h2>
		<br>
		<manage-appointment></manage-appointment>
		<br>
		<patient-form></patient-form>
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
		provinces: [{text: 'Province', value: null}, 'Alberta', 'British Colombia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'],
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
			console.log(this.form)
		},
	},
	template:
	`
	<div style="background-color:#ccc; padding: 5rem; margin: 5rem;">
		<h3>Patient Form</h3>
		<br>
		<b-form @submit="submit">
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
	`
})

Vue.component("manage-appointment", {
	data: function() { return {
		date: "", // string of the follwing format YYYY-MM-DD
		branch: null,
		branches: [],
		dentist: {
					ssn: "1",
					first_name: "John",
					last_name: "Doe",
				},
		dentists: [{text: "Select a dentist", value: null}],
		appointments: [],
		showOverlay: false,
	}},
	created: function() {
		today = new Date()
		this.date = "" + today.getFullYear() + "-" + ( ((today.getMonth()+1)>10)?((today.getMonth()+1)):("0"+(today.getMonth()+1)) ) + "-" + ( (today.getDate()>10)?(today.getDate()):("0"+today.getDate()) )		
		this.branches = [{text: "Select a branch", value: null}, 'branch 1', 'branch 2', 'branch 3']
	},
	methods: {
		getDentists(branch) {
			dentists = [
				{
					ssn: "1",
					first_name: "John",
					last_name: "Doe",
				},
			]
			this.dentist = null
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
		},
		getAppointments(date, branch, dentist) {
			this.appointments = [
				{
					start_time: "start_time",
					end_time: "end_time",
					dentist: {
						ssn: "1",
						first_name: "John",
						last_name: "Doe",
					},
					patient: {
						ssn: "2",
						first_name: "Jane",
						last_name: "Doe",
					},
					type: "appointment_type",
					status: "appointment_status",
				},
			]
		}
	},
	watch: {
		branch: function(oldBranch, newBranch) {
			this.getDentists(newBranch)
		},
		dentist: function(oldDentist, newDentist) {
			this.getAppointments(this.date, this.branch, newDentist)
		},
	},
	template:
	`
	<div style="background-color:#ccc; padding: 5rem; margin: 5rem; min-height: 40rem">
		<b-overlay :show="showOverlay" rounded="sm">
			<h3>Appointments</h3>
			<b-form-select v-model="branch" :options="branches"></b-form-select>
			<b-form-select v-model="dentist" :options="dentists" :disabled="branch==null"></b-form-select>
			<b-form-datepicker v-model="date" class="mb-2" :disabled="dentist==null"></b-form-datepicker>
			<div style="background-color: #fff; padding: 1rem;" v-if="dentist!=null">
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
							<td>{{appointment.dentist.ssn}}: {{appointment.dentist.first_name}} {{appointment.dentist.last_name}}</td>
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