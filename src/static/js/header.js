Vue.component('myheader', {
	data: function() {
		return {
			firstname:"",
			lastname:"",
			email: "",
			password: "",
			user: {},
			logged_in: false,
			error_message: "",
		}
	},
	created: function() {
		axios({
			method: 'post',
			url: '/login',
		}).then((response) => {
			this.login_success(response)
		}, (error) => {})
	},
	methods: {
		login(email, password) {
			axios({
				method: 'post',
				url: '/login',
				data: {
					'email': email,
					'password': password
				}
			}).then((response) => {
				this.login_success(response)
			}, (error) => {
				console.log(error)
				this.error_message = "Invalid email password combination"
			})
		},
		login_success(response) {
				this.user = response.data
				this.error_message = ""
				this.logged_in = true
				this.email = ""
				this.password = ""
				// console.log("login:", this.user)
				this.$emit('user-update', this.user)
		},
		logout() {
			axios({
				methods: "post",
				url: "/logout",
			}).then((response) => {
				this.user = {}
				this.logged_in = false
				this.$emit('user-update', this.user)
			})
		},

	},
//Display of the header
	template:
	`
	<div>
		<b-navbar type="dark" variant="dark">
			<b-navbar-brand 
				<a href="/" >
					<button type="button" class="btn btn-dark" style="margin: auto; font-size: larger;">DCMS</button>
				</a>
			</b-navbar-brand>
			
			<b-navbar-nav class="ml">
				<b-navbar-nav>
					<a href="/patient" v-if="user.patient!=null">
						<button type="button" class="btn btn-dark" style="margin: auto;">Patient</button>
					</a>

					<a href="/dentist" v-if="user.employee_type == 'dentist'">
						<button type="button" class="btn btn-dark" style="margin: auto;">Dentist</button>
					</a>

					<a href="/receptionist" v-if="user.employee_type == 'receptionist'">
						<button type="button" class="btn btn-dark" style="margin: auto;">Receptionist</button>
					</a>
				</b-navbar-nav>

				<b-nav-item-dropdown text="User" v-if="!logged_in" right>
					<li class="no-wrap" style="min-width: 17rem; margin: 4px;">
						<div class="input-group input-group-sm mb-3">
							<div class="input-group-prepend" style="width:5rem; display:block; text-align:left;">
								<span class="input-group-text" id="inputGroup-sizing-sm">Email</span>
							</div>
						<input type="text" class="form-control" 
						v-model="email"
						aria-label="Small" aria-describedby="inputGroup-sizing-sm">
						</div>
					</li>
			
					<li class="no-wrap" style="min-width: 17rem; margin: 4px;">
						<div class="input-group input-group-sm mb-3">
							<div class="input-group-prepend" style="width:5rem; display:block; text-align:left;">
								<span class="input-group-text" id="inputGroup-sizing-sm">Password</span>
							</div>
							<input type="password" class="form-control" 
							v-model="password"
							aria-label="Small" aria-describedby="inputGroup-sizing-sm">
						</div>
					</li>
					
					<li v-show="error_message != ''" style="color: red; margin-bottom: 1rem;">{{ error_message }}</li>
			
					<li style="margin: 4px;">
						<button class="btn btn-dark" style="margin: auto;" 
							v-on:click="login(email, password)">Connect
						</button>

						<a href="/signUp" >
							<button type="button" class="btn btn-dark" style="margin: auto;">Sign Up</button>
						</a>
					</li>
				</b-nav-item-dropdown>

				<b-nav-item-dropdown v-bind:text="user.email" v-else right>
					<b-dropdown-item href="/account">Account</b-dropdown-item>

					<li class="no-wrap" style="min-width: 10rem; margin: 4px;">
						<button class="btn btn-dark" style="margin: auto;" 
							v-on:click="logout()">
							Logout
						</button>
					</li>
				</b-nav-item-dropdown>
			</b-navbar-nav>
		</b-navbar>
	</div>
	`
})