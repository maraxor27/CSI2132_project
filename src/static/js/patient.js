Vue.component("patient", {
	props: ["user"],
	data: function() { return {
		// default value are for testing without api connection 
		default_user: {
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
		},
		past_appointment: [
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
		],
		future_appointment: [
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
		],
	}},
	methods: {

	},
	template:
	`
		<div>
			PATIENT INFORMATION
			<br>

			<div style="margin-bottom:1rem;background-color:#ccc">
				SSN = {{default_user.SSN}}
				<br>
				firstname = {{default_user.first_name}}
				<br>
				middlename = {{default_user.middle_name}}
				<br>
				lastname = {{default_user.last_name}}
				<br>
				...
				<br>
				age = {{default_user.age}}
			</div>

			PAST APPOINTMENT
			<br>

			<appointment v-for="(p_apt, index) in past_appointment" :info="p_apt"></appointment>
			<br>
			
			FUTURE APPOINTMENT
			<br>
			
			<appointment v-for="(f_apt, index) in future_appointment" :info="f_apt"></appointment>
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