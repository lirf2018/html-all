<template>
	<div class="body-bg">
		<!-- <div class="search"><van-search shape="round" background="#008000" placeholder="请输入搜索关键词" /></div> -->
		<div class="search">
			<van-search v-model="goodsName" placeholder="请输入搜索关键词" shape="round" background="#008000"
				@search="onSearch" />
		</div>
		<div style="height: 44px;"></div>
		<div class="banner-list">
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(bannel, index) in bannelList" :key="index"><img :src="bannel.banner_img"
						@click="toPageUrl(bannel.banner_link)" /></van-swipe-item>
			</van-swipe>
		</div>
		<!-- <div class="ticket">
			<div class="ticket-detail">
				<span>
					<div>
						<span>5</span>
						<span>元</span>
					</div>
					<div>满29.00可用</div>
				</span>
			</div>
			<div class="ticket-detail">
				<span>
					<div>
						<span>15</span>
						<span>元</span>
					</div>
					<div>满29.00可用</div>
				</span>
			</div>
		</div> -->
		<div class="volume" v-if="newsInfo && newsInfo != null">
		<!-- <div class="volume"> -->
			<van-notice-bar :text="newsInfo" left-icon="volume-o" color="#008080" />
		</div>
		<div class="">
			<div>
				<van-grid>
					<!-- <van-grid-item icon="home-o" text="所有水果" />
					<van-grid-item icon="home-o" text="所有水果" />
					<van-grid-item icon="home-o" text="所有水果" />
					<van-grid-item icon="home-o" text="所有水果" />
					<van-grid-item icon="home-o" text="所有水果" />
					<van-grid-item icon="home-o" text="所有水果" /> -->
					<van-grid-item :icon="item.menuImg" :text="item.menuName" v-for="(item, index) in mainMenu"
						:to="item.menuUrl" :key="index" />
				</van-grid>
			</div>
		</div>
		<div class="activity" v-if="activity1 != null"><img :src="activity1.activity_img"
				@click="toPageUrl(activity1.activity_link)" /></div>
		<div class="goods-list">
			<div class="goods-item" v-for="(item, index) in newGoodsList" :key="index">
				<div class="goods-item-detail">
					<div class="goods-item-img">
						<div><img :src="item.goods_img" /></div>
						<div></div>
					</div>
					<div class="goods-item-info">
						<!-- <div><span>优惠</span></div> -->
						<div class="goods-item-name">
							<span>{{ item.goods_name }}</span>
						</div>
					</div>
					<div class="goods-item-price-div">
						<div class="goods-item-price">
							<span>￥</span>
							<span>{{ item.now_money }}</span>
						</div>
						<div class="goods-item-go"
							@click="toGoodsDetailPage(item.goods_id, item.is_single,item.time_goods_id)">
							<span>去看看</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<div class="activity2" v-if="activity2 != null || activity3 != null">
			<img v-if="activity2 != null" :src="activity2.activity_img" @click="toPageUrl(activity2.activity_link)" />
			<img v-if="activity3 != null" :src="activity3.activity_img" @click="toPageUrl(activity3.activity_link)" />
		</div>
		<div class="goods-item2" v-for="(item, index) in weightGoodsList" :key="index">
			<div style="clear: both;"></div>
			<div class="goods-item2-img">
				<span><img :src="item.goods_img" /></span>
			</div>
			<div class="goods-item2-info">
				<div class="goods-item2-name">{{ item.goods_name }}</div>
				<div class="goods-item2-price-dev">
					<div class="goods-item2-price">
						<span>￥</span>
						<span>{{ item.now_money }}</span>
					</div>
					<div class="goods-item2-buy"
						@click="toGoodsDetailPage(item.goods_id, item.is_single,item.time_goods_id,item.time_goods_id)">
						<span>去购买</span>
					</div>
				</div>
			</div>
		</div>
		<div class="activity" v-if="activity4 != null"><img :src="activity4.activity_img"
				@click="toPageUrl(activity4.activity_link)" /></div>
		<div class="goods-list">
			<div class="goods-item" v-for="(item, index) in hotGoodsList" :key="index">
				<div class="goods-item-detail">
					<div class="goods-item-img">
						<div><img :src="item.goods_img" /></div>
						<div></div>
					</div>
					<div class="goods-item-info">
						<!-- <div><span>优惠</span></div> -->
						<div class="goods-item-name">
							<span>{{ item.goods_name }}</span>
						</div>
					</div>
					<div class="goods-item-price-div">
						<div class="goods-item-price">
							<span>￥</span>
							<span>{{ item.now_money }}</span>
						</div>
						<div class="goods-item-go"
							@click="toGoodsDetailPage(item.goods_id, item.is_single,item.time_goods_id)">
							<span>去看看</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style="clear: both;height: 10px;"></div>
		<div class="activity2">
			<img v-if="activity5 != null" :src="activity5.activity_img" @click="toPageUrl(activity5.activity_link)" />
			<img v-if="activity6 != null" :src="activity6.activity_img" @click="toPageUrl(activity6.activity_link)" />
		</div>
		<div style="clear: both;"></div>
		<van-divider :style="{ color: '#ADADAD', borderColor: '#ADADAD', padding: '0 16px' }">我是有底线的</van-divider>
		<div>
			<Tbar tbActiveParent="0" />
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
	export default {
		components: {
			Tbar: Tbar,
			EG: EG
		},
		data() {
			return {
				goodsName: '',
				cartCount: 0,
				mainMenu: [],
				bannelList: [],
				newGoodsList: [],
				hotGoodsList: [],
				timeGoodsList: [],
				weightGoodsList: [],
				newsInfo: null,
				activity1: null,
				activity2: null,
				activity3: null,
				activity4: null,
				activity5: null,
				activity6: null
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findBannelAndActivity();
			});
			this.$nextTick(function() {
				this.findMenus();
			});
		},
		methods: {
			findMenus() {
				let vm = this;
				let params = {
					req_type: 'main_menu',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.mainMenu = res.data.list;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			onSearch() {
				let url = '/classifyAllGoodsList?goodsName=' + this.goodsName;
				this.$router.push(url);
			},
			toGoodsDetailPage(goodsId, isSingle, timeGoodsId) {
				let url = '/goodsSku';
				if (isSingle == 1) {
					url = '/goodsSingle';
				}
				url = url + '?goodsId=' + goodsId + "&timeGoodsId=" + timeGoodsId;
				this.$router.push(url);
				//打开新页签
				//const page  = this.$router.resolve({path: url})
				//window.open(page.href,'_blank')
			},
			findBannelAndActivity() {
				let vm = this;
				let params = {
					req_type: 'main',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						// 资讯
						// 活动
						let activitys = res.data.activity_list;
						vm.activityMethod(activitys);
						// bannel
						vm.bannelList = res.data.banner_list;
						// 推荐商品
						vm.weightGoodsList = res.data.weight_goods_list;
						// 最新商品
						vm.newGoodsList = res.data.new_goods_list;
						// 热门商品
						vm.hotGoodsList = res.data.hot_goods_list;
						//限时商品
						vm.timeGoodsList = res.data.time_goods_list;
						// 通知
						vm.newsInfo = res.data.news_info;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			findGoods() {},
			activityMethod(activitys) {
				let vm = this;
				if (activitys.length > 0) {
					vm.activity1 = activitys[0];
				}
				if (activitys.length > 1) {
					vm.activity2 = activitys[1];
				}
				if (activitys.length > 2) {
					vm.activity3 = activitys[2];
				}
				if (activitys.length > 3) {
					vm.activity4 = activitys[3];
				}
				if (activitys.length > 4) {
					vm.activity5 = activitys[4];
				}
				if (activitys.length > 5) {
					vm.activity6 = activitys[5];
				}
			},
			toPageUrl(url) {
				if (url == null || url == '') {
					return;
				}
				this.$router.push(url);
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

	.my-swipe .van-swipe-item {
		text-align: center;
	}

	.van-grid-item__icon {
		font-size: 3.5rem !important;
	}

	.search {
		z-index: 99999999999;
		position: fixed;
		top: 0;
		width: 100%;
		margin: 0px auto;
	}

	.banner-list img {
		height: 10rem;
		width: 100%;
	}

	.ticket {
		color: #008000;
		font-weight: bold;
		text-align: center;
		margin: 10px 0;
	}

	.ticket-detail {
		float: left;
		width: 50%;
		position: relative;
	}

	.ticket-detail>span {
		display: block;
		padding: 30px 10px;
		border-left: 3px dashed #f0f0f0;
		border-right: 3px dashed #f0f0f0;
		margin: 0 8px;
	}

	.ticket-detail>span>div:first-child>span:first-child {
		padding-right: 3px;
		font-size: 25px;
	}

	.ticket-detail>span>div:last-child {
		color: grey;
		font-weight: normal;
		font-size: 12px;
		clear: both;
	}

	.volume {
		clear: both;
		padding: 10px 0;
	}

	.main-menu {
		clear: both;
	}

	.main-menu>div {
		padding: 0 10px;
	}

	.activity img {
		height: auto;
		width: 100%;
		padding-top: 10px;
	}

	.activity2 img {
		height: auto;
		width: 100%;
	}

	.goods-list {
		text-align: center;
		padding: 0px 10px;
		font-size: 14px;
		color: #008000;
	}

	.goods-name {
		color: #3c3c3c;
		font-size: 14px;
	}

	.goods-price {
		color: #008000;
	}

	.goods-list img {
		height: 150px;
		width: 100%;
	}

	.goods-item {
		float: left;
		width: 50%;
		text-align: center;
	}

	.goods-item-detail {
		padding: 10px 4px;
	}

	.goods-item-info {
		padding: 2px 10px;
	}

	/* .goods-item-info > div:first-child {
	float: left;
	margin-right: 10px;
	background-color: #93ff93;
	font-size: 12px;
	padding: 0 3px;
} */

	.goods-item-name {
		white-space: nowrap;
		/*一行显示*/
		overflow: hidden;
		/*超出部分隐藏*/
		text-overflow: ellipsis;
		/*用...代替超出部分*/
		color: #3c3c3c;
	}

	.goods-item-price-div {
		padding: 5px 10px;
		margin-bottom: 5px;
	}

	.goods-item-price {
		float: left;
		width: 30%;
	}

	.goods-item-price>span:first-child {
		font-size: 12px;
	}

	.goods-item-price>span:last-child {
		font-size: 16px;
		font-weight: 900;
	}

	.goods-item-go {
		float: right;
		font-size: 12px !important;
		border: 1px solid #008000;
		padding: 2px 8px;
		border-radius: 50px;
	}

	.goods-item2 {
		height: 7.5rem;
		padding: 10px 10px;
		/* color: #3c3c3c; */
	}

	.goods-item2-img {
		float: left;
	}

	.goods-item2-img img {
		width: 7.5rem;
		height: 7.5rem;
	}

	.goods-item2-info {
		color: #3c3c3c;
		font-size: 14px;
		margin-left: 8rem;
		height: 7.5rem;
		position: relative;
	}

	.goods-item2-name {
		padding-top: 8px;
	}

	.goods-item2-price-dev {
		position: absolute;
		bottom: 0px;
		width: 100%;
	}

	.goods-item2-price {
		float: left;
		width: 50%;
		color: #008000;
		border: 0px;
	}

	.goods-item2-price>span:first-child,
	.goods-item2-price>span:last-child {
		font-size: 12px;
	}

	.goods-item2-price>span:nth-child(2) {
		font-size: 16px;
		font-weight: 900;
	}

	.goods-item2-buy {
		float: right;
		font-size: 12px;
		border: 1px solid #008000;
		padding: 2px 10px;
		border-radius: 50px;
		color: #008000;
	}

	>>>.van-search .van-cell {
		padding: 0px 8px 0px 0;
	}
</style>
