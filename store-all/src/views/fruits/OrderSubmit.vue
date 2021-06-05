<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="user-addr-div">
			<div v-show="!showAddrFlag">
				<div class="img">
					<div @click="showUserAddrListPage">
						<van-icon name="location-o" />
					</div>
				</div>
				<div class="user-info">
					<div class="addr-detail addr-detail2" @click="showUserAddrListPage"><span>选择收货地址</span></div>
				</div>
			</div>
		</div>
		<div class="user-addr-div">
			<div v-show="showAddrFlag">
				<div class="img">
					<div @click="showUserAddrListPage">
						<van-icon name="location-o" />
					</div>
				</div>
				<div class="user-info">
					<div>
						<span @click="showUserAddrListPage">{{userName}}</span>
						<span @click="showUserAddrListPage">{{phone}}</span>
					</div>
					<div class="addr-detail" @click="showUserAddrListPage"><span>{{addrDetail}}</span></div>
				</div>
			</div>
		</div>
		<div class="goods-items">
			<div>
				<div class="shop-name"><span>{{shopName}}</span></div>
				<div class="goods-list" v-for="(goods,index) in goodsList" :key="index">
					<div class="goods-img"><img :src="goods.goodsImg" /></div>
					<div class="goods-info">
						<div>
							<div class="goods-name"><span>{{goods.goodsName}}</span></div>
							<div class="space-name" v-if="goods.propCodeName != ''">规格：{{goods.propCodeName}}</div>
							<div class="goods-price">
								<div><span>X{{goods.buyCount}}</span></div>
								<div>
									<span class="currency-sale-price">￥</span>
									<span class="money-sale-price">{{goods.nowMoney}}</span>
									<!-- <span style="font-size: 10px;color: gray;" v-if="goods.trueMoney > goods.nowMoney">&nbsp;￥<span>{{goods.trueMoney}}</span></span> -->
									<span style="font-size: 10px;color: gray;"
										v-if="goods.trueMoney > goods.nowMoney">&nbsp;￥<span
											style="text-decoration:line-through;">{{goods.trueMoney}}</span></span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="border-bottom: 1px solid #f0f0f0;height: 3px;"></div>
				<div class="title title-first">
					<div class="title-p"><span>商品总价</span></div>
					<div class="title-sub">
						<span class="currency-goods-all">￥</span>
						<span class="money-goods-all">{{goodsTruePriceAll}}</span>
					</div>
				</div>
				<div class="title">
					<div class="title-p"><span>邮费/配送费/自取费</span></div>
					<div class="title-sub">
						<span class="currency-other">￥</span>
						<span class="money-other">{{postPrice}}</span>
					</div>
				</div>
				<div class="order_price_div">
					<div class="order_price_div_name">
						<div>订单总价:</div>
						<div>优惠总价:</div>
						<div>押金总价:</div>
					</div>
					<div class="order_price_div_value">
						<div>
							<span style="font-size: 12px;">￥</span>
							<span>{{orderPrice}}</span>
						</div>
						<div>
							<span style="font-size: 12px;">￥</span>
							<span>{{discountsPriceAll}}</span>
						</div>
						<div>
							<span style="font-size: 12px;">￥</span>
							<span>{{depositMoneyAll}}</span>
						</div>
					</div>
				</div>
				<div class="user-remark">
					<div><input placeholder="用户备注" v-model="userRemark" /></div>
				</div>
				<div class="vant-div vant-read">
					<van-collapse v-model="activeName" accordion>
						<van-collapse-item title="下单必看" name="1">
							<OrderRead></OrderRead>
						</van-collapse-item>
					</van-collapse>
				</div>
			</div>
		</div>
		<div class="advice"><span>如收到的商品出现质量、错发、漏发等问题，请联系客服处理</span></div>
		<div style="border-top: 1px solid #c3cbd6; font-weight: normal;"></div>
		<PriceMsg />
		<div style="height: 55px; width: 100%;"></div>
		<div class="foot-btn">
			<div class="order-price-div">
				<span>
					<span>实付：</span>
					<span class="currency">￥</span>
					<span class="money">{{realPrice}}</span>
				</span>
			</div>
			<div><span class="to-pay" @click="createOrder()">去下单</span></div>
		</div>
		<van-popup v-model="showAddrListPannelFlag" position="bottom" :style="{ height: '100%' }">
			<UserAddr :setShowAddrListPannelFlag="setShowAddrListPannelFlag" :setUserChoseAddr="setUserChoseAddr">
			</UserAddr>
		</van-popup>
	</div>
