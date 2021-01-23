<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="banner-list">
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item, index) in goodsBannelList" :key="index"><img :src="item.imgUrl" /></van-swipe-item>
			</van-swipe>
		</div>
		<div class="goods-info" v-if="goodsInfo != null">
			<div class="goods-name"><span>{{goodsInfo.goodsName}}</span></div>
			<div class="goods-prop">
				<div>
					<span>￥</span>
					<span>{{goodsInfo.nowMoney}}</span>
				</div>
				<div><span>销量 {{goodsInfo.sellCount}}</span></div>
				<div>库存 {{goodsInfo.goodsNum}}</div>
			</div>
			<div style="clear: both;"></div>
		</div>

		<div class="beforeBuy">
			<van-collapse v-model="activeName" accordion>
				<van-collapse-item title="订购须知">
					<div>
						5G升级包限时优惠 活动时间 即日起至2020年4月30日 参与对象： 4G套餐49元、76元及以上用户订购 活动内容： 29元10GB全国流量5G升级包（包含
						“优惠购”权益），现首月9.9元/月；次月起恢复原价 49元20GB全国流量5G升级包（包含 “优惠购”权益），现首月19.9元/月；次月起恢复原价
						29元、49元升级包，月费76元及以上4G套餐用户以上用户均可订购； 49元升级包，限月费49元及以上76元以下4G套餐用户订购；
						订购5G升级包，可以在手厅-搜索-优惠购-订购优惠权益 活动规则：
						1、订购后立即生效，5G升级包月费一次性收取，用户不取消默认续订。变更、退订次月生效。用户只能订购一档产品一次，不能重复订购。
						2、订购用户如在档内变更为4G套餐，保持5G升级包订购；如低于档位下限变更为4G套餐，变更生效时同步取消5G升级包订购；如变更为5G套餐，变更生效时5G升级包随原套餐自动退订。
						3、主副卡仅限主卡订购，副卡不能订购。主卡订购后，主、副卡共享流量、速率、优惠购权益，副卡通过主卡订购享受服务；
						4、承诺低消用户可订购，5G升级包月费计入低消；融合共享版用户迁转到组合版产品后订购； 5、2/3G套餐用户迁转4G套餐后订购；
						6、5G升级包包含“优惠购”权益，用户可登录-手机营业厅-搜索“优惠购”平台按优惠价订购相关权益。 7、5G升级包订购更换套餐，在支持5G信号，并使用5G设备时享受5G网速。
						8、5G套餐用户不能订购。
						9、达量限速套餐用户，在限速前订购5G升级包，按订购5G升级包包含流量值提高一次限速阀值；在限速后订购5G升级包，订购后取消限速，5G升级包包含流量消费完后再按套餐规定限速。限速之前均可享受5G优享服务。二次限速阀值不变。达量封顶套餐和王卡套餐在未关闭上网功能状态下均可享受5G优享服务，计算封顶阀值时5G升级包流量不算入套餐外流量。
						10、5G升级包流量当月未使用完部分按现有规则结转次月。 11、5G升级包包含“优惠购”权益，用户可登录-手机营业厅-搜索“优惠购”平台按优惠价订购相关权益。
						12、5G升级包订购用户，不用更换套餐，持有5G手机5G网络下即可体验5G高速上网，4G设备4G信号下使用4G网络。
					</div>
				</van-collapse-item>
			</van-collapse>
		</div>

		<div class="goods-detail">
			<van-tabs v-model="active" color="#008000">
				<van-tab title="商品详情">
					<div class="text-img"></div>
					<div class="both-img">
						<img :src="item.imgUrl" v-for="(item,index) in goodsInfoList" :key="index" />
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
		<div class="footer">
			<div style="height: 51px; width: 100%;clear: both;"></div>
			<van-goods-action>
				<!-- <van-goods-action-icon icon="chat-o" text="客服" color="#008000" />
				<van-goods-action-icon icon="cart-o" text="购物车" badge="5" />
				<van-goods-action-icon icon="star" text="已收藏" color="#008000" /> -->
				<van-goods-action-button v-if="goodsStatus == 1 && goodsStore > 0" color="#53FF53" text="加入购物车" @click="showNext(0)" />
				<van-goods-action-button v-if="goodsStatus == 1 && goodsStore > 0" color="#008000" text="立即购买" @click="showNext(1)" />
				<div v-if="goodsStatus != 1" class="goods-down"><span>商品已下架</span></div>
				<div v-if="goodsStatus == 1 && goodsStore == 0" class="goods-down"><span>售罄</span></div>
			</van-goods-action>
		</div>
		<!-- 弹出选择商品数量 -->
		<div>
			<van-popup v-model="showGoods" closeable close-icon="close" position="bottom">
				<div class="goods-show-info">
					<div class="goods-show-img"><img :src="goodsInfo.goodsImg" @click="showImg" /></div>
					<div class="goods-show-goods">
						<div class="goods-show-goods-name">{{goodsInfo.goodsName}}</div>
						<div class="goods-show-price">
							<span>￥</span>
							<span>{{goodsInfo.nowMoney}}</span>
						</div>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div class="goods-show-buy">
					<div class="goods-show-buy-info">
						<span>购买数量</span>
						<span>剩余{{ goodsInfo.goodsNum }}件</span>
					</div>
					<div class="goods-show-buy-count">
						<div><van-stepper v-model="buyCount" disable-input /></div>
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
		<div class="d-img"><van-image-preview v-model="showImgDetail" :images="imagesShow" /></div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
