<template>
	<div class="markdown-editor">
		<div class="article-title" contenteditable="true">{{title}}</div>
		<ul class="nav">
			<li class="item" @mouseenter="showList($event)" @mouseleave="hideList($event)">
				标题
				<triangle class="trian"></triangle>
				<ul class="list-ul">
					<li class="list-li" @click="title(1)">H1</li>
					<li class="list-li" @click="title(2)">H2</li>
					<li class="list-li" @click="title(3)">H3</li>
					<li class="list-li" @click="title(4)">H4</li>
					<li class="list-li" @click="title(5)">H5</li>
					<li class="list-li" @click="title(6)">H6</li>
				</ul>
			</li>
			<li class="item" @mouseenter="showList($event)" @mouseleave="hideList($event)">
				列表
				<triangle class="trian"></triangle>
				<ul class="list-ul">
					<li class="list-li">无序列表</li>
					<li class="list-li">有序列表</li>
				</ul>
			</li>
			<li class="item">分割线</li>
			<li class="item">引用</li>
			<li class="item">链接</li>
			<li class="item">图片</li>
			<li class="item">粗体</li>
			<li class="item">斜体</li>
			<li class="item">删除线</li>
			<li class="item">表格</li>
			<li class="item">代码</li>
			<li class="item" :class="{'active': !editContent}" @click="afterMark()"><i class="fa fa-eye"></i></li>
			<li class="btn btn-save" @click="saveArticle()">保存</li>
			<li class="btn btn-submit" @click="submitArticle()">提交</li>
		</ul>
		<textarea class="areas" v-model="content" v-if="editContent"></textarea> 
		<div class="areas" v-else v-html="content"></div>
		<comfirm ></comfirm>
	</div>
</template>

<script>
import triangle from '../Untils/Triangle/Triangle';
import marked from 'marked';
import highlight from 'highlight.js';
export default {
	props: {
		article: {
			default: '',
			type: String
		},
		type: {
			default: 'edit',
			type: String
		}
	},
	data () {
		return {
			// 存放当前文本
			content: '',
			// 眼睛按钮是否高亮
			editContent: true,
			// 存放原生文本
			rowContent: '',
			// 文章标题
			title: '新建文章标题'
		};
	},
	mounted () {
		// 配置marked
		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: true,
			smartLists: true,
			smartypants: false,
			highlight: function (code) {
				return highlight.highlightAuto(code).value;
			}
		});
	},
	components: {
		triangle
	},
	methods: {
		// 保存到浏览器
		saveArticle () {
			if (!window.localStorage.getItem('articles')) {
				let articles = [];
				window.localStorage.setItem('articles', JSON.stringify(articles));
			}
			let articles = JSON.parse(window.localStorage.getItem('articles'));
			articles.push(this.rowContent);
		},
		// 提交到数据库
		submitArticle () {
		},
		showList (event) {
			event.target.getElementsByClassName('list-ul')[0].style.transform = 'scaleY(1)';
		},
		hideList (event) {
			event.target.getElementsByClassName('list-ul')[0].style.transform = 'scaleY(0)';
		},
		afterMark () {
			console.log(this.content);
			this.editContent = !this.editContent;
			if (!this.editContent) {
				this.rowContent = this.content;
				this.content = marked(this.content);
			} else if (this.editContent) {
				this.content = this.rowContent;
			}
		}
	}
};
</script>

<style lang="stylus">
@import '../../common/stylus/index.styl'
.trian
	position: absolute
	top: 2px
	right: 2px
.markdown-editor
	box-sizing: border-box
	position: relative
	width: 100%
	height: 100%
	padding-top: 94px
	.article-title
		position: absolute
		top: 0
		left: 0
		height: 60px
		line-height: 60px
		padding: 0 40px
		font-size: 34px
		font-weight: 400
		outline: none
	.nav
		position: absolute
		top: 60px
		left: 0
		width: 100%
		height: 34px
		box-sizing: border-box
		padding-left: 10%
		border: 1px solid #ddd
		color: #aaa
		background-color: #efefef
		border-radius: 3px
		.item
			position: relative
			box-sizing: border-box
			cursor: pointer
			user-select: none
			display: inline-block
			text-align: center
			vertical-align: top
			height: 34px
			line-height: 34px
			width: 50px
			font-size: 14px
			transition: all .4s
			&.active
				background-color: #888
				color: #efefef
			&:nth-child(3), &:nth-last-child(4), &:nth-child(2)
				width: 60px
			.list-ul
				width: 100%
				overflow: hidden
				margin-top: 1px
				color: #999
				background-color: #efefef
				transition: all .4s
				transform: scaleY(0)
				transform-origin: 0 0 0
				.list-li
					width: 100%
					transition: all .4s
					&:hover
						background-color: #888
						color: #efefef
			&:hover
				background-color: #888
				color: #efefef
		.btn
			cursor: pointer
			user-select: none
			display: inline-block
			margin-top: 2px
			margin-right: 10px
			width: 85px
			height: 28px
			line-height: 28px
			text-align: center
			font-size: 14px
			color: #ffffff
			background-color: #DE5145
			border-radius: 4px
			&:hover
				opacity: 0.8
	.areas
		box-sizing: border-box
		width: 100%
		height: 100%
		overflow: auto
		padding: 20px 30px
		font-family: '微软雅黑'
		resize: none
		border: none
		outline: none
		markdown()
</style>
