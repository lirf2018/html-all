<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="banner-list">
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item, index) in goodsBannelList" :key="index"><img :src="item.imgUrl" />
				</van-swipe-item>
			</van-swipe>
		</div>
		<div class="goods-info" v-if="goodsInfo != null">
			<div class="goods-name">
				<span>{{ goodsInfo.goodsName }}{{goodsInfo.goodsType == 6?'(预约商品)':''}}</span>
			</div>
			<div class="goods-prop">
				<div>
					<span>￥</span>
					<span>{{ goodsInfo.nowMoney }}</span>
					<span>
						<span v-if="goodsInfo.nowMoney < goodsInfo.trueMoney"
							style="font-size: 10px;color: gray;font-weight: 100;">
							<span> 价格 ￥</span>
							<span
								style="text-decoration:line-through;font-weight: 300;">{{ goodsInfo.trueMoney }}</span>
						</span>
					</span>
				</div>
				<div>
					<span>销量 {{ goodsInfo.sellCount }}</span>
				</div>
				<div>库存 {{ goodsInfo.goodsNum }}</div>
			</div>
			<div style="clear: both;"></div>
			<div class="ya-jin" v-if="goodsInfo.depositMoney > 0">
				<div>
					<span>押金:￥{{goodsInfo.depositMoney}}</span>
				</div>
			</div>
			<div style="clear: both;"></div>
		</div>
		<div class="beforeBuy">
			<van-collapse v-model="activeName" accordion>
				<van-collapse-item title="订购须知">
					<div>
						<OrderRead></OrderRead>
					</div>
				</van-collapse-item>
			</van-collapse>
		</div>
		<div class="beforeBuy" v-if="null!= goodsInfo && goodsInfo.addGoodsDesc != ''">
			<van-collapse v-model="activeNames">
				<van-collapse-item title="商品说明" name='1'>
					<div style="font-size: 12px;">
						<span v-html="goodsInfo.addGoodsDesc"></span>
					</div>
				</van-collapse-item>
			</van-collapse>
		</div>
		<div class="goods-detail">
			<!-- color="#008000" -->
			<van-tabs v-model="active" color="#ffffff">
				<van-tab title="商品详情">
					<div v-if="goodsInfo != null">
						<div class="text-img" v-html="goodsInfo.intro">{{ goodsInfo.intro }}</div>
					</div>
					<div class="both-img"><img :src="item.imgUrl" v-for="(item, index) in goodsInfoList" :key="index" />
					</div>
					<div style="height: 10px; width: 100%;clear: both;"></div>
					<!-- <van-divider dashed color="red">价格说明</van-divider> -->
				</van-tab>
				<!-- <van-tab title="成交记录">
					<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
						<div class="order-record">
							<div class="title">
								<span>买家</span>
								<span>成交时间</span>
								<span>数量</span>
							</div>
							<div style="width: 100%;clear: both;"></div>
							<div class="order-record-items" v-for="(item, index) in orderRecordlist" :key="index">
								<div>
									<span>{{ item.buyerNickName }}</span>
									<span>{{ item.finishTime }}</span>
									<span>{{ item.buyCount }}</span>
								</div>
							</div>
							<div style="width: 100%;clear: both;"></div>
						</div>
					</van-list>
				</van-tab> -->
			</van-tabs>
		</div>
		<div class="footer" v-if="goodsInfo != null">
			<div style="height: 51px; width: 100%;clear: both;"></div>
			<van-goods-action>
				<!-- <van-goods-action-icon icon="chat-o" text="客服" color="#008000" />
					<van-goods-action-icon icon="cart-o" text="购物车" badge="5" />
					<van-goods-action-icon icon="star" text="已收藏" color="#008000" /> -->
				<van-goods-action-icon
					v-if="goodsInfo.allStatus == 1 && goodsInfo.goodsNum > 0 && goodsInfo.isPutaway == 2" icon="cart-o"
					text="购物车" :badge="cartCount" @click="toPage('shopCart')" />
				<van-goods-action-button
					v-if="goodsInfo.allStatus == 1 && goodsInfo.goodsNum > 0 && goodsInfo.isPutaway == 2"
					color="#53FF53" text="加入购物车" @click="showNext(0)" />
				<van-goods-action-button
					v-if="goodsInfo.allStatus == 1 && goodsInfo.goodsNum > 0 && goodsInfo.isPutaway == 2"
					color="#008000" text="立即购买" @click="showNext(1)" />
				<div v-if="goodsInfo.allStatus != 1 || goodsInfo.isPutaway != 2" class="goods-down"><span>商品已下架</span>
				</div>
				<div v-if="goodsInfo.allStatus == 1 && goodsInfo.goodsNum == 0" class="goods-down"><span>售罄</span></div>
			</van-goods-action>
		</div>
		<!-- 弹出选择商品数量 -->
		<div v-if="goodsInfo != null">
			<van-popup v-model="showGoods" closeable close-icon="close" position="bottom">
				<div class="goods-show">
					<div class="goods-show-info">
						<div class="img-top">
							
						</div>
						<div class="goods-show-img"><img :src="goodsInfo.goodsImg" @click="showImg" /></div>
						<div class="goods-show-goods">
							<div class="goods-show-goods-name">{{ goodsInfo.goodsName }}</div>
							<!-- <div class="goods-show-goods-name">{{ goodsInfo.goodsName }}择商品数择商品数择商品数择商品数商品数择商品数商品数择商品数商品数择商品数商品数择商品数商品数择商品数商品数择商品数商品数择商品数商品数择商品数择商品数</div> -->
							<div class="goods-show-price">
								<span>￥</span>
								<span>{{ goodsInfo.nowMoney }}</span>
								<span>
									<span v-if="goodsInfo.nowMoney < goodsInfo.trueMoney"
										style="font-size: 10px;color: gray;font-weight: 100;">
										<span> 价格 ￥</span>
										<span
											style="text-decoration:line-through;font-weight: 300;">{{ goodsInfo.trueMoney }}</span>
									</span>
								</span>
							</div>
						</div>
					</div>
				</div>
				<!-- <div style="clear: both;"></div> -->
				<div class="goods-show-buy">
					<div class="goods-show-buy-info">
						<span>购买数量</span>
						<span>剩余{{ goodsInfo.goodsNum }}件</span>
					</div>
					<div class="goods-show-buy-count">
						<div>
							<van-stepper v-model="buyCount" disable-input />
						</div>
					</div>
				</div>
				<div class="goods-show-btn" @click="closeShow">
					<div>
						<span>{{ clickTypeText }}</span>
					</div>
				</div>
			</van-popup>
		</div>
		<!-- 查看图片详情 -->
		<div class="d-img">
			<van-image-preview v-model="showImgDetail" :images="imagesShow" />
		</div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import OrderRead from '@/components/OrderRead.vue';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			OrderRead: OrderRead
		},
		data() {
			return {
				title: '商品详情',
				activeName: 1,
				goodsStatus: 1,
				goodsStore: 110,
				active: 0,
				buyCount: 1,
				orderRecordlist: [],
				error: false,
				loading: false,
				finished: false,
				refreshing: false,
				showGoods: false,
				imagesShow: [],
				showImgDetail: false,
				clickType: 0, //0加入购物车  1购买
				clickTypeText: '加入购物车',
				testIndex: 0,
				goodsInfo: null,
				goodsBannelList: [],
				goodsInfoList: [],
				goodsId: null,
				timeGoodsId: 0,
				activeNames: ['1'],
				cartCount: 0
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findGoodsInfo();
				this.findOrderCartCount();
			});
		},
		methods: {
			findGoodsInfo() {
				let vm = this;
				let {
					goodsId,
					timeGoodsId
				} = this.$route.query;
				vm.goodsId = goodsId;
				vm.timeGoodsId = timeGoodsId;
				if (!goodsId) {
					return;
				}
				let params = {
					req_type: 'query_goods_detail',
					data: {
						goods_id: goodsId,
						user_id: 0,
						time_goods_id: vm.timeGoodsId
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.goodsInfo = res.data;
						if (vm.timeGoodsId != vm.goodsInfo.timeGoodsId) {
							vm.timeGoodsId = 0;
						}
						vm.goodsBannelList = vm.goodsInfo.bannerImgList;
						vm.goodsInfoList = vm.goodsInfo.goodsImgList;
						vm.imagesShow.push(vm.goodsInfo.goodsImg);
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			showNext(clickType) {
				this.showGoods = true;
				this.clickTypeText = clickType == 0 ? '加入购物车' : '下一步';
				this.clickType = clickType;
			},
			closeShow() {
				this.showGoods = false;
				if (this.clickType == 1) {
					//下一步
					this.$router.push('orderSubmit2?goodsId=' + this.goodsId + '&buyCount=' + this.buyCount +
						"&timeGoodsId=" + this.timeGoodsId);
				} else {
					//加入购物车
					this.addCartGoods();
				}
			},
			showImg() {
				//展示图片
				this.showImgDetail = true;
			},
			onLoad() {
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.testIndex = this.testIndex + 1;
						var obj = {
							buyerNickName: '买家名称' + this.testIndex,
							finishTime: '2018-01-02',
							buyCount: 10 + i
						};
						this.orderRecordlist.push(obj);
					}
					this.loading = false;

					if (this.orderRecordlist.length >= 40) {
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
			addCartGoods() {
				let vm = this;
				let params = {
					req_type: 'add_order_cart',
					data: {
						goods_id: vm.goodsId,
						user_id: 0,
						goods_spec: null,
						goods_count: vm.buyCount,
						time_goods_id: vm.timeGoodsId,
						now_price: vm.goodsInfo.nowMoney
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.findOrderCartCount();
						Toast('添加成功');
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			findOrderCartCount() {
				let vm = this;
				let params = {
					req_type: 'find_order_cart_count',
					data: {
						userId: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.cartCount = res.data.count;
					}
				});
			},
			toPage(url) {
				this.$router.push(url);
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		background-color: #f8f8f8;
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

	.my-swipe .van-swipe-item {
		text-align: center;
	}

	.van-grid-item__icon {
		font-size: 3.5rem !important;
	}

	.banner-list img {
		height: 13rem;
		width: 100%;
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

	.van-info {
		background-color: #008000 !important;
	}

	.van-popup__close-icon--top-right {
		top: 8px !important;
		right: 10px !important;
	}

	.goods-info {
		font-weight: bold;
		color: #464c5b;
		padding: 10px 0;
		overflow: auto;
		background-color: #ffffff;
		margin-bottom: 10px;
	}

	.goods-name,
	.goods-prop {
		padding: 0 15px;
		padding-top: 10px;
	}

	.goods-prop>div {
		padding-top: 10px;
	}

	.goods-prop>div:first-child {
		float: left;
		width: 50%;
		font-size: 18px;
	}

	.goods-prop>div:nth-child(2) {
		float: left;
		width: 25%;
		text-align: left;
		font-size: 10px;
	}

	.goods-prop>div:last-child {
		float: right;
		width: 25%;
		text-align: right;
		font-size: 10px;
	}

	.goods-prop {
		color: #008000;
	}

	.goods-prop>div:first-child>span:first-child {
		font-weight: bold;
		font-size: 10px;
	}

	.goods-prop>div:first-child>span:last-child {
		font-size: 10px;
	}

	.goods-prop>div:not(:first-child) {
		color: #657180;
		font-size: 12px;
		font-weight: normal;
	}

	.goods-prop>div:nth-child(2) {
		text-align: center;
	}

	.goods-show-info {
		overflow: visible;
	}
	
	.beforeBuy {
		margin-bottom: 10px;
	}

	.beforeBuy,
	.van-cell {
		color: #657180 !important;
	}

	.van-popup {
		overflow-y: visible !important;
	}
	
	.img-top {
		height: 20px;
		/* position: absolute; */
		/* top: 0px; */
		width: 80%;
		background:transparent;
	}
	
	>>>.van-popup{
		background:transparent;
	}
	
	.goods-show{
		/* border: 1px solid black; */
		overflow: hidden;
		position: relative;
		/* height: 120px; */
	}

	.goods-show-img {
		width: 100px;
		height: 110px;
		position: absolute;
		top: 0px;
		padding-left: 10px;
		/* border: 1px solid red; */
	}

	.goods-show-img img {
		width: 100% !important;
		border-radius: 15px;
		height: 100% !important;
		background-color: white;
	}

	.img-detail {
		overflow: auto;
		width: 100%;
	}

	.img-detail img {
		display: block;
	}

	.goods-show-goods {
		/* width: 100%; */
		color: #464c5b;
		height: 100px;
		padding: 10px 25px 10px 120px;
		word-break: break-all;
		background-color: white;
	}
	
	.goods-show-goods-name{
		height: 60px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3; 
		overflow: hidden;
	}

	.goods-show-price {
		color: #008000;
		font-weight: bold;
		padding-top: 5px;
		background-color: white;
	}

	.goods-show-price>span:first-child {
		font-size: 10px;
	}

	.goods-show-price>span:nth-child(2) {
		font-size: 18px;
	}

	.goods-show-buy {
		padding: 10px 0;
		/* margin-top: 1.8rem; */
		color: #464c5b;
		overflow: auto;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;
		background-color: white;
	}

	.goods-show-buy-info {
		float: left;
		width: 35%;
	}

	.goods-show-buy-count {
		float: right;
		padding-right: 10px;
	}

	.goods-show-buy-info span {
		display: block;
		text-align: center;
	}

	.goods-show-buy-info>span:last-child {
		color: #9ea7b4;
		font-size: 12px;
		/* padding-top: 2px; */
	}

	.goods-show-btn {
		color: #ffffff;
		background-color: #008000;
		text-align: center;
		padding: 12px 0;
		font-weight: 500;
	}

	/* 图片详情 */
	.both-img>img {
		display: block;
		/* float: left; */
	}

	.both-img img {
		width: 100%;
	}

	.order-record {
		font-size: 0.8rem;
		color: #323233;
	}

	.title,
	.order-record-items {
		text-align: center;
		overflow: hidden;
		background-color: #f2f2f2;
		padding: 8px 0;
	}

	.order-record-items {
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		color: #657180;
	}

	.title>span,
	.order-record-items>div>span {
		float: left;
		width: 33.3%;
		display: block;
	}

	/* 售罄 /下架*/
	.goods-down {
		height: 100%;
		line-height: 50px;
		width: 100%;
		padding-left: 15px;
		text-align: center;
		background-color: #008000;
		color: white;
		position: absolute;
		right: 0px;
	}

	.ya-jin {
		background-color: white;
		font-size: 12px;
		color: gray;
		font-weight: normal;
		padding: 0 15px;
		padding-top: 5px;
	}

	>>>.van-tabs__line {
		z-index: 0;
	}
	
	>>>.van-popup__close-icon--top-right{
		right: 8px;
		top: 25px;
	}
</style>
