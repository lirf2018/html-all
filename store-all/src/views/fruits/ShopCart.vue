<template>
	<div class="body-bg">
		<div class="header">
			<div>
				<Head :title="title" />
			</div>
		</div>
		<div style="height: 46px;"></div>
		<div class="tabs">
			<van-tabs @change="onChange" v-model="cartActive" title-inactive-color="#657180" animated color="#008000"
				title-active-color="#008000">
				<van-tab :title="tabTitle0" key="0" name="0"></van-tab>
				<van-tab :title="tabTitle1" key="1" name="1"></van-tab>
			</van-tabs>
		</div>
		<div style="height: 46px;"></div>
		<div class="tabs-data">
			<div class="shop-item" v-for="(shopCart, index) in cartItems" :key="shopCart.shopId"
				v-if="shopCart.cartList.length == 0">
				<div @click="toGoodsList">
					<van-empty class="custom-image" :image="cartNullImg" description="去逛逛" />
				</div>
			</div>
			<div class="shop-item" v-for="(shopCart, index) in cartItems" :key="shopCart.shopId"
				v-if="shopCart.isValid && shopCart.cartList.length > 0">
				<div class="shop">
					<div class="shop-div">
						<div>
							<van-checkbox v-model="shopCart.isChecked" checked-color="#008000"
								@click="checkedShopGoodsAll(shopCart.shopId, shopCart.isChecked)">
							</van-checkbox>
						</div>
						<div class="shop-o">
							<van-icon name="shop-o" />
						</div>
						<div>
							<span>{{ shopCart.shopName }}</span>
						</div>
						<div @click="onEditer(shopCart.shopId)">
							<span>{{ shopCart.editerText }}</span>
						</div>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div class="items" v-for="(goodsInfo, index) in shopCart.cartList" :key="goodsInfo.cartId"
					v-if="goodsInfo.isValid">
					<div class="goods-list">
						<div class="select-btn">
							<div class="checkbox-goods">
								<van-checkbox checked-color="#008000" ref="checkboxes" v-model="goodsInfo.isChecked"
									@click="checkedShopGoods(shopCart.shopId, goodsInfo.cartId, goodsInfo.isChecked)">
								</van-checkbox>
							</div>
						</div>
						<div class="goods-img" @click="toGoodsDetailPage(goodsInfo)">
							<div>
								<span><img :src="goodsInfo.goodsImg" /></span>
							</div>
						</div>
						<div :class="goodsInfo.goodsInfoCss">
							<div class="goods">
								<div v-show="shopCart.isEditer" class="editer-goods">
									<van-stepper v-model="goodsInfo.goodsCount" disable-input integer
										:key="goodsInfo.cartId"
										@change="updateCartGoodsCount(shopCart.shopId, goodsInfo.cartId, goodsInfo.goodsCount)" />
								</div>
								<div v-show="!shopCart.isEditer" class="goods-name"
									@click="toGoodsDetailPage(goodsInfo)">
									<span
										v-if="goodsInfo.goodsType == 3">【{{ goodsInfo.rentPayTypeName }}租赁】{{ goodsInfo.goodsName }}</span>
									<span v-if="goodsInfo.goodsType != 3">{{ goodsInfo.goodsName }}</span>
								</div>
							</div>
							<div class="goods-sku" @click="toGoodsDetailPage(goodsInfo)">
								<span v-if="goodsInfo.goodsSpecName != ''">规格:{{ goodsInfo.goodsSpecName }}</span>
							</div>
							<div class="goods-price" @click="toGoodsDetailPage(goodsInfo)">
								<div>
									<span>￥</span>
									<span>{{ goodsInfo.goodsPrice }}</span>
								</div>
							</div>
						</div>
						<div :class="goodsInfo.buyCountCss">
							<div v-show="!shopCart.isEditer" class="bc">
								<span>x{{ goodsInfo.goodsCount }}</span>
							</div>
							<div v-show="shopCart.isEditer" class="delete-goods"
								@click="deleteCartGoods(goodsInfo.cartId)">
								<span>删除</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 失效 -->
			<div style="height: 10px"></div>
			<div class="shop-item" v-if=" outTimeGoods.length > 0">
				<div class="shop">
					<div class="shop-div">
						<div>
							<van-checkbox v-model="deleteAll" checked-color="#008000" @click="checkedDeleteGoodsAll()">
							</van-checkbox>
						</div>
						<div class="shop-o">
						</div>
						<div>
							<span>&nbsp;&nbsp;失效商品</span>
						</div>
						<div>
							<span @click="deleteShopCart">删除</span>
						</div>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div class="items" v-for="(goodsInfo, index) in outTimeGoods" :key="goodsInfo.cartId">
					<div class="goods-list">
						<div class="select-btn">
							<div class="checkbox-goods">
								<van-checkbox ref="checkboxes" v-model="goodsInfo.isChecked" checked-color="#008000"
									@click="deleteSun"></van-checkbox>
							</div>
						</div>
						<div class="goods-img">
							<div>
								<span><img :src="goodsInfo.goodsImg" /></span>
							</div>
						</div>
						<div class="goods-info">
							<div class="goods">
								<div class="goods-name">{{ goodsInfo.goodsName }}</div>
							</div>
							<div class="goods-sku">
								<span>{{ goodsInfo.goodsSpecName }}</span>
							</div>
							<div class="goods-price goods-price-del">
								<div>
									<span style="font-weight: normal;color: grey;">￥</span>
									<span style="font-weight: normal;color: grey;">{{ goodsInfo.goodsPrice }}</span>
								</div>
							</div>
						</div>
						<div class="buy-count">
							<div class="bc">
								<span style="font-weight: normal;color: grey;">x{{ goodsInfo.goodsCount }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div style="height: 60px; width: 100%;clear: both;"></div>
			<div class="van-submit-bar">
				<div class="all-price-div">
					<div class="all-price">
						<span>合计：</span>
						<span>￥{{ computeResultPrice }}</span>
						<br />
						<span>（不含邮费）</span>
					</div>
				</div>
				<div class="van-btn" @click="deleteCartGoods(0, 0)">
					<div>
						<span>{{ buttonText }}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- <div>
			<Tbar tbActiveParent="2" />
		</div> -->
	</div>
</template>
<script>
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
				title: '购物车',
				cartActive: 0,
				clickTab: 0,
				isEditer: false,
				buttonText: '结算',
				checkedAll: false,
				tbActive: 2,
				cartItems: [],
				priceAll: 0.0,
				goodsCount: 1,
				showCartEmptyFlag: false,
				outTimeGoods: [], // 过期购物车商品
				deleteAll: "",
				cartNullImg: null,
				tabCount: 0,
				// 
				tabTitle0: '普通商品【0】',
				tabTitle1: '租赁商品【0】',
			};
		},
		mounted: function() {
			this.$nextTick(() => {
				this.onChange(0);
			});
		},
		computed: {
			computeResultPrice() {
				//计算价格
				var priceAll = 0.0; //商品总价格
				this.cartItems.forEach(function(e) {
					var cartList = e.cartList;
					cartList.forEach(function(e) {
						var isChecked = e.isChecked;
						var goodsCount = e.goodsCount;
						var goodsPrice = e.goodsPrice;
						if (e.isValid && isChecked) {
							priceAll = priceAll + Number(goodsCount) * Number(goodsPrice);
						}
					});
				});
				// this.priceAll = priceAll;
				return priceAll.toFixed(2);
			}
		},
		methods: {
			toGoodsDetailPage(goods) {
				let goodsId = goods.goodsId;
				let isSingle = goods.isSingle;
				let timeGoodsId = goods.timeGoodsId;
				//.goodsId, goodsInfo.isSingle

				let url = '/goodsSku';
				if (isSingle == 1) {
					url = '/goodsSingle';
				}
				url = url + '?goodsId=' + goodsId + "&timeGoodsId=" + timeGoodsId;
				this.$router.push(url);
				//打开新页签
				//const page  = this.$router.resolve({path: url})
				//window.open(page.href,'_blank')
			},
			onChange(index) {
				let vm = this;
				vm.initData();
				vm.clickTab = index;
				// this.onClickOrderStatus = this.tabList[index].orderStatus;
				// console.log('----选中的标签-----' + index);
				vm.findOrderCart();
				// 初始化参数
			},
			initData() {
				let vm = this;
				vm.cartActive = 0;
				vm.clickTab = 0;
				vm.isEditer = false;
				vm.buttonText = '结算';
				vm.checkedAll = false;
				vm.cartItems = [];
				vm.priceAll = 0.0;
				vm.goodsCount = 1;
				vm.showCartEmptyFlag = false;
				vm.outTimeGoods = []; // 过期购物车商品
				vm.deleteAll = "";
				vm.cartNullImg = null;
				vm.tabCount = 0;
			},
			findOrderCart() {
				let vm = this;
				let params = {
					req_type: 'query_order_cart',
					data: {
						user_id: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let datas = res.data.cartList;
						vm.outTimeGoods = res.data.outTimeCartList;
						vm.initOutTimeGoods();
						vm.showCartEmptyFlag = res.data.showCartEmptyFlag;
						vm.cartNullImg = res.data.cartNullImg;
						var myData = [];
						//
						var tabCount0 = [];
						var tabCount1 = [];
						datas.forEach(function(e) {
							var dateSun = [];
							e.cartDetailList.forEach(function(e) {
								// var shopCartData = {
								// 	cartId: e.cartId,
								// 	goodsId: e.goodsId,
								// 	goodsName: e.goodsName,
								// 	goodsCount: e.goodsCount,
								// 	goodsImg: e.goodsImg,
								// 	goodsPrice: e.goodsPrice,
								// 	goodsSpecName: e.goodsSpecName,
								// 	timeGoodsId: e.timeGoodsId,
								// 	isSingle: e.isSingle,
								// 	isChecked: false,
								// 	isValid: true,
								// 	goodsInfoCss: 'goods-info',
								// 	buyCountCss: 'buy-count'
								// };
								e.isChecked = false;
								e.isValid = true;
								e.goodsInfoCss = 'goods-info';
								e.buyCountCss = 'buy-count';
								if (vm.clickTab == 1) {
									// 租赁商品
									if (e.goodsType == 3) {
										dateSun.push(e);
										tabCount1.push(e);
									} else {
										tabCount0.push(e);
									}
								} else {
									// 普通商品
									if (e.goodsType != 3) {
										dateSun.push(e);
										tabCount0.push(e);
									} else {
										tabCount1.push(e);
									}
								}

							});
							// 
							// console.log("=================================")
							vm.tabCount = dateSun.length;
							vm.tabTitle0 = "普通商品【" + tabCount0.length + "】";
							vm.tabTitle1 = "租赁商品【" + tabCount1.length + "】";
							// 
							var shopCart = {
								shopName: e.shopName,
								shopId: e.shopId,
								cartList: dateSun,
								isChecked: false,
								editerText: '编辑',
								isEditer: false,
								isValid: true
							};
							myData.push(shopCart);
							// console.info(shopCart)
						});
						vm.cartItems = myData;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			initOutTimeGoods() {
				// 过期购物车商品
				let vm = this;
				let items = [];
				vm.outTimeGoods.forEach(function(e) {
					// var shopCartData = {
					// 	cartId: e.cartId,
					// 	goodsId: e.goodsId,
					// 	goodsName: e.goodsName,
					// 	goodsCount: e.goodsCount,
					// 	goodsImg: e.goodsImg,
					// 	goodsPrice: e.goodsPrice,
					// 	goodsSpecName: e.goodsSpecName,
					// 	isSingle: e.isSingle,
					// 	isChecked: false,
					// 	isValid: true,
					// 	goodsInfoCss: 'goods-info',
					// 	buyCountCss: 'buy-count'
					// };
					e.isChecked = false;
					e.isValid = true;
					e.goodsInfoCss = 'goods-info';
					e.buyCountCss = 'buy-count';
					if (vm.clickTab == 1) {
						// 租赁商品
						if (e.goodsType == 3) {
							items.push(e);
						}
					} else {
						// 普通商品
						if (e.goodsType != 3) {
							items.push(e);
						}
					}
				});
				vm.outTimeGoods = items;
			},
			onClickLeft() {
				this.$toast('返回');
			},
			onEditer(shopId) {
				var editCount = 0; //编辑数;结算或者删除
				this.cartItems.forEach(function(e) {
					if (shopId == e.shopId) {
						e.isEditer = !e.isEditer;
						e.editerText = e.isEditer ? '完成' : '编辑';
					}
					if (e.isEditer && e.isValid) {
						editCount++;
					}
				});

				if (editCount > 0) {
					this.isEditer = true;
					this.buttonText = '删除';
				} else {
					this.isEditer = false;
					this.buttonText = '结算';
				}
				this.initPageCss();
			},
			choiceAll() {
				//全选
				let checkedAll_ = this.checkedAll;
				this.cartItems.forEach(function(e) {
					var cartList = e.cartList;
					e.isChecked = !checkedAll_;
					cartList.forEach(function(e) {
						e.isChecked = !checkedAll_;
					});
				});
			},
			checkedShopGoodsAll(shopId, shopIsChecked) {
				// console.log('--checkedShopGoodsAll----' + shopId + '  shopIsChecked=' + shopIsChecked);
				//店铺全选
				this.cartItems.forEach(function(e) {
					let _shopId = e.shopId;
					if (shopId == _shopId) {
						if (shopIsChecked) {
							var cartList = e.cartList;
							cartList.forEach(function(e) {
								e.isChecked = true;
							});
						} else {
							var cartList = e.cartList;
							cartList.forEach(function(e) {
								e.isChecked = false;
							});
						}
					}
				});
			},
			checkedShopGoods(shopId, cartId, isChecked) {
				let checkShopcartGoodsCount = 0;
				//选择店铺单个商品
				this.cartItems.forEach(function(e) {
					if (e.shopId == shopId) {
						e.cartList.forEach(function(e) {
							//被点击的商品选择
							if (cartId == e.cartId) {
								e.isChecked = isChecked;
							}
							if (e.isChecked) {
								checkShopcartGoodsCount = checkShopcartGoodsCount + 1;
							}
						});
						e.isChecked = false;
						if (checkShopcartGoodsCount == e.cartList.length) {
							e.isChecked = true;
						}
					}
				});
			},
			updateCartGoodsCount(shopId, cartId, goodsCount) {
				let vm = this;
				let params = {
					req_type: 'add_order_cart',
					data: {
						cart_id: cartId,
						user_id: 0,
						goods_spec: null,
						goods_count: goodsCount,
						add_model: 1
					}
				};
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('添加成功');
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			deleteCartGoods(cartId) {
				let vm = this;
				if (cartId > 0) {
					this.$dialog
						.confirm({
							title: '提示',
							message: '确认删除该商品吗？'
						})
						.then(() => {
							// on confirm
							//删除商品
							// console.info('------------删除商品----------' + cartId);
							this.cartItems.forEach(function(e) {
								var shopCartGoodsCount = e.cartList.length; //店铺下购物车商品数量
								e.cartList.forEach(function(e) {
									if (cartId == e.cartId) {
										e.isValid = false;
									}
									if (!e.isValid) {
										shopCartGoodsCount--;
									}
								});
								if (shopCartGoodsCount == 0) {
									e.isValid = false;
								}
							});
							vm.updateGoodsCartStatus(cartId);
							vm.checkCartGoods();
						})
						.catch(() => {
							// on cancel
							// console.info('---------on cancel----------');
						});
				} else {
					if (!this.isEditer) {
						//提交购物车
						// console.info('------------提交购物车-----------');
						vm.toSubmitOrderPage();
					} else {
						//批量删除商品
						// console.info('------------批量删除商品-----------');
						this.$dialog
							.confirm({
								title: '提示',
								message: '确认删除编辑状态下已选中的商品吗？'
							})
							.then(() => {
								// on confirm
								var deleteCartGoods = []; //删除的购物车商品
								this.cartItems.forEach(function(e) {
									if (e.isEditer) {
										var shopCartGoodsCount = e.cartList.length; //店铺下购物车商品数量
										e.cartList.forEach(function(e) {
											if (e.isValid && e.isChecked) {
												deleteCartGoods.push(e.cartId);
												e.isValid = false;
											}
											if (!e.isValid) {
												shopCartGoodsCount--;
											}
										});
										if (shopCartGoodsCount == 0) {
											e.isValid = false;
										}
									}
								});

								let cartIds = '';
								for (var i = 0; i < deleteCartGoods.length; i++) {
									if (deleteCartGoods.length - 1 == i) {
										cartIds = cartIds + deleteCartGoods[i];
									} else {
										cartIds = cartIds + deleteCartGoods[i] + ',';
									}
								}
								if (cartIds == '') {
									Toast('选择要删除的商品');
									return
								}
								vm.updateGoodsCartStatus(cartIds);
								vm.checkCartGoods();
							})
							.catch(() => {
								// on cancel
								console.info('---------on cancel----------');
							});
					}
				}
			},
			checkCartGoods() {
				let vm = this;
				let count = 0;
				vm.cartItems.forEach(function(e) {
					if (!e.isValid) {
						count++;
					}
				});
				if (count == vm.cartItems.length) {
					vm.showCartEmptyFlag = true;
				}
			},
			updateGoodsCartStatus(cartIds) {
				//
				let vm = this;
				let params = {
					req_type: 'delete_order_cart',
					data: {
						cart_ids: cartIds,
						user_id: 0
					}
				};
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('删除成功');
						vm.onChange(vm.clickTab);
					} else {}
				});
			},
			toGoodsList() {
				this.$router.push('allGoodsList');
			},
			toSubmitOrderPage() {
				// 选中的购物车
				var selectCartGoods = []; //删除的购物车商品
				this.cartItems.forEach(function(e) {
					e.cartList.forEach(function(e) {
						if (e.isValid && e.isChecked) {
							selectCartGoods.push(e.cartId);
						}
					});
				});
				// console.log(selectCartGoods)
				let cartIds = '';
				for (var i = 0; i < selectCartGoods.length; i++) {
					if (selectCartGoods.length - 1 == i) {
						cartIds = cartIds + selectCartGoods[i];
					} else {
						cartIds = cartIds + selectCartGoods[i] + ',';
					}
				}
				if (cartIds == '') {
					Toast('请选择商品');
					return
				}
				// console.log(cartIds)
				this.checkBeforeOrder(cartIds);
			},
			initPageCss() {
				let vm = this;
				if (vm.isEditer) {
					// 编辑
					vm.cartItems.forEach(function(e) {
						var cartList = e.cartList;
						cartList.forEach(function(e) {
							e.goodsInfoCss = "goods-info2";
							e.buyCountCss = "buy-count2";
						});
					});
				} else {
					vm.cartItems.forEach(function(e) {
						var cartList = e.cartList;
						cartList.forEach(function(e) {
							e.goodsInfoCss = "goods-info";
							e.buyCountCss = "buy-count";
						});
					});
				}
			},
			deleteSun() {
				let vm = this;
				let count = 0;
				vm.outTimeGoods.forEach(item => {
					if (item.isChecked) {
						count++;
					}
				})

				if (count == vm.outTimeGoods.length) {
					vm.deleteAll = true;
				} else {
					vm.deleteAll = false;
				}
			},
			checkedDeleteGoodsAll() {
				let vm = this;
				if (vm.deleteAll) {
					vm.outTimeGoods.forEach(item => {
						item.isChecked = true;
					})
				} else {
					vm.outTimeGoods.forEach(item => {
						item.isChecked = false;
					})
				}
			},
			deleteShopCart() {
				let vm = this;
				let cartIds = "";
				vm.outTimeGoods.forEach(item => {
					if (item.isChecked) {
						cartIds = cartIds + item.cartId + ",";
					}
				});
				if (cartIds == "") {
					Toast('请选择失效的商品');
					return
				}
				let params = {
					req_type: 'delete_order_cart',
					data: {
						cart_ids: cartIds,
						user_id: 0
					}
				};
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('删除成功');
						vm.onChange(vm.clickTab);
					} else {}
				});
			},
			checkBeforeOrder(cartIds) {
				let vm = this;
				let params = {
					req_type: 'before_submit_order',
					data: {
						cart_ids: cartIds
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.$router.push('orderSubmit2?cartIds=' + cartIds);
					} else {
						Toast(res.resp_desc);
					}
				});
			},
		}
	};
