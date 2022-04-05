Vue.component("dentist", {
	props: ["user"],
	data: function() { return {
			date: "",
			appointments: [],
			apt: null,
			procedures: null,
			temp_procedure: null,
			new_procedure_error: "",
	}},
	created: function() {
		today = new Date()
		this.date = "" + today.getFullYear() + "-" + ( ((today.getMonth()+1)>10)?((today.getMonth()+1)):("0"+(today.getMonth()+1)) ) + "-" + ( (today.getDate()>10)?(today.getDate()):("0"+today.getDate()) )		
	},
	watch: {
		date: function(old, newDate) {
			this.getAppointments(this.date)
		},
		user: function(old, newUser) {
			this.getAppointments(this.date)
		}
	},
	methods: {
		getAppointments(newDate) {
			if (this.user != null) {
				console.log('/api/v2/dentist/'+this.user.ssn+"/appointment/"+newDate)
				axios({
					method: 'get',
					url: '/api/v2/dentist/'+this.user.ssn+"/appointment/"+newDate,
				}).then((response) => {
					console.log(response)
					this.appointments = response.data
				}, (error) => {
					console.log(error)
				})
			}
			/*
			// use this.user.SSN & this.date to query
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
				{
					start_time: "start_time 2",
					end_time: "end_time 2",
					dentist: {
						ssn: "2",
						first_name: "Jane",
						last_name: "Doe",
					},
					patient: {
						ssn: "1",
						first_name: "John",
						last_name: "Doe",
					},
					type: "appointment_type 2",
					status: "appointment_status 2",
				},
			]
			*/

		},
		selectApt(index) {
			// this should call api to get (appointment + procedure + medical history) 
			this.apt = this.appointments[index];
			this.apt.patient.treatments = [
				{

				}
			];
			this.temp_procedure = {
				code: '',
				type: '',
				tooth_involved: '',
				medication: '',
				description: '',
			}
		},
		addProcedure() {
			if (this.temp_procedure.code == '') {
				this.new_procedure_error = "code is empty"
				return
			} else if (this.temp_procedure.type == '') {
				this.new_procedure_error = "type is empty"
				return
			} else if (this.temp_procedure.tooth_involved == '') {
				this.new_procedure_error = "tooths is empty"
				return
			} else if (this.temp_procedure.medication == '') {
				this.new_procedure_error = "medication is empty"
				return
			} else if (this.temp_procedure.description == '') {
				this.new_procedure_error = "description is empty"
				return
			}
			//reset the new procedure row
			this.new_procedure_error = ''
			this.temp_procedure = {
				code: '',
				type: '',
				tooth_involved: '',
				medication: '',
				description: '',
			}
		},
	},
	template: 
	`
	<div style="margin: 5rem;">
		<b-form-datepicker 
			v-model="date" 
			class="mb-2"
			style="width:15rem;">
		</b-form-datepicker>
		<div style="margin-top: 2rem;">
			<div style="display:inline-block; width:40%; vertical-align:top;">
				<table class="table table-hover table-bordered">
					<thead>
						<tr>
							<th scope="col">Start Time</th>
							<th scope="col">End Time</th>
							<th scope="col">Patient</th>
							<th scope="col">Type</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody>
						<tr class="clickable" v-for="(appointment, index) in appointments" @click="selectApt(index)">
							<td>{{appointment.start_time}}</td>
							<td>{{appointment.end_time}}</td>
							<td>{{appointment.patient.ssn}}: {{appointment.patient.first_name}} {{appointment.patient.middle_name}} {{appointment.patient.last_name}}</td>
							<td>{{appointment.type}}</td>
							<td>{{appointment.status}}</td>
						</tr>
					</tbody>
				</table>
			</div><div style="display:inline-block; width:1%; vertical-align:top;">
			</div><div style="display:inline-block; width:59%; vertical-align:top; border:1px solid #dee2e6; padding:1rem;">
				<div v-if="apt" >
					<h5 style="margin-bottom:2rem;">{{apt.patient.ssn}}: {{apt.patient.first_name}} {{apt.patient.last_name}}</h5>
					<div style="width:100%">
						<h5>Procedures</h5>
						<table class="table table-bordered">
							<thead>
								<tr>
									<th scope="col">Code</th>
									<th scope="col">Type</th>
									<th scope="col">Tooths</th>
									<th scope="col">Medication</th>
									<th scope="col">description</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="procedure in apt.procedures">
									<td scope="col">{{procedure.code}}</td>
									<td scope="col">{{procedure.type}}</td>
									<td scope="col">{{procedure.tooth_involved}}</td>
									<td scope="col">{{procedure.medication}}</td>
									<td scope="col">{{procedure.description}}</td>
									<td scope="col">{{procedure.fee}}</td>
								</tr>
								<tr>
									<td scope="col">
										<b-input v-model="temp_procedure.code" placeholder="Code"></b-input>
									</td>
									<td scope="col">
										<b-input v-model="temp_procedure.type" placeholder="Type" ></b-input>
									</td>
									<td scope="col">
										<b-input v-model="temp_procedure.tooth_involved" placeholder="Tooth Involved" style="min-width:4rem;"></b-input>
									</td>
									<td scope="col">
										<b-textarea style="min-width:10rem;"
											v-model="temp_procedure.medication" 
											placeholder="Medication">
										</b-textarea>
									</td>
									<td scope="col">
										<b-textarea style="min-width:15rem;"
											v-model="temp_procedure.description" 
											placeholder="description">
										</b-textarea>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div>
						<b-button variant="primary" 
							style="margin: 1rem 0 2rem 0;"
							@click="addProcedure">
							Add procedure
						</b-button>
						<div style="display:inline-block; vertical-align: super; color: red; margin-left: 2rem;"
							v-if="new_procedure_error!=''">
							Can't add this procedure because the {{new_procedure_error}}
						</div>
					</div>
					<div style="width:100%">
						<h5>Treatments</h5>
						<table class="table table-bordered">
							<thead>
								<tr>
									<th scope="col">Type</th>
									<th scope="col">Tooths</th>
									<th scope="col">Medication</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="treatment in apt.patient.treatments">
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
})

