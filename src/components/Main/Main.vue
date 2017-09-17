<template>
	<div class="main" ref="main">
		<!--屏幕大于620px-->
		<transition name="nav-fade">
			<nav ref="nav" :class="{'onTop':isOnTop, 'onBottom': !isOnTop}" v-show="showNav">
					<ul class="nav-ul">
						<li class="nav-li" @click="showType = -1">所有文章</li>
						<li class="nav-li" @click="showType = 0">技术</li>
						<li class="nav-li" @click="showType = 1">生活</li>
						<li class="nav-li">about</li>
						<li class="nav-li">github</li>
					</ul>
			</nav> 
		</transition>
		<!--屏幕小于620px-->
		<nav class="nav-wrapper" :class="{'show-nav': showUl}">
			<div class="mask" :class="{'show-mask': showUl}"></div>
			<div class="btn" :class="{'show-btn': showUl}" @click="toggleShowUl()">←</div>
			<ul class="nav-ul" :class="{'show-nav': showUl}">
				<li class="nav-li" @click="showType = -1">所有文章</li>
				<li class="nav-li" @click="showType = 0">技术</li>
				<li class="nav-li" @click="showType = 1">生活</li>
				<li class="nav-li">about</li>
				<li class="nav-li">github</li>
			</ul>
		</nav>
		<div class="head">
			<img :src="getBackgroundImg" class="baImg" ref="img">
		</div> 
		<div class="content">
			<router-link :to="getArticle(item.id)" v-for="(item, key) in initData" :key="key" v-if="item.type === showType || showType === -1">
				<div class="item" @mouseover.capture="mouseover(key)" @mouseout.capture="mouseout(key)" ref="item">
					<span class="item-top">
						<span class="create-time">{{item.createTime}}</span>
						<span class="space">/</span>
						<span class="like-count" v-if="item.like !== 0">{{item.like}} LIKE<span v-if="item.like > 1">S</span></span>
						<span class="like-count" v-else>NO ONE LIKE</span>
						<span class="space">/</span>
						<span class="comment-count" v-if="item.commentLength !== 0">{{item.commentLength}} COMMENT<span v-if="item.commentLength > 1">S</span></span>
						<span class="comment-count" v-else>NO ONE COMMENT</span>
					</span>
					<h1>{{item.title}}</h1>
				</div>
			</router-link>
		</div>
		<my-footer></my-footer>
	</div>
</template>

