<template>
	<div class="triangle" :class="{'bottom': direction === 'bottom', 'top': direction === 'top', 'right': direction === 'right', 'left': direction === 'left'}"></div>
</template>

<script>
export default {
	props: {
		direction: {
			type: String,
			default: 'bottom'
		}
	}
};
</script>

<style lang="stylus" scoped>
.triangle
	width: 0
	height: 0
	&.bottom
		border-bottom: none
		border-right: 4px dashed transparent
		border-left: 4px dashed transparent
		border-top: 6px solid #000
</style>
