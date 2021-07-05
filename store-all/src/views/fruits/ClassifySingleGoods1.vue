<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<section class="box">
			<div class="content">
				<div class="left" ref="left">
					<ul>
						<div v-for="(item, index) in left" :key="index"
							:class="{current: currentIndex == index || clickIndex == index}"
							@click="selectItem(index, $event)">
							<li class="ul-leftli-item">
								<span class="left-item">{{item.menuName}}</span>
							</li>
						</div>
					</ul>
				</div>
				<div class="right" ref="right">
					<ul>
						<li class="right-item right-item-hook" v-for="(item,index) in right" :key="item.menuId">
							<div class="menu-title"><span>{{item.menuName}}</span></div>
							<ul>
								<li class="goods-item" v-for="(g,index2) in item.goodsList" :key="index2">
									<div class="goods-img" @click="toGoodsDetailPage(g.goodsId,1,g)">
										<img :src="g.goodsImg" />
									</div>
									<div class="goods-contents">
										<div class="goods-name-div" @click="toGoodsDetailPage(g.goodsId,1,g)">
											<span class="goods-name">{{ g.goodsName }}</span>
										</div>
										<!-- <span class="goods-desc">{{ g.goodsName }}</span> -->
										<div class="price-div">
											<div class="price" @click="toGoodsDetailPage(g.goodsId,1,g)">
												<span class="goods-currency">￥</span>
												<span class="goods-price">{{ g.nowMoney }}</span>
											</div>
											<div class="add-cart">
												<div v-if="g.userGoodsCount == 0" class="shop-cart"
													@click="onclickShopCart(item.menuId, g.goodsId)">
													<van-icon name="cart-circle-o" color="#008000;" />
												</div>
												<div v-if="g.userGoodsCount > 0">
													<van-stepper input-width="20px" button-size="12px"
														v-model="g.userGoodsCount" disable-input
														@overlimit = "overlimit(item.menuId, g.goodsId, g.userGoodsCount)"
														@change="onChangeGoods(item.menuId, g.goodsId, g.userGoodsCount)" />
												</div>
											</div>
											<div class="click-div" @click="toGoodsDetailPage(g.goodsId,1,g)">

											</div>
											<div class="click-div2" @click="toGoodsDetailPage(g.goodsId,1,g)">

											</div>
										</div>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</section>
		<div class="cart-div" v-show="right.length > 0">
			<div @click="toPage('shopCart')">
				<div class="cart-count"><span>{{cartCount}}</span></div>
				<van-icon name="shopping-cart-o" />
			</div>
		</div>
	</div>
</template>


