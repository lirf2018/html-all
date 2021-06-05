<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<!-- <div class="order-detail">
			<div>
				<div class="order-num"><span>订单编号：20085554664643513546543212</span></div>
			</div>
		</div> -->
		<div class="user-addr-div">
			<div>
				<div class="img">
					<div><van-icon name="location-o" /></div>
				</div>
				<div class="user-info">
					<div>
						<span>李先生</span>
						<span>13418921358</span>
					</div>
					<div class="addr-detail"><span>深圳市龙岗区布吉镇坂岗区布吉镇坂岗吉镇坂岗区岗区布吉镇坂岗区布吉镇坂岗区布吉镇坂岗区布吉镇坂田社区吉华路696号</span></div>
				</div>
			</div>
		</div>
		<div class="goods-items">
			<div>
				<div class="shop-name"><span>鲜果超市</span></div>
				<div class="goods-list">
					<div class="goods-img"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
					<div class="goods-info">
						<div>
							<div class="goods-name"><span>1商品名称商品名称商品名称品名称商品名称商品名称2</span></div>
							<div class="space-name">规格：红色;24G;红色;24G;红色;24G;红色;24G;</div>
							<div class="goods-price">
								<div><span>X2</span></div>
								<div>
									<span class="currency-sale-price">￥</span>
									<span class="money-sale-price">66666.66</span>
									<span style="font-size: 10px;color: gray;">&nbsp;￥<span style="text-decoration:line-through;">66666</span></span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="goods-list">
					<div class="goods-img"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
					<div class="goods-info">
						<div>
							<div class="goods-name"><span>1商品名称商品名称商品名称商品名称商品名称商品名称2</span></div>
							<div class="goods-price">
								<div><span>X2</span></div>
								<div>
									<span class="currency-sale-price">￥</span>
									<span class="money-sale-price">66666.66</span>
									<span style="font-size: 10px;color: gray;">&nbsp;￥<span style="text-decoration:line-through;">66666</span></span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style="border-bottom: 1px solid #f0f0f0;height: 20px;"></div>
				<div class="title title-first">
					<div class="title-p"><span>商品总价</span></div>
					<div class="title-sub">
						<span class="currency-goods-all">￥</span>
						<span class="money-goods-all">66.66</span>
					</div>
				</div>
				<div class="vant-div">
					<!-- 红包单元格 -->
					<van-coupon-cell :coupons="hongbaos" :chosen-coupon="chosenHongbao" @click="showListHongbao = true" title="红包" />
					<!-- 红包列表 -->
					<van-popup v-model="showListHongbao" round position="bottom" style="height: 90%; padding-top: 4px;">
						<van-coupon-list
							:coupons="hongbaos"
							:chosen-coupon="chosenHongbao"
							:disabled-coupons="disabledHongbao"
							@change="onChangeHongbao"
							@exchange="onExchangeHongbao"
							input-placeholder="请输入红包码"
							close-button-text="不使用红包券"
							enabled-title="可用"
							disabled-title="不可用"
						/>
					</van-popup>
				</div>
				<div class="vant-div">
					<!-- 优惠券单元格 -->
					<van-coupon-cell :coupons="coupons" :chosen-coupon="chosenCoupon" @click="showListCoupon = true" />
					<!-- 优惠券列表 -->
					<van-popup v-model="showListCoupon" round position="bottom" style="height: 90%; padding-top: 4px;">
						<van-coupon-list
							:coupons="coupons"
							:chosen-coupon="chosenCoupon"
							:disabled-coupons="disabledCoupons"
							@change="onChangeCoupon"
							@exchange="onExchangeCoupon"
						/>
					</van-popup>
				</div>
				<div class="title">
					<div class="title-p"><span>邮费/配送费/自取费</span></div>
					<div class="title-sub">
						<span class="currency-other">￥</span>
						<span class="money-other">0.00</span>
					</div>
				</div>
				<div class="user-remark">
					<div><input placeholder="订单备注" /></div>
				</div>
				<div class="vant-div vant-read">
					<van-collapse v-model="activeName" accordion><van-collapse-item title="下单必看" name="1">内容</van-collapse-item></van-collapse>
				</div>
			</div>
		</div>
		<div class="advice"><span>如收到的商品出现质量、错发、漏发等问题，请联系客服处理</span></div>
		<div style="height: 55px; width: 100%;"></div>
		<div class="foot-btn">
			<div class="order-price-div">
				<span>
					<span>实付：</span>
					<span class="currency">￥</span>
					<span class="money">66.66</span>
				</span>
			</div>
			<div><span class="to-pay">去下单</span></div>
		</div>
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
export default {
	components: { Head: Head },
	data() {
		return {
			activeName: '0',
			title: '填写订单',
			orderList: [],
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
			showListHongbao: false // 红包
		};
	},
	methods: {
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
		}
	}
};
</script>

