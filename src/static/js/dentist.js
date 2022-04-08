Vue.component("dentist", {
	props: ["user"],
	data: function() { return {
			date: "",
			appointments: [],
			apt: null,
			procedures: null,
			med_history: null,
			temp_procedure: null,
			new_procedure_error: "",
	}},
	created: function() {
		today = new Date()
		this.date = "" + today.getFullYear() + "-" + ( ((today.getMonth()+1)>10)?((today.getMonth()+1)):("0"+(today.getMonth()+1)) ) + "-" + ( (today.getDate()>10)?(today.getDate()):("0"+today.getDate()) )		
		this.getAppointments(this.date)
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
				axios({
					method: 'get',
					url: '/api/v2/dentist/'+this.user.ssn+"/appointment/"+newDate,
				}).then((response) => {
					this.appointments = response.data
				}, (error) => {
					console.log(error)
				})
			}
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
				fee: ''
			}
			this.getProcedure(this.apt.appointment_id)
			this.getPreviousTreatment(this.apt.patient.ssn)
		},
		getProcedure(id) {
			axios({
				method: "GET",
				url: "/api/v2/appointment/"+id+"/procedure",
			}).then((response) => {
				this.procedures = response.data
			}, (error) => {
				console.log(error)
			})
		},
		getPreviousTreatment(ssn) {
			axios({
				method: "GET",
				url: "/api/v2/patient/"+ssn+"/medical_history"
			}).then((response) => {
				this.med_history = response.data
			}, (error) => {
				console.log(error)
			})
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
			} else if (this.temp_procedure.fee == '') {
				this.new_procedure_error = "fee is empty"
				return
			}
			console.log(this.temp_procedure)
			axios({
				method: "POST",
				url: "/api/v2/appointment/"+this.apt.appointment_id+"/procedure",
				data: {
					procedure_code: parseInt(this.temp_procedure.code),
					procedure_type: this.temp_procedure.type,
					description: this.temp_procedure.description,
					tooth_involved: this.temp_procedure.tooth_involved,
					medication: this.temp_procedure.medication,
					fee: this.temp_procedure.fee
				}
			}).then((response) => {
				//reset the new procedure row
				this.new_procedure_error = ''
				this.temp_procedure = {
					code: '',
					type: '',
					tooth_involved: '',
					medication: '',
					description: '',
					fee: '',
				}
				this.getProcedure(this.apt.appointment_id)
			}, (error) => {
				console.log(error)
			})
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
			</div><div style="display:inline-block; width:59%; vertical-align:top; border:1px solid #dee2e6; padding:1rem;" v-if="apt != null">
				<div>
					<h5 style="margin-bottom:2rem;">{{apt.patient.ssn}}: {{apt.patient.first_name}} {{apt.patient.last_name}}</h5>
					<div v-if="apt != null && apt.type!='TREATMENT'">
						<div style="width:100%">
							<h5>Procedures</h5>
							<table class="table table-bordered">
								<thead>
									<tr>
										<th scope="col">Code</th>
										<th scope="col">Type</th>
										<th scope="col">Tooths</th>
										<th scope="col">Medication</th>
										<th scope="col">Description</th>
										<th scope="col">Fee</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="procedure in procedures">
										<td scope="col">{{procedure.procedure_code}}</td>
										<td scope="col">{{procedure.procedure_type}}</td>
										<td scope="col">{{procedure.tooth_involved}}</td>
										<td scope="col">{{procedure.medication}}</td>
										<td scope="col">{{procedure.description}}</td>
										<td scope="col">{{procedure.fee}}</td>
									</tr>
									<tr>
										<td scope="col">
											<b-input type="number" v-model="temp_procedure.code" placeholder="Code"></b-input>
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
										<td scope="col">
											<b-input v-model="temp_procedure.fee" placeholder="0.00" style="width:5.5rem;"></b-input>
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
					</div>
				</div>
				<div style="width:100%">
					<h5>Medical History</h5>
					<table class="table table-bordered">
						<thead>
							<tr>
								<th scope="col">Date</th>
								<th scope="col">Type</th>
								<th scope="col">Tooths</th>
								<th scope="col">Medication</th>
								<th scope="col">Comments</th>
								<th scope="col">Symptoms</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="treat in med_history">
								<td>{{treat.date}}</td>
								<td>{{treat.treatment_type}}</td>
								<td>{{treat.tooth_involved}}</td>
								<td>{{treat.medication}}</td>
								<td>{{treat.comments}}</td>
								<td>{{treat.symptoms}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	`
})

