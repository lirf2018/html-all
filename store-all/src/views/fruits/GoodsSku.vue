<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="banner-list">
			<div class="model">
				<span>图片仅供参考</span>
			</div>
			<van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
				<van-swipe-item v-for="(item, index) in goodsBannelList" :key="index"><img :src="item.imgUrl" />
				</van-swipe-item>
			</van-swipe>
		</div>
		<div class="goods-info" v-if="goodsInfo != null">
			<div class="goods-name"  v-if="goodsInfo.goodsType != 3"><span>{{goodsInfo.goodsName}}{{goodsInfo.goodsType == 6?'(预约商品)':''}}</span></div>
			<div class="goods-name"  v-if="goodsInfo.goodsType == 3"><span>【{{ goodsInfo.rentPayTypeName }}租赁】{{goodsInfo.goodsName}}</span></div>
			<div class="goods-prop">
				<div>
					<span>￥</span>
					<span>
						{{goodsInfo.skuLowMoney}}
						<span v-if="goodsInfo.skuLowMoney<goodsInfo.skuLowMoneyTrue"
							style="font-size: 10px;color: gray;font-weight: 100;">
							<span>价格 ￥</span>
							<span style="text-decoration:line-through;">{{goodsInfo.skuLowMoneyTrue}}</span>
						</span>
					</span>
					<span></span>
				</div>
				<div><span>销量 {{goodsInfo.sellCount}}</span></div>
				<div>库存 {{goodsInfo.goodsNum}}</div>
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
			<van-tabs v-model="active" color="#ffffff">
				<van-tab title="商品详情">
					<div v-if="goodsInfo!=null">
						<div class="text-img" v-html="goodsInfo.intro">{{goodsInfo.intro}}</div>
					</div>
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
		<!-- 弹出选择商品sku -->
		<!-- 弹出选择商品数量 -->
		<div class="sku-div">
			<van-popup v-model="showGoods" closeable close-icon="close" position="bottom" :style="{ height: '80%' }">
				<div class="goods-show-info">
					<div class="goods-show-img"><img :src="skuImg" @click="showImg" /></div>
					<div class="goods-show-goods">
						<div class="goods-show-price">
							<span>￥</span>
							<span>{{ skuPrice }}</span>
						</div>
						<div class="kc">
							<span>剩余{{ skuStore }}件</span>
						</div>
						<div class="sku-chose">
							<span>已选规格：</span>
							<span>{{ skuPropName }}</span>
						</div>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div class="props">
					<div class="goods-show-buy">
						<div class="goods-show-buy-info"><span>购买数量</span></div>
						<div class="goods-show-buy-count">
							<div>
								<van-stepper v-model="buyCount" disable-input />
							</div>
						</div>
					</div>
					<div style="clear: both;"></div>
					<div class="prop-item" v-for="(propItem, index) in goodsItem.goodsSkuPropList" :key="index">
						<div class="prop-title">{{ propItem.propName }}</div>
						<div class="prop-value">
							<div @click="clickValueSpan(propItem.propId, valueItem.valueId)"
								:class="valueItem.valueItemsCss == null?'value-items':valueItem.valueItemsCss"
								v-for="valueItem in propItem.valueList" :key="valueItem.valueId">
								<span>{{ valueItem.valueName }}</span>
							</div>
						</div>
						<div style="clear: both;"></div>
					</div>
					<div style="height: 51px;width: 100%;"></div>
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
			<van-image-preview v-model="showImgDetail" :images="skuImagesShow" />
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
				active: 0,
				buyCount: 1,
				orderRecordlist: [],
				error: false,
				loading: false,
				finished: false,
				refreshing: false,
				showGoods: false, //
				showImgDetail: false,
				skuId: null,
				skuImg: null,
				skuPrice: '0',
				skuStore: '0',
				skuPropName: '',
				skuPropNameCode: '',
				showImgDetail: false,
				skuImagesShow: [],
				goodsItem: [], //商品数据
				clickType: 0, //0加入购物车  1购买
				clickTypeText: '加入购物车',
				testIndex: 0,
				goodsInfo: null,
				goodsBannelList: [],
				goodsInfoList: [],
				goodsSkuList: [],
				goodsId: 0,
				activeNames: ['1'],
				cartCount: 0,
				timeGoodsId:0
			};
		},
		filters: {
			numFilter(value) {
				let realVal = '';
				if (!isNaN(value) && value !== '') {
					// 截取当前数据到小数点后两位
					realVal = parseFloat(value).toFixed(2);
				} else {
					realVal = '--';
				}
				return realVal;
			},
			dateFormat(originVal) {
				let dt = new Date(originVal);
				//年的时间
				let y = dt.getFullYear();
				//月的时间  .padStart 不足两位自动补0  2位长度
				let m = (dt.getMonth() + 1 + '').padStart(2, '0');
				//日的时间
				let d = (dt.getDate() + '').padStart(2, '0');

				//小时
				let hh = (dt.getHours() + '').padStart(2, '0');
				//分钟
				let mm = (dt.getMinutes() + '').padStart(2, '0');
				//秒数
				let ss = (dt.getSeconds() + '').padStart(2, '0');

				//将它们拼接成完整的字符串
				//return 'yyyy-mm-dd hh:mm:ss'  可以改成下面的方法
				return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
			}
		},
		methods: {
			findGoodsInfo() {
				let {
					goodsId,
					timeGoodsId
				} = this.$route.query;
				if (!goodsId) {
					return;
				}
				let vm = this;
				vm.goodsId = goodsId;
				vm.timeGoodsId = timeGoodsId;
				let params = {
					req_type: 'query_goods_detail',
					data: {
						goods_id: goodsId,
						user_id: 0,
						time_goods_id: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.goodsInfo = res.data;
						//
						let isSingle = vm.goodsInfo.isSingle;
						let goodsId = vm.goodsInfo.goodsId;
						if(isSingle == 1){
							// 单品
							let url = '/goodsSingle?goodsId=' + goodsId;
							vm.$router.push(url);
						}
						
						vm.goodsBannelList = vm.goodsInfo.bannerImgList;
						vm.goodsInfoList = vm.goodsInfo.goodsImgList;
						vm.skuImg = vm.goodsInfo.goodsImg;
						vm.skuImagesShow = [vm.goodsInfo.goodsImg];
						vm.goodsSkuList = vm.goodsInfo.goodsSkuList;
						vm.skuStore = vm.goodsInfo.goodsNum;
						vm.initSku(vm.goodsInfo);
					} else {}
				});
			},
			initSku(goods) {
				var goodsItem = {
					goodsId: goods.goodsId,
					goodsName: goods.goodsName,
					goodsStore: goods.goodsNum,
					goodsStatus: goods.status,
					goodsSkuPropList: goods.salePropList
				};
				this.goodsItem = goodsItem;
			},
			showNext(clickType) {
				let vm = this;
				this.showGoods = true;
				this.clickTypeText = clickType == 0 ? '加入购物车' : '下一步';
				this.clickType = clickType;
				if (null == vm.skuId || vm.skuId == "") {
					vm.skuPrice = vm.goodsInfo.skuLowMoney;
				}
			},
			closeShow() {
				let vm = this;
				// console.log("-----------closeShow------------goodsId="+vm.goodsId)
				// console.log("-----------closeShow------------skuPropNameCode="+vm.skuPropNameCode)
				if (null == vm.skuId || vm.skuId == "") {
					Toast('请选择商品规格');
					return;
				}
				if (vm.clickType == 1) {
					//下一步
					vm.showGoods = false;
					// console.log("---buyCount="+vm.buyCount+"     --skuId="+vm.skuId)
					this.$router.push('orderSubmit2?goodsId=' + this.goodsId + '&buyCount=' + this.buyCount + "&skuId=" +
						vm.skuId +
						"&timeGoodsId=0");
				} else {
					//加入购物车
					let params = {
						req_type: 'add_order_cart',
						data: {
							goods_id: vm.goodsId,
							user_id: 0,
							goods_spec: vm.skuPropNameCode,
							goods_count: vm.buyCount,
							time_goods_id: 0
						}
					}; // 参数
					axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							vm.findOrderCartCount();
							Toast('添加成功');
							vm.showGoods = false;
						} else {
							Toast(res.resp_desc);
						}
					});
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
			clickValueSpan(propId, valueId) {
				let vm = this;
				//选中属性值
				let propList = this.goodsItem.goodsSkuPropList;
				let chosePropValueIds = ''; //选中的属性值id
				let chosePropValueIdsNames = ''; //选中的属性值id名称
				propList.forEach(function(e) {
					let propId_ = e.propId;
					e.valueList.forEach(function(e) {
						if (propId_ == propId) {
							e.valueItemsCss = valueId == e.valueId ? 'value-items-chose' : 'value-items';
						}
						if (e.valueItemsCss == 'value-items-chose') {
							chosePropValueIds = chosePropValueIds + e.valueId + ';';
							chosePropValueIdsNames = chosePropValueIdsNames + e.valueName + ';';
						}
					});
				});
				//根据已选择的属性值查找对应的sku价格和库存
				this.skuPropNameCode = chosePropValueIds;
				this.skuPropName = chosePropValueIdsNames;
				this.goodsSkuList.forEach(function(e) {
					if (e.propCode == chosePropValueIds) {
						vm.skuPrice = e.skuNowMoney;
						vm.skuStore = e.skuNum;
						vm.skuImg = e.skuImg;
						vm.skuId = e.skuId;
						vm.skuImagesShow = [e.skuImg];
					}
				})


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
		},
		mounted() {
			this.$nextTick(function() {
				this.findGoodsInfo();
				this.findOrderCartCount();
			});
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		background-color: #f8f8f8;
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

	.banner-list {
		position: relative;
	}

	.model {
		font-size: 13px;
		position: absolute;
		bottom: 15px;
		right: 5px;
		z-index: 99;
		background-color: white;
		padding: 2px 3px;
		
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
		font-size: 14px;
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

	.goods-prop {
		color: #008000;
		border-bottom: 1px solid #f0f0f0;
	}

	.goods-prop>div {
		padding-top: 10px;
	}

	.goods-prop>div:first-child {
		float: left;
		width: 50%;
	}

	.goods-prop>div:nth-child(2) {
		float: left;
		width: 25%;
		text-align: left;
	}

	.goods-prop>div:last-child {
		float: right;
		width: 25%;
		text-align: right;
	}

	.goods-prop>div:not(:first-child) {
		margin-top: 6px;
	}

	.goods-prop>div:first-child>span:first-child {
		font-weight: bold;
		font-size: 10px;
	}

	.goods-prop>div:first-child>span:nth-child(2) {
		font-size: 18px;
	}

	.goods-prop>div:first-child>span:last-child {
		color: #657180;
		font-size: 12px;
		font-weight: normal;
		padding-left: 2px;
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
		width: 100px;
		height: 100px;
		position: absolute;
		top: -20px;
		padding-left: 10px;
	}

	.goods-show-img img {
		width: 100% !important;
		border-radius: 15px;
		height: 100px;
	}

	.img-detail {
		overflow: auto;
		width: 100%;
	}

	.img-detail img {
		display: block;
	}

	.goods-show-goods {
		float: left;
		width: 54%;
		font-size: 14px;
		color: #464c5b;
		padding-left: 18px;
		padding-top: 10px;
		word-break: break-all;
		margin-left: 30%;
	}

	.goods-show-price {
		color: #008000;
		font-weight: bold;
	}

	.goods-show-price>span:first-child {
		font-size: 12px;
	}

	.goods-show-price>span:last-child {
		font-size: 18px;
	}

	.kc {
		padding-bottom: 5px;
	}

	.kc,
	.sku-chose {
		color: #9ea7b4;
		font-size: 12px;
	}

	/* sku */
	.prop-item {
		color: #464c5b;
		font-size: 14px;
	}

	.prop-title,
	.prop-value {
		padding: 10px 10px;
	}

	.prop-title {
		padding-bottom: 0px;
		font-size: 14px;
	}

	.prop-value>div {
		float: left;
		margin: 0 5px;
		padding: 5px 10px;
		margin-bottom: 8px;
	}

	.value-items {
		background-color: #f0f0f0;
	}

	.value-items-chose {
		background-color: #008000;
		color: white;
	}

	.props {
		overflow-y: scroll;
		height: 80%;
		font-size: 12px;
		position: relative;
		overflow: auto;
	}

	.goods-show-btn {
		position: absolute;
		bottom: 0px;
		width: 100%;
	}

	.goods-show-buy {
		padding: 10px 0;
		margin-top: 1.8rem;
		color: #464c5b;
		font-size: 14px;
		text-align: left;
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
		text-align: left;
		padding-left: 10px;
	}

	.goods-show-buy-info>span:last-child {
		color: #9ea7b4;
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
		font-size: 14px;
		color: #323233;
	}

	.title,
	.order-record-items {
		text-align: center;
		overflow: hidden;
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
</style>
