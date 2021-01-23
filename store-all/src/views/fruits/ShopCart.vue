<template>
	<div class="body-bg">
		<div class="header">
			<div><Head :title="title" /></div>
		</div>
		<div style="height: 46px;"></div>
		<!-- <div><van-empty class="custom-image" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="描述文字" /></div> -->
		<div class="shop-item" v-for="(shopCart, index) in cartItems" :key="shopCart.shopId" v-if="shopCart.isValid">
			<div class="shop">
				<div class="shop-div">
					<div><van-checkbox v-model="shopCart.isChecked" checked-color="#008000" @click="checkedShopGoodsAll(shopCart.shopId)"></van-checkbox></div>
					<div class="shop-o"><van-icon name="shop-o" /></div>
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
							<van-checkbox
								checked-color="#008000"
								ref="checkboxes"
								v-model="goodsInfo.isChecked"
								@click="checkedShopGoods(shopCart.shopId, goodsInfo.cartId)"
							></van-checkbox>
						</div>
					</div>
					<div class="goods-img">
						<div>
							<span><img :src="goodsInfo.goodsImg" /></span>
						</div>
					</div>
					<div class="goods-info">
						<div class="goods">
							<div v-show="shopCart.isEditer" class="editer-goods">
								<van-stepper
									v-model="goodsInfo.goodsCount"
									disable-input
									integer
									:key="goodsInfo.cartId"
									@change="updateCartGoodsCount(shopCart.shopId, goodsInfo.cartId)"
								/>
							</div>
							<div v-show="!shopCart.isEditer" class="goods-name">{{ goodsInfo.goodsName }}</div>
						</div>
						<div class="goods-sku">
							<span>{{ goodsInfo.goodsSkuPropName }}</span>
						</div>
						<div class="goods-price">
							<div>
								<span>￥</span>
								<span>{{ goodsInfo.goodsPrice }}</span>
							</div>
						</div>
					</div>
					<div class="buy-count">
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
				<div class="checked-all">
					<div><van-checkbox checked-color="#008000" v-model="checkedAll" @click="choiceAll">全选</van-checkbox></div>
				</div>
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
		<div><Tbar :tbActive="tbActive" /></div>
	</div>
</template>
<script>
import Head from '@/components/Head.vue';
import Tbar from '@/components/Bottom-bar.vue';
export default {
	components: { Head: Head, Tbar: Tbar },
	data() {
		return {
			title: '购物车',
			isEditer: false,
			buttonText: '结算',
			checkedAll: false,
			tbActive: 2,
			cartItems: [],
			priceAll: 0.0,
			goodsCount: 1
		};
	},
	mounted: function() {
		const cartItems = [
			{
				shopName: '水果2号店',
				shopId: 2,
				cartList: [
					{
						cartId: 10,
						goodsName: '测试店铺22商品10',
						goodsCount: 1,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-1.jpg',
						goodsPrice: 1.0,
						goodsSkuPropName: ''
					},
					{
						cartId: 11,
						goodsName: '测试店铺22商品11',
						goodsCount: 1,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-8.jpg',
						goodsPrice: 1.01,
						goodsSkuPropName: ''
					}
				]
			}
			/* ,{
				shopName: '水果1号店',
				shopId: 1,
				cartList: [
					{
						cartId: 1,
						goodsName: '测试店铺商品1',
						goodsCount: 1,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-2.jpg',
						goodsPrice: 1.0,
						goodsSkuPropName: ''
					},
					{
						cartId: 2,
						goodsName: '测试店铺商品2',
						goodsCount: 1,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-5.jpg',
						goodsPrice: 1.01,
						goodsSkuPropName: ''
					}
				]
			} */
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
					goodsSkuPropName: e.goodsSkuPropName,
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
		checkedShopGoodsAll(shopId) {
			//店铺全选
			this.cartItems.forEach(function(e) {
				let _shopId = e.shopId;
				if (shopId == _shopId) {
					let shopIsChecked = e.isChecked; //店铺是否全选
					var cartList = e.cartList;
					cartList.forEach(function(e) {
						e.isChecked = shopIsChecked ? false : true;
					});
				}
			});
		},
		checkedShopGoods(shopId, cartId) {
			let cartgoodskAll = 0; //购物车商品数量
			let cartIsCheckAll = 0; //购物车选中的数据
			//选择店铺单个商品
			this.cartItems.forEach(function(e) {
				let _shopId = e.shopId;
				var cartList = e.cartList;
				cartgoodskAll = cartgoodskAll + cartList.length;
				var checkedSize = 0; //店铺全选
				cartList.forEach(function(e) {
					//被点击的商品选择
					if (cartId == e.cartId) {
						e.isChecked = !e.isChecked;
					}
					if (e.isChecked) {
						cartIsCheckAll++;
						checkedSize++;
					}
				});
				e.isChecked = checkedSize == cartList.length ? true : false;
			});
			this.checkedAll = cartgoodskAll == cartIsCheckAll ? true : false;
		},
		updateCartGoodsCount(shopId, cartId) {
			//更新购物车数量
			var goodsCount = 0;
			var index = 0;
			this.cartItems.forEach(function(e) {
				if (shopId == e.shopId) {
					e.cartList.forEach(function(e) {
						if (cartId == e.cartId) {
							goodsCount = e.goodsCount;
							return;
						}
					});
				}
			});
			console.info('----------------------goodsCount=' + goodsCount + '          index=' + index);
		},
		deleteCartGoods(cartId) {
			if (cartId > 0) {
				this.$dialog
					.confirm({
						title: '提示',
						message: '确认删除该商品吗？'
					})
					.then(() => {
						// on confirm
						//删除商品
						console.info('------------删除商品----------' + cartId);
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
					})
					.catch(() => {
						// on cancel
						console.info('---------on cancel----------');
					});
			} else {
				if (!this.isEditer) {
					//提交购物车
					console.info('------------提交购物车-----------');
				} else {
					//批量删除商品
					console.info('------------批量删除商品-----------');
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
						})
						.catch(() => {
							// on cancel
							console.info('---------on cancel----------');
						});
				}
			}
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

.shop-div > div {
	float: left;
	font-size: 14px;
}
.shop-div > div:last-child {
	float: right;
	color: #008000;
	padding-right: 15px;
}

.shop-div > div:nth-child(2) {
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
	width: 30%;
	float: left;
	display: block;
}
.goods-info {
	width: 40%;
	float: left;
	display: block;
}
.buy-count {
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

.goods-img > div {
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
	padding-top: 3px;
	margin-top: 3px;
}

.goods-price > div {
	position: absolute;
	bottom: 0px;
	color: #008000;
}

.goods-price > div > span:first-child {
	font-size: 12px;
}
.goods-price > div > span:last-child {
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
.checked-all > div {
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
.all-price-div > div > span:first-child {
	color: #000000;
	font-weight: bold;
	font-size: 16px;
}
.all-price-div > div > span:nth-child(2) {
	color: #008000;
	font-weight: bold;
	font-size: 16px;
	padding-right: 10px;
}
.all-price-div > div > span:last-child {
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