<script>
	import BScroll from 'better-scroll'
	import Head from '@/components/Head.vue';
	import Tbar from '@/components/Bottom-bar.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			Tbar: Tbar
		},
		data() {
			return {
				title: '商品分类',
				left: [],
				right: [],
				listHeight: [],
				listLeftHeight: [],
				scrollY: 0, //实时获取当前y轴的高度
				clickEvent: false,
				clickIndex: -1,
				index: 0,
				cartCount: 0,
				tbActive: '0'
			}
		},
		methods: {
			_initScroll() {
				// console.log("-----_initScroll--------")
				//better-scroll的实现原理是监听了touchStart,touchend事件，所以阻止了默认的事件（preventDefault）
				//所以在这里做点击的话，需要在初始化的时候传递属性click,派发一个点击事件
				//在pc网页浏览模式下，点击事件是不会阻止的，所以可能会出现2次事件，所以为了避免2次，可以在绑定事件的时候把$event传递过去
				this.lefts = new BScroll(this.$refs.left, {
					click: true,
					probeType: 3 //探针的效果，实时获取滚动高度
				})
				this.lefts.on('scroll', (pos) => {
					//this.leftScrollY = Math.abs(Math.round(pos.y))
				})
				//rights这个对象监听事件，实时获取位置pos.y
				this.rights = new BScroll(this.$refs.right, {
					click: true,
					probeType: 3 //探针的效果，实时获取滚动高度
				})
				//rights这个对象监听事件，实时获取位置pos.y
				this.rights.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			_getHeight() {
				let rightItems = this.$refs.right.getElementsByClassName('right-item-hook')
				let height = 0
				this.listHeight.push(height)
				for (let i = 0; i < rightItems.length; i++) {
					let item = rightItems[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			},
			_getLeftHeight() {
				let leftItems = this.$refs.left.getElementsByClassName('ul-leftli-item')
				let height = 0
				this.listLeftHeight.push(height)
				for (let i = 0; i < leftItems.length; i++) {
					let item = leftItems[i]
					height += item.clientHeight
					this.listLeftHeight.push(height)
				}
			},
			selectItem(index, event) {
				// console.log("====selectItem======" + index)
				this.clickIndex = index;
				this.index = index;
				//在better-scroll的派发事件的event和普通浏览器的点击事件event有个属性区别_constructed
				//浏览器原生点击事件没有_constructed所以当时浏览器监听到该属性的时候return掉
				if (!event._constructed) {
					return
				} else {
					let rightItems = this.$refs.right.getElementsByClassName('right-item-hook')
					let el = rightItems[index]
					this.rights.scrollToElement(el, 300)
				}
			},
			initLeftItem() {
				let vm = this;
				// 可见范围高度
				var h = document.documentElement.clientHeight || document.body.clientHeight;
				h = h - 50
				// console.log("----hhhhhhhhhhhhhhhhhhh-----" + h)
				if (this.lefts) {
					let leftItems = this.$refs.left.getElementsByClassName('ul-leftli-item')
					// 左侧每个菜单高度间距
					if (this.listLeftHeight.length > 1) {
						let leftHeigth = this.listLeftHeight[1] - this.listLeftHeight[0]

						// 当前滑动高度
						let scrollHeight = leftHeigth * this.index + leftHeigth;
						// console.log("----当前滑动高度-----" + scrollHeight+"========this.index======="+this.index)

						for (var i = 0; i < this.listLeftHeight.length; i++) {
							// console.log("----h * i * leftHeigth - scrollHeight-----" + (i * leftHeigth - scrollHeight))
							if (scrollHeight < h) {
								if (this.index == 0) {
									let el = leftItems[0]
									this.lefts.scrollToElement(el, 300)

								} else {
									let el = leftItems[1]
									this.lefts.scrollToElement(el, 300)
								}
								return
							} else {
								let el = leftItems[this.index - 1]
								this.lefts.scrollToElement(el, 300)
							}
						}
					}
				}
			},
			searchGoodsList() {
				let vm = this;
				let params = {
					req_type: 'query_goods_list1',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let menusList = res.data.menusList;
						vm.left = menusList;
						vm.right = menusList;
						vm.initVueScroll();
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			initVueScroll() {
				this.$nextTick(() => {
					this._initScroll()
					this._getHeight()
					this._getLeftHeight()
				})
			},
			toGoodsDetailPage(goodsId, isSingle, g) {
				let url = '/goodsSku';
				if (isSingle == 1) {
					url = '/goodsSingle';
				}
				url = url + '?goodsId=' + goodsId + "&timeGoodsId=" + g.timeGoodsId;
				this.$router.push(url);
				//打开新页签
				//const page  = this.$router.resolve({path: url})
				//window.open(page.href,'_blank')
			},
			onChangeGoods(menuId, goodsId, userGoodsCount) {
				let vm = this;
				let params = {
					req_type: 'add_order_cart',
					data: {
						goods_id: goodsId,
						user_id: 0,
						goods_spec: null,
						goods_count: userGoodsCount,
						add_model: 1
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.findOrderCartCount();
						Toast('添加成功');
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			onclickShopCart(menuId, goodsId) {
				let vm = this
				let flag = 1;
				this.right.forEach(function(e) {
					if (menuId == e.menuId) {
						e.goodsList.forEach(function(e) {
							if (e.goodsId == goodsId) {
								e.userGoodsCount = 1;
								vm.onChangeGoods(null, goodsId, 1);
							}
						});
					}
				});
			},
			findOrderCartCount() {
				let vm = this;
				let params = {
					req_type: 'find_order_cart_count',
					data: { userId: 0 }
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.cartCount = res.data.count;
					}
				});
			},
			toPage(url){
				this.$router.push(url);
			},
			overlimit(menuId, goodsId, userGoodsCount){
				let vm = this;
				let params = {
					req_type: 'add_order_cart',
					data: {
						goods_id: goodsId,
						goods_count: 0,
						del_mark: 1
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.findOrderCartCount();
						vm.initMenuData(menuId, goodsId);
						Toast('删除成功');
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			initMenuData(menuId, goodsId){
				let vm = this;
				this.right.forEach(function(e) {
					if (menuId == e.menuId) {
						e.goodsList.forEach(function(e) {
							if (e.goodsId == goodsId) {
								e.userGoodsCount = 0;
							}
						});
					}
				});
			}
		},
		created: function() {},
		mounted() {
			this.$nextTick(() => {
				this.searchGoodsList();
				this.findOrderCartCount();
			})
		},
		computed: {
			currentIndex() {
				this.initLeftItem();
				// console.log("---------currentIndex-------")
				for (let i = 0; i < this.listHeight.length; i++) {
					let height = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					//当height2不存在的时候，或者落在height和height2之间的时候，直接返回当前索引
					//>=height，是因为一开始this.scrollY=0,height=0
					if (!height2 || (this.scrollY >= height && this.scrollY < height2)) {
						// console.log("--------return i---------"+i)
						if (this.clickIndex != -1) {
							if (this.clickIndex == i) {
								this.clickIndex = -1;
								this.index = i;
								return i
							}
							return -1;
						}
						this.index = i;
						return i
					}
					/* if (this.listHeight[this.listHeight.length - 1] - this.$refs.right.clientHeight <= this.scrollY) {
						if (this.clickTrue) {
							console.log("---------currentIndex--sssss-----"+this.clickTrue)
							return this.currentNum
						} else {
							return (this.listHeight.length - 1)
						}
					} */
				}
				//如果this.listHeight没有的话，就返回0
				return 0
			}
		}
	}
</script>


<style scoped>
	.content {
		display: flex;
		position: absolute;
		top: 46px;
		/* bottom: 100px; */
		bottom: 0px;
		width: 100%;
		overflow: hidden;
		background: #FFFFFF;
	}

	.left {
		flex: 0 0 80px;
		width: 80px;
		background-color: #f3f5f7;
	}

	.left li {
		width: 100%;
		height: 100%;
	}

	.current {
		background-color: #FFFFFF;
		border-left: 5px solid #008000;
		border-radius: 5px 5px 5px 5px;
	}

	.left-item {
		display: block;
		width: 100%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		/* border-bottom: 1px solid red; */
	}

	.right {
		flex: 1;
	}

	.right-item li {
		width: 100%;
		height: 100px;
		text-align: center;
		/* border-bottom: 1px solid red; */
	}

	* {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.menu-title {
		padding: 10px 0px 5px 0;
		color: #464c5b;
		font-weight: 900;
		font-size: 14px;
		border-bottom: 1px solid #f0f0f0;
	}

	.menu-title span {
		padding: 8px 10px 5px 10px;
	}

	.goods-item {
		position: relative;
	}

	.goods-img {
		float: left;
		/* width: 20%; */
		height: 100%;
		/* border: 1px solid red; */
		/* clear: both; */
		display: table-cell;
		/*主要是这个属性*/
		vertical-align: middle;
	}

	.goods-img>img {
		width: 70px;
		height: 80px;
		margin-top: 10px;
		margin-left: 5px;
		border: 1px solid #f0f0f0;
	}

	.goods-contents {
		/* overflow: hidden; */

	}

	.goods-name-div {
		height: 20px;
		/* overflow: hidden; */
		/* text-overflow: ellipsis;
		white-space: nowrap; */
		font-size: 12px;
		font-weight: bold;
		/* padding-left: 5px; */
		text-align: left;
		padding-top: 10px;
		margin-left: 85px;
	}

	.goods-desc {
		font-size: 12px;
		color: gray;
		display: block;
		font-weight: normal;
		text-align: left;
	}

	.price-div {}

	.price {
		color: #008000;
		font-size: 14px;
		bottom: 13px;
		left: 80px;
		font-weight: 900;
	}

	.goods-currency {
		font-weight: bold;
		font-size: 12px;
	}

	.price,
	.add-cart {
		bottom: 13px;
		position: absolute;
	}

	.add-cart {
		right: 15px;
		font-size: 18px;
	}

	.shop-cart {
		font-weight: bold;
	}

	/*  */
	.click-div {
		height: 60px;
		width: 55%;
	}

	.click-div2 {
		height: 50px;
		margin-top: 15px;
	}

	.cart-div {
		position: fixed;
		font-weight: bold;
		bottom: 100px;
		right: 8px;
		font-size: 1.8rem;
		color: #008000;
		background-color: #FFFFFF;
	}

	.cart-count {
		font-size: 0.8rem;
		position: absolute;
		right: -3px;
		top: -10px;
		color: white;
		background-color: #008000;
		border-radius: 50% 50%;
		-moz-border-radius: 50%;
		-webkit-border-radius: 50%;
		width: 18px;
		height: 18px;
		line-height: 18px;
		text-align: center;
	}

</style>
