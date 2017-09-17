<template>
	<transition name="detail-fade" mode="out-in">
		<div class="detail" v-if="currentArticle !== undefined">
			 <h1 class="article-title">{{currentArticle.title}}</h1> 
			<span class="info">
				<span class="create-time">{{currentArticle.createTime}}</span>
				<span class="sum">字数 {{getContentLength}}</span>
				  <span class="comment-num">评论数 {{currentArticle.comments.length}}</span>  
				<span class="like-num">点赞数 {{currentArticle.like}}</span>
			</span>
			<div class="article-content" v-html="currentArticle.content">
			</div>
			<div class="bottom">
				<div class="support">
					<div class="support-icon">
						赞赏支持
					</div>
				</div>
				<div class="like-share">
					<div @click="toggleLike()" class="like" :class="{'islike': islikeArticle}"><span class="like-word">like</span>|<span class="like-count">{{currentArticle.like}}</span></div>
					<div class="share">
						<span class="share-title">分享</span>
						<ul class="share-ul">
							<li class="share-li weixin" @mouseenter="showWeixin=true" @mouseleave="showWeixin=false">
								<prompt direction="top" content="微信" v-show="showWeixin"></prompt>
								<i class="fa fa-weixin"></i>
							</li>
							<li class="share-li qq" @mouseenter="showQQ=true" @mouseleave="showQQ=false">
								<prompt direction="top" content="QQ" v-show="showQQ"></prompt>
								<i class="fa fa-qq"></i>
							</li>
						</ul>
					</div>
				</div>
				<div class="comments-wrapper">
					<h3 class="comment-h3">评论:</h3>
					<div class="passby-info">
						<comment :isReply="false" :submit="addComment"></comment>
					</div>
					<div class="comments">
						<h3 class="hasComments" v-if="currentArticle.comments.length > 0 && currentArticle.comments">{{currentArticle.comments.length}}条评论</h3> 
						<h3 v-else class="noComments">无评论</h3> 
						<div class="comment-wrapper" v-for="(comment, key) in currentArticle.comments" :key="key">
							<div class="comment">
								<span class="comment-name">{{comment.name}}</span>
								<span class="comment-time">{{comment.commentTime}}</span>
								 <p class="comment-content">{{comment.commentContent}}</p> 
								<span class="reply-like">
									<span class="comment-like" :class="{'isLikeComment': comment.islike}" @click="toggleCommentLike(comment.id, key)"><i class="fa fa-thumbs-o-up" v-if="!comment.islike"></i><i class="fa fa-thumbs-up" v-else></i>{{comment.like}}人赞</span>
									<span class="comment-reply" @click="toggleInput(key, true, comment.name)"><i class="fa fa-commenting-o"></i>回复</span>
								</span>
							</div>
							<div class="reply-wrapper">
								<div class="reply" v-for="(reply, replyKey) in comment.reply" :key="replyKey">
									<span class="reply-main">
										<span class="reply-from">{{reply.replyFrom}}： </span><span v-show="reply.replyTo !== comment.name" class="reply-to">@{{reply.replyTo}} </span><span class="reply-content"> {{reply.replyContent}}</span>
									</span>
									<span class="time-reply">
										<span class="reply-time">{{reply.replyTime}}</span>
										<span class="reply-reply" @click="toggleInput(key, true, reply.replyFrom)"><i class="fa fa-commenting-o"></i>回复</span>
									</span>
								</div>
							</div>
							<transition name="write-fade">
								<div class="write-wrapper" v-if="comment.showInput">
									<comment ref="comments" :isReply="comment.isReply" :toSomebody="comment.replyTo" :submit="addReply" :commentId="comment.id" :commentKey="key"></comment>
								</div>
							</transition>
						</div><!--commnet-->
					</div>
				</div>
			</div>
			<my-footer></my-footer>
		</div>
	</transition>
</template>