</script>

<style scoped>
	.body-bg {
		color: #464c5b;
		border: none;
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.header {
		position: fixed;
		height: 50px;
		width: 100%;
		z-index: 1000;
		top: 0;
	}

	.van-nav-bar__title {
		color: #000000 !important;
		font-weight: bold !important;
	}

	.van-nav-bar__text {
		color: #008000;
	}

	.header .van-icon,
	.van-nav-bar__text {
		color: #9ea7b4 !important;
	}

	.shop-item {
		margin-bottom: 10px;
	}

	.shop {
		border-bottom: 1px solid #f0f0f0;
	}

	.shop-div {
		background-color: #ffffff;
		overflow: auto;
		padding: 10px 10px;
	}

	.items {
		padding: 0 10px;
		background-color: #ffffff;
		padding: 0 10px;
	}

	.shop-o .van-icon {
		font-size: 18px !important;
		color: gray;
	}

	.shop-div>div {
		float: left;
		font-size: 14px;
	}

	.shop-div>div:last-child {
		float: right;
		color: #008000;
		padding-right: 15px;
	}

	.shop-div>div:nth-child(2) {
		padding-left: 10px;
	}

	/**
 * goods-list
 */
	.goods-list {
		height: 6.2rem;
		color: #3c3c3c;
		position: relative;
		padding: 10px 0;
		border-bottom: 1px solid #f0f0f0;
		font-size: 12px;
	}

	.select-btn {
		width: 10%;
		float: left;
		display: block;
	}

	.goods-img {
		width: 25%;
		float: left;
		display: block;
	}

	.goods-info {
		width: 60%;
		float: left;
		display: block;
		line-height: 16px;
	}

	.goods-info2 {
		width: 45%;
		float: left;
		display: block;
		line-height: 16px;
	}

	.buy-count {
		width: 5%;
		float: right;
		display: block;
	}

	.buy-count2 {
		width: 20%;
		float: right;
		display: block;
	}

	.select-btn {
		height: 6.2rem;
		text-align: center;
		position: relative;
	}

	.checkbox-goods {
		position: absolute;
		top: 2.5rem;
	}

	.goods-img>div {
		height: 6.2rem;
		overflow: hidden;
	}

	.goods-img img {
		height: 100%;
		width: 100%;
	}

	.goods-info {
		height: 100%;
		/* overflow: auto; */
		font-size: 12px;
		position: relative;
	}

	.goods,
	.goods-sku,
	.goods-price {
		padding-left: 10px;
	}

	.goods-sku {
		font-size: 12px;
		margin-top: 1px;
		font-size: 10px;
		color: gray;
	}

	.goods-price>div {
		position: absolute;
		bottom: 0px;
		color: #008000;
	}

	.goods-price>div>span:first-child {
		font-size: 12px;
	}

	.goods-price>div>span:last-child {
		font-size: 16px;
		font-weight: 900;
	}

	.goods-price-del {
		overflow: auto;
	}

	.buy-count {
		height: 100%;
		position: relative;
	}

	.bc {
		position: absolute;
		bottom: 0px;
		right: 0px;
		color: #008000;
	}

	.delete-goods {
		height: 100%;
		text-align: center;
		line-height: 6.2rem;
		color: #ffffff;
		background-color: #008000;
	}

	>>>.van-submit-bar {
		bottom: 0px !important;
		padding: 0px 0px !important;

	}

	.van-submit-bar__price {
		color: #008000 !important;
	}

	.van-button--danger2 {
		color: #ffffff;
		font-size: 16px !important;
		background: #008000 !important;
	}

	.van-button--danger {
		color: #3c3c3c;
		font-size: 16px !important;
		background: #e5e5e5 !important;
		border: 1px solid #999999 !important;
	}

	.van-submit-bar {
		padding: 10px 10px;
	}

	.checked-all {
		float: left;
		width: 20%;
		color: 0.5rem;
		height: 50px;
		position: relative;
	}

	.checked-all>div {
		position: absolute;
		top: 18px;
	}

	.all-price-div {
		margin-top: 5px;
		float: left;
		width: 50%;
		text-align: right;
		color: #3c3c3c;
		font-size: 14px;
	}

	.all-price-div>div>span:first-child {
		color: #000000;
		font-weight: bold;
		font-size: 16px;
	}

	.all-price-div>div>span:nth-child(2) {
		color: #008000;
		font-weight: bold;
		font-size: 16px;
		padding-right: 10px;
	}

	.all-price-div>div>span:last-child {
		color: #9e9e9e;
		font-size: 12px;
		padding-right: 10px;
	}

	.van-btn {
		float: right;
		width: 30%;
		text-align: center;
		height: 50px;
		line-height: 50px;
		background: #008000;
		color: #ffffff;
	}

	/* tabs */
	.tabs {
		position: fixed;
		top: 45px;
		width: 100%;
		background-color: #ffffff;
		z-index: 99;
	}

	.tabs-data {}
</style>
