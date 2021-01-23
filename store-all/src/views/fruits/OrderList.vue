<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="order-tab">
			<div>
				<van-tabs v-model="active" animated color="#008000" title-active-color="#008000" title-inactive-color="#657180" @change="onChange">
					<van-tab :title="item.statusName" v-for="(item, index) in tabList" :key="item.orderStatus"></van-tab>
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
							<span>{{ item.orderStatusName }}</span>
						</div>
					</div>
					<div class="order-contens" v-for="(goods, index) in item.goodsList">
						<div class="goods-list">
							<div class="goods-img"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
							<div class="goods-info">
								<div class="goods-name">
									<span>{{ goods.goodsName }}</span>
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
						<span>实付：</span>
						<span class="currency">￥</span>
						<span class="money">{{ item.orderPrice }}</span>
					</div>
					<div class="order-btn">
						<div><span>去支付</span></div>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '我的订单',
			active: 0,
			onClickOrderStatus: -1,
			tabList: [],
			orderList: [],
			loading: false,
			finished: false,
			testOrderId: 0
		};
	},
	created() {
		this.tabList = [
			{
				orderStatus: -1,
				statusName: '全部'
			},
			{
				orderStatus: 1,
				statusName: '待付款'
			},
			{
				orderStatus: 2,
				statusName: '待发货'
			},
			{
				orderStatus: 3,
				statusName: '已发货'
			}
		];
	},
	methods: {
		onChange(index) {
			console.log('----选中的标签-----' + index);
			this.onClickOrderStatus = this.tabList[index].orderStatus;
			this.orderList.length = 0;
			this.testOrderId = 0;
			this.loading = false;
			this.finished = false;
			this.onLoad();
		},
		onLoad() {
			// 异步更新数据
			// setTimeout 仅做示例，真实场景中一般为 ajax 请求
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					var goodsList = [];
					var orderCount = 0;
					var orderPrice = 0;
					for (let j = 0; j < 2; j++) {
						var goodsSalePrice = 0.1 + j;
						var goods = {
							goodsId: j,
							goodsName: this.active + '苹果水果新鲜当季水果丑苹果整箱10斤现季山西冰糖心红富士带一十',
							goodsSalePrice: goodsSalePrice,
							goodsCount: j + 1
						};
						orderCount = orderCount + (j + 1);
						orderPrice = orderPrice + goodsSalePrice * (j + 1);
						goodsList.push(goods);
					}
					this.testOrderId = this.testOrderId + 1;

					var orderStatus = -1;
					var orderStatusName = '待付款';

					var order = {
						orderId: this.testOrderId,
						createTime: '2020-05-03 15:02:43',
						orderStatusName: orderStatusName,
						orderStatus: orderStatus,
						orderCount: orderCount,
						orderPrice: orderPrice.toFixed(2),
						goodsList: goodsList
					};
					this.orderList.push(order);
				}

				// 加载状态结束
				this.loading = false;

				// 数据全部加载完成
				if (this.orderList.length >= 20) {
					this.finished = true;
				}
			}, 1000);
		}
	}
};
</script>

<style scoped>
.body-bg{
	border: none;
	line-height: 20px;
	background-color: #f8f8f8;
	margin: 0;
	padding: 0;
	font-size: 14px;
	color: #323233;
	font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
}
.order-tab {
	position: fixed;
	background-color: #f8f8f8;
	z-index: 99999999;
	width: 100%;
}

.order-tab > div {
	margin: 0px 5px;
}

.order-items {
	color: #464c5b;
	font-size: 14px;
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
	padding: 15px 0;
	color: #9ea7b4;
	border-bottom: 1px solid #f0f0f0;
}

.order-title > div:first-child {
	float: left;
	width: 70%;
	text-align: left;
}
.order-title > div:last-child {
	float: right;
	width: 30%;
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
.order-count > span {
	display: block;
}
.order-count > span:first-child {
	position: absolute;
	bottom: 5px;
}
.order-count > span:last-child {
	position: absolute;
	bottom: 5px;
	right: 100px;
}
.goods-price,.goods-name{
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
	padding: 18px 0;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
	margin-top: 5px;
}

.order-price .money {
	font-size: 16px;
}

.order-price > span:first-child {
	padding-right: 25px;
}

.order-btn {
	padding: 20px 0;
	overflow: hidden;
}

.order-btn > div {
	float: right;
	padding: 8px 15px;
	margin-left: 12px;
	border-radius: 10px;
	color: white;
	background-color: #008000;
}
</style>