<style scoped>
.body-bg {
	border: none;
	margin: 0;
	padding: 0;
	font-size: 14px;
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
	padding: 10px 10px;
	margin: 10px 10px;
	border-radius: 10px;
	background-color: #ffffff;
	font-weight: normal;
	font-size: 14px;
	color: #464c5b;
	overflow: hidden;
}

.user-addr-div > div:last-child {
	position: relative;
}
.user-addr-div > div:last-child > div:first-child {
	text-align: center;
	font-size: 25px;
	color: #9ea7b4;
	position: absolute;
	top: 50%;
	left: 4%;
	transform: translate(-50%, -50%);
}

.user-addr-div > div:last-child > div:last-child {
	padding-left: 10%;
	line-height: 20px;
	font-size: 12px;
}
.user-info > div:first-child {
	padding: 3px 0;
}

.user-info > div:first-child > span:last-child {
	padding-left: 5px;
	color: #9ea7b4;
}

/* goods */
.shop-name {
	color: #008000;
	padding: 5px 0;
	margin-bottom: 10px;
	font-size: 14px;
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
.space-name{
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

.goods-info > div {
	padding-left: 8px;
}

.goods-price > div:first-child {
	float: left;
	font-size: 12px;
	color: #9ea7b4;
	width: 40%;
	position: absolute;
	bottom: 2px;
}

.goods-price > div:last-child {
	float: right;
	width: 60%;
	text-align: right;
	position: absolute;
	right: 0px;
	bottom: 2px;
}

.title-first {
	margin-top: 20px;
}

.title {
	color: #657180;
	font-size: 14px;
	padding: 10px 0;
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
	font-weight: bold;
}
.money-sale-price {
	font-size: 14px;
}
.money-other {
	font-size: 14px;
	font-weight: normal;
}
.money-goods-all {
	font-size: 14px;
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
	font-size: 14px;
	line-height: 30px;
}

.order-price-div {
	position: absolute;
	left: 0px;
}

.order-num {
	padding-bottom: 10px;
}

.order-detail > div {
	border-bottom: 1px solid #f0f0f0;
}

.user-remark input {
	border: none;
	width: 100%;
	padding: 5px 0;
	padding-left: 3px;
	border-bottom: 1px solid #c3cbd6;
}
.user-remark {
	padding: 8px 0;
}

.advice {
	color: #9ea7b4;
	font-size: 12px;
	text-align: center;
	padding: 0px 10px;
	margin-bottom: 30px;
	font-weight: normal;
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

.foot-btn > div > span {
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

.vant-read >>> .van-cell__title {
	color: #000000 !important;
}

>>> .van-cell {
	padding: 0 0;
	color: #657180;
	font-size: 14px;
}

>>> .van-button--plain,
.van-button--danger {
	color: #008000 !important;
}

>>> .van-coupon-list__bottom button {
	background-color: #008000 !important;
	background: #008000 !important;
	border: 1px solid #008000 !important;
}

>>> .van-coupon__head {
	color: #008000 !important;
}

>>> .van-coupon__amount {
	font-weight: bold !important;
}

>>> .van-coupon__amount {
	font-size: 25px;
}
>>> .van-tabs__line,
>>> .van-checkbox__icon--checked .van-icon {
	background-color: #008000 !important;
	background: #008000 !important;
	border: 1px solid #008000 !important;
}

>>> .van-coupon-cell--selected {
	color: #008000 !important;
}

>>> .van-collapse-item__content{
	font-size: 10px;
}
</style>
