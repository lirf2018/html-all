<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="chose-classify">
			<div class="classify">
				<span>已选条件 ：</span>
				<span>{{ categoryName }}</span>
			</div>
			<div class="classify-cancel" @click="toAllGoods()"><span>取消</span></div>
		</div>
		<div style="height: 35px;"></div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="l-items">
				<div class="goods-item" v-for="(items, index) in goodsList" :key="index">
					<div @click="toGoodsDetailPage(items.goodsId, items.isSingle)">
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
								<span>{{ items.isSingle == 1 ? items.nowMoney : items.lowPrice }}</span>
							</div>
							<div class="kc">
								<span>已售 {{ items.sellCount }}</span>
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
import axios from '@/network/request.js';
export default {
	components: {
		Head: Head
	},
	data() {
		return {
			title: '全部水果',
			goodsList: [],
			loading: false,
			finished: false,
			refreshing: false,
			testGoodsId: 0,
			currePage: 1,
			categoryName: null,
			hasNext: false
		};
	},
	mounted: function() {},
	methods: {
		onLoad() {
			let vm = this;
			let { catogeryId } = vm.$route.query;
			let params = {
				req_type: 'query_goods_list',
				data: {
					currePage: vm.currePage,
					catogeryId: catogeryId,
					userId: 0
				}
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					let goodsList = res.data.goodsList;
					let hasNext = res.data.hasNext;
					vm.categoryName = res.data.categoryName;
					vm.initGoodsList(goodsList, hasNext);
					vm.currePage = vm.currePage + 1;
				} else {
				}
			});
		},
		initGoodsList(newGoodsList, hasNext) {
			let vm = this;
			setTimeout(() => {
				for (let i = 0; i < newGoodsList.length; i++) {
					vm.goodsList.push(newGoodsList[i]);
				}
				this.loading = false;
				if (hasNext == false) {
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
		},
		toGoodsDetailPage(goodsId, isSingle) {
			let url = '/goodsSku';
			if (isSingle == 1) {
				url = '/goodsSingle';
			}
			url = url + '?goodsId=' + goodsId;
			this.$router.push(url);
			//打开新页签
			//const page  = this.$router.resolve({path: url})
			//window.open(page.href,'_blank')
		},
		toAllGoods() {
			//查询全部商品
			this.$router.push('allGoodsList');
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

.chose-classify {
	position: fixed;
	z-index: 999999;
	width: 100%;
	background-color: #ffffff;
	color: #657180;
}

.classify,
.classify-cancel {
	padding: 10px 10px;
}

.classify {
	float: left;
}
.classify > span:last-child {
	color: #464c5b;
}
.classify-cancel {
	float: right;
}

.items {
	padding: 10px 10px;
	height: 100%;
	padding-bottom: 0px;
	padding-top: 50px;
}

.goods-item {
	float: left;
	width: 50%;
	text-align: center;
	color: #3c3c3c;
	padding-bottom: 8px;
}

.goods-item > div:first-child {
	margin: 0 5px;
	padding: 8px 0;
	border: 1px solid #c3cbd6;
	background-color: #ffffff;
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
