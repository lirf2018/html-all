<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="classfy-contents">
			<van-row>
				<van-col span="6">
					<div class="left-main" ref="ratingsmain" :style="myStyle" id="scrollDiv">
						<van-sidebar v-model="activeKey" @change="onchange">
							<div ref="lItem" v-for="(item, index) in menuList" :key="index">
								<van-sidebar-item :style="{ color: item.menuId == onclickMenu ? '#008000' : '' }" :title="item.menuId + item.menuName" />
							</div>
						</van-sidebar>
					</div>
				</van-col>
				<van-col span="18" class="ratings-main-col">
					<div class="ratings-main" ref="ratingsmain" :style="myStyle">
						<div>
							<div v-for="(item, index) in menuList" :key="index" class="goods-list" ref="vansticky">
								<div ref="rItem">
									<div class="second-tab-name">
										<span>{{ item.menuId + item.menuName }}</span>
									</div>
									<div class="goods-items" v-for="g in item.goodsList" :key="g.goodsId">
										<div class="goods-img"><img :src="g.goodsImg" /></div>
										<div class="goods-contents">
											<span class="goods-name">{{ g.goodsname }}</span>
											<span class="goods-desc">{{ g.goodsDesc }}</span>
											<div class="price-div">
												<div class="price">
													<span class="goods-currency">￥</span>
													<span class="goods-price">{{ g.goodsPrice }}</span>
												</div>
												<div class="add-cart">
													<div v-if="g.userGoodsCount == 0" class="shop-cart" @click="onclickShopCart(item.menuId, g.goodsId)">
														<van-icon name="cart-circle-o" color="#008000;" />
													</div>
													<div v-if="g.userGoodsCount > 0">
														<van-stepper
															input-width="20px"
															button-size="12px"
															v-model="g.userGoodsCount"
															disable-input
															@change="onChangeGoods(item.menuId, g.goodsId)"
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
		<div><Tbar :tbActive="tbActive" /></div>
	</div>
</template>