<script>
import prompt from '../Untils/Prompt/Prompt';
import comment from '../Comment/Comment';
import myFooter from '../Untils/Footer/Footer';
// import marked from 'marked';
// import hljs from 'highlight.js';
export default {
	components: {
		prompt,
		comment,
		myFooter
	},
	data () {
		return {
			showWeixin: false,
			showQQ: false,
			islikeArticle: false
		};
	},
	created () {
		let currentId = this.$route.params.id;
		let url = 'http://localhost:8000/api/article?article_id=' + currentId;
		this.$http.get(url).then(res => {
			this.$store.commit('setCurrentArticle', res.data);
			this._createdCommentsInfo(this.currentArticle.comments);
			this._getArtStorage();
			this._getComStorage();
		});
		this.$nextTick(() => {
			window.scrollTo(0, 0);
		});
		// 评论取消按钮的事件接收
		this.$root.eventHub.$on('cancel', this._hideInput);
		// 配置marked
		// marked.setOptions({
		// 	renderer: new marked.Renderer(),
		// 	gfm: true,
		// 	tables: true,
		// 	breaks: true,
		// 	pedantic: false,
		// 	sanitize: false,
		// 	smartLists: true,
		// 	smartypants: false,
		// 	highlight: function (code) {
		// 		return hljs.highlightAuto(code).value;
		// 	}
		// });
	},
	computed: {
		currentArticle () {
			let data = this.$store.state.currentArticle.article;
			return data;
		},
		getContentLength () {
			return this.currentArticle.content.split('').length;
		}
	},
	methods: {
		// 评论文章
		addComment (from, content) {
			let url = 'http://localhost:8000/api/addComment';
			let data = {
				'commentName': from,
				'commentContent': content,
				'article_id': this.currentArticle.id
			};
			this.$http.post(url, data).then(res => {
				if (res.data.status === 0) {
					res.data.newComment = this._createdCommentInfo(res.data.newComment);
					this.currentArticle.comments.unshift(res.data.newComment);
				}
			});
		},
		// 回复评论，回复针对评论的回复
		addReply (from, to, content, commentId, commentKey) {
			let url = 'http://localhost:8000/api/addReply';
			let data = {
				'replyFrom': from,
				'replyTo': to,
				'replyContent': content,
				'comment_id': commentId
			};
			this.$http.post(url, data).then(res => {
				if (res.data.status === 0) {
					this.currentArticle.comments[commentKey].reply.push(res.data.newReply);
				}
			});
		},
		// 对文章的点赞
		toggleLike () {
			let url = 'http://localhost:8000/api/togglePraiseArticle';
			let type = this.islikeArticle ? 'cancel' : 'add';
			let data = {
				'article_id': this.currentArticle.id,
				'type': type
			};
			this.$http.post(url, data).then(res => {
				if (res.data.status === 0) {
					// 若返回成功，更新storage
					let tem = JSON.parse(window.localStorage.getItem('islikeArticles'));
					tem.forEach(val => {
						if (val.id === this.currentArticle.id) {
							val.islike = !val.islike;
						}
					});
					// 修改like值
					if (data.type === 'add') {
						this.currentArticle.like++;
					} else {
						this.currentArticle.like--;
					}
					// 更新视图
					this.islikeArticle = !this.islikeArticle;
					window.localStorage.setItem('islikeArticles', JSON.stringify(tem));
				}
			});
		},
		// 对评论的点赞
		toggleCommentLike (id, key) {
			let url = 'http://localhost:8000/api/togglePraiseComment';
			let type = this.currentArticle.comments[key].islike ? 'cancel' : 'add';
			let data = {
				'comment_id': id,
				'type': type
			};
			this.$http.post(url, data).then(res => {
				if (res.data.status === 0) {
					// 修改缓存
					let tem = JSON.parse(window.localStorage.getItem('islikeComments'));
					tem.forEach(val => {
						if (val.id === id) {
							val.islike = !val.islike;
						}
					});
					window.localStorage.setItem('islikeComments', JSON.stringify(tem));
					// 修改视图
					let newCom = this.currentArticle.comments[key];
					newCom.islike = !newCom.islike;
					if (type === 'add') {
						newCom.like++;
					} else {
						newCom.like--;
					}
					this.currentArticle.comments.splice(key, 1, newCom);
				}
			});
		},
		// 关闭和打开评论回复框
		toggleInput (key, isReply, to) {
			let currentShowInput = this.currentArticle.comments[key].showInput;
			let newInfo = this.currentArticle.comments[key];
			if (currentShowInput) {
				newInfo.currentName = '';
				newInfo.replyTo = '';
				newInfo.currentComment = '';
				newInfo.showInput = false;
			} else {
				newInfo.isReply = isReply;
				newInfo.replyTo = to;
				newInfo.showInput = true;
			}
			this.currentArticle.comments.splice(key, 1, newInfo);
		},
		// 给每个评论添加存放当前用户要评论的信息
		_createdCommentsInfo (comments) {
			comments = comments.map(val => {
				val.currentName = '';
				val.currentComment = '';
				val.showInput = false;
				val.isReply = false;
				val.replyTo = '';
				return val;
			});
		},
		// 添加评论后给评论信息添加附加信息
		_createdCommentInfo (comment) {
				comment.currentName = '';
				comment.currentComment = '';
				comment.showInput = false;
				comment.isReply = false;
				comment.replyTo = '';
				comment.reply = [];
				return comment;
		},
		// 关闭评论框
		_hideInput (key) {
			if (key !== -1) {
				let temComment = this.currentArticle.comments[key];
				temComment.showInput = false;
				this.currentArticle.comments.splice(key, 1, temComment);
			}
		},
		// 设置评论点赞的storage
		// {
		// 'id': 1,
		// 'islike': false
		// }
		_getComStorage () {
			if (!window.localStorage.getItem('islikeComments')) {
				window.localStorage.setItem('islikeComments', '[]');
			}
			let islikeComments = JSON.parse(window.localStorage.getItem('islikeComments'));
			if (this.currentArticle.comments) {
				this.currentArticle.comments.forEach(val => {
					// 若缓存中有该评论的点赞，获取该值，不然就创建新值
					let hasVal = islikeComments.some(val2 => {
						if (val2.id === val.id) {
							val.islike = val2.islike;
							return true;
						}
						return false;
					});
					if (!hasVal) {
						islikeComments.push({'id': val.id, 'islike': false});
						val.islike = false;
					}
				});
				window.localStorage.setItem('islikeComments', JSON.stringify(this.currentArticle.comments));
			}
		},
		// 设置文章的点赞的storage
		// {
		// 'id': 1,
		// 'islike': false
		// }
		_getArtStorage () {
			if (!window.localStorage.getItem('islikeArticles')) {
				window.localStorage.setItem('islikeArticles', '[]');
			}
			let islikeArticles = JSON.parse(window.localStorage.getItem('islikeArticles'));
			let currentId = this.$route.params.id;
			// 若缓存中有该文章的点赞，获取该值，不然就创建新值
			let flag = islikeArticles.some(val => {
				if (val.id === currentId) {
					this.islikeArticle = val.islike;
					return true;
				}
				return false;
			});
			if (!flag) {
				islikeArticles.push({'id': currentId, 'islike': false});
				this.islikeArticle = false;
			}
			window.localStorage.setItem('islikeArticles', JSON.stringify(islikeArticles));
		}
	}
};
</script>

