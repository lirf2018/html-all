<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="classfy-contents">
			<div class="left-menu" :style="myStyle">
				<van-sidebar v-model="activeKey" @change="onChange">
					<van-sidebar-item :style="{'color':item.menuId == onclickClassifyId ?'#008000':''}" :index="item.menuId" :title="item.menuName" v-for="(item, index) in menuList" :disabled="item.isdisabled" :key="item.menuId" />
				</van-sidebar>
			</div>
			<div class="right-contents" :style="myStyle">
				<div>
					<div class="goods-list">
						<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
							<div class="goods-items" v-for="(item, index) in goodsList" :key="item.goodsId">
								<div class="goods-img"><img :src="item.goodsImg" /></div>
								<div class="goods-contents">
									<span class="goods-name">{{ item.goodsId }}{{ item.goodsname }}</span>
									<span class="goods-desc">{{ item.goodsDesc }}</span>
									<div class="price-div">
										<div class="price">
											<span class="goods-currency">￥</span>
											<span class="goods-price">{{ item.goodsPrice }}</span>
										</div>
										<div class="add-cart">
											<div v-if="item.userGoodsCount == 0" class="shop-cart" @click="onclickShopCart(item.goodsId)">
												<van-icon name="cart-circle-o" color="#008000;" />
											</div>
											<div v-if="item.userGoodsCount > 0">
												<van-stepper
													input-width="20px"
													button-size="12px"
													v-model="item.userGoodsCount"
													disable-input
													@change="onChangeGoods(item.goodsId)"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</van-list>
					</div>
				</div>
			</div>
		</div>
		<div><Tbar :tbActive="tbActive" /></div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
import Tbar from '@/components/Bottom-bar.vue';
export default {
	components: { Head: Head, Tbar: Tbar },
	data() {
		return {
			title: '商品分类',
			tbActive: 1,
			activeKey: 0,
			onclickClassifyId: 1,
			menuList: [],
			goodsList: [],
			loading: false,
			finished: false,
			myStyle: '',
			testGoodsId: 0
		};
	},
	created() {
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		this.myStyle = 'height:' + (h - 46 - 51) + 'px';
	},
	mounted() {
		this.menuList = [
			{
				menuId: 1,
				menuName: '1鲜蔬菜',
				isdisabled: false
			},
			{
				menuId: 2,
				menuName: '2饮冲调',
				isdisabled: false
			},
			{
				menuId: 3,
				menuName: '3闲零食',
				isdisabled: false
			},
			{
				menuId: 4,
				menuName: '4鲜水产',
				isdisabled: true
			},
			{
				menuId: 5,
				menuName: '5手美食',
				isdisabled: false
			},
			{
				menuId: 6,
				menuName: '6闲零食',
				isdisabled: false
			},
			{
				menuId: 7,
				menuName: '7鲜水产',
				isdisabled: true
			},
			{
				menuId: 8,
				menuName: '8手美食',
				isdisabled: false
			},
			{
				menuId: 9,
				menuName: '9闲零食',
				isdisabled: false
			},
			{
				menuId: 10,
				menuName: '10鲜水产',
				isdisabled: true
			},
			{
				menuId: 11,
				menuName: '11手美食',
				isdisabled: false
			}
		];
	},
	methods: {
		onChange(index) {
			console.log('===当前点击===' + this.menuList[index].menuId + ': ' + this.menuList[index].menuName);
			this.onclickClassifyId = this.menuList[index].menuId;
			this.goodsList.length = 0;
			this.testGoodsId = 0;
			this.loading = false;
			this.finished = false;
			this.onLoad();
		},
		onChangeGoods(goodsId) {
			this.goodsList.forEach(function(e) {
				if (e.goodsId == goodsId) {
					console.log('--当前商品' + goodsId + '数量--' + e.userGoodsCount);
				}
			});
		},
		onclickShopCart(goodsId) {
			this.goodsList.forEach(function(e) {
				if (e.goodsId == goodsId) {
					e.userGoodsCount = 1;
				}
			});
		},
		onLoad() {
			// 异步更新数据
			// setTimeout 仅做示例，真实场景中一般为 ajax 请求
			setTimeout(() => {
				//查询的商品分类标识
				console.log('-----查询的商品分类标识------' + this.onclickClassifyId);

				for (let i = 0; i < 10; i++) {
					this.testGoodsId = this.testGoodsId + 1;
					var data = {
						goodsId: this.onclickClassifyId + '-' + this.testGoodsId,
						goodsname: '苹果水果新鲜当季水果丑苹果整箱10斤现季山西冰糖心红富士带一十',
						goodsDesc:
							'皮薄，口感特别好。果肉细腻，看的出是新鲜采摘下来的，个子很大个，包装严实，没有坏果，皮薄肉厚，水分充足，好吃还不贵，苹果红红的，看着就很新鲜，苹果闻起来也是香气十足，颜色鲜艳好看，脆爽可口，汁多皮薄，味道极好。果子都很新鲜香味扑鼻个个都是熟透的香甜可口的大苹果。',
						userGoodsCount: 0,
						goodsPrice: '30.23',
						goodsImg: 'https://img.yzcdn.cn/vant/apple-2.jpg'
					};
					this.goodsList.push(data);
				}
				// 加载状态结束
				this.loading = false;

				// 数据全部加载完成
				if (this.goodsList.length >= 40) {
					this.finished = true;
				}
			}, 1000);
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
.van-sidebar-item--select {
	border-color: #008000 !important;
}

.van-sidebar{
	width: auto !important;
	text-align:center !important;
}

.left-menu {
	float: left;
	width: 25%;
	overflow-y: scroll;
	overflow-x: hidden;
}

.right-contents {
	float: left;
	width: 75%;
	background-color: #ffffff;
	overflow-y: scroll;
	overflow-x: hidden;
}
.right-contents > div {
	padding: 10px 10px;
}

/**
 * goods-item
 */
.goods-list > .goods-items:not(:last-child) {
	border-bottom: 1px solid #ebedf0;
}

.goods-items {
	overflow: hidden;
	color: #657180;
	height: 5.5rem;
	position: relative;
	padding: 7px 0;
}

.goods-img {
	float: left;
	width: 33%;
}

.goods-img > img {
	width: 5.5rem;
	height: 5.5rem;
}

.goods-contents {
	float: right;
	width: 67%;
	overflow: hidden;
}

.goods-contents > span {
	display: block;
}

.goods-name,
.goods-desc {
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 12px;
	padding-bottom: 5px;
	padding-left: 1.5rem;
}
.goods-name {
	color: #464c5b;
	font-size: 14px;
}

.price-div {
	padding: 0 5px;
	overflow: auto;
	width: 100%;
	margin-top: 15px;
	font-size: 0.5rem;
}

.price {
	float: left;
	width: 20%;
	position: absolute;
	bottom: 5px;
	padding-left: 15px;
}

.price > span {
	color: #008000;
}
.price > span:last-child {
	font-size: 16px;
	font-weight: bold;
}
.add-cart {
	float: right;
	text-align: right;
	padding-right: 8px;
	font-size: 20px;
	color: #464c5b !important;
	position: absolute;
	right: 0px;
	bottom: 11px;
}

.shop-cart {
	margin-top: 11px;
	position: absolute;
	bottom: -10px;
	right: 0px;
}
</style>