</template>

<script>
	const coupon = {
		available: 1,
		condition: '无使用门槛\n最多优惠12元',
		reason: '',
		value: 150,
		name: '优惠券名称',
		startAt: 1489104000,
		endAt: 1514592000,
		valueDesc: '1.8',
		unitDesc: '元'
	};

	const hongbao = {
		available: 1,
		condition: '无使用门槛',
		reason: '',
		value: 200,
		name: '红包名称',
		startAt: 1489104000,
		endAt: 1514592000,
		valueDesc: '20',
		unitDesc: '元'
	};

	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import OrderRead from '@/components/OrderRead.vue';
	import PriceMsg from '@/components/PriceMsg.vue';
	import UserAddr from '@/components/UserAddrListPannel.vue'
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			UserAddr: UserAddr,
			OrderRead: OrderRead,
			PriceMsg: PriceMsg
		},
		data() {
			return {
				showAddrFlag: false,
				showAddrListPannelFlag: false,
				activeName: '0',
				title: '填写订单',
				shopName: null,
				goodsList: [],
				userRemark: "",
				loading: false,
				finished: false,
				testOrderId: 0,
				chosenCoupon: -1, // 优惠券
				coupons: [coupon], // 优惠券
				disabledCoupons: [coupon], // 优惠券
				showListCoupon: false, // 优惠券
				chosenHongbao: -1, // 红包
				hongbaos: [hongbao], // 红包
				disabledHongbao: [hongbao], // 红包
				showListHongbao: false, // 红包
				postPrice: 0,
				orderPrice: 0,
				realPrice: 0,
				goodsPriceAll: 0,
				goodsTruePriceAll: 0,
				depositMoneyAll: 0,
				advancePriceAll: 0,
				discountsPriceAll: 0, //红包等优惠价格
				discountsPrice: 0,
				goodsDiscountsPrice: 0, // 商品优惠价格
				userAddrId: null,
				userName: '',
				phone: '',
				addrDetail: '',
				//
				order: null
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findGoodsData();
			});
		},
		methods: {
			toDetailPage(orderId) {
				let vm = this
				setTimeout(() => {
					vm.$router.push("orderDetail?orderId=" + orderId);
				}, 2000);
			},
			findGoodsData() {
				let vm = this;
				let {
					goodsId,
					skuId,
					buyCount,
					cartIds,
					timeGoodsId
				} = this.$route.query;

				let params = {
					req_type: 'before_submit_order',
					data: {
						goods_id: goodsId,
						sku_id: skuId,
						buy_count: buyCount,
						cart_ids: cartIds,
						user_id: 0,
						time_goods_id: timeGoodsId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.order = res.data;
						vm.goodsList = res.data.goods_list;
						vm.shopName = res.data.shop_name;
						vm.shopId = res.data.shop_id;
						vm.goodsPriceAll = res.data.goods_price_all;
						vm.goodsTruePriceAll = res.data.goods_true_price_all;
						vm.depositMoneyAll = res.data.deposit_money_all;
						vm.advancePriceAll = res.data.advance_price_all;
						//商品优惠总额
						vm.goodsDiscountsPrice = res.data.goods_discounts_price;
						//
						vm.orderPrice = res.data.order_price;
						vm.initPayPrice();
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			onChangeCoupon(index) {
				this.showListCoupon = false;
				this.chosenCoupon = index;
			},
			onExchangeCoupon(code) {
				this.coupons.push(coupon);
			},
			onChangeHongbao(index) {
				this.showListHongbao = false;
				this.chosenHongbao = index;
			},
			onExchangeHongbao(code) {
				this.hongbaos.push(hongbao);
			},
			initPayPrice() {
				let vm = this;
				vm.discountsPriceAll = vm.order.goods_discounts_price + vm.discountsPrice;
				vm.orderPrice = Number(vm.order.order_price) + Number(vm.postPrice);
				vm.orderPrice = vm.orderPrice.toFixed(2);
				vm.realPrice = Number(vm.orderPrice) - Number(vm.discountsPriceAll);
				vm.realPrice = vm.realPrice.toFixed(2);
			},
			showUserAddrListPage() {
				if (this.showAddrListPannelFlag) {
					this.showAddrListPannelFlag = false;
				} else {
					this.showAddrListPannelFlag = true;
				}
			},
			setShowAddrListPannelFlag() {
				this.showAddrListPannelFlag = false;
			},
			setUserChoseAddr(obj) {
				let vm = this;
				vm.userAddrId = obj.userAddrId;
				vm.userName = obj.userName;
				vm.phone = obj.phone;
				vm.addrDetail = obj.addrDetail;
				vm.postPrice = obj.postPrice;
				if (obj.userAddrId != null) {
					vm.showAddrFlag = true;
				}
				vm.initPayPrice();
			},
			createOrder() {
				let vm = this;
				let goodsList = [];
				for (var i = 0; i < vm.goodsList.length; i++) {
					let goods = {
						goods_id: vm.goodsList[i].goodsId,
						sku_id: vm.goodsList[i].skuId,
						buy_count: vm.goodsList[i].buyCount,
						time_goods_id: vm.goodsList[i].timeGoodsId,
						cart_id: vm.goodsList[i].cartId,
					}
					goodsList.push(goods);
				}
				let postWay = 1; //收货方式 1.邮寄4.自取5配送地址

				let obj = {
					user_id: 0,
					user_addr_id: vm.userAddrId,
					addr_detail: vm.addrDetail,
					user_remark: vm.userRemark,
					user_name: vm.userName,
					user_phone: vm.phone,
					user_sex: -1,
					post_way: postWay,
					post_price: vm.postPrice,
					order_price: vm.orderPrice,
					real_price: vm.realPrice,
					goods_price_all: vm.goodsPriceAll, //商品总价
					deposit_price_all: vm.depositMoneyAll, //押金总价
					discounts_price_all: vm.discountsPriceAll, //优惠总价
					advance_price_all: vm.advancePriceAll,
					shop_id: vm.shopId,
					business_type: 1, //1正常下单2抢购3预定4租赁
					coupon_id: 0,
					goods_list: goodsList
				}
				let flag = vm.checkOrder();
				if (!flag) {
					return;
				}
				let params = {
					req_type: 'create_order',
					data: obj
				};
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('下单成功');
						let orderId = res.data.order_id;
						vm.toDetailPage(orderId);
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			checkOrder() {
				let vm = this;
				if (vm.userAddrId == '' || vm.userAddrId == null) {
					Toast('收货地址不能为空');
					return false;
				}
				return true;
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		margin: 0;
		padding: 0;
		font-size: 12px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.order-msg {
		font-size: 15px;
	}

	.close-time {
		color: #008000;
	}

	.user-addr-div,
	.goods-items,
	.order-price,
	.order-detail {
		padding: 0px 10px;
		margin: 10px 10px;
		border-radius: 10px;
		background-color: #ffffff;
		font-weight: normal;
		font-size: 12px;
		color: #464c5b;
		overflow: hidden;
	}

	.user-addr-div>div:last-child {
		position: relative;
		font-size: 10px;
	}

	.user-addr-div>div:last-child>div:first-child {
		text-align: center;
		font-size: 25px;
		color: #9ea7b4;
		position: absolute;
		top: 50%;
		left: 4%;
		transform: translate(-50%, -50%);
	}

	.user-addr-div>div:last-child>div:last-child {
		padding-left: 10%;
		line-height: 20px;
		font-size: 12px;
	}

	.user-info>div:first-child {
		padding: 3px 0;
	}

	.user-info>div:first-child>span:last-child {
		padding-left: 5px;
		color: #9ea7b4;
	}

	.addr-detail2 {
		text-align: center;
	}

	/* goods */
	.shop-name {
		color: #008000;
		padding: 5px 0;
		margin-bottom: 10px;
		font-size: 12px;
		border-bottom: 1px solid #f0f0f0;
	}

	.goods-list {
		margin-bottom: 10px;
		position: relative;
		overflow: hidden;
	}

	.goods-img {
		float: left;
		width: 30%;
	}

	.space-name {
		font-size: 10px;
		color: gray;
		line-height: 14px;
	}

	.goods-img img {
		width: 100%;
		height: 7rem;
		display: block;
		border: none;
	}

	.goods-info {
		float: left;
		width: 70%;
	}

	.goods-info>div {
		padding-left: 8px;
	}

	.goods-price>div:first-child {
		float: left;
		font-size: 12px;
		color: #9ea7b4;
		width: 40%;
		position: absolute;
		bottom: 2px;
	}

	.goods-price>div:last-child {
		float: right;
		width: 60%;
		text-align: right;
		position: absolute;
		right: 0px;
		bottom: 2px;
	}

	.title-first {
		margin-top: 5px;
	}

	.title {
		color: #657180;
		font-size: 12px;
		padding: 2px 0;
		overflow: hidden;
		height: 20px;
	}

	.title-p {
		float: left;
	}

	.title-sub {
		float: right;
	}

	.currency-other,
	.money-other,
	.currency-goods-all,
	.money-goods-all,
	.currency-sale-price,
	.money-sale-price {
		font-size: 12px;
		color: #008000;
	}

	.money-sale-price {
		font-size: 12px;
		;
	}

	.money-other {
		font-size: 12px;
		font-weight: normal;
	}

	.money-goods-all {
		font-size: 12px;
	}

	.goods-all-price {
		border-top: 1px solid #f0f0f0;
	}

	.order-price {
		position: absolute;
		right: 15px;
	}

	.currency,
	.money {
		color: #008000;
		font-weight: bold;
		font-size: 12px;
	}

	.money {
		font-size: 16px;
	}

	.order-detail {
		background-color: #ffffff;
		color: #657180;
		font-size: 12px;
		line-height: 30px;
	}

	.order-price-div {
		position: absolute;
		left: 0px;
	}

	.order-num {
		padding-bottom: 10px;
	}

	.order-detail>div {
		border-bottom: 1px solid #f0f0f0;
	}

	.user-remark input {
		border: none;
		width: 100%;
		padding: 5px 0;
		padding-left: 3px;
		font-size: 10px;
		border-bottom: 1px solid #c3cbd6;
	}

	.order_price_div {
		border-top: 1px solid #c3cbd6;
		border-bottom: 1px solid #c3cbd6;
		padding: 10px 0;
		overflow: hidden;
	}

	.order_price_div_name {
		float: left;
		width: 65%;
		text-align: right;
	}

	.order_price_div_value {
		float: right;
		width: 35%;
		text-align: right;
		color: #008000;
		font-size: 16px;
		font-weight: bold;
	}

	.user-remark {
		/* padding: 8px 0; */
	}

	.advice {
		color: #9ea7b4;
		font-size: 12px;
		text-align: center;
		padding: 0px 10px;
		margin-bottom: 10px;
		font-weight: normal;
	}

	.advice2 {
		color: #9ea7b4;
		font-size: 12px;
		text-align: left;
		padding: 0px 10px;
		margin-bottom: 30px;
		font-weight: normal;
	}

	.advice2>span {
		display: block;
	}

	.foot-btn {
		font-size: 14px;
		background-color: #ffffff;
		position: fixed;
		bottom: 0px;
		overflow: hidden;
		width: auto;
		color: #464c5b;
		width: 100%;
		border-top: 1px solid #f0f0f0;
	}

	.foot-btn>div>span {
		float: right;
		display: block;
		padding: 8px 18px;
		border-radius: 5px;
		margin: 10px 0;
		margin-right: 15px;
	}

	.to-cancel {
		border: 1px solid #c3cbd6;
	}

	.to-pay {
		color: #ffffff;
		background-color: #008000;
	}

	.next-step {
		color: #c3cbd6;
		font-size: 14px;
		right: 10px;
		float: right;
		line-height: 23px;
	}

	.vant-div {
		padding: 10px 0;
	}

	.vant-read>>>.van-cell__title {
		color: #000000 !important;
	}

	>>>.van-cell {
		padding: 0 0;
		color: #657180;
		font-size: 12px;
	}

	>>>.van-button--plain,
	.van-button--danger {
		color: #008000 !important;
	}

	>>>.van-coupon-list__bottom button {
		background-color: #008000 !important;
		background: #008000 !important;
		border: 1px solid #008000 !important;
	}

	>>>.van-coupon__head {
		color: #008000 !important;
	}

	>>>.van-coupon__amount {
		font-weight: bold !important;
	}

	>>>.van-coupon__amount {
		font-size: 25px;
	}

	>>>.van-tabs__line,
	>>>.van-checkbox__icon--checked .van-icon {
		background-color: #008000 !important;
		background: #008000 !important;
		border: 1px solid #008000 !important;
	}

	>>>.van-coupon-cell--selected {
		color: #008000 !important;
	}

	>>>.van-collapse-item__content {
		font-size: 10px;
	}
</style>