<style lang="stylus">
@import '../../common/stylus/index.styl'
.detail-fade-enter-active
	transition: all 0.3s
.detail-fade-enter, .detail-fade-leave-to
	opacity: 0
	transform: translateY(-20px)
.detail
	box-sizing: border-box
	padding: 0 30px
	max-width: 620px
	margin: 0 auto
	.article-title
		margin: 20px 0
		word-break: break-all
		line-height: 1.3
		font-size: 34px
		font-weight: 700
	.info
		display: inline-block
		margin-bottom: 20px
		color: #999
		font-size: 0
		.create-time
			margin-right: 10px
			font-size: 12px
		.sum
			margin-right: 10px
			font-size: 12px
		.comment-num
			margin-right: 10px
			font-size: 12px
		.like-num
			font-size: 12px
	.article-content
		markdown()
	.bottom
		.support
			border-bottom: 1px solid #ddd
			.support-icon
				width: 128px
				height: 40px
				line-height: 40px
				margin: 30px auto
				text-align: center
				font-size: 15px
				background-color: #ea6f5a
				border-radius: 20px
				color: #fff
				cursor: pointer
				&:hover
					opacity: 0.8
		.like-share
			margin-bottom: 40px
			.like
				display: inline-block
				box-sizing: border-box
				text-align: center
				vertical-align: middle
				padding: 18px 30px 18px 30px
				margin: 36px 0
				border: 1px solid #ea6f5a
				cursor: pointer
				font-size: 18px
				font-weight: 200
				color: #ea6f5a
				border-radius: 28px
				user-select: none
				.like-word
					display: inline-block
					vertical-align: middle
					margin-right: 18px
				.like-count
					display: inline-block
					vertical-align: middle
					margin-left: 15px
				&:hover
					background-color: #fff0f0
				&.islike
					background-color: #ea6f5a
					color: #fff
			.share
				vertical-align: middle
				display: inline-block
				margin-left: 20px
				font-size: 0
				.share-title
					line-height: 48px
					vertical-align: middle
					font-size: 15px
					color: #999
				.share-ul
					display: inline-block
					margin-left: 12px
					font-size: 0
					.share-li
						position: relative
						display: inline-block
						vertical-align: middle
						height: 48px
						width: 48px
						margin-right: 12px
						text-align: center
						font-size: 0
						border: 1px solid #ccc
						border-radius: 50%
						cursor: pointer
						.fa
							line-height: 48px
							font-size: 20px
						&:last-child
							margin: 0
						&:hover
							background-color: #efefef
					.weixin
						color: #00BB29
					.qq
						color: #55f
		.comments-wrapper
			.comment-h3
				line-height: 1.3
				margin-bottom: 16px
				font-size: 20px
				color: #666
			.passby-info
				width: 90%
				margin: 0 auto
				margin-bottom: 30px
			.comments
				.hasComments
					line-height: 1.3
					padding-bottom: 20px
					border-bottom: 1px solid #ddd
					font-size: 15px
					color: #000
				.noComments
					line-height: 2
					font-size: 30px
					text-align: center
					margin: 30px 0 30px 0
					color: #aaa
				.comment-wrapper
					padding: 30px 0
					border-bottom: 1px solid #ddd
					&:last-child
						border: none
					.comment
						.comment-name
							display: inline-block
							line-height: 1.3
							margin-bottom: 8px
							font-size: 20px
							border-bottom: 1px dashed #aaa
						.comment-time
							display: block
							line-height: 1.3
							margin-bottom: 16px
							font-size: 13px
							color: #aaa
						.comment-content
							line-height: 1.3
							word-break: break-all
							word-wrap: break-word
							font-size: 15px
						.reply-like
							display: inline-block
							margin: 16px 0
							font-size: 0
							color: #666
							user-select: none
							.comment-like
								cursor: pointer
								margin-right: 12px
								font-size: 14px
								&.isLikeComment
									color: #000
									.fa
										color: #f00
								.fa
									vertical-align: top
									margin-right: 5px
									font-size: 15px
							.comment-reply
								cursor: pointer
								font-size: 14px
								.fa
									position: relative
									bottom: 1px
									margin-right: 5px
									font-size: 15px
					.reply-wrapper
						box-sizing: border-box
						padding-left: 20px
						border-left: 2px solid #ccc
						.reply
							padding: 10px
							border-bottom: 1px dashed #ddd
							&:last-child
								border: none
							.reply-main
								display: inline-block
								line-height: 1.3
								margin: 10px 0
								font-size: 0
								.reply-from
									color: #3194d0
									font-size: 14px
								.reply-to
									color: #3194d0
									font-size: 14px
								.reply-content
									line-height: 1.3
									font-size: 14px
							.time-reply
								display: block
								font-size: 0
								.reply-time
									margin-right: 10px
									font-size: 12px
									color: #aaa
								.reply-reply
									cursor: pointer
									font-size: 12px
									color: #aaa
									.fa
										position: relative
										bottom: 2px
										vertical-align: top
										margin-right: 5px
										font-size: 14px
					.write-fade-enter-active, .write-fade-leave-active
						transition: all .3s
					.write-fade-enter, .write-fade-leave-to
						opacity: 0
						transform: translateY(-10px);
					.write-wrapper
						margin-top: 20px
</style>
