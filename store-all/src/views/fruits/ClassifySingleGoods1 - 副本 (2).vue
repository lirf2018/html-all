<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<!-- <div style="height: 46px;"></div> -->
		<div class="classfy-contents">
			<van-row>
				<van-col span="6">
					<div class="left-main" ref="ratingsmain" :style="myStyle" id="scrollDiv">
						<van-sidebar v-model="activeKey" @change="onchange">
							<div ref="lItem" v-for="(item, index) in menuList" :key="index"
								v-if="item.goodsList.length>0">
								<van-sidebar-item :style="{ color: item.menuId == onclickMenu ? '#008000' : '' }"
									:title="item.menuName" />
							</div>
						</van-sidebar>
					</div>
				</van-col>
				<van-col span="18" class="ratings-main-col">
					<div class="ratings-main" ref="ratingsmain" :style="myStyle">
						<div>
							<div v-for="(item, index) in menuList" :key="index" class="goods-list" ref="vansticky"
								v-if="item.goodsList.length>0">
								<div ref="rItem">
									<div class="second-tab-name">
										<span style="font-size: 12px;">{{ item.menuName }}</span>
									</div>
									<div class="goods-items" v-for="g in item.goodsList" :key="g.goodsId">
										<div class="goods-img" @click="toGoodsDetailPage(g.goodsId,1,g)"><img
												:src="g.goodsImg" /></div>
										<div class="goods-contents">
											<div class="goods-name-div" @click="toGoodsDetailPage(g.goodsId,1,g)">
												<span class="goods-name">{{ g.goodsName }}</span>
											</div>
											<!-- <span class="goods-desc">{{ g.goodsDesc }}</span> -->
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
															@change="onChangeGoods(item.menuId, g.goodsId, g.userGoodsCount)" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
		<!-- <div style="display: none;"><Tbar :tbActive="tbActive" /></div> -->
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
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
				tbActive: 1,
				title: '商品分类',
				activeKey: 0,
				onclickMenu: 1,
				heightList: [], //保存每一个的高度,
				menuHeightList: [], //保存每一个菜单的高度
				showheight: 0, //内容高度
				menuList: [],
				myStyle: '',
				testId: 0
			};
		},
		created() {
			var h = document.documentElement.clientHeight || document.body.clientHeight;
			// this.showheight = h - 50 - 51;
			this.showheight = h - 50; // 设置底部高度
			this.myStyle = 'height:' + this.showheight + 'px';
			this._Bscroll();

			//测试
			this.searchGoodsList();
		},
		mounted() {
			//增加滚动监听
			// window.addEventListener('scroll', this.handleScroll);
			// this.$refs.Box.addEventListener('scroll', this.handleScroll);
		},
		methods: {
			onchange(index) {
				console.log("====index="+index)
				console.log('===当前点击===' + this.menuList[index].menuId + ': ' + this.menuList[index].menuName);
				this.onclickMenu = this.menuList[index].menuId;
				this.scroll.scrollToElement(this.$refs.vansticky[index], 100, 0, 0);
			},
			getHeight() {
				// 获取每一个li的高度
				const lis = this.$refs.rItem;
				// 获取p标签的高度  这里想错，应该把上面的标题也列入进去
				/* const heightp = this.$refs.vansticky
		heightp.forEach(item => {
		  //console.log(item.clientHeight)
		}) */
				// console.log(heightp.offsetHeight)
				// heightList的第一个元素为0
				let height = 0;
				this.heightList.push(height);
				// 之后的高度即为当前li的高度加上之前面li的高度和
				lis.forEach(item => {
					height += item.clientHeight;
					this.heightList.push(height);
					// console.log(this.heightList)
				});

				//菜单
				height = 0;
				this.menuHeightList.push(height);
				const list = this.$refs.lItem;
				list.forEach(item => {
					height += item.clientHeight;
					this.menuHeightList.push(height);
					// console.log(this.heightList)
				});
			},
			_Bscroll() {
				this.$nextTick(() => {
					// if (this.goods) {
					this.scroll = new BScroll(this.$refs.ratingsmain, {
						click: true,
						probeType: 3
					});
					// }
					this.scroll.on('scroll', res => {
						// console.log(res)
						this.scrollY = Math.abs(res.y);
						// // console.log(res.y)
						this.scrolly = res.y;
						this.getHeight();
						this.currentIndex();
						var div = document.getElementById('scrollDiv');

						//可视范围   0 < y < this.showheight

						// div.scrollTop = div.scrollHeight;
						// console.log(this.activeKey + '======' + this.menuHeightList[this.activeKey] + '===可见：' + this.showheight);
						// div.scrollTop = this.showheight;
						// console.log("===6==="+this.showheight)
						if (this.menuHeightList[this.activeKey] > this.showheight - this.menuHeightList[1]) {
							div.scrollTop = this.menuHeightList[this.activeKey] - this.menuHeightList[2];
						} else {
							div.scrollTop = 0;
						}
					});
				});
			},
			currentIndex() {
				for (let i = -1; i < this.heightList.length; i++) {
					const height1 = this.heightList[i];
					const height2 = this.heightList[i + 1];
					if (this.scrollY < height2 && this.scrollY >= height1) {
						return i;
					}
					// 通过打印的控制台信息，，然后进行调试，我也不知道为啥第一个默认不出来，难搞
					this.activeKey = i + 1;
					this.onclickMenu = this.menuList[this.activeKey].menuId;
					// console.log(i)
				}
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
						Toast('添加成功');
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			onclickShopCart(menuId, goodsId) {
				let vm = this
				let flag = 1;
				this.menuList.forEach(function(e) {
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
			searchGoodsList() {
				let vm = this;
				let params = {
					req_type: 'query_goods_list1',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.menuList = res.data.menusList;
					} else {
						Toast(res.resp_desc);
					}
				});
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
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 12px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.left-main {
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.ratings-main {
		overflow: hidden;
	}

	>>>.van-sidebar-item--select {
		border-color: #008000 !important;
	}

	>>>.van-sidebar-item--select::before {
		background-color: #008000;
	}

	>>>.van-sidebar-item {
		font-size: 12px;
		padding: 15px 12px 15px 8px;
	}

	/**
 * goods-item
 */
	.goods-list {
		padding: 0px 10px;
		background-color: #ffffff;
	}

	.second-tab-name {
		padding: 15px 0 5px 0;
		margin-bottom: 8px;
		color: #464c5b;
		font-size: 14px;
		border-bottom: 1px solid #f0f0f0;
	}

	.goods-list>.goods-items:not(:last-child) {
		border-bottom: 1px solid #ebedf0;
	}

	.goods-items {
		overflow: hidden;
		font-size: 14px;
		color: #657180;
		height: 4.5rem;
		position: relative;
		padding: 7px 0;
	}

	.goods-img {
		float: left;
		width: 20%;
	}

	.goods-contents {
		float: right;
		width: 80%;
		overflow: hidden;
	}

	.goods-img>img {
		width: 4rem;
		height: 4rem;
	}

	.goods-contents>span {
		display: block;
	}

	.goods-name,
	.goods-desc {
		/* display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 12px;
	padding-bottom: 5px;
	padding-left: 1.5rem; */
		/* overflow:hidden; 
	text-overflow:ellipsis;
	display:-webkit-box; 
	-webkit-box-orient:vertical;
	-webkit-line-clamp:2; 
	display: inline-block; */
	}

	.goods-name-div {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		height: 40px;
		margin-left: 20px;
		overflow-wrap: break-word;
	}

	.goods-name {
		color: #464c5b;
		font-size: 12px;
	}

	.price-div {
		padding: 0 5px;
		overflow: auto;
		width: 100%;
		margin-top: 15px;
		font-size: 0.5rem;
	}

	.price {
		float: left;
		width: 20%;
		position: absolute;
		bottom: 5px;
		padding-left: 15px;
	}

	.price>span {
		color: #008000;
	}

	.price>span:last-child {
		font-size: 16px;
		font-weight: bold;
	}

	.add-cart {
		float: right;
		text-align: right;
		padding-right: 8px;
		font-size: 1.4rem;
		color: #464c5b !important;
		position: absolute;
		right: 0px;
		bottom: 11px;
	}

	.shop-cart {
		margin-top: 11px;
		position: absolute;
		bottom: -10px;
		right: 0px;
	}
	
</style>
