<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="order-status">
			<div class="status"><span>待支付</span></div>
			<div class="order-msg">
				<span>
					<span>剩余支付时间为</span>
					<span class="close-time">08:59</span>
				</span>
			</div>
			<div class="status-remark"><span>15分钟后内未支付，订单将自动消失</span></div>
		</div>
		<div class="user-addr-div">
			<div>
				<div><span>订单状态</span></div>
				<div><span>待支付</span></div>
			</div>
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
							<div class="goods-price">
								<div><span>X2</span></div>
								<div>
									<span class="currency-sale-price">￥</span>
									<span class="money-sale-price">66666.66</span>
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
							<div class="space-name">规格：红色;24G;红色;24G;红色;24G;红色;24G;</div>
							<div class="goods-price">
								<div><span>X2</span></div>
								<div>
									<span class="currency-sale-price">￥</span>
									<span class="money-sale-price">66666.66</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="goods-all-price">
					<div><span>商品总价</span></div>
					<div>
						<span class="currency-goods-all">￥</span>
						<span class="money-goods-all">66.66</span>
					</div>
				</div>
				<div class="other-price">
					<div><span>红包</span></div>
					<div>
						<span>
							<span class="currency-other">-￥</span>
							<span class="money-other">0.00</span>
						</span>
					</div>
				</div>
				<div class="other-price">
					<div><span>邮费/配送费/自取费</span></div>
					<div>
						<span>
							<span class="currency-other">￥</span>
							<span class="money-other">0.00</span>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="order-price">
			<span>
				<span>实付：</span>
				<span class="currency">￥</span>
				<span class="money">66.66</span>
			</span>
		</div>
		<div class="order-detail">
			<div>
				<div class="order-num"><span>订单编号：20085554664643513546543212</span></div>
				<div><span>下单时间：2020-05-03 11:20:33</span></div>
				<div><span>取消时间：2020-05-03 11:20:33</span></div>
			</div>
		</div>
		<div class="advice"><span>如收到的商品出现质量、错发、漏发等问题，请联系客服处理</span></div>
		<div style="height: 55px; width: 100%;"></div>
		<div class="foot-btn">
			<div>
				<span class="to-pay">去支付</span>
				<span class="to-cancel">取消订单</span>
			</div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '订单详情',
			orderList: [],
			loading: false,
			finished: false,
			testOrderId: 0
		};
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

.user-addr-div > div:first-child {
	overflow: hidden;
	padding: 10px 0;
	border-bottom: 1px solid #f0f0f0;
	margin-bottom: 10px;
}

.user-addr-div > div:first-child > div:first-child {
	float: left;
	width: 50%;
	color: #9ea7b4;
}

.user-addr-div > div:first-child > div:last-child {
	float: right;
	width: 50%;
	text-align: right;
	color: #008000;
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
.space-name{
	font-size: 10px;
	color: gray;
	line-height: 14px;
}
.goods-img {
	float: left;
	width: 30%;
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

.goods-all-price,
.other-price {
	overflow: hidden;
	color: #657180;
	position: relative;
}

.goods-all-price > div:first-child,
.other-price > div:first-child {
	float: left;
	width: 50%;
	padding: 10px 0;
	font-size: 14px;
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

.goods-all-price > div:last-child,
.other-price > div:last-child {
	float: left;
	width: 100%;
	text-align: right;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.order-price > span > span:first-child {
	color: #464c5b;
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
.order-price {
	text-align: right;
}
.order-detail {
	background-color: #ffffff;
	color: #657180;
	font-size: 14px;
	line-height: 30px;
}
.advice {
	color: #9ea7b4;
	font-size: 12px;
	text-align: center;
	padding: 15px 0;
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
</style>
