<template>
	<div class="page" :style="widthStyle">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;">
			<Navigation />
		</div>
		<div>
			<div class="div1">
				<div class="title-name"><span>开单</span></div>
				<div class="table-div">
					<ul class="ul-text">
						<li>桌号：</li>
						<li>人数：</li>
					</ul>
					<ul class="ul-value">
						<li>{{ tableName }}</li>
						<li>{{ personCount }}</li>
					</ul>
				</div>
				<div class="table-div">
					<ul class="ul-text">
						<li>服务员：</li>
						<li>时间：</li>
					</ul>
					<ul class="ul-value">
						<li>{{ serverName }}&nbsp;</li>
						<li>{{ date | dateFormat }} &nbsp;</li>
					</ul>
				</div>
			</div>
			<div class="div2">
				<div class="div2-left">
					<div class="div2-left-text">
						<span><input readonly="readonly" disabled="disabled" value="订单号：" /></span>
						<span><input readonly="readonly" disabled="disabled" value="店铺/商品码：" /></span>
					</div>
					<div class="div2-left-value">
						<span>
							<input value="" v-model="searchOrderForm.order_no" />
							<!-- <strong class="order-msg" v-if="searchOrderFlag">订单不存在</strong> -->
						</span>
						<span><input ref="myFocus" value="" v-model="searchOrderForm.goods_code" @keyup="searchOrderGoodsData" /></span>
					</div>
				</div>
				<div class="div2-right">
					<div class="div2-right-text">
						<span><input readonly="readonly" disabled="disabled" value="桌号：" /></span>
						<span><input readonly="readonly" disabled="disabled" value="手机号：" /></span>
					</div>
					<div class="div2-right-value">
						<span><input value="" v-model="searchOrderForm.table_name" /></span>
						<span>
							<input value="" v-model="searchOrderForm.user_phone" />
							<!-- <strong class="order-msg" v-if="searchPhoneOrderFlag">订单不存在</strong> -->
						</span>
					</div>
				</div>
				<div class="div2-right-2">
					<div class="div2-right-text">
						<span><input readonly="readonly" disabled="disabled" value="秘钥：" /></span>
						<span><input readonly="readonly" disabled="disabled" value="优惠码：" /></span>
					</div>
					<div class="div2-right-value">
						<span><input value="" type="password" v-model="orderPass" /></span>
						<span><input value="" /></span>
					</div>
				</div>

				<div class="chose-goods">
					<button @click="createNewOrder">重新开单</button>
					<button v-if="orderInfo.order_status != 0">
						订单状态：{{ orderInfo.order_status_name }}
						<span>({{ orderInfo.pay_method_name }})</span>
					</button>
					<button @click="resetOrderStatus" v-if="orderInfo.order_status != 0">重置付款状态</button>
					<!-- <button @click="searchOrderGoodsData">查询商品</button> -->
					<button @click="showAddOrderInfoView" v-if="orderInfo.order_status == 0">添加订单信息</button>
					<button @click="searchOrderList">查询订单</button>
					<button @click="showAddGoodsView" v-if="orderInfo.order_status == 0">添加商品</button>
				</div>
			</div>
			<div class="div3-0">
				<div class="div-contents">商品信息</div>
				<div class="goods-contents-title">
					<ul>
						<li class="class-detail-id">序号</li>
						<li class="class-goods-code">商品编码</li>
						<li class="class-goods-name">商品名称/品名</li>
						<li class="class-buy-count">购买数</li>
						<li class="class-price-true">实付单价</li>
						<li class="class-sale-price">销售价</li>
						<li class="class-member-price">会员价</li>
						<li class="class-discounts-price">促销价</li>
						<li class="class-unit">规格</li>
						<li class="class-unit-count">规格数</li>
						<li class="class-do">操作</li>
					</ul>
				</div>
			</div>
			<div class="div3-1"></div>
			<div class="div3">
				<div class="goods-contents-value">
					<ul v-for="(g, index) in orderGoodsList" :key="index" :class="g.style" @mouseover="mouseInGoodsUl(g.id, 0)"
					 @mouseout="mouseOutGoodsUl(g.id, 0)">
						<li class="class-detail-id">{{ g.id }}</li>
						<li class="class-goods-code">{{ g.goodsCode }}</li>
						<li class="class-goods-name">{{ g.goodsName }}</li>
						<li class="class-buy-count">{{ g.buyCount }}</li>
						<li class="class-price-true">
							{{ g.salePriceTrue | numFilter }}
							<span v-if="g.salePriceTrueDesc != '' ">({{g.salePriceTrueDesc}})</span>
						</li>
						<li class="class-sale-price">{{ g.goodsSalePrice | numFilter }}</li>
						<li class="class-member-price">{{ g.memberPrice | numFilter }}</li>
						<li class="class-discounts-price">
							{{ g.goodsDiscountsPrice | numFilter }}
						</li>
						<li class="class-unit">{{ g.goodsUnitName }}</li>
						<li class="class-unit-count">{{ g.unitCount }}</li>
						<li class="class-do">
							<div class="handler-btn" v-if="orderInfo.order_status == 0">
								<button @click="delOrderGoods(g)">删除</button>
								<button @click="addGoodsFromOrder(g)">添加(+1)</button>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div style="height: 250px;background-color: white;"></div>
			<div class="div4">
				<div class="count-other">
					<div class="count-other-text">
						<span>优惠券折扣：</span>
						<span>会员折扣：</span>
						<span>促销折扣：</span>
					</div>
					<div class="count-other-value">
						<span>{{ discountsCouponPriceCount | numFilter }}</span>
						<span>{{ discountsMemberPriceCount | numFilter }}</span>
						<span>{{ discountsPriceCount | numFilter }}</span>
					</div>
				</div>
				<div class="count-div count-div-gray">
					<div class="count-text count-text-gray">
						<span>商品总数 ：</span>
						<span>消费合计 ：</span>
						<span>优惠合计 ：</span>
					</div>
					<div class="count-value count-value-gray">
						<span>{{ goodsCount }}</span>
						<span>{{ orderPrice | numFilter }}</span>
						<span>{{ discountsPriceCountAll | numFilter }}</span>
					</div>
				</div>
				<div class="count-div">
					<div class="count-text">
						<span>实付合计：</span>
						<span>收到金额 ：</span>
						<span>{{ returnPriceText }}：</span>
					</div>
					<div class="count-value">
						<span>{{ realPrice | numFilter }}</span>
						<span>{{ payPrice | numFilter }}</span>
						<span>{{ returnPrice | numFilter }}</span>
					</div>
				</div>
				<div class="sure-btn" v-if="orderInfo.order_status == 0">
					<button>余额支付</button>
					<button @click="showCashPay">现金付款</button>
					<button>微信付款</button>
					<button>支付宝付款</button>
				</div>
			</div>
		</div>
		<!-- 添加 订单信息 -->
		<Modal width="600" v-model="addOrderInfoFlag" title="添加订单信息" @on-ok="addOrderTitle">
			<div class="input-show-div add-order-info">
				<div class="input-show-div-text add-order-info-text">
					<span><input readonly="readonly" disabled="disabled" value="桌号：" /></span>
					<span><input readonly="readonly" disabled="disabled" value="人数：" /></span>
					<span><input readonly="readonly" disabled="disabled" value="服务员：" /></span>
				</div>
				<div class="input-show-div-value add-order-info-value">
					<span><input v-model="addOrderFormData.table_name" /></span>
					<span><input v-model="addOrderFormData.person_count" /></span>
					<span><input v-model="addOrderFormData.server_name" /></span>
				</div>
			</div>
		</Modal>
		<!-- 添加商品信息 -->
		<Modal :fullscreen="fullscreen" v-model="addGoodsFlag" title="添加商品信息">
			<div class="append-goods">
				<div class="div2 div2-1">
					<div class="div2-left">
						<div class="div2-left-text">
							<span><input readonly="readonly" disabled="disabled" value="商品条形码：" /></span>
							<span><input readonly="readonly" disabled="disabled" value="商品店铺码：" /></span>
						</div>
						<div class="div2-left-value">
							<span><input value="" v-model="searchGoodsForm.goods_code" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
							<span><input value="" v-model="searchGoodsForm.shop_code" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
						</div>
					</div>
					<div class="div2-right">
						<div class="div2-right-text">
							<span><input readonly="readonly" disabled="disabled" value="商品类别：" /></span>
							<span><input readonly="readonly" disabled="disabled" value="商品拼音：" /></span>
						</div>
						<div class="div2-right-value">
							<span>
								<select v-model="searchGoodsForm.classify_code" @change="searchGoodsData">
									<option value="">全部</option>
									<option :key="index" :value="item.classify_code" v-for="(item, index) in classifys">{{ item.classify_name }}</option>
								</select>
							</span>
							<span><input v-model="searchGoodsForm.goods_py" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
						</div>
					</div>
					<div class="div2-right-2">
						<div class="div2-right-text">
							<span><input readonly="readonly" disabled="disabled" value="商品名称：" /></span>
							<span><input readonly="readonly" disabled="disabled" value="是否促销：" /></span>
						</div>
						<div class="div2-right-value">
							<span><input v-model="searchGoodsForm.goods_name" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
							<span>
								<select v-model="searchGoodsForm.is_discounts" @change="searchGoodsData">
									<option value="">全部</option>
									<option value="0">否</option>
									<option value="1">是</option>
								</select>
							</span>
						</div>
					</div>
					<div class="clear-condition">
						<button @click="clearGoodsCondition">清除</button>
						&nbsp;
						<button @click="searchGoodsData">搜索</button>
					</div>
				</div>
				<div class="div3-0 div3-0-1">
					<div class="div-contents">商品信息</div>
					<div class="goods-contents-title goods-contents-title-1">
						<ul>
							<li>序号</li>
							<li>商品编码</li>
							<li>商品名称/品名</li>
							<li>销售价</li>
							<li>会员价</li>
							<li>促销价</li>
							<li>规格</li>
							<li>规格数</li>
							<li>操作</li>
							<li>已选择数量</li>
						</ul>
					</div>
				</div>
				<div class="div3">
					<div class="goods-contents-value goods-contents-value-1">
						<ul v-for="(g, index) in goodsSearchList" :key="index" :class="g.style" @mouseover="mouseInGoodsUl(g.id, 1)"
						 @mouseout="mouseOutGoodsUl(g.id, 1)">
							<li>{{ g.id }}</li>
							<li>{{ g.goodsCode }}</li>
							<li>{{ g.goodsName }}</li>
							<li>{{ g.goodsSalePrice | numFilter }}</li>
							<li>{{ g.memberPrice | numFilter }}</li>
							<li>{{ g.goodsDiscountsPrice | numFilter }}</li>
							<li>{{ g.goodsUnitName }}</li>
							<li>{{ g.unitCount }}</li>
							<li>
								<div class="handler-btn"><button @click="addGoodsFromSearchGoods(g)">添加(+1)</button></div>
							</li>
							<li>{{ g.buyCount }}</li>
						</ul>
					</div>
					<div class="page-next">
						<Page :current="searchGoodsForm.curre_page" show-total :page-size="searchGoodsForm.page_size" :total="total"
						 show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage" @on-page-size-change="changePageSize" />
					</div>
				</div>
			</div>
		</Modal>
		<!-- 收钱 -->
		<Modal width="600" v-model="payCashPriceFlag" title="现金付款" @on-ok="showCashPayOk">
			<div class="input-show-div add-order-info pay-info">
				<div class="input-show-div-text  pay-info-text">
					<span><input readonly="readonly" disabled="disabled" value="付款金额：" /></span>
				</div>
				<div class="input-show-div-value  pay-info-value">
					<span><input v-model="payPrice" @keydown="countPrice" @keyup="countPrice" ref="cashPayRef" /></span>
				</div>
			</div>
		</Modal>
		<!-- 多个订单结果 -->
		<Modal width="950" v-model="moreOrdreFlag" title="订单列表">
			<div class="">
				<div class="more-order-title">
					<div>订单号</div>
					<div>桌号</div>
					<div>会员号</div>
					<div>订单状态</div>
					<div>订单更新时间</div>
					<div>操作</div>
				</div>
				<div style="clear: both;"></div>
				<div class="more-order-content">
					<div @click="clickOrderItem(item)" v-for="(item, index) in orderGoodsLists" :key="index" :class="item.style"
					 @mouseover="mouseInGoodsUl(item.orderNum, 2)" @mouseout="mouseOutGoodsUl(item.orderNum, 2)">
						<div>{{ item.orderNum }}</div>
						<div>{{ item.tableName }}</div>
						<div>{{ item.userPhone }}</div>
						<div>{{ item.orderStatusName }}</div>
						<div>{{ item.lastUpdateTime }}</div>
						<div><span>选择</span></div>
					</div>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
	import Navigation from '@/components/Navigation.vue';
	import axios from '@/network/request.js';
	import {
		timeToTimestamp
	} from '@/commons/common.js';

	export default {
		components: {
			Navigation: Navigation
		},
		data() {
			return {
				lock: false,
				total: 0,
				date: new Date(),
				fullscreen: true,
				addGoodsFlag: false,
				addOrderInfoFlag: false,
				moreOrdreFlag: false, // 多个订单明结果
				//付款
				payCashPriceFlag: false,
				payWxPriceFlag: false,
				payAlipayPriceFlag: false,
				payAccountPriceFlag: false,
				//
				searchOrderFlag: false,
				searchPhoneOrderFlag: false,
				/** 数据结果 */
				orderGoodsList: [],
				orderGoodsLists: [], // 查询得到多个订单数据的时候
				goodsSearchList: [],
				/** 计算总价 */
				orderPrice: 0,
				discountsPriceCountAll: 0,
				realPrice: 0,
				payPrice: 0, //收到的钱
				returnPrice: 0,
				returnPriceText: '找零',
				goodsCount: 0,
				// 折扣
				discountsCouponPriceCount: 0, //优惠券折扣
				discountsMemberPriceCount: 0, //会员折扣
				discountsPriceCount: 0, //促销折扣
				//
				unique_key: null,
				//
				orderPass: null,
				//head
				tableName: null,
				personCount: null,
				serverName: null,
				//
				orderInfo: {
					order_id: null,
					order_no: null,
					order_status: 0,
					order_status_name: null,
					pay_method: null,
					pay_method_name: null
				},
				addGoodsFormData: {},
				searchGoodsForm: {
					curre_page: 1,
					page_size: 10,
					goods_code: null,
					shop_code: null,
					classify_code: null,
					goods_py: null,
					goods_name: null,
					is_discounts: null,
					search_absolute: 0,
					order_no: null
				},
				addOrderFormData: {
					table_name: null,
					person_count: null,
					server_name: null
				},
				searchOrderForm: {
					curre_page: 1,
					page_size: 10,
					order_no: null,
					goods_code: null,
					table_name: null,
					user_phone: null,
					search_absolute: 1
				},
				classifys: [],
				widthStyle:0
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
		created() {},
		mounted() {
			let vm = this; // 声明一个变量指向Vue实例this，保证作用域一致
			let width  = document.documentElement.clientWidth;
			this.widthStyle = "width: "+width+"px;";
			//
			vm.$nextTick(() => {
				vm.findClassify();
				vm.$refs.myFocus.focus();
			});
			this.countPrice();
			//显示系统时间
			this.timer = setInterval(() => {
				vm.date = new Date(); // 修改数据date
			}, 1000);
		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
			}
		},
		methods: {
			shopCodeInputGetFocus() {
				this.$refs.redsc.focus();
			},
			mouseOutGoodsUl(id, index) {
				this.mouseInOutGoods(id, 'out', index);
			},
			mouseInGoodsUl(id, index) {
				this.mouseInOutGoods(id, 'in', index);
			},
			mouseInOutGoods(id, type, index) {
				if (index == 1) {
					this.goodsSearchList.forEach(item => {
						let id_ = item.id;
						if (type == 'in') {
							if (id == id_) {
								item.style = 'mouse-in-goods-ul';
							} else {
								item.style = 'mouse-out-goods-ul';
							}
						} else {
							if (id == id_) {
								item.style = 'mouse-out-goods-ul';
							}
						}
					});
				} else if (index == 2) {
					this.orderGoodsLists.forEach(item => {
						let id_ = item.orderNum;
						if (type == 'in') {
							if (id == id_) {
								item.style = 'mouse-in-goods-ul';
							} else {
								item.style = 'mouse-out-goods-ul';
							}
						} else {
							if (id == id_) {
								item.style = 'mouse-out-goods-ul';
							}
						}
					});
				} else {
					this.orderGoodsList.forEach(item => {
						let id_ = item.id;
						if (type == 'in') {
							if (id == id_) {
								item.style = 'mouse-in-goods-ul';
							} else {
								item.style = 'mouse-out-goods-ul';
							}
						} else {
							if (id == id_) {
								item.style = 'mouse-out-goods-ul';
							}
						}
					});
				}
				this.countPrice();
			},
			changePage(current) {
				this.searchGoodsForm.curre_page = current;
				this.searchGoodsData();
			},
			changePageSize(pageSize) {
				this.searchGoodsForm.page_size = pageSize;
				this.searchGoodsForm.curre_page = 1;
				this.searchGoodsData();
			},
			// 价格计算
			countPrice() {
				let vm = this;
				if (vm.orderInfo.order_status && vm.orderInfo.order_status != 0) {
					vm.payPrice = vm.realPrice;
				}
				//优惠合计
				vm.returnPrice = vm.payPrice - vm.realPrice;
				if (vm.returnPrice < 0) {
					vm.returnPrice = vm.realPrice - vm.payPrice;
					vm.returnPriceText = '客户还需支付';
				} else {
					vm.returnPriceText = '找零';
				}
			},
			resetOrderStatus() {
				let vm = this;
				if (!vm.orderPass || vm.orderPass == '') {
					let msg = '秘钥不能为空';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return;
				}
				if (vm.checkOrderNo()) {
					return;
				}
				let params = {
					req_type: 'kc_reset_order_status',
					data: {
						order_id: vm.orderInfo.order_id,
						order_pass: vm.orderPass
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.searchOrderList();
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
				});
			},
			createNewOrder() {
				let vm = this;
				vm.orderGoodsList = [];

				Object.keys(vm.orderInfo).map(i => {
					vm.orderInfo[i] = null;
				});
				Object.keys(vm.searchOrderForm).map(i => {
					vm.searchOrderForm[i] = null;
				});
				Object.keys(vm.addOrderFormData).map(i => {
					vm.addOrderFormData[i] = null;
				});
				//
				vm.serverName = vm.addOrderFormData.server_name;
				vm.personCount = vm.addOrderFormData.person_count;
				vm.tableName = vm.addOrderFormData.table_name;
				// 初始值
				vm.orderInfo.order_status = 0;
				vm.searchOrderForm.curre_page = 1;
				vm.searchOrderForm.page_size = 10;
				vm.searchOrderForm.search_absolute = 1;
				//
				vm.discountsCouponPriceCount = 0;
				vm.discountsMemberPriceCount = 0;
				vm.discountsPriceCount = 0;
				vm.orderPrice = 0;
				vm.discountsPriceCountAll = 0;
				vm.realPrice = 0;
				vm.payPrice = 0;
				vm.returnPrice = 0;
				vm.goodsCount = 0;
				//
				vm.$nextTick(() => {
					vm.$refs.myFocus.focus();
				});
			},
			showAddGoodsView() {
				let vm = this;
				if (vm.checkOpenNew()) {
					return;
				}
				if (vm.checkBeforeAddOrderGoods()) {
					return;
				}
				Object.keys(vm.searchGoodsForm).map(i => {
					vm.searchGoodsForm[i] = null;
				});
				// 初始值
				vm.searchGoodsForm.curre_page = 1;
				vm.searchGoodsForm.page_size = 10;
				vm.searchGoodsForm.search_absolute = 0;
				vm.addGoodsFlag = true;
				vm.searchGoodsData();
			},
			searchOrderList() {
				let vm = this;
				let params = {
					req_type: 'kc_open_order_list',
					data: vm.searchOrderForm
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let orderList = res.data.order_list;
						if (orderList.length == 0) {
							let msg = '订单不存在, 订单号:' + vm.searchOrderForm.order_no;
							vm.$Message.warning({
								content: msg,
								duration: 5
							});
							vm.searchOrderFlag = true;
							return;
						}
						vm.searchOrderFlag = false;
						vm.moreOrdreFlag = false;
						if (orderList.length == 1) {
							vm.orderGoodsList = orderList[0].detail_list;
							vm.discountsCouponPriceCount = orderList[0].discountsTicketPrice;
							vm.discountsMemberPriceCount = orderList[0].discountsMemberPrice;
							vm.discountsPriceCount = orderList[0].discountsPrice;
							vm.orderPrice = orderList[0].orderPrice;
							vm.realPrice = orderList[0].realPrice;
							vm.discountsPriceCountAll = orderList[0].discountsPriceCountAll;
							vm.goodsCount = orderList[0].goodsCount;
							vm.orderInfo.order_id = orderList[0].orderId;
							vm.orderInfo.order_no = vm.searchOrderForm.order_no;
							vm.orderInfo.order_status = orderList[0].orderStatus;
							vm.orderInfo.pay_method = orderList[0].payMethod;
							vm.orderInfo.order_status_name = orderList[0].orderStatusName;
							vm.orderInfo.pay_method_name = orderList[0].payMethodName;
							//
							vm.addOrderFormData.server_name = orderList[0].serverName;
							vm.addOrderFormData.person_count = orderList[0].personCount;
							vm.addOrderFormData.table_name = orderList[0].tableName;
							//
							vm.tableName = orderList[0].tableName;
							vm.personCount = orderList[0].personCount;
							vm.serverName = orderList[0].serverName;
							//
							vm.payPrice = 0;
							vm.orderPass = null;
							//
							vm.countPrice();
						} else {
							vm.orderGoodsLists = orderList;
							vm.moreOrdreFlag = true;
						}
						if (!vm.unique_key) {
							vm.unique_key = res.data.unique_key;
						}
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
					vm.$nextTick(() => {
						vm.$refs.myFocus.focus();
					});
				});
			},
			delOrderGoods(detail) {
				let vm = this;
				if (vm.checkOrderNo()) {
					return;
				}
				let params = {
					req_type: 'kc_open_delete_detail_goods',
					data: {
						detail_id: detail.id,
						order_id: vm.orderInfo.order_id
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let count = res.data.detail_count;
						if (count == 0) {
							vm.orderGoodsList = [];
						} else {
							vm.searchOrderList();
						}
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
					vm.$nextTick(() => {
						vm.$refs.myFocus.focus();
					});
				});
			},
			addGoodsFromSearchGoods(goods) {
				let vm = this;
				if (vm.checkOpenNew()) {
					return;
				}
				let data = {
					goods_id: goods.id,
					shop_no: vm.searchGoodsForm.shop_code,
					user_phone: vm.searchOrderForm.user_phone,
					goods_unit_name: goods.goodsUnitName,
					order_no: vm.searchOrderForm.order_no,
					discounts_remark: '',
					unique_key: vm.unique_key,
					server_name: vm.addOrderFormData.server_name,
					person_count: vm.addOrderFormData.person_count,
					table_name: vm.addOrderFormData.table_name
				};
				vm.addGoodsSubmit(data);
			},
			addGoodsFromOrder(detail) {
				let vm = this;
				if (vm.checkOrderNo()) {
					return;
				}
				if (vm.checkOpenNew()) {
					return;
				}
				let data = {
					goods_id: detail.goodsId,
					shop_no: vm.searchGoodsForm.shop_code,
					user_phone: vm.searchOrderForm.user_phone,
					goods_unit_name: detail.goodsUnitName,
					order_no: vm.searchOrderForm.order_no,
					discounts_remark: '',
					unique_key: vm.unique_key,
					server_name: vm.addOrderFormData.server_name,
					person_count: vm.addOrderFormData.person_count,
					table_name: vm.addOrderFormData.table_name
				};
				vm.addGoodsSubmit(data);
			},
			addGoodsSubmit(data) {
				let vm = this;
				if (vm.checkBeforeAddOrderGoods()) {
					return;
				}
				let params = {
					req_type: 'kc_open_order_add',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					vm.searchOrderForm.goods_code = null;
					if (res.resp_code == 1) {
						vm.orderInfo.order_id = res.data.order_id;
						vm.orderInfo.order_no = res.data.order_no;
						vm.searchOrderForm.order_no = res.data.order_no;
						//
						vm.searchGoodsForm.shop_code = null;
						vm.searchGoodsForm.curre_page = 1;
						vm.searchGoodsForm.page_size = 10;
						//
						vm.searchGoodsData();
						vm.searchOrderList();
					} else {
						if (res.resp_code == 10045) {
							let msg = '订单不存在,添加失败, 订单号:' + vm.searchOrderForm.order_no;
							vm.$Message.warning({
								content: msg,
								duration: 5
							});
							return;
						} else if (50011 != res.resp_code) {
							vm.$Message.warning({
								content: res.resp_desc,
								duration: 5
							});
						}
					}
					vm.$nextTick(() => {
						vm.$refs.myFocus.focus();
					});
				});
			},
			searchGoodsData() {
				//添加 商品页面查询商品
				let vm = this;
				vm.searchGoodsForm.order_no = vm.searchOrderForm.order_no;
				let params = {
					req_type: 'kc_list_goods',
					data: vm.searchGoodsForm
				}; // 参数
				vm.searchGoodsDataSubmit(params, 1);
			},
			searchOrderGoodsData() {
				// 开单页面查询商品
				let vm = this;
				vm.searchOrderForm.shop_no = vm.searchOrderForm.goods_code;
				if (vm.orderGoodsList.length > 0) {
					if (!vm.searchOrderForm.shop_no || vm.searchOrderForm.shop_no == '') {
						return;
					}
				}
				if (!(vm.searchOrderForm.shop_no.length == 13 || vm.searchOrderForm.shop_no.length == 23)) {
					return;
				}
				let params = {
					req_type: 'kc_list_goods',
					data: vm.searchOrderForm
				}; // 参数
				vm.searchGoodsDataSubmit(params, 0);
			},
			searchGoodsDataSubmit(params, type) {
				let vm = this;
				vm.lock = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							vm.goodsSearchList = res.data.goods_list;
							vm.total = res.data.total_num;
							vm.hasNext = res.data.has_next;
							if (!vm.unique_key) {
								vm.unique_key = res.data.unique_key;
							}
							if (res.data.goods_list.length > 0 && type == 0) {
								vm.searchGoodsForm.shop_code = vm.searchOrderForm.goods_code;
								vm.addGoodsFromSearchGoods(res.data.goods_list[0]);
							}
							if (vm.goodsSearchList.length == 0) {
								vm.$Message.warning({
									content: '商品不存在',
									duration: 5
								});
								vm.searchOrderForm.goods_code = '';
							}
						} else {
							vm.$Message.warning({
								content: res.resp_desc,
								duration: 5
							});
						}
						vm.$nextTick(() => {
							vm.$refs.myFocus.focus();
						});
					}).catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.lock = false;
					});
			},
			findClassify() {
				let vm = this;
				let params = {
					req_type: 'kc_find_classify_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.classifys = res.data.classify_list;
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
				});
			},
			showAddOrderInfoView() {
				let vm = this;
				if (vm.checkBeforeAddOrderGoods()) {
					return;
				}
				vm.addOrderFormData.server_name = vm.serverName;
				vm.addOrderFormData.person_count = vm.personCount;
				vm.addOrderFormData.table_name = vm.tableName;
				vm.addOrderInfoFlag = true;
			},
			addOrderTitle() {
				let vm = this;
				if (vm.checkBeforeAddOrderGoods()) {
					return;
				}
				let orderId = vm.orderInfo.order_id;
				if (!orderId) {
					// 当前订单未生成(直接保存数据在页面)
					vm.serverName = vm.addOrderFormData.server_name;
					vm.personCount = vm.addOrderFormData.person_count;
					vm.tableName = vm.addOrderFormData.table_name;
					return;
				}
				let data = {
					order_id: orderId,
					person_count: vm.addOrderFormData.person_count,
					table_name: vm.addOrderFormData.table_name,
					server_name: vm.addOrderFormData.server_name
				};
				let params = {
					req_type: 'kc_add_order_title',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						// vm.searchOrderForm.table_name = vm.addOrderFormData.table_name;
						vm.searchOrderList();
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
				});
			},
			clearGoodsCondition() {
				let vm = this;
				Object.keys(vm.searchGoodsForm).map(i => {
					vm.searchGoodsForm[i] = null;
				});
				// 初始值
				vm.searchGoodsForm.curre_page = 1;
				vm.searchGoodsForm.page_size = 10;
				vm.searchGoodsForm.search_absolute = 0;
				vm.searchGoodsData();
			},
			clickOrderItem(order) {
				let vm = this;
				vm.searchOrderForm.order_no = order.orderNum;
				vm.searchOrderList();
			},
			showCashPay() {
				let vm = this;
				if (!vm.searchOrderForm.order_no || vm.searchOrderForm.order_no == '') {
					let msg = '订单号不能为空';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return;
				}
				if (vm.orderInfo.order_status != 0) {
					const msg = '不能重复支付';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				if (vm.beforePayCheck()) {
					return;
				}
				vm.payPrice = 0;
				vm.payCashPriceFlag = true;
				vm.$nextTick(() => {
					vm.$refs.cashPayRef.focus();
				});
			},
			showCashPayOk() {
				let vm = this;
				if (vm.checkOrderNo()) {
					return;
				}
				const data = {
					order_id: vm.orderInfo.order_id,
					order_status: 1,
					pay_method: 0
				};
				const params = {
					req_type: 'kc_update_order_status',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.payPrice = 0;
						vm.searchOrderList();
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 5
						});
					}
				});
			},
			checkOrderNo() {
				let vm = this;
				if (!vm.searchOrderForm.order_no || vm.searchOrderForm.order_no == '') {
					let msg = '订单号不能为空';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				return false;
			},
			checkOrderStatusCantPay() {
				let vm = this;
				if (vm.orderInfo.order_status != 0) {
					const msg = '不能重复支付';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				return false;
			},
			checkOpenNew() {
				let vm = this;
				if ((!vm.searchOrderForm.order_no || vm.searchOrderForm.order_no == '') && vm.orderGoodsList.length > 0) {
					let msg = '订单号不能为空,请重新开单';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				return false;
			},
			checkBeforeAddOrderGoods() {
				let vm = this;
				if (vm.orderInfo.order_status && vm.orderInfo.order_status != 0) {
					let msg = '订单号已付款,请重新开单';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				return false;
			},
			beforePayCheck() {
				let vm = this;
				if (vm.orderGoodsList.length == 0) {
					const msg = '请先添加商品';
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return true;
				}
				return false;
			}
		}
	};
</script>

<style scoped>
	.page {
		background-color: #f0f0f0;
	}

	li {
		list-style: none;
	}

	input {
		border-radius: 1px;
	}

	/* 桌号信息层 */
	.div1,
	.div2 {
		overflow: auto;
		border-bottom: 2px solid #d0d0d0;
		position: relative;
		background-color: #f0f0f0;
	}

	.title-name {
		position: absolute;
		left: 120px;
		top:20px;
		font-size: 3.5rem;
		font-weight: bold;
	}

	.table-div {
		float: left;
		width: 50%;
		text-align: center;
		margin: 15px 0;
	}

	.table-div>ul {
		float: left;
		width: 50%;
	}

	.ul-text {
		text-align: right;
	}

	.ul-value {
		text-align: left;
	}

	/* 查询录入层 */
	.div2 {
		padding: 15px 0;
		position: relative;
		overflow: auto;
	}

	.div2-left,
	.div2-right,
	.div2-right-2 {
		text-align: center;
		float: left;
	}

	.div2-left {
		width: 30%;
	}

	.div2-right {
		width: 30%;
	}

	.div2-right-2 {
		width: 40%;
	}

	.div2-left-text,
	.div2-left-value,
	.div2-right-text,
	.div2-right-value {
		float: left;
		width: 50%;
	}

	.div2-left-text>span,
	.div2-left-value>span,
	.div2-right-text>span,
	.div2-right-value>span {
		width: 100%;
		float: left;
		display: block;
		padding: 5px 0;
	}

	.div2-left-text,
	.div2-left-text>span>input,
	.div2-right-text,
	.div2-right-text>span>input {
		text-align: right;
		background-color: #f0f0f0;
		border: 2px solid #f0f0f0;
	}

	.div2-left-value {
		text-align: left;
	}

	.order-msg {
		color: red;
		padding-left: 5px;
	}

	.div2-left-value>span>input {
		padding-left: 10px;
		width: 100%;
	}

	.div2-right-value {
		padding-left: 0px;
		text-align: left;
	}

	.chose-goods {
		position: absolute;
		right: 50px;
		bottom: 15px;
	}

	.chose-goods>button {
		padding: 5px 25px;
		cursor: pointer;
		margin-left: 18px;
	}

	/* 内容层title */
	.div-contents {
		height: 50px;
		line-height: 50px;
		font-weight: 500;
		text-align: center;
		color: wheat;
		background-color: #272727;
	}

	/* 内容层 */
	.div3 {
		overflow: auto;
		text-align: center;
		width: 100%;
		background-color: #f0f0f0;
	}

	.goods-contents-title>ul>li,
	.goods-contents-value>ul>li {
		float: left;
	}

	.goods-contents-title {
		font-weight: 900;
		padding: 10px 0;
		background-color: #f0f0f0;
		border-bottom: 1px solid #6c6c6c;
		overflow: auto;
		text-align: center;
	}

	.goods-contents-value {
	}

	.goods-contents-value>ul>li {
		padding: 8px 0;
		cursor: pointer;
	}

	.mouse-out-goods-ul {
		background-color: #f0f0f0;
		color: #6c6c6c;
	}

	.mouse-in-goods-ul {
		background-color: #272727;
		color: white;
	}

	.goods-contents-title,
	.goods-contents-value>ul {
		clear: both;
		overflow: hidden;
	}

	.class-detail-id {
		width: 5%;
	}

	.class-goods-code {
		width: 15%;
	}

	.class-goods-name {
		width: 15%;
	}

	.class-buy-count {
		width: 8%;
	}

	.class-price-true {
		width: 8%;
	}

	.class-sale-price {
		width: 8%;
	}

	.class-member-price {
		width: 8%;
	}

	.class-discounts-price {
		width: 8%;
	}

	.class-unit {
		width: 8%;
	}

	.class-unit-count {
		width: 5%;
	}

	.class-do {
		width: 12%;
	}

	/* 价格汇总层 */
	.div4 {
		position: fixed;
		width: 100%;
		bottom: 0px;
		height: 240px;
		border-top: 2px solid #d0d0d0;
		background-color: #f0f0f0;
	}

	.count-other {
		position: absolute;
		bottom: 15px;
		text-align: center;
		width: 40%;
	}

	.count-other>div {
		float: left;
		display: block;
	}

	.count-other-text>span,
	.count-other-value>span {
		display: block;
		float: left;
		line-height: 45px;
		width: 100%;
	}

	.count-other-text {
		text-align: right;
		width: 30%;
	}

	.count-other-value {
		text-align: left;
		padding-left: 5px;
		width: 70%;
	}

	.sure-btn {
		cursor: pointer;
		position: absolute;
		top: 0px;
		left: 15px;
		text-align: center;
		padding: 15px 0;
	}

	.sure-btn>button {
		padding: 5px 0;
		width: 100px;
		font-weight: 500;
		cursor: pointer;
		position: relative;
		margin-right: 10px;
	}

	.count-div {
		position: absolute;
		right: 0px;
		height: 100%;
		width: 750px;
		text-align: center;
	}

	.count-div>div {
		float: left;
		display: block;
		height: 100%;
		width: 50%;
		font-size: 1.5rem;
		font-weight: normal;
	}

	.count-text>span,
	.count-value>span {
		width: 100%;
		float: left;
		height: 60px;
		line-height: 60px;
		display: block;
	}

	.count-text {
		width: 40%;
		text-align: right;
	}

	.count-value {
		width: 60%;
		text-align: left;
		padding-left: 30px;
	}

	.count-text>span,
	.count-value>span {
		font-size: 1.8rem;
		color: black;
		font-weight: 900;
	}

	.count-text-gray>span,
	.count-value-gray>span {
		font-size: 2.1rem;
		font-weight: normal;
	}

	.count-div-gray {
		position: absolute;
		right: 700px;
		width: 500px;
	}

	/* 操作按钮 */
	.handler-btn>button {
		padding: 3px 15px;
		cursor: pointer;
	}

	.handler-btn>button:nth-child(2) {
		margin: 0px 15px;
	}

	/* 布局 */
	.div1,
	.div2,
	.div3-0 {
		width: 100%;
		background-color: #f0f0f0;
		overflow: hidden;
		position: fixed;
	}

	.div1 {
		height: 90px;
		top: 0px;
		z-index: 100;
	}

	.div2 {
		height: 180px;
		top: 90px;
		z-index: 90;
	}

	.div3-0 {
		height: 120px;
		top: 270px;
		z-index: 80;
	}

	.div3-1 {
		width: 100%;
		height: 390px;
		background-color: #f0f0f0;
	}

	/* 添加订单信息 */
	.input-show-div {
		text-align: center;
		overflow: auto;
	}

	.input-show-div-text,
	.input-show-div-value {
		float: left;
		width: 50%;
	}

	.input-show-div-text input {
		text-align: right;
	}

	.input-show-div-value input {
		padding-left: 10px;
	}

	.add-order-info {
		width: 500px;
		margin: 30px auto;
	}

	.add-order-info-text>span>input {
		background-color: white;
		border: none;
	}

	.add-order-info-text,
	.add-order-info-text>span>input {
		width: 150px;
	}

	/* 添加付款金额 */
	.pay-info {
		font-size: 1.8rem;
	}

	.pay-info-text>span>input {
		width: 250px;
		background-color: white;
		border: none;
	}

	.pay-info-value>span>input {
		width: 250px;
		padding-left: 10px;
	}

	/* 添加商品 */
	.append-goods {
		position: relative;
		background-color: #f0f0f0;
		height: 100%;
	}

	.div2-1,
	.div3-0-1,
	.div3-1-1 {
		width: 100%;
		background-color: #f0f0f0;
		overflow: hidden;
		position: relative;
	}

	.div2-1 {
		top: 20px;
		border: none;
	}

	.div3-0-1 {
		top: 2px;
		z-index: 6666;
	}

	.div3-1-1 {
		height: 30px;
	}

	.goods-contents-value {
		background-color: #f0f0f0;
		overflow: auto;
	}

	.goods-contents-title-1,
	.goods-contents-value-1>ul {
		clear: both;
		overflow: hidden;
	}

	.goods-contents-title-1>ul>li:first-child,
	.goods-contents-value-1>ul>li:first-child {
		width: 5%;
	}

	.goods-contents-title-1>ul>li:nth-child(2),
	.goods-contents-value-1>ul>li:nth-child(2) {
		width: 20%;
	}

	.goods-contents-title-1>ul>li:nth-child(3),
	.goods-contents-value-1>ul>li:nth-child(3) {
		width: 20%;
	}

	.goods-contents-title-1>ul>li:nth-child(4),
	.goods-contents-value-1>ul>li:nth-child(4) {
		width: 8%;
	}

	.goods-contents-title-1>ul>li:nth-child(5),
	.goods-contents-value-1>ul>li:nth-child(5) {
		width: 8%;
	}

	.goods-contents-title-1>ul>li:nth-child(6),
	.goods-contents-value-1>ul>li:nth-child(6) {
		width: 8%;
	}

	.goods-contents-title-1>ul>li:nth-child(7),
	.goods-contents-value-1>ul>li:nth-child(7) {
		width: 5%;
	}

	.goods-contents-title-1>ul>li:nth-child(8),
	.goods-contents-value-1>ul>li:nth-child(8) {
		width: 8%;
	}

	.goods-contents-title-1>ul>li:nth-child(9),
	.goods-contents-value-1>ul>li:nth-child(9) {
		width: 10%;
	}

	.goods-contents-title-1>ul>li:nth-child(10),
	.goods-contents-value-1>ul>li:nth-child(10) {
		width: 8%;
	}

	.clear-condition {
		position: absolute;
		right: 40px;
		bottom: 40px;
	}

	.clear-condition>button {
		padding: 5px 25px;
	}

	.clear-condition2 {
		bottom: 100px;
		right: 50px;
	}

	/*  page */
	.page-next {
		background-color: #f0f0f0;
		text-align: right;
		margin-right: 30px;
		padding: 50px 0;
	}

	/* 多个订单列表 */
	.more-order-title,
	.more-order-content {
		text-align: center;
	}

	.more-order-title {
		font-weight: bold;
		border-bottom: 1px solid #6c6c6c;
		overflow: auto;
		padding: 5px 0;
	}

	.more-order-content>div {
		padding-bottom: 15px;
		border-bottom: 2px solid #d0d0d0;
		height: 40px;
		line-height: 40px;
		cursor: pointer;
	}

	.more-order-title>div,
	.more-order-content>div>div {
		float: left;
		text-align: center;
	}

	.more-order-title>div:nth-child(1),
	.more-order-content>div :nth-child(1) {
		width: 25%;
	}

	.more-order-title>div:nth-child(2),
	.more-order-content>div :nth-child(2) {
		width: 10%;
	}

	.more-order-title>div:nth-child(3),
	.more-order-content>div :nth-child(3) {
		width: 15%;
	}

	.more-order-title>div:nth-child(4),
	.more-order-content>div :nth-child(4) {
		width: 10%;
	}

	.more-order-title>div:nth-child(5),
	.more-order-content>div :nth-child(5) {
		width: 25%;
	}

	.more-order-title>div:nth-child(6),
	.more-order-content>div :nth-child(6) {
		width: 15%;
	}

	.more-order-content>div :nth-child(6) {
		position: relative;
	}

	.more-order-content span {
		cursor: pointer;
	}
	input {
		border: 1px solid grey;
		margin-top: 2px;
	}

	/* 修改默认字体大小 */
	>>>.ivu-form .ivu-form-item-label,
	>>>.ivu-input,
	>>>.ivu-btn,
	>>>.ivu-table-cell {
		font-size: 12px;
	}

	>>>.ivu-modal-header p,
	>>>.ivu-modal-header-inner {
		font-size: 20px;
	}

	>>>.ivu-modal-close .ivu-icon-ios-close {
		font-size: 33px;
	}
	
	.div3, .body,.goods-contents-value{
		overflow-x: hidden;
	}
	
</style>
