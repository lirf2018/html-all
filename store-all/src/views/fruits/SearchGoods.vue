<template>
	<div class="body-bg">
		<div class="search-head">
			<div class="search-btn">
				<van-search shape="round" background="#F2F2F2" v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch">
					<template #action>
						<div class="to-home" @click="onMain">
							<div><van-icon name="wap-home-o" size="25" /></div>
						</div>
					</template>
				</van-search>
			</div>
			<div class="search-type">
				<div @click="choseType(0)"><span :class="classType0">综合</span></div>
				<div @click="choseType(1)"><span :class="classType1">销量</span></div>
				<div @click="choseType(2)"><span :class="classType2">最新</span></div>
			</div>
			<div style="clear: both;"></div>
		</div>
		<div class="items-div">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
					<div class="items">
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
			</van-pull-refresh>
		</div>
		<EG />
	</div>
</template>

<script>
import EG from '@/components/EgMark.vue';
export default {
	components: { EG: EG },
	data() {
		return {
			value: '',
			goodsList: [],
			loading: false,
			finished: false,
			refreshing: false,
			classType0: 'activate',
			classType1: '',
			classType2: ''
		};
	},
	methods: {
		onSearch() {},
		onMain() {
			//返回Mian页
			this.$toast('666');
		},
		onLoad() {
			setTimeout(() => {
				console.log('--------------');
				if (this.refreshing) {
					this.goodsList = [];
					this.refreshing = false;
				}

				for (let i = 0; i < 10; i++) {
					var goods = {
						goodsId: i,
						goodsName: '测试商品' + i,
						goodsImg: 'https://img.yzcdn.cn/vant/apple-1.jpg',
						goodsCount: i,
						goodsPrice: i + 0.01
					};
					this.goodsList.push(goods);
				}

				this.loading = false;

				if (this.goodsList.length >= 40) {
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
		choseType(type) {
			if (type == 1) {
				this.classType0 = '';
				this.classType1 = 'activate';
				this.classType2 = '';
			} else if (type == 2) {
				this.classType0 = '';
				this.classType1 = '';
				this.classType2 = 'activate';
			} else {
				this.classType0 = 'activate';
				this.classType1 = '';
				this.classType2 = '';
			}
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
.search-head {
	position: fixed;
	z-index: 999999999;
	width: 100%;
}
.to-home {
	color: #657180;
}

.van-search__action {
	line-height: 0px !important;
}

.search-type {
	border-bottom: 1px solid #f2f2f2;
	overflow: auto;
	background-color: #ffffff;
}
.search-type > div {
	float: left;
	width: 33.3%;
	text-align: center;
	padding: 15px 0;
	font-size: 14px;
}
.items-div {
	padding-top: 100px;
}
/**
 * goods-items
 */
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

.items {
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
	font-size: 12px;
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
.activate {
	color: #008000;
}

.van-search,.van-search--show-action{
	background: #FFFFFF !important;
	border-bottom: 1px solid #f0f0f0;
}

</style>