<script>
import BScroll from 'better-scroll';
import Head from '@/components/Head.vue';
import Tbar from '@/components/Bottom-bar.vue';
export default {
	components: { Head: Head, Tbar: Tbar },
	data() {
		return {
			tbActive: 1,
			title: '商品分类',
			activeKey: 0,
			onclickMenu: 1,
			heightList: [], //保存每一个的高度,
			menuHeightList: [], //保存每一个菜单的高度
			showheight: 0, //内容高度
			menuList: [],
			myStyle: '',
			testId: 0
		};
	},
	created() {
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		this.showheight = h - 50 - 51;
		this.myStyle = 'height:' + this.showheight + 'px';
		this._Bscroll();

		//测试
		this.testPost();
	},
	mounted() {
		//增加滚动监听
		// window.addEventListener('scroll', this.handleScroll);
		// this.$refs.Box.addEventListener('scroll', this.handleScroll);
	},
	methods: {
		onchange(index) {
			this.onclickMenu = this.menuList[index].menuId;
			this.scroll.scrollToElement(this.$refs.vansticky[index], 100, 0, 0);
		},
		getHeight() {
			// 获取每一个li的高度
			const lis = this.$refs.rItem;
			// 获取p标签的高度  这里想错，应该把上面的标题也列入进去
			/* const heightp = this.$refs.vansticky
		heightp.forEach(item => {
		  //console.log(item.clientHeight)
		}) */
			// console.log(heightp.offsetHeight)
			// heightList的第一个元素为0
			let height = 0;
			this.heightList.push(height);
			// 之后的高度即为当前li的高度加上之前面li的高度和
			lis.forEach(item => {
				height += item.clientHeight;
				this.heightList.push(height);
				// console.log(this.heightList)
			});

			//菜单
			height = 0;
			this.menuHeightList.push(height);
			const list = this.$refs.lItem;
			list.forEach(item => {
				height += item.clientHeight;
				this.menuHeightList.push(height);
				// console.log(this.heightList)
			});
		},
		_Bscroll() {
			this.$nextTick(() => {
				// if (this.goods) {
				this.scroll = new BScroll(this.$refs.ratingsmain, {
					click: true,
					probeType: 3
				});
				// }
				this.scroll.on('scroll', res => {
					// console.log(res)
					this.scrollY = Math.abs(res.y);
					// // console.log(res.y)
					this.scrolly = res.y;
					this.getHeight();
					this.currentIndex();
					var div = document.getElementById('scrollDiv');

					//可视范围   0 < y < this.showheight

					// div.scrollTop = div.scrollHeight;
					// console.log(this.activeKey + '======' + this.menuHeightList[this.activeKey] + '===可见：' + this.showheight);
					// div.scrollTop = this.showheight;
					// console.log("===6==="+this.showheight)
					if (this.menuHeightList[this.activeKey] > (this.showheight - this.menuHeightList[1])) {
						div.scrollTop = this.menuHeightList[this.activeKey] - this.menuHeightList[2];
					} else {
						div.scrollTop = 0;
					}
				});
			});
		},
		currentIndex() {
			for (let i = -1; i < this.heightList.length; i++) {
				const height1 = this.heightList[i];
				const height2 = this.heightList[i + 1];
				if (this.scrollY < height2 && this.scrollY >= height1) {
					return i;
				}
				// 通过打印的控制台信息，，然后进行调试，我也不知道为啥第一个默认不出来，难搞
				this.activeKey = i + 1;
				this.onclickMenu = this.menuList[this.activeKey].menuId;
				// console.log(i)
			}
		},
		onChangeGoods(menuId, goodsId) {
			this.menuList.forEach(function(e) {
				if (menuId == e.menuId) {
					e.goodsList.forEach(function(e) {
						if (e.goodsId == goodsId) {
							console.log('--当前商品' + goodsId + '数量--' + e.userGoodsCount);
						}
					});
				}
			});
		},
		onclickShopCart(menuId, goodsId) {
			this.menuList.forEach(function(e) {
				if (menuId == e.menuId) {
					e.goodsList.forEach(function(e) {
						if (e.goodsId == goodsId) {
							e.userGoodsCount = 1;
						}
					});
				}
			});
		},
		testPost() {
			let goodsList = [];
			for (let i = 0; i < 10; i++) {
				this.testId = this.testId + 1;
				var data = {
					goodsId: this.testId + '-' + this.testId,
					goodsname: '苹果水果新鲜当季水果丑苹果整箱10斤现季山西冰糖心红富士带一十',
					goodsDesc:
						'皮薄，口感特别好。果肉细腻，看的出是新鲜采摘下来的，个子很大个，包装严实，没有坏果，皮薄肉厚，水分充足，好吃还不贵，苹果红红的，看着就很新鲜，苹果闻起来也是香气十足，颜色鲜艳好看，脆爽可口，汁多皮薄，味道极好。果子都很新鲜香味扑鼻个个都是熟透的香甜可口的大苹果。',
					userGoodsCount: 0,
					goodsPrice: '30.23',
					goodsImg: 'https://img.yzcdn.cn/vant/apple-2.jpg'
				};
				goodsList.push(data);
			}

			this.menuList = [
				{
					menuId: 1,
					menuName: '新鲜蔬菜',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 2,
					menuName: '果饮冲调',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 3,
					menuName: '休闲零食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 4,
					menuName: '海鲜水产',
					isdisabled: true,
					goodsList: []
				},
				{
					menuId: 5,
					menuName: '快手美食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 6,
					menuName: '休闲零食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 7,
					menuName: '海鲜水产',
					isdisabled: true,
					goodsList: goodsList
				},
				{
					menuId: 8,
					menuName: '快手美食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 9,
					menuName: '休闲零食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 10,
					menuName: '海鲜水产',
					isdisabled: true,
					goodsList: goodsList
				},
				{
					menuId: 11,
					menuName: '快手美食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 12,
					menuName: '休闲零食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 13,
					menuName: '海鲜水产',
					isdisabled: true,
					goodsList: goodsList
				},
				{
					menuId: 14,
					menuName: '快手美食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 15,
					menuName: '休闲零食',
					isdisabled: false,
					goodsList: goodsList
				},
				{
					menuId: 16,
					menuName: '海鲜水产',
					isdisabled: true,
					goodsList: goodsList
				},
				{
					menuId: 17,
					menuName: '快手美食',
					isdisabled: false,
					goodsList: goodsList
				}
			];
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
.left-main {
	overflow-y: scroll;
	overflow-x: hidden;
}
.ratings-main {
	overflow: hidden;
}
.van-sidebar-item--select {
	border-color: #008000 !important;
}

/**
 * goods-item
 */
.goods-list {
	padding: 0px 10px;
	background-color: #ffffff;
}

.second-tab-name {
	padding: 15px 0 5px 0;
	margin-bottom: 8px;
	color: #464c5b;
	font-size: 14px;
	border-bottom: 1px solid #f0f0f0;
}

.goods-list > .goods-items:not(:last-child) {
	border-bottom: 1px solid #ebedf0;
}

.goods-items {
	overflow: hidden;
	font-size: 14px;
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
	font-size: 1.4rem;
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
