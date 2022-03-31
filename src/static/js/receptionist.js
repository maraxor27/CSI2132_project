Vue.component("receptionist", {
	props: ["user"],
	data: function() { return {
		
	}},
	methods: {

	},
	template:
	`
	<div>
		RECEPTIONIST
		<br>
		<new-patient></new-patient>
	</div>
	`
})

Vue.component("new-patient", {
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
	<div style="background-color:#ccc; padding: 5rem;">
		PATIENT FORM
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