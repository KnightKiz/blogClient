<template>
	<transition name="comfirm-slide">
		<div class="comfirm">
			<div class="mask"></div>
			<div class="dialog">
				<p class="content">
					{{content}}
				</p>
				<div class="btn" @click="submit()">确定</div>
				<div class="btn" @click="cancel()">取消</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	props: {
		content: {
			type: String,
			default: '确定吗？'
		},
		submit: {
			type: Function,
			default: _submit
		},
		cancel: {
			type: Function,
			default: _cancel
		}
	},
	methods: {
		_submit () {
			alert('submit');
		},
		_cancel () {
			alert('cancel');
		}
	},
	created () {
		document.body.style.overflow = hidden;
	},
	destroyed () {
		document.body.style.overflow = auto;
	}
};
</script>

<style lang="stylus" scoped>
.comfirm-slide-enter-active, .comfirm-slide-leave-active
	transition: all .4s
	opacity: 1
comfirm-slide-enter, .comfirm-slide-leave-to
	opacity: 0
.comfirm
	position: relative
	.mask
		height: 100%
		width: 100%
		background-color: rbga(0, 0, 0, 0.7)
	.dialog
		position: absolute
		top: 0
		left: 0
		right: 0
		bottom: 0
		margin: auto
</style>
