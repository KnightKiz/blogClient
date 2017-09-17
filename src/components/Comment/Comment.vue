<template>
	<div class="comment">
		<input class="name" type="text" placeholder="填写你的姓名" v-model="from" ref="name">
		<input class="name" type="type" readonly="readonly" :value="to" v-if="isReply" style="color: #3194d0;user-select:none">
		<textarea class="content" rows="5" placeholder="填写内容" v-model="content"></textarea>
		<div class="warning" v-show="showWarning">{{warningContent}}</div>
		<div class="btns">
			<div class="submit-btn btn" @click="onSubmit()">{{getType}}</div>
			<div class="cancel-btn btn" @click="cancel()">取消</div>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			showWarning: false,
			warningContent: '',
			from: '',
			content: ''
		};
	},
	mounted () {
		if (this.commentKey !== -1) {
			this.$refs.name.focus();
		}
	},
	computed: {
		getType () {
			return this.isReply ? '回复' : '评论';
		},
		to () {
			return '@' + this.toSomebody;
		}
	},
	props: {
		toSomebody: {
			default: '',
			type: String
		},
		isReply: {
			default: false,
			type: Boolean
		},
		submit: {
			default: () => {},
			type: Function
		},
		commentId: {
			default: -1,
			type: Number
		},
		commentKey: {
			default: -1,
			type: Number
		}
	},
	methods: {
		onSubmit () {
			if (this.from === '') {
				this.warningContent = '姓名不能为空';
				this.showWarning = true;
				return;
			}
			if (this.content === '') {
				this.warningContent = '内容不能为空';
				this.showWarning = true;
				return;
			}
			if (this.isReply) {
				this.submit(this.from, this.toSomebody, this.content, this.commentId, this.commentKey);
			} else {
				this.submit(this.from, this.content);
			}
			this.from = '';
			this.content = '';
			this.warningContent = '';
			this.showWarning = false;
		},
		cancel () {
			this.from = '';
			this.content = '';
			this.warningContent = '';
			this.showWarning = false;
			this.$root.eventHub.$emit('cancel', this.commentKey);
		}
	}
};
</script>

<style lang="stylus" scoped>
	.comment
		.name
			box-sizing: border-box
			width: 100%
			margin-bottom: 20px
			padding: 10px 6px
			background-color: #fafafa
			border: 1px solid #ddd
			border-radius: 4px
			outline: none
			transition: all .3s
			&:focus
				box-shadow: 0 0 7px 0 #5aa
		.content
			box-sizing: border-box
			width: 100%
			line-height: 1.3
			margin-bottom: 20px
			padding: 10px 6px
			background-color: #fafafa
			font-family: '微软雅黑'
			border: 1px solid #ddd
			border-radius: 4px
			resize: none
			outline: none
			transition: all .3s
			&:focus
				box-shadow: 0 0 7px 0 #5aa
		.warning
			margin-bottom: 10px
			font-size: 15px
			color: #f00
		.btns
			font-size: 0
			.btn
				user-select: none
				cursor: pointer
				display: inline-block
				padding: 10px 32px
				font-size: 14px
				border-radius: 17px
				&:hover
					opacity: 0.8
			.submit-btn
				margin-right: 20px
				background-color: #42c02e
				color: #fff
			.cancel-btn
				background-color: #ec6149
				color: #fff
</style>
