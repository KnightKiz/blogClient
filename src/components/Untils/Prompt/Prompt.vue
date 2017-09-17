<template>
	<transition name="prompt-fade">
		<div class="prompt" :class="{'top': direction === 'top', 'left': direction === 'left', 'bottom': direction === 'bottom', 'right': direction === 'right'}">
			<div class="content">{{content}}</div>
			<div class="arrow"></div>
		</div>
	</transition>
</template>

<script>
export default {
	props: {
		direction: {
			default: 'top',
			type: String
		},
		content: {
			default: 'warning',
			type: String
		}
	}
};
</script>

<style lang="stylus" scoped>
	.prompt-fade-enter-active, .prompt-fade-leave-active
		transition: all .2s
		opacity: 1
	.prompt-fade-enter, .prompt-fade-leave-to
		opacity: 0
	.prompt
		position: absolute
		display: block
		z-index: 999
		height: 30px
		font-size: 14px
		color: #fff
		.content
			box-sizing: 0
			line-height: 30px
			padding: 0 8px
			background-color: #000
			border-radius: 4px
			white-space: nowrap
		&.top
			right: 0
			left: 0
			bottom: -30px
			margin: 0 auto
			.arrow
				position: absolute
				width: 1px
				top: -7px
				right: 0
				left: 0
				margin 0 auto
				border-bottom: 8px solid #000
				border-left: 6px solid transparent
				border-right: 6px solid transparent
				border-top-width: 0
		&.left
			top: 0
			bottom: 0
			right: -40px
			transform: translateX(56px)
			margin: auto 0
			.arrow
				position: absolute
				height: 1px
				left: -7px
				bottom: 0
				top: 0
				margin auto 0
				border-right: 8px solid #000
				border-top: 6px solid transparent
				border-bottom: 6px solid transparent
				border-left-width: 0
		&.right
			top: 0
			bottom: 0
			left: -40px
			margin: auto 0
			.arrow
				position: absolute
				height: 1px
				right: -7px
				bottom: 0
				top: 0
				margin auto 0
				border-left: 8px solid #000
				border-top: 6px solid transparent
				border-bottom: 6px solid transparent
				border-right-width: 0
		&.bottom
			right: 0
			left: 0
			top: -30px
			margin: 0 auto
			.arrow
				position: absolute
				width: 1px
				bottom: -7px
				right: 0
				left: 0
				margin 0 auto
				border-top: 8px solid #000
				border-left: 6px solid transparent
				border-right: 6px solid transparent
				border-bottom-width: 0	
</style>