<script>
import myFooter from '../Untils/Footer/Footer';
export default {
	components: {
		myFooter
	},
	data () {
		return {
			// 导航栏是否在上部
			isOnTop: true,
			// 显示文章类型
			showType: -1,
			// 屏幕大于620px控制导航栏上下滑动
			showNav: true,
			// 控制滚动事件添加的删除
			setScrollEvent: false,
			// 屏幕小于620px控制导航栏左右滑动
			showUl: false
		};
	},
	computed: {
		getBackgroundImg () {
			let ran = Math.floor(Math.random() * 5) + 1;
			return '../../../static/images/bg' + ran + '.png';
		},
		initData () {
			return this.$store.state.initData;
		}
	},
	created () {
		let url = 'http://localhost:8000/api/initData';
		this.$http.get(url).then(res => {
			this.$store.state.initData = res.data;
			// 若第一次进入首页，初始化每篇文章是否点赞的标志
		});
	},
	mounted () {
		this.setScrollEvent = true;
		this._listenScroll();
		window.scrollTo(0, 0);
		this.isOnTop = true;
	},
	destroyed () {
		this.setScrollEvent = false;
	},
	methods: {
		toggleShowUl () {
			console.log('toggleShowUl');
			this.showUl = !this.showUl;
			// 打开mask阻止背景滚动
			if (this.showUl) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		},
		mouseover (key) {
				this.$refs.item[key].style.boxShadow = '0 4px 10px 0 #aaa';
		},
		mouseout (key) {
				this.$refs.item[key].style.boxShadow = 'none';
		},
		getArticle (id) {
			return '/article/' + id;
		},
		_listenScroll () {
			let beforeTop = document.body.scrollTop;
			window.addEventListener('scroll', () => {
				if (this.setScrollEvent && window.innerWidth > 620) {
					let afterTop = document.body.scrollTop;
					if (afterTop > beforeTop) {
						this.showNav = false;
					} else {
						this.showNav = true;
					}
					beforeTop = afterTop;
					let picHeight = this.$refs.img.height - 60;
					if (document.body.scrollTop > picHeight) {
						this.isOnTop = false;
					} else {
						this.isOnTop = true;
					}
				}
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
	.main
		position: absolute
		left: 0
		top: 0
		height: 100%
		width: 100%
		overflow-x: hidden
		@media screen and (min-width: 620px)
			.nav-wrapper
				display: none
			.nav-fade-enter-active, .nav-fade-leave-active
				transition: all .3s
			.nav-fade-enter, .nav-fade-leave-to
				transform: translateY(-56px)		
			.onTop
				position: fixed
				height: 56px
				width: 100%
				transition: all .3s
				.nav-ul
					position: absolute
					top: 0
					right: 20px
					height: 56px
					.nav-li
						display: inline-block
						user-select: none
						cursor: pointer
						width: 96px
						height: 56px
						line-height: 56px
						text-align: center
						color: #fff
						transition: all .3s
						&:hover
							color: #f80
			.onBottom
				position: fixed
				height: 56px
				width: 100%
				transition: all .3s
				background-color: #fff
				border-bottom: 1px solid #aaa
				.nav-ul
					position: absolute
					top: 0
					right: 20px
					height: 56px
					.nav-li
						display: inline-block
						user-select: none
						cursor: pointer
						width: 96px
						height: 56px
						line-height: 56px
						text-align: center
						color: #000
						transition: all .3s
						&:hover
							color: #f80
		@media screen and (max-width: 620px)
			.onTop, .onBottom
				display: none
			.nav-wrapper
				display: block
				position: absolute
				top: 0
				left: 0
				height: 1px
				width: 100%
				&.show-nav
					height: 100%
				.mask
					position: absolute
					top: 0
					left: 0
					height: 100%
					width: 100%
					transition: all .5s
					&.show-mask
						background-color: rgba(0, 0, 0, 0.7);
				.btn
					cursor: pointer
					user-select: none
					position: absolute
					right: 20px
					top: 10px
					height: 40px
					width: 40px
					line-height: 40px
					text-align: center
					color: #fff
					font-size: 20px
					background-color: #519ABA
					border-radius: 50%
					transition: all .5s
					&.show-btn
						transform: translateX(-150px) rotate(180deg)
				.nav-ul
					position: absolute
					right: -150px
					top: 0
					width: 150px
					min-height: 100%
					background-color: #fff
					opacity: 0.8
					transition: all .5s
					&.show-nav
						transform: translateX(-150px)
					.nav-li
						user-select: none
						cursor: pointer
						width: 100%
						height: 56px
						line-height: 56px
						text-align: center
						color: #000
						transition: all .3s
						&:hover
							color: #f80
		.head
			z-index: -1
			position: relative
			width: 100%
			font-size: 0
			.baImg
				width: 100%
		.content
			max-width: 674px
			margin: 0 auto
			a
				display: block
				text-decoration: none
				border-bottom: 1px solid #ddd
				color: #000
				&:last-child
					border-bottom: none
				.item
					box-sizing: border-box
					min-height: 138px
					padding: 26px 46px
					cursor: pointer
					transition: all .3s
					.item-top
						font-size：0
						.create-time
							font-size: 14px
						.like-count
							font-size: 14px
							color: #f70
						.space
							display: inline-block
							text-align: center
							width: 36px
							color: #bbb
						.comment-count
							cursor: pointer
							font-size: 14px
							font-weight: 700
							color: #0aa
						.pointer
							display: block
					h1
						line-height: 46px
						margin: 20px 0
						font-size: 30px
						word-break: break-all
					@media screen and (max-width: 620px)
						.space
							visibility: hidden
						.create-time
							display: block
						.like-count
							display: block
						.comment-count
							display: block
</style>
