<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="order-tab">
			<div>
				<van-tabs v-model="active" animated color="#008000" title-active-color="#008000"
					title-inactive-color="#657180" @change="onChange">
					<van-tab :title="item.statusName" v-for="(item, index) in tabList" :key="item.orderStatus">
					</van-tab>
				</van-tabs>
			</div>
		</div>
		<div style="clear: both;height: 43px;width: 100%;"></div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="order-items" v-for="(item, index) in orderList" :key="item.orderId">
				<div class="order-info">
					<div class="order-title">
						<div>
							<span>{{ item.createTime }}</span>
						</div>
						<div>
							<span v-if="item.orderStatus ==2 && item.realPrice>0 ">已付款--></span>
							<span>{{ item.orderStatusName }}</span>
						</div>
					</div>
					<div class="order-contens" v-for="(goods, index) in item.goodsList" @click="toPage(item.orderId)">
						<div class="goods-list">
							<div class="goods-img"><img :src="goods.goodsImg" /></div>
							<div class="goods-info">
								<div class="goods-name">
									<span>{{ goods.goodsName }}</span>
									<div style="padding-top: 2px;" v-if="goods.goodsSpecName != ''">
										<span style="color: gray;">规格：{{ goods.goodsSpecName }}</span>
									</div>
								</div>
								<div class="order-count">
									<span class="goods-price">
										<span class="currency">￥</span>
										<span class="money">{{ goods.goodsSalePrice }}</span>
									</span>
									<span>x{{ goods.goodsCount }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="order-price">
						<span>商品数量：{{ item.orderCount }}</span>
						<span v-if="item.orderPrice >= item.realPrice">总价：{{ item.orderPrice }}&nbsp;&nbsp;&nbsp;</span>
						<span>实付：</span>
						<span class="currency">￥</span>
						<span class="money">{{ item.realPrice }}</span>
					</div>
					<div class="order-btn">
						<div v-if="item.orderStatus == 0"><span>去支付</span></div>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head
		},
		data() {
			return {
				title: '我的订单',
				active: 0,
				onClickOrderStatus: -1,
				tabList: [],
				orderList: [],
				// 分页
				loading: false,
				finished: false,
				refreshing: false,
				currePage: 1,
				hasNext: true
			};
		},
		created() {
			this.tabList = [{
					orderStatus: -1,
					statusName: '全部'
				},
				{
					orderStatus: 0,
					statusName: '待付款'
				},
				{
					orderStatus: 2,
					statusName: '确认中'
				},
				{
					orderStatus: 5,
					statusName: '待收货'
				}
			];
		},
		methods: {
			toPage(orderId) {
				// 登出系统
				this.$router.push("orderDetail?orderId=" + orderId);
			},
			onChange(index) {
				this.onClickOrderStatus = this.tabList[index].orderStatus;
				console.log('----选中的标签-----' + index + " this.onClickOrderStatus=" + this.onClickOrderStatus);
				this.orderList.length = 0;
				this.loading = false;
				this.finished = false;
				this.currePage = 1,
					this.hasNext = true;
				this.onLoad();
			},
			onLoad() {
				let vm = this;
				let params = {
					req_type: 'query_order_list',
					data: {
						curre_page: vm.currePage,
						user_id: 0,
						status: vm.onClickOrderStatus
					}
				}; // 参数
				this.loading = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let orderList = res.data.order_list;
							let hasNext = res.data.has_next;
							vm.initOrderList(orderList, hasNext)
							vm.currePage = vm.currePage + 1;
						} else {
							Toast(res.resp_desc);
						}
					})
					.catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			initOrderList(orderList, hasNext) {
				let vm = this;
				// 异步更新数据
				// setTimeout 仅做示例，真实场景中一般为 ajax 请求
				// setTimeout(() => {
				for (let i = 0; i < orderList.length; i++) {
					var goodsList = [];
					var orderCount = orderList[i].order_count;
					var realPrice = orderList[i].real_price;
					for (let j = 0; j < orderList[i].detail_list.length; j++) {
						var goods = {
							goodsId: orderList[i].detail_list[j].goods_id,
							goodsName: orderList[i].detail_list[j].goods_name,
							goodsSalePrice: orderList[i].detail_list[j].sale_money,
							goodsCount: orderList[i].detail_list[j].goods_count,
							goodsSpecName: orderList[i].detail_list[j].goods_spec_name,
							goodsImg: orderList[i].detail_list[j].goods_img
						};
						goodsList.push(goods);
					}

					var orderStatus = orderList[i].order_status;
					var orderStatusName = orderList[i].order_status_name;

					var order = {
						orderId: orderList[i].order_id,
						createTime: orderList[i].order_time,
						orderStatusName: orderStatusName,
						orderStatus: orderStatus,
						orderCount: orderCount,
						realPrice: realPrice,
						orderPrice: orderList[i].order_price,
						goodsList: goodsList
					};
					this.orderList.push(order);
				}
				this.loading = false;
				if (hasNext == false) {
					this.finished = true;
				}
				// }, 1000);
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		line-height: 15px;
		background-color: #f8f8f8;
		margin: 0;
		padding: 0;
		font-size: 12px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.order-tab {
		position: fixed;
		background-color: #f8f8f8;
		z-index: 99999999;
		width: 100%;
	}

	.order-tab>div {
		margin: 0px 5px;
	}

	.order-items {
		color: #464c5b;
		font-size: 12px;
		background-color: #ffffff;
		margin: 10px 10px 0 10px;
		overflow: hidden;
		border-radius: 15px;
	}

	.order-info {
		padding: 0 10px;
		background-color: #ffffff;
	}

	.order-title {
		overflow: auto;
		padding: 8px 0;
		color: #9ea7b4;
		border-bottom: 1px solid #f0f0f0;
	}

	.order-title>div:first-child {
		float: left;
		width: 60%;
		text-align: left;
	}

	.order-title>div:last-child {
		float: right;
		width: 40%;
		text-align: right;
		color: #008000;
	}

	.order-contens {
		overflow: auto;
	}

	.goods-list {
		padding: 10px 0;
		position: relative;
		overflow: hidden;
	}

	.goods-img {
		float: left;
		width: 5rem;
		height: 5rem;
		margin-right: 5px;
	}

	.goods-img img {
		width: 100%;
		height: 100%;
	}

	.goods-info {
		margin-left: 5rem;
	}

	.order-count {
		position: absolute;
		width: 100%;
		bottom: 1px;
	}

	.order-count>span {
		display: block;
	}

	.order-count>span:first-child {
		position: absolute;
		bottom: 5px;
	}

	.order-count>span:last-child {
		position: absolute;
		bottom: 5px;
		right: 100px;
	}

	.goods-price,
	.goods-name {
		padding-left: 10px;
	}

	.goods-price,
	.currency,
	.money {
		color: #008000;
		font-weight: bold;
		font-size: 12px;
	}

	.money {
		font-size: 14px;
	}

	.order-price {
		overflow: hidden;
		text-align: right;
		padding: 8px 0;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;
		margin-top: 5px;
	}

	.order-price .money {
		font-size: 16px;
	}

	.order-price>span:first-child {
		padding-right: 25px;
	}

	.order-btn {
		padding: 5px 0;
		overflow: hidden;
	}

	.order-btn>div {
		float: right;
		padding: 8px 15px;
		margin-left: 12px;
		border-radius: 10px;
		color: white;
		background-color: #008000;
	}
</style>
