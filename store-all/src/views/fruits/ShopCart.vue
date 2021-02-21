<template>
	<div class="body-bg">
		<div class="header">
			<div>
				<Head :title="title" />
			</div>
		</div>
		<div style="height: 46px;"></div>
		<div @click="toGoodsList" v-if="showCartEmptyFlag">
			<van-empty class="custom-image" image="http://127.0.0.1/2021/01/10/202101101610290789993.jpg" description="去逛逛" />
		</div>
		<div class="shop-item" v-for="(shopCart, index) in cartItems" :key="shopCart.shopId" v-if="shopCart.isValid && shopCart.cartList.length > 0">
			<div class="shop">
				<div class="shop-div">
					<div>
						<van-checkbox v-model="shopCart.isChecked" checked-color="#008000" @click="checkedShopGoodsAll(shopCart.shopId, shopCart.isChecked)"></van-checkbox>
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
			<div class="items" v-for="(goodsInfo, index) in shopCart.cartList" :key="goodsInfo.cartId" v-if="goodsInfo.isValid">
				<div class="goods-list">
					<div class="select-btn">
						<div class="checkbox-goods">
							<van-checkbox checked-color="#008000" ref="checkboxes" v-model="goodsInfo.isChecked" @click="checkedShopGoods(shopCart.shopId, goodsInfo.cartId, goodsInfo.isChecked)"></van-checkbox>
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
								<van-stepper v-model="goodsInfo.goodsCount" disable-input integer :key="goodsInfo.cartId" @change="updateCartGoodsCount(shopCart.shopId, goodsInfo.cartId, goodsInfo.goodsCount)" />
							</div>
							<div v-show="!shopCart.isEditer" class="goods-name" @click="toGoodsDetailPage(goodsInfo)">{{ goodsInfo.goodsName }}</div>
						</div>
						<div class="goods-sku" @click="toGoodsDetailPage(goodsInfo)">
							<span>{{ goodsInfo.goodsSpecName }}</span>
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
						<div v-show="shopCart.isEditer" class="delete-goods" @click="deleteCartGoods(goodsInfo.cartId)"><span>删除</span></div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div style="height: 52px; width: 100%;clear: both;"></div>
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
		<div>
			<Tbar tbActiveParent="2" />
		</div>
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
				isEditer: false,
				buttonText: '结算',
				checkedAll: false,
				tbActive: 2,
				cartItems: [],
				priceAll: 0.0,
				goodsCount: 1,
				showCartEmptyFlag: false
			};
		},
		mounted: function() {
			this.$nextTick(() => {
				this.findOrderCart();
				// this.testData();
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
				//.goodsId, goodsInfo.isSingle

				let url = '/goodsSku';
				if (isSingle == 1) {
					url = '/goodsSingle';
				}
				url = url + '?goodsId=' + goodsId;
				this.$router.push(url);
				//打开新页签
				//const page  = this.$router.resolve({path: url})
				//window.open(page.href,'_blank')
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
						vm.showCartEmptyFlag = res.data.showCartEmptyFlag;
						var myData = [];
						datas.forEach(function(e) {
							var dateSun = [];
							e.cartDetailList.forEach(function(e) {
								var shopCartData = {
									cartId: e.cartId,
									goodsId: e.goodsId,
									goodsName: e.goodsName,
									goodsCount: e.goodsCount,
									goodsImg: e.goodsImg,
									goodsPrice: e.goodsPrice,
									goodsSpecName: e.goodsSpecName,
									isSingle: e.isSingle,
									isChecked: false,
									isValid: true,
									goodsInfoCss:'goods-info',
									buyCountCss:'buy-count'
								};
								dateSun.push(shopCartData);
							});
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
					} else {}
				});
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
					} else {}
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
											console.log('----e.cartId=' + e.cartId);
											console.log('----e.isValid=' + e.isValid);
											console.log('----e.isChecked=' + e.isChecked);
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
				this.$router.push('orderSubmit2?cartIds=' + cartIds);
			},
			initPageCss(){
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
				}else{
					vm.cartItems.forEach(function(e) {
						var cartList = e.cartList;
						cartList.forEach(function(e) {
							e.goodsInfoCss = "goods-info";
							e.buyCountCss = "buy-count";
						});
					});
				}
			},
			testData() {
				const cartItems = [{
						shopName: '水果2号店',
						shopId: 2,
						cartList: [{
								cartId: 10,
								goodsName: '测试店铺22商品10',
								goodsCount: 1,
								goodsImg: 'https://img.yzcdn.cn/vant/apple-1.jpg',
								goodsPrice: 1.0,
								goodsSpecName: ''
							},
							{
								cartId: 11,
								goodsName: '测试店铺22商品11',
								goodsCount: 1,
								goodsImg: 'https://img.yzcdn.cn/vant/apple-8.jpg',
								goodsPrice: 1.01,
								goodsSpecName: ''
							}
						]
					},
					{
						shopName: '水果1号店',
						shopId: 1,
						cartList: [
							// {
							// 	cartId: 1,
							// 	goodsName: '测试店铺商品1',
							// 	goodsCount: 1,
							// 	goodsImg: 'https://img.yzcdn.cn/vant/apple-2.jpg',
							// 	goodsPrice: 1.0,
							// 	goodsSpecName: ''
							// },
							// {
							// 	cartId: 2,
							// 	goodsName: '测试店铺商品2',
							// 	goodsCount: 1,
							// 	goodsImg: 'https://img.yzcdn.cn/vant/apple-5.jpg',
							// 	goodsPrice: 1.01,
							// 	goodsSpecName: ''
							// }
						]
					}
				];

				var myData = [];
				cartItems.forEach(function(e) {
					var dateSun = [];
					e.cartList.forEach(function(e) {
						var shopCartData = {
							cartId: e.cartId,
							goodsName: e.goodsName,
							goodsCount: e.goodsCount,
							goodsImg: e.goodsImg,
							goodsPrice: e.goodsPrice,
							goodsSpecName: e.goodsSpecName,
							isChecked: false,
							isValid: true
						};
						dateSun.push(shopCartData);
					});
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
				this.cartItems = myData;
			}
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
		overflow: auto;
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

	.van-submit-bar {
		bottom: 50px !important;
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
</style>
