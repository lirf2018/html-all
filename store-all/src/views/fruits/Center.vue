<template>
	<div class="body-bg">
		<div v-if="data != null">
			<div class="center-head">
				<div class="user-img">
					<div>
						<van-image round width="7rem" height="7rem" :src="data.user_img" />
					</div>
					<div>{{data.nick_name}}</div>
				</div>
				<div class="user-ql">
					<div class="jifen-div">
						<div @click="toPage('/myJifen')">
							<span>积分</span>
							<!-- <span>敬请期待</span> -->
							<span>{{data.user_jifen}}</span>
						</div>
					</div>
					<div class="ticket-div">
						<div>
							<span>优惠券</span>
							<span>敬请期待</span>
						</div>
					</div>
					<div class="cost-div">
						<div>
							<span>累计消费</span>
							<span>{{data.order_price_all}}</span>
						</div>
					</div>
				</div>
			</div>
			<div style="clear: both;"></div>
			<div @click="toPage('/orderList')">
				<van-cell-group>
					<van-cell title="" is-link value="查看全部订单" />
				</van-cell-group>
			</div>
			<div>
				<van-grid>
					<van-grid-item icon="pending-payment" text="待付款" @click="toOrderListOne(0)"
						:badge="data.order_dfk" />
					<van-grid-item icon="send-gift-o" text="确认中" @click="toOrderListOne(2)" :badge="data.order_qrz" />
					<van-grid-item icon="send-gift-o" text="待收货" @click="toOrderListOne(5)" :badge="data.order_dsh" />
					<van-grid-item icon="sign" text="退款/退货" @click="toOrderListOne(6)" :badge="data.order_ywc" />
				</van-grid>
			</div>
			<div class="shop-cart" @click="toPage('/shopCart')">
				<div>
					<div>
						<van-cell-group>
							<van-cell title="购物车" is-link />
						</van-cell-group>
					</div>
					<div class="cart-count"><span>{{data.cart_goods_count}}</span></div>
				</div>
			</div>
			<div>
				<!-- 对固定会员一次下单，多次不同时间配送场景 -->
				<van-cell-group>
					<van-cell title="定制果园" is-link />
				</van-cell-group>
			</div>
			<div @click="toPage('tuiGuang')">
				<van-cell-group>
					<van-cell title="我的推广码" is-link />
				</van-cell-group>
			</div>
			<!-- <div @click="toPage('userAddr')">
				<van-cell-group>
					<van-cell title="收入记录" is-link />
				</van-cell-group>
			</div> -->
			<!-- <div @click="toPage('userAddr')">
				<van-cell-group>
					<van-cell title="收货地址管理" is-link />
				</van-cell-group>
			</div> -->
			<!-- <div>
				<van-cell-group>
					<van-cell title="我的优惠券" is-link />
				</van-cell-group>
			</div> -->
			<!-- <div>
				<van-cell-group><van-cell title="我的优惠码" is-link /></van-cell-group>
			</div> -->
			<div @click="toPage('bangList')">
				<van-cell-group>
					<van-cell title="我的绑定" is-link />
				</van-cell-group>
			</div>
			<!-- <div>
				<van-cell-group>
					<van-cell title="我的消息" is-link />
				</van-cell-group>
			</div> -->
			<div @click="toPage('mySuggest')">
				<van-cell-group>
					<van-cell title="建议和反馈" is-link />
				</van-cell-group>
			</div>
			<div class="exit-out" @click="logOut('phoneLogin')">
				<van-button color="#008000">退出</van-button>
			</div>
			<div>
				<Tbar tbActiveParent="3" />
			</div>
		</div>
		<EG />
	</div>
</template>

<script>
	import Tbar from '@/components/Bottom-bar.vue';
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	import {
		mapMutations
	} from 'vuex';
	export default {
		components: {
			Tbar: Tbar,
			EG: EG
		},
		data() {
			return {
				tbActive: 3,
				data: null
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findUserCenter();
			});
		},
		methods: {
			...mapMutations(['userLoginOut']),
			logOut(path) {
				let vm = this;
				vm.userLoginOut({
					Authorization: ""
				});
				vm.$router.push(path);
			},
			toPage(path) {
				if (path == 'tuiGuang') {
					path = path + "?member=" + this.data.member_id;
				}
				this.$router.push(path);
			},
			toOrderListOne(status) {
				this.$router.push("orderListOne?orderStatus=" + status);
			},
			findUserCenter() {
				let vm = this;
				let params = {
					req_type: 'query_user_center',
					data: {
						user_id: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.data = res.data;
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
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.user-img {
		text-align: center;
		padding: 38px 0 15px 0;
		background-color: #008000;
		color: white;
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

	.user-ql>div>div>span:first-child {
		color: #323233;
		padding: 15px 0 5px 0;
	}

	.user-ql>div>div {
		/* padding-bottom: 15px; */
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

	.jifen-div>div,
	.ticket-div>div {
		border-right: 1px solid #f0f0f0;
	}

	.user-img>div:last-child {
		padding-top: 10px;
	}

	.shop-cart {
		padding: 10px 0;
	}

	/**
 * 退出
 */
	.exit-out {
		margin: 15px 30px;
	}

	.van-button {
		border-radius: 20px !important;
		width: 100%;
	}

	.shop-cart>div {
		position: relative;
	}

	.cart-count {
		background-color: #008000;
		color: #ffffff;
		height: 15px;
		width: 15px;
		text-align: center;
		line-height: 15px;
		font-size: 12px;
		border-radius: 50px;
		position: absolute;
		right: 35px;
		bottom: 12px;
		padding: 2px 2px;
	}

	>>>.van-button {
		height: 35px;
	}
</style>
