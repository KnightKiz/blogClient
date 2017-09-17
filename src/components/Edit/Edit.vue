<template>
	<transition name="edit-fade" mode="out-in">
		<div class="edit">
			<div class="menu-wrapper">
				<ul class="menu">
					<li class="menu-item" @click="back()" @mouseenter="isback=true" @mouseleave="isback=false"><i class="fa fa-reply"></i><prompt direction="left" content="返回" v-show="isback"></prompt></li>
					<li class="menu-item" @click="newArticle()" @mouseenter="isNew=true" @mouseleave="isNew=false"><i class="fa fa-magic"></i><prompt direction="left" content="新建文章" v-show="isNew"></prompt></li>
					<li class="menu-item" @click="getDraft()" @mouseenter="isDraft=true" @mouseleave="isDraft=false"><i class="fa fa-shopping-basket"></i><prompt direction="left" content="草稿箱" v-show="isDraft"></prompt></li>
					<li class="menu-item" @click="editArticle()" @mouseenter="isEdit=true" @mouseleave="isEdit=false"><i class="fa fa-pencil-square-o"></i><prompt direction="left" content="文章编辑" v-show="isEdit"></prompt></li>
				</ul>
			</div>
			<transition name="articles-slide">
				<div class="articles-wrapper" v-show="isEditing">
					<ul class="articles">
						<li class="empty" v-show="editArticles !== undefined && editArticles.length === 0">
							文章列表为空
							<i class="fa fa-money"></i>
						</li>
						<li class="article-item" v-for="(item, index) in editArticles" :key="index" @click="selectArticle(index)" :class="{'activeLi': item.activeli}">
							<i class="fa fa-file-text"></i>
							<h1 class="article-title">{{item.title}}</h1>
							<span class="article-info">
								<span class="article-time">{{item.createTime}}</span>
								<span class="article-like">点赞 {{item.like}}</span>
								<span class="article-comment" v-show="item.comments !== undefined">评论 {{item.comments.length}}</span>
							</span>
						</li>
					</ul>
				</div>
			</transition>
			<div class="main-wrapper">
				<markdown-editor :ariticleContent="ariticleContent" :type="type"></markdown-editor>
			</div> 
		</div>
	</transition>
</template>

<script>
import prompt from '../Untils/Prompt/Prompt';
import markdownEditor from '../MarkdownEditor/MarkdownEditor';
export default {
	computed: {
		editArticles () {
			return this.$store.state.initData.articles;
		}
	},
	components: {
		prompt,
		markdownEditor
	},
	created () {
		this.$http.get('/api/data').then(res => {
			res.data.articles = res.data.articles.map(val => {
				val.activeli = false;
				return val;
			});
			this.$store.commit('setData', res.data);
		});
	},
	methods: {
		// 返回首页
		back () {
			this.$router.push('/index');
		},
		// 新建文章
		newArticle () {
			this.isEditing = false;
			this.type = 'write';
		},
		// 打开草稿箱
		getDraft () {
			this.isEditing = true;
			this.type = 'edit';
		},
		// 编辑文章
		editArticle () {
			this.isEditing = true;
			this.type = 'edit';
		},
		// 选择文章进行编辑
		selectArticle (index) {
			if (this.editArticles[index].activeli) {
				this.editArticles[index].activeli = false;
			} else {
				this.editArticles.forEach((val) => {
					val.activeli = false;
				});
				this.editArticles[index].activeli = true;
				this._getArticle(index);
			}
		},
		// 点击获取文章
		_getArticle (index) {
			this.ariticleContent = this.editArticles[index].content;
		}
	},
	data () {
		return {
			// 编辑状态
			isEditing: false,
			// 草稿状态,只保存在浏览器
			isdrafting: false,
			// 返回按钮prompt显示
			isback: false,
			// 新建文章按钮prompt显示
			isNew: false,
			// 草稿箱按钮prompt显示
			isDraft: false,
			// 编辑按钮prompt显示
			isEdit: false,
			// 存放articles是草稿还是当前文章
			currentArticles: this.editArticles,
			// 传入markdown组件的文章内容
			ariticleContent: '',
			// 当前markdown是编辑状态还是创作状态
			type: 'write'
		};
	}
};
</script>

<style lang="stylus" scoped>
.edit-fade-enter-active, .edit-fade-leave-active
	transition: all .5s
	opacity: 1
.edit-fade-enter, .edit-fade-leave-to
	opacity: 0
.articles-slide-enter-active, .articles-slide-leave-active
	transition: all .4s
.articles-slide-enter, .articles-slide-leave-to
	transform: translateX(-100%);
.edit
	position: absolute
	top: 0
	left: 0
	height: 100%
	width: 100%
	font-size: 0
	display: flex
	flex-wrap: nowrap
	.menu-wrapper
		z-index: 999
		flex-shrink: 0
		height: 100%
		width: 56px
		background-color: #1E1E1E
		.menu
			width: 100%
			margin-top: 20px
			.menu-item
				position: relative
				cursor: pointer
				user-select: none
				line-height: 56px
				margin-bottom: 10px
				width: 100%
				text-align: center
				font-size: 28px
				color: #007ACC
				transition: all .3s
				&:hover
					box-shadow: 0 0 10px 0 #fff inset
					color: #fff
	.articles-wrapper
		z-index: 0
		flex-shrink: 0
		height: 100%
		width: 320px
		overflow: auto
		transition: all .4s
		.articles
			width: 100%
			.empty
				margin: 40px 0
				text-align: center
				font-size: 26px
				color: #aaa
				.fa
					display: block
					margin-top: 20px
					font-size: 50px
			.article-item
				z-index: 999
				position: relative
				padding: 5px 20px
				border-bottom: 1px solid #ddd
				cursor: pointer
				user-select: none
				transition: all .4s
				&.activeLi
					background-color: #efefef
				&:hover
					box-shadow: 0 0 10px 0 #aaa
				&:last-child
					border: none
				.fa
					position: absolute
					top: 30px
					left: 20px
					color: #888
					font-size: 30px
				.article-title
					white-space:nowrap
					overflow:hidden
					text-overflow:ellipsis
					line-height: 88px
					margin-left: 35px
					font-size: 24px
					font-weight: 300
				.article-info
					font-size: 0
					color: #aaa
					.article-time
						margin-right: 10px
						font-size: 12px
					.article-like
						margin-right: 10px
						font-size: 12px
					.article-comment
						font-size: 12px
	.main-wrapper
		box-sizing: border-box
		position: relative
		flex-grow: 1
		height: 100%
		border-left: 1px solid #ddd
		transition: all .4s
@media screen and (max-width: 620px)
	.edit
		display: block
		.menu-wrapper
			display: block
			width: 100%
			height: 56px
		.articles-wrapper
			display: block
			width: 100%
			min-height: 100px
		.main-wrapper
			display: block
			min-height: 100%
</style>
