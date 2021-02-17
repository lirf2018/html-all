<template>
	<div class="body-bg">
		<div class="center-head">
			<div class="user-img">
				<div><van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
				<div>昵称</div>
			</div>
			<div class="user-ql">
				<div class="jifen-div">
					<div>
						<span>积分</span>
						<span>100</span>
					</div>
				</div>
				<div class="ticket-div">
					<div>
						<span>优惠券</span>
						<span>10</span>
					</div>
				</div>
				<div class="cost-div">
					<div>
						<span>累计消费</span>
						<span>1000000.10 元</span>
					</div>
				</div>
			</div>
		</div>
		<div style="clear: both;"></div>
		<div>
			<van-cell-group><van-cell title="单元格" is-link value="查看全部订单" /></van-cell-group>
		</div>
		<div>
			<van-grid>
				<van-grid-item icon="pending-payment" text="待付款" />
				<van-grid-item icon="send-gift-o" text="待发货" />
				<van-grid-item icon="logistics" text="已发货" />
				<van-grid-item icon="sign" text="已完成" />
			</van-grid>
		</div>
		<div class="shop-cart">
			<div>
				<div>
					<van-cell-group><van-cell title="购物车" is-link /></van-cell-group>
				</div>
				<div class="cart-count"><span>10</span></div>
			</div>
		</div>
		<div>
			<van-cell-group><van-cell title="我的优惠券" is-link /></van-cell-group>
		</div>
		<!-- <div>
			<van-cell-group><van-cell title="我的优惠码" is-link /></van-cell-group>
		</div> -->
		<div>
			<van-cell-group><van-cell title="我的推广码" is-link /></van-cell-group>
		</div>
		<div>
			<van-cell-group><van-cell title="我的消息" is-link /></van-cell-group>
		</div>
		<div>
			<van-cell-group><van-cell title="绑定列表" is-link /></van-cell-group>
		</div>
		<div @click="toPage('userAddr')">
			<van-cell-group><van-cell title="收货地址管理" is-link /></van-cell-group>
		</div>
		<div @click="toPage('mySuggest')">
			<van-cell-group><van-cell title="建议和反馈" is-link /></van-cell-group>
		</div>
		<div class="exit-out" @click="toPage('accountLogin')"><van-button color="#008000" >退出</van-button></div>
		<div><Tbar tbActiveParent="3" /></div>
		<EG />
	</div>
</template>

<script>
import Tbar from '@/components/Bottom-bar.vue';
import EG from '@/components/EgMark.vue';
export default {
	components: { Tbar: Tbar, EG: EG },
	data() {
		return {
			tbActive: 3
		};
	},
	mounted:function(){
		
	},
	methods:{
		toPage(path){
			// 登出系统
			this.$router.push(path);
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
	font-size: 14px;
	color: #323233;
	font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
}
.user-img {
	text-align: center;
	padding: 38px 0 5px 0;
	background-color: #ffffff;
}
.user-ql {
	background-color: #ffffff;
	color: #969799;
	font-size: 14px;
	overflow: auto;
	text-align: center;
	margin-bottom: 10px;
}

.user-ql span {
	display: block;
}
.user-ql > div > div > span:first-child {
	color: #323233;
	padding: 15px 0 5px 0;
}
.user-ql > div > div {
	padding-bottom: 15px;
}
.jifen-div {
	float: left;
	width: 30%;
}
.ticket-div {
	float: left;
	width: 30%;
}
.cost-div {
	float: left;
	width: 40%;
}

.jifen-div > div,
.ticket-div > div {
	border-right: 1px solid #f0f0f0;
}

.user-img > div:last-child {
	padding-top: 10px;
}

.shop-cart {
	padding: 10px 0;
}

/**
 * 退出
 */
.exit-out {
	margin-top: 15px;
}

.van-button {
	border-radius: 20px !important;
	width: 100%;
}

.shop-cart > div {
	position: relative;
}

.cart-count {
	background-color: #008000;
	color: #ffffff;
	height: 15px;
	line-height: 15px;
	font-size: 12px;
	border-radius: 50px;
	position: absolute;
	right: 35px;
	bottom: 12px;
	padding: 2px 2px;
}
</style>