import axios from '@/network/request.js';
export default {
	components: { Head: Head },
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
			goodsInfo:null,
			goodsBannelList:[],
			goodsInfoList:[]
		};
	},
	mounted: function() {
		this.$nextTick(function() {
			this.findGoodsInfo();
		});
	},
	methods: {
		findGoodsInfo() {
			let {goodsId} = this.$route.query;
			if (!goodsId) {
				return;
			}
			let vm = this;
			let params = {
				req_type: 'query_goods_detail',
				data: { goods_id: goodsId, user_id: 0 }
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.goodsInfo = res.data;
					vm.goodsBannelList = vm.goodsInfo.bannerImgList;
					vm.goodsInfoList = vm.goodsInfo.goodsImgList;
					vm.imagesShow.push(vm.goodsInfo.goodsImg)
				} else {
				}
			});
		},
		showNext(clickType) {
			this.showGoods = true;
			this.clickTypeText = clickType == 0 ? '加入购物车' : '下一步';
		},
		closeShow() {
			this.showGoods = false;
			if (this.clickType == 1) {
				//下一步
			} else {
				//加入购物车
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

.goods-prop > div {
	padding-top: 10px;
	border-top: 1px solid #f0f0f0;
}

.goods-prop > div:not(:last-child) {
	float: left;
	width: 34%;
}

.goods-prop > div:last-child {
	float: right;
	width: 32%;
	text-align: right;
}

.goods-prop {
	color: #008000;
}

.goods-prop > div:first-child > span:first-child {
	font-weight: bold;
	font-size: 12px;
}

.goods-prop > div:first-child > span:last-child {
	font-size: 16px;
}

.goods-prop > div:not(:first-child) {
	color: #657180;
	font-size: 12px;
	font-weight: normal;
}
.goods-prop > div:nth-child(2) {
	text-align: center;
}
.goods-show-info {
	padding-bottom: 10px;
	overflow: visible;
	position: relative;
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

.goods-show-img {
	float: left;
	width: 30%;
	position: absolute;
	top: -20px;
	padding-left: 10px;
}

.goods-show-img img {
	width: 100% !important;
	border-radius: 15px;
}

.img-detail {
	overflow: auto;
	width: 100%;
	border: 1px solid red;
}

.img-detail img {
	display: block;
}

.goods-show-goods {
	float: left;
	width: 54%;
	color: #464c5b;
	padding-left: 18px;
	padding-top: 10px;
	word-break: break-all;
	margin-left: 30%;
}

.goods-show-price {
	color: #008000;
	font-weight: bold;
	padding-top: 5px;
}
.goods-show-price > span:first-child {
	font-size: 12px;
}
.goods-show-price > span:last-child {
	font-size: 16px;
}
.goods-show-buy {
	padding: 10px 0;
	margin-top: 1.8rem;
	color: #464c5b;
	overflow: auto;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
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
.goods-show-buy-info > span:last-child {
	color: #9ea7b4;
	font-size: 12px;
	padding-top: 2px;
}

.goods-show-btn {
	color: #ffffff;
	background-color: #008000;
	text-align: center;
	padding: 12px 0;
	font-weight: 500;
}

/* 图片详情 */
.both-img > img {
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
.title > span,
.order-record-items > div > span {
	float: left;
	width: 33.3%;
	display: block;
}
</style>
