<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div v-if="null!=order">
			<div class="order-status" v-if="null!=order && order.order_status == 0">
				<div class="status"><span>待付款</span></div>
				<div class="status-remark"><span>{{closeTime}}分钟后内未支付，订单将自动消失</span></div>
			</div>
			<div class="user-addr-div" v-if="null!=order">
				<div>
					<div><span>订单状态</span></div>
					<div><span>{{order.order_status_name}}</span></div>
				</div>
				<div>
					<div class="img">
						<div>
							<van-icon name="location-o" />
						</div>
					</div>
					<div class="user-info">
						<div>
							<span>{{order.user_name}}</span>
							<span>{{order.user_phone}}</span>
						</div>
						<div class="addr-detail"><span>{{order.user_addr}}</span></div>
					</div>
				</div>
			</div>
			<div class="goods-items" v-if="null!=order">
				<div>
					<div class="shop-name"><span>{{order.shop_name}}</span></div>
					<div class="goods-list" v-for="(goods,index) in goodsList" :key="index">
						<div class="goods-img"><img :src="goods.goods_img" /></div>
						<div class="goods-info">
							<div>
								<div class="goods-name"><span>{{goods.goods_name}}</span></div>
								<div class="space-name" v-if="goods.goods_spec_name != ''">规格：{{goods.goods_spec_name}}
								</div>
								<div class="goods-price">
									<div><span>X{{goods.goods_count}}</span></div>
									<div>
										<span class="currency-sale-price">￥</span>
										<span class="money-sale-price">{{goods.sale_money}}</span>
										<span style="font-size: 10px;color: gray;"
											v-if="goods.goods_true_money > goods.sale_money">&nbsp;￥<span
												style="text-decoration:line-through;">{{goods.goods_true_money}}</span></span>
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
							<span class="money-goods-all">{{order.goods_true_price_all}}</span>
						</div>
					</div>
					<div class="title">
						<div class="title-p"><span>邮费/配送费/自取费</span></div>
						<div class="title-sub">
							<span class="currency-other">￥</span>
							<span class="money-other">{{order.post_price}}</span>
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
								<span>{{order.order_price}}</span>
							</div>
							<div>
								<span style="font-size: 12px;">￥</span>
								<span>{{order.discounts_price}}</span>
							</div>
							<div>
								<span style="font-size: 12px;">￥</span>
								<span>{{order.deposit_price_all}}</span>
							</div>
						</div>
					</div>
					<div class="order_price_div" style="border-top: none;">
						<div class="order_price_div_name">
							<div>实付总价:</div>
						</div>
						<div class="order_price_div_value">
							<div>
								<span style="font-size: 12px;">￥</span>
								<span>{{order.real_price}}</span>
							</div>
						</div>
					</div>
					<div class="user-remark">
						<div><input placeholder="用户备注" readonly="readonly" v-model="order.user_remark" /></div>
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
			<div class="order-detail">
				<div>
					<div class="order-num"><span>订单编号：{{order.order_no}}</span></div>
					<div><span>下单时间：{{order.order_time}}</span></div>
				</div>
			</div>
			<div class="advice"><span>如收到的商品出现质量、错发、漏发等问题，请联系客服处理</span></div>
			<div style="border-top: 1px solid #c3cbd6; font-weight: normal;"></div>
			<PriceMsg />
			<div style="height: 55px; width: 100%;"></div>
			<div class="foot-btn" v-if="null!=order">
				<div v-if="order.order_status == 0">
					<span class="to-pay">去支付</span>
					<span class="to-cancel">取消订单</span>
				</div>
				<div v-if="order.order_status == 2">
					<span class="to-cancel">取消订单</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import OrderRead from '@/components/OrderRead.vue';
	import PriceMsg from '@/components/PriceMsg.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			OrderRead: OrderRead,
			PriceMsg: PriceMsg
		},
		data() {
			return {
				title: '订单详情',
				activeName: 0,
				order: null,
				goodsList: [],
				orderId: 0,
				orderNo:'',
				closeTime: 0
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findOrderDetail();
			});
		},
		methods: {
			findOrderDetail() {
				let vm = this;
				let {
					orderId,
					orderNo
				} = this.$route.query;
				if (null == orderId) {
					return;
				}
				vm.orderId = orderId;
				vm.orderNo = orderNo;
				let params = {
					req_type: 'query_order_detail',
					data: {
						order_id: orderId,
						order_no:orderNo
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.order = res.data;
						vm.goodsList = res.data.detail_list;
						vm.closeTime = res.data.close_time;
					} else {
						Toast(res.resp_desc);
					}
				});
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

	.order-status {
		padding: 10px 10px 5px 10px;
		font-weight: bold;
		color: #464c5b;
	}

	.status {
		font-size: 18px;
	}

	.order-msg {
		font-size: 15px;
	}

	.close-time {
		color: #008000;
	}

	.status-remark {
		color: #9ea7b4;
		font-size: 12px;
		padding-top: 5px;
	}

	.user-addr-div,
	.goods-items,
	.order-price,
	.order-detail {
		padding: 0px 10px;
		margin: 0px 10px;
		border-radius: 10px;
		background-color: #ffffff;
		font-weight: normal;
		font-size: 12px;
		color: #464c5b;
		overflow: hidden;
	}

	.user-addr-div>div:last-child {
		position: relative;
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

	.user-addr-div>div:first-child {
		overflow: hidden;
		padding: 10px 0 3px 0;
		border-bottom: 1px solid #f0f0f0;
		margin-bottom: 10px;
	}

	.user-addr-div>div:first-child>div:first-child {
		float: left;
		width: 50%;
		color: #9ea7b4;
	}

	.user-addr-div>div:first-child>div:last-child {
		float: right;
		width: 50%;
		text-align: right;
		color: #008000;
	}

	.user-info>div:first-child {
		padding: 3px 0;
	}

	.user-info>div:first-child>span:last-child {
		padding-left: 5px;
		color: #9ea7b4;
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
	}

	.order-price-div {
		position: absolute;
		left: 0px;
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
		padding: 10px 10px 0 10px;
		margin-bottom: 10px;
		font-weight: normal;
	}

	.advice2 {
		color: #9ea7b4;
		font-size: 12px;
		text-align: left;
		padding: 10px 10px 0 10px;
		margin-bottom: 30px;
		font-weight: normal;
	}

	.advice2>span {
		display: block;
	}

	.foot-btn {
		font-size: 12px;
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
		margin: 8px 0;
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
