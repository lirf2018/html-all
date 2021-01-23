<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="l-items">
				<div class="goods-item" v-for="(items, index) in goodsList" :key="index">
					<div>
						<div class="goods-img">
							<div>
								<div><img :src="items.goodsImg" /></div>
							</div>
						</div>
						<div class="goods-name">
							<span>{{ items.goodsName }}</span>
						</div>
						<div class="price-div">
							<div class="price">
								<span>￥</span>
								<span>{{ items.goodsPrice }}</span>
							</div>
							<div class="kc">
								<span>库存 {{ items.goodsCount }}</span>
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
				</div>
				<div style="clear: both;"></div>
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
			title: '全部水果',
			goodsList: [],
			loading: false,
			finished: false,
			refreshing: false,
			testGoodsId: 0
		};
	},
	mounted: function() {},
	methods: {
		onLoad() {
			setTimeout(() => {
				for (let i = 0; i < 10; i++) {
					this.testGoodsId = this.testGoodsId + 1;
					var goods = {
						goodsId: this.testGoodsId,
						goodsName: '465798测试商品商品商品' + this.testGoodsId,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-1.jpg',
						goodsCount: i,
						goodsPrice: i + 0.01
					};
					this.goodsList.push(goods);
				}

				this.loading = false;

				if (this.goodsList.length >= 20) {
					this.finished = true;
				}
			}, 1000);
		},
		onRefresh() {
			// 清空列表数据
			this.finished = false;

			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			this.loading = true;
			this.onLoad();
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

.goods-item {
	float: left;
	width: 50%;
	text-align: center;
	font-size: 14px;
	color: #3c3c3c;
	padding-bottom: 8px;
}

.goods-item > div:first-child {
	margin: 0 5px;
	padding: 8px 0;
	border: 1px solid #c3cbd6;
}

.l-items {
	padding: 10px 10px;
	height: 100%;
	padding-bottom: 0px;
}
/* 奇数行  */
.goods-img > div {
	padding: 0 5px;
}

.goods-img img {
	width: 100%;
	height: auto;
}
.goods-name {
	text-align: left;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	/* overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical; */
	padding: 5px 10px;
}
.price-div {
	padding: 0px 10px;
	clear: both;
}
.price {
	color: #008000;
	font-weight: bold;
	float: left;
	width: 50%;
	text-align: left;
}
.price > span:last-child {
	font-size: 16px;
}

.kc {
	text-align: right;
	float: right;
	font-size: 12px;
	color: #657180;
}
</style>
