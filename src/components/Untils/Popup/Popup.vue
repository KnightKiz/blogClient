<template>
	<transition name="popup-slide">
		<div class="popup" v-show="popup">
			{{message}}
		</div>
	</transition>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			default: '警告'
		},
		showPopup: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		popup () {
			console.log('inside ' + this.showPopup);
			if (this.showPopup) {
				setTimeout(() => {
					this._hidePopup();
				}, 2000);
			}
			return this.showPopup;
		}
	},
	methods: {
		_hidePopup () {
			this.$emit('hidePopup');
		}
	}
};
</script>  

<style lang="stylus" scpoed>
.popup-slide-enter-active, .popup-slide-leave-active
	transition: all .4s
	opacity: 0.8
.popup-slide-enter, .popup-slide-leave-to
	transform: translateY(-76px)
	opacity: 0
.popup
	box-sizing: border-box
	position: absolute
	top: 20px
	left: 0
	right: 0
	height: 56px
	line-height: 56px
	width: 180px
	margin: 0 auto
	text-align: center
	background-color: #F20F0F
	font-size: 20px
	font-weight: 300
	color: #fff
	opacity: 0.8
	border-radius: 5px
</style>
