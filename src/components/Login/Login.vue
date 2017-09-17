<template>
	<transition name="login-fade" mode="out-in">
		<div class="login-wrapper">
			<popup :message="message" :show-popup="showPopup" v-on:hidePopup="hidePopup"></popup>
			<transition name="login-slide">
				<div class="login">
					<h1 class="title">Welcome</h1>
					<input type="text" class="input" placeholder="Username" v-model="username">
					<input type="password" class="input" placeholder="Password" v-model="password">
					<div class="btn" @click="login()">Login</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import popup from '../Untils/Popup/Popup';
export default {
	data () {
		return {
			username: '',
			password: '',
			message: '',
			showPopup: false
		};
	},
	components: {
		popup
	},
	methods: {
		hidePopup () {
			this.showPopup = false;
		},
		_checkInput () {
			if (this.username === '') {
				this.message = '用户名不能为空';
				this.showPopup = true;
				return false;
			} else if (this.password === '') {
				this.message = '密码不能为空';
				this.showPopup = true;
				return false;
			}
			return true;
		},
		login () {
			if (!this._checkInput()) {
				return;
			}
			let url = '';
			let data = {
				username: this.username,
				password: this.password
			};
			this.$http.post(url, data).then(res => {
				if (res.data) {
				}
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
.login-fade-enter-active, .login-fade-leave-active
	transition: all .5s
	opacity: 1
.login-fade-enter, .login-fade-leave-to
	transform: translateY(-30px)
	opacity: 0
.login-wrapper
	position: absolute
	top: 0
	left: 0
	height: 100%
	width: 100%
	background-color: #74D1B6
	.login
		position: absolute
		top: 0
		left: 0
		right: 0
		bottom: 0
		margin: auto
		width: 30%
		height: 50%
		@media screen and (max-width: 620px)
			width: 70%
		.title
			line-height: 1.3
			text-align: center
			font-size: 36px
			font-weight: 200
			margin-bottom: 20px
			color: #fff
		.input
			width: 100%
			height: 46px
			line-height: 46px
			margin-bottom: 20px
			text-align: center
			font-size: 18px
			font-weight: 200
			box-shadow: 0 2px 5px 2px #74B6B5
			border: none
			border-radius: 3px
			background-color: #90D9C5
			color: #fff
			outline: none
			&::-webkit-input-placeholder
				color: #fff
			&:-moz-placeholder
				color: #fff
			&::-moz-placeholder
				color: #fff
			&:-ms-input-placeholder
				color: #fff
		.btn
			cursor: pointer
			user-select: none
			width: 100%
			height: 46px
			line-height: 46px
			text-align: center
			font-size: 18px
			font-weight: 200
			background-color: #fff
			color: #74D1B6
			box-shadow: 0 2px 5px 2px #74B6B5
			border-radius: 3px
			&:hover
				opacity: 0.8
</style>
