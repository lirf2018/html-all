<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="div1">
				<div class="title-name"><span>开单</span></div>
				<div class="table-div">
					<ul class="ul-text">
						<li>桌号：</li>
						<li>人数：</li>
					</ul>
					<ul class="ul-value">
						<li>{{ tableNum }}</li>
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
						<li>{{ date| dateFormat }} &nbsp;</li>
					</ul>
				</div>
			</div>
			<div class="div2">
				<div class="div2-left">
					<div class="div2-left-text">
						<span><input readonly="readonly" disabled="disabled" value="订单号：" /></span>
						<span><input readonly="readonly" disabled="disabled" value="商品码：" /></span>
					</div>
					<div class="div2-left-value">
						<span>
							<input value="" v-model="orderNo" />
							<strong class="order-msg">订单不存在</strong>
						</span>
						<span><input value="" v-model="goodsCode" /></span>
					</div>
				</div>
				<div class="div2-right">
					<div class="div2-right-text">
						<span><input readonly="readonly" disabled="disabled" value="会员号：" /></span>
						<span><input readonly="readonly" disabled="disabled" value="优惠码：" /></span>
					</div>
					<div class="div2-right-value">
						<span><input v-model="memberNo" /></span>
						<span><input v-model="discountsNo" /></span>
					</div>
				</div>
				<div class="chose-goods">
					<button @click="addOrderInfoFlag = true">添加订单信息</button>
					<button @click="addGoodsDataShow()">添加商品</button>
				</div>
				<div class="clear-condition clear-condition2"><button @click="clearCondition">清除</button></div>
			</div>
			<div class="div3-0">
				<div class="div-contents">商品信息</div>
				<div class="goods-contents-title">
					<ul>
						<li>序号</li>
						<li>商品名称/品名</li>
						<li>购买数</li>
						<li>销售价</li>
						<li>会员价</li>
						<li>促销价</li>
						<li>规格</li>
						<li>规格数</li>
						<li>操作</li>
					</ul>
				</div>
			</div>
			<div class="div3-1"></div>
			<div class="div3">
				<div class="goods-contents-value">
					<ul v-for="(g, index) in orderGoodsList" :key="index" :class="g.style" @mouseover="mouseInGoodsUl(g.id, 0)" @mouseout="mouseOutGoodsUl(g.id, 0)">
						<li>{{ g.id }}</li>
						<li>{{ g.goodsName }}</li>
						<li>{{ g.buyCount }}</li>
						<li>{{ g.goodsSalePrice | numFilter }}</li>
						<li>{{ g.memberPrice | numFilter }}</li>
						<li>{{ g.goodsDiscountsPrice | numFilter }}</li>
						<li>{{ g.goodsUnit }}</li>
						<li>{{ g.unitCount }}</li>
						<li>
							<div class="handler-btn">
								<button @click="delGoods(g)">删除</button>
								<button @click="reduceGoods(g)">减少</button>
								<button @click="addGoods(g)">增加</button>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div style="height: 250px;background-color: #f0f0f0;"></div>
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
						<span>消费合计 ：</span>
						<span>优惠合计 ：</span>
					</div>
					<div class="count-value count-value-gray">
						<span>{{ orderPrice | numFilter }}</span>
						<span>{{ discountsPriceCountAll | numFilter }}</span>
					</div>
				</div>
				<div class="count-div">
					<div class="count-text">
						<span>实付合计：</span>
						<span>付款金额 ：</span>
						<span>{{ returnPriceText }}：</span>
					</div>
					<div class="count-value">
						<span>{{ realPrice | numFilter }}</span>
						<span>{{ payPrice | numFilter }}</span>
						<span>{{ returnPrice | numFilter }}</span>
					</div>
				</div>
				<div class="sure-btn">
					<button @keyup.enter="submit" @click="submit">确认</button>
					<button @click="payPriceFlag = true">结算</button>
				</div>
			</div>
		</div>
		<!-- 添加 订单信息 -->
		<Modal width="600" v-model="addOrderInfoFlag" title="添加订单信息">
			<div class="input-show-div add-order-info">
				<div class="input-show-div-text add-order-info-text">
					<span><input readonly="readonly" disabled="disabled" value="桌号：" /></span>
					<span><input readonly="readonly" disabled="disabled" value="人数：" /></span>
					<span><input readonly="readonly" disabled="disabled" value="服务员：" /></span>
				</div>
				<div class="input-show-div-value add-order-info-value">
					<span><input v-model="tableNum" /></span>
					<span><input v-model="personCount" /></span>
					<span><input v-model="serverName" /></span>
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
							<span><input value="" v-model="goodsCode_" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
							<span><input value="" v-model="shopCode_" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
						</div>
					</div>
					<div class="div2-right">
						<div class="div2-right-text">
							<span><input readonly="readonly" disabled="disabled" value="商品类别：" /></span>
							<span><input readonly="readonly" disabled="disabled" value="商品拼音：" /></span>
						</div>
						<div class="div2-right-value">
							<span><input v-model="classifyId" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
							<span><input v-model="goodsPingYin" @keydown="searchGoodsData" @keyup="searchGoodsData" /></span>
						</div>
					</div>
					<div class="clear-condition"><button @click="clearCondition">清除</button></div>
				</div>
				<div class="div3-0 div3-0-1">
					<div class="div-contents">商品信息</div>
					<div class="goods-contents-title goods-contents-title-1">
						<ul>
							<li>序号</li>
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
						<ul v-for="(g, index) in goodsSearchList" :key="index" :class="g.style" @mouseover="mouseInGoodsUl(g.id, 1)" @mouseout="mouseOutGoodsUl(g.id, 1)">
							<li>{{ g.id }}</li>
							<li>{{ g.goodsName }}</li>
							<li>{{ g.goodsSalePrice | numFilter }}</li>
							<li>{{ g.memberPrice | numFilter }}</li>
							<li>{{ g.goodsDiscountsPrice | numFilter }}</li>
							<li>{{ g.goodsUnit }}</li>
							<li>{{ g.unitCount }}</li>
							<li>
								<div class="handler-btn">
									<button @click="appendReduce(g)">删除(-1)</button>
									<button @click="appendAddGoods(g)">添加(+1)</button>
								</div>
							</li>
							<li>{{ g.buyCount }}</li>
						</ul>
					</div>
				</div>
			</div>
		</Modal>
		<!-- 收钱 -->
		<Modal width="600" v-model="payPriceFlag" title="付款金额">
			<div class="input-show-div add-order-info pay-info">
				<div class="input-show-div-text  pay-info-text">
					<span><input readonly="readonly" disabled="disabled" value="付款金额：" /></span>
				</div>
				<div class="input-show-div-value  pay-info-value">
					<span><input v-model="payPrice" @keydown="countPrice" @keyup="countPrice" /></span>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
	components: { Navigation: Navigation },
	data() {
		return {
			date: new Date(),
			fullscreen: true,
			addGoodsFlag: false,
			addOrderInfoFlag: false,
			payPriceFlag: false,
			/** 桌号信息 */
			tableNum: null,
			personCount: null,
			serverName: null,
			/** 查询条件 */
			orderNo: null,
			goodsCode: null,
			shopCode: null,
			memberNo: null,
			discountsNo: null,
			goodsCode_: null,
			shopCode_: null,
			classifyId: null,
			goodsPingYin: null,
			/** 数据结果 */
			orderGoodsList: [],
			goodsSearchList: [],
			/** 计算总价 */
			orderPrice: 0,
			discountsPriceCountAll: 0,
			realPrice: 0,
			payPrice: 0, //收到的钱
			returnPrice: 0,
			returnPriceText: '找零',
			// 折扣
			discountsCouponPriceCount: 0.1, //优惠券折扣
			discountsMemberPriceCount: 0, //会员折扣
			discountsPriceCount: 0 //促销折扣
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
			const dt = new Date(originVal);
			//年的时间
			const y = dt.getFullYear();
			//月的时间  .padStart 不足两位自动补0  2位长度
			const m = (dt.getMonth() + 1 + '').padStart(2, '0');
			//日的时间
			const d = (dt.getDate() + '').padStart(2, '0');

			//小时
			const hh = (dt.getHours() + '').padStart(2, '0');
			//分钟
			const mm = (dt.getMinutes() + '').padStart(2, '0');
			//秒数
			const ss = (dt.getSeconds() + '').padStart(2, '0');

			//将它们拼接成完整的字符串
			//return 'yyyy-mm-dd hh:mm:ss'  可以改成下面的方法
			return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
		}
	},
	created() {
		this.orderGoodsList = [
			{
				id: 1,
				goodsCode: '00',
				goodsName: '王老鸡00',
				buyCount: 1,
				goodsUnit: '只',
				unitCount: 1,
				goodsSalePrice: 4.0,
				memberPrice: 1.5,
				goodsDiscountsPrice: 4.0,
				style: 'mouse-out-goods-ul',
				status: 1
			},
			{
				id: 2,
				goodsCode: '01',
				goodsName: '农夫山泉01',
				buyCount: 1,
				goodsUnit: '瓶',
				unitCount: 1,
				goodsSalePrice: 5,
				memberPrice: 3.3,
				goodsDiscountsPrice: 2.2,
				style: 'mouse-out-goods-ul',
				status: 1
			},
			{
				id: 3,
				goodsCode: '02',
				goodsName: '农夫山泉02',
				buyCount: 1,
				goodsUnit: '瓶',
				unitCount: 1,
				goodsSalePrice: 2.2,
				memberPrice: 2.2,
				goodsDiscountsPrice: 2.2,
				style: 'mouse-out-goods-ul',
				status: 1
			},
			{
				id: 4,
				goodsCode: '03',
				goodsName: '农山泉夫03',
				buyCount: 1,
				goodsUnit: '瓶',
				unitCount: 1,
				goodsSalePrice: 2.2,
				memberPrice: 2.0,
				goodsDiscountsPrice: 2.2,
				style: 'mouse-out-goods-ul',
				status: 1
			},
			{
				id: 5,
				goodsCode: '04',
				goodsName: '农夫山泉04',
				buyCount: 1,
				goodsUnit: '瓶',
				unitCount: 1,
				goodsSalePrice: 2.2,
				memberPrice: 2.2,
				goodsDiscountsPrice: 2.2,
				style: 'mouse-out-goods-ul',
				status: 1
			}
		];
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.redsc.focus();
		});
		this.countPrice();
		//显示系统时间
		let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
		this.timer = setInterval(() => {
			_this.date = new Date(); // 修改数据date
		}, 1000);
	},
	beforeDestroy() {
		if (this.timer) {
			clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
		}
	},
	methods: {
		submit() {
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
		delGoods(goods) {
			this.doGoods(goods, 'del');
		},
		reduceGoods(goods) {
			this.doGoods(goods, 'reduce');
		},
		addGoods(goods) {
			this.doGoods(goods, 'add');
		},
		appendAddGoods(goods) {
			this.doGoods(goods, 'appendAdd');
		},
		appendReduce(goods) {
			this.doGoods(goods, 'appendReduce');
		},
		doGoods(goods, type) {
			let goodsCode = goods.goodsCode;
			let goodsUnit = goods.goodsUnit;
			let unitCount = goods.unitCount;
			let appendAddFlag = true;
			for (let i = 0; i < this.orderGoodsList.length; i++) {
				let item = this.orderGoodsList[i];
				if (item.goodsCode == goodsCode && item.goodsUnit == goodsUnit && item.unitCount == unitCount) {
					if ('del' == type) {
						this.updateGoodsOrder(item, 'del');
					} else if ('reduce' == type) {
						if (item.buyCount > 1) {
							item.buyCount = item.buyCount - 1;
						} else {
							this.$Notice.open({
								top: 50,
								title: '温馨提示',
								desc: '当前商品(' + item.goodsName + ')购买数量为1,不能减少'
							});
						}
					} else if ('add' == type) {
						item.buyCount = item.buyCount + 1;
					} else if ('appendReduce' == type) {
						item.buyCount = item.buyCount - 1;
						if (item.buyCount < 1) {
							this.updateGoodsOrder(item, 'del');
						}
					} else if ('appendAdd' == type) {
						appendAddFlag = false;
						item.buyCount = item.buyCount + 1;
					}
				}
			}
			let aa = this.orderGoodsList;
			if ('appendAdd' == type && appendAddFlag) {
				// 添加到数据库中（修改数据库中的数据），返回修改后的订单商品数据
				this.updateGoodsOrder(goods, 'add');
			}
			// 查询商品处理
			for (let i = 0; i < this.goodsSearchList.length; i++) {
				let item = this.goodsSearchList[i];
				if (item.goodsCode == goodsCode && item.goodsUnit == goodsUnit && item.unitCount == unitCount) {
					if ('appendReduce' == type) {
						item.buyCount = item.buyCount - 1 < 0 ? 0 : item.buyCount - 1;
					} else if ('appendAdd' == type) {
						item.buyCount = item.buyCount + 1;
					}
				}
			}
			this.countPrice();
		},
		addGoodsDataShow() {
			this.addGoodsFlag = true;
			this.searchGoodsData();
		},
		searchGoodsData() {
			this.goodsSearchList = [
				{
					id: 1,
					goodsCode: '00',
					goodsName: '王老鸡00',
					buyCount: 0,
					goodsUnit: '只',
					unitCount: 1,
					goodsSalePrice: 200.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 100.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'a'
				},
				{
					id: 2,
					goodsCode: '01',
					goodsName: '农夫山泉01',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'b'
				},
				{
					id: 3,
					goodsCode: '02',
					goodsName: '农夫山泉02',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'c'
				},
				{
					id: 4,
					goodsCode: '03',
					goodsName: '农山泉夫03',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'd'
				},
				{
					id: 5,
					goodsCode: '04',
					goodsName: '农夫山泉04',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'e'
				},
				{
					id: 6,
					goodsCode: '100',
					goodsName: '农夫山泉100',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'a'
				},
				{
					id: 7,
					goodsCode: '111',
					goodsName: '王老鸡111',
					buyCount: 0,
					goodsUnit: '只',
					unitCount: 1,
					goodsSalePrice: 200.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 100.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'c'
				},
				{
					id: 8,
					goodsCode: '1000',
					goodsName: '农夫山泉山泉山泉山泉1000',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'f'
				},
				{
					id: 9,
					goodsCode: '90',
					goodsName: '农夫山泉山泉山泉90',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'd'
				},
				{
					id: 10,
					goodsCode: '180',
					goodsName: '农夫山泉180',
					buyCount: 0,
					goodsUnit: '瓶',
					unitCount: 1,
					goodsSalePrice: 2.2,
					memberPrice: 33.33,
					goodsDiscountsPrice: 1.5,
					style: 'mouse-out-goods-ul',
					goodsPingYin: 'a'
				}
			];
			//数据处理
			this.goodsSearchList.forEach(item => {
				this.orderGoodsList.forEach(item_ => {
					if (item.goodsCode == item_.goodsCode && item.goodsUnit == item_.goodsUnit && item.unitCount == item_.unitCount) {
						item.buyCount = item_.buyCount;
					}
				});
			});
			this.countPrice();
		},
		clearCondition() {
			this.goodsCode_ = '';
			this.shopCode_ = '';
			this.classifyId = '';
			this.goodsPingYin = '';
			this.orderNo = '';
			this.goodsCode = '';
			this.shopCode = '';
			this.memberNo = '';
			this.discountsNo = '';
		},
		updateGoodsOrder(goods, type) {
			// 添加到数据库中（修改数据库中的数据），返回修改后的订单商品数据
			if ('del' == type) {
				let goodsCode = goods.goodsCode;
				let goodsUnit = goods.goodsUnit;
				let unitCount = goods.unitCount;
				let newGoodsOrderList = [];
				this.orderGoodsList.forEach(item => {
					if (item.goodsCode != goodsCode || item.goodsUnit != goodsUnit || item.unitCount != unitCount) {
						newGoodsOrderList.push(item);
					}
				});
				this.orderGoodsList = newGoodsOrderList;
			} else {
				let data = {
					id: goods.id + 1000,
					goodsCode: goods.goodsCode,
					goodsName: goods.goodsName,
					buyCount: 1,
					goodsUnit: goods.goodsUnit,
					unitCount: 1,
					goodsSalePrice: goods.goodsSalePrice,
					memberPrice: goods.memberPrice,
					goodsDiscountsPrice: goods.goodsDiscountsPrice,
					style: 'mouse-out-goods-ul'
				};
				this.orderGoodsList.push(data);
			}
			this.countPrice();
		},
		// 价格计算
		countPrice() {
			let orderPrice_ = 0; //订单总价格（消费合计）按销售价格计算
			let orderPriceMember = 0; //订单总价格（消费合计）按会员价格计算
			let orderPriceDiscounts = 0; //订单总价格（消费合计）按促销价格计算

			this.orderGoodsList.forEach(item => {
				let buyCount = item.buyCount;
				let goodsSalePrice = item.goodsSalePrice;
				let goodsDiscountsPrice = item.goodsDiscountsPrice;
				let memberPrice = item.memberPrice;
				orderPrice_ = orderPrice_ + buyCount * goodsSalePrice;
				orderPriceMember = orderPriceMember + buyCount * memberPrice;
				orderPriceDiscounts = orderPriceDiscounts + buyCount * goodsDiscountsPrice;
			});
			this.orderPrice = orderPrice_;
			// console.log("-------orderPrice_="+orderPrice_);
			// console.log("-------orderPriceMember="+orderPriceMember);
			// console.log("-------orderPriceDiscounts="+orderPriceDiscounts);
			// console.log("-------discountsCouponPriceCount="+this.discountsCouponPriceCount);

			//是否是会员
			let isMember = false;
			if (isMember) {
				//判断促销价格与会员价格
				if (orderPriceDiscounts < orderPriceMember) {
					//促销价小于会员价格(以促销价格算)
					this.realPrice = orderPriceDiscounts - this.discountsCouponPriceCount;
					this.discountsPriceCount = this.orderPrice - orderPriceDiscounts; //促销折扣总价
				} else {
					this.realPrice = orderPriceMember - this.discountsCouponPriceCount;
					this.discountsMemberPriceCount = this.orderPrice - orderPriceMember; //会员折扣总价
				}
			} else {
				this.realPrice = orderPriceDiscounts - this.discountsCouponPriceCount;
				this.discountsPriceCount = this.orderPrice - orderPriceDiscounts; //促销折扣总价
			}

			//优惠合计
			this.discountsPriceCountAll = this.orderPrice - this.realPrice;
			this.returnPrice = this.payPrice - this.realPrice;
			if (this.returnPrice < 0) {
				this.returnPrice = this.realPrice - this.payPrice;
				this.returnPriceText = '客户还需支付';
			} else {
				this.returnPriceText = '找零';
			}
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
}
.title-name {
	position: absolute;
	left: 120px;
	font-size: 5rem;
}
.table-div {
	float: left;
	width: 50%;
	text-align: center;
	font-size: 1.5rem;
	margin: 15px 0;
}
.table-div > ul {
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
	overflow: auto;
	padding: 15px 0;
	position: relative;
}
.div2-left,
.div2-right {
	text-align: center;
	float: left;
}

.div2-left {
	width: 60%;
}
.div2-right {
	width: 30%;
}
.div2-left-text,
.div2-left-value,
.div2-right-text,
.div2-right-value {
	float: left;
	width: 50%;
}
.div2-left-text > span,
.div2-left-value > span,
.div2-right-text > span,
.div2-right-value > span {
	width: 100%;
	float: left;
	display: block;
	padding: 5px 0;
	font-size: 1.5rem;
}
.div2-left-text,
.div2-left-text > span > input,
.div2-right-text,
.div2-right-text > span > input {
	text-align: right;
	background-color: #f0f0f0;
	border: 2px solid #f0f0f0;
}
.div2-left-value {
	text-align: left;
}

.order-msg {
	font-size: 1rem;
	color: red;
	padding-left: 5px;
}

.div2-left-value > span > input {
	padding-left: 10px;
	width: 75%;
}

.div2-right-value {
	padding-left: 15px;
}
.chose-goods {
	position: absolute;
	right: 50px;
	bottom: 15px;
}

.chose-goods > button {
	padding: 5px 25px;
	cursor: pointer;
	margin-left: 18px;
}
/* 内容层title */
.div-contents {
	height: 50px;
	line-height: 50px;
	font-weight: 500;
	font-size: 1.8rem;
	text-align: center;
	color: wheat;
	background-color: #272727;
}
/* 内容层 */
.div3 {
	overflow: auto;
	text-align: center;
	font-size: 1.5rem;
	width: 100%;
}
.goods-contents-title > ul > li,
.goods-contents-value > ul > li {
	float: left;
}
.goods-contents-title {
	font-weight: 900;
	padding: 10px 0;
	background-color: #f0f0f0;
	border-bottom: 1px solid #6c6c6c;
	overflow: auto;
	text-align: center;
	font-size: 1.5rem;
}
.goods-contents-value {
	font-size: 1.3rem;
}
.goods-contents-value > ul > li {
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
.goods-contents-value > ul {
	clear: both;
	overflow: hidden;
}
.goods-contents-title > ul > li:first-child,
.goods-contents-value > ul > li:first-child {
	width: 5%;
}
.goods-contents-title > ul > li:nth-child(2),
.goods-contents-value > ul > li:nth-child(2) {
	width: 30%;
}
.goods-contents-title > ul > li:nth-child(3),
.goods-contents-value > ul > li:nth-child(3) {
	width: 5%;
}
.goods-contents-title > ul > li:nth-child(4),
.goods-contents-value > ul > li:nth-child(4) {
	width: 8%;
}
.goods-contents-title > ul > li:nth-child(5),
.goods-contents-value > ul > li:nth-child(5) {
	width: 8%;
}
.goods-contents-title > ul > li:nth-child(6),
.goods-contents-value > ul > li:nth-child(6) {
	width: 8%;
}
.goods-contents-title > ul > li:nth-child(7),
.goods-contents-value > ul > li:nth-child(7) {
	width: 8%;
}
.goods-contents-title > ul > li:nth-child(8),
.goods-contents-value > ul > li:nth-child(8) {
	width: 8%;
}
.goods-contents-title > ul > li:nth-child(9),
.goods-contents-value > ul > li:nth-child(9) {
	width: 20%;
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
.count-other > div {
	float: left;
	display: block;
	font-size: 1.5rem;
}
.count-other-text > span,
.count-other-value > span {
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
	left: 120px;
	font-size: 1.5rem;
	text-align: center;
	padding: 15px 0;
}
.sure-btn > button {
	padding: 5px 0;
	width: 130px;
	font-weight: 500;
	cursor: pointer;
	position: relative;
	margin-right: 45px;
}
.count-div {
	position: absolute;
	right: 0px;
	height: 100%;
	width: 750px;
	text-align: center;
}
.count-div > div {
	float: left;
	display: block;
	height: 100%;
	width: 50%;
	font-size: 2.1rem;
	font-weight: normal;
}
.count-text > span,
.count-value > span {
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
.count-text > span,
.count-value > span {
	font-size: 3rem;
	color: black;
	font-weight: 900;
}

.count-text-gray > span,
.count-value-gray > span {
	font-size: 2.1rem;
	font-weight: normal;
}
.count-div-gray {
	position: absolute;
	right: 700px;
	width: 500px;
}

/* 操作按钮 */
.handler-btn > button {
	padding: 3px 30px;
	cursor: pointer;
}
.handler-btn > button:nth-child(2) {
	margin: 0px 20px;
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
}

/* 添加订单信息 */
.input-show-div {
	text-align: center;
	font-size: 1.5rem;
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
.add-order-info-text > span > input {
	background-color: white;
	border: none;
}
.add-order-info-text,
.add-order-info-text > span > input {
	width: 150px;
}
/* 添加付款金额 */
.pay-info {
	font-size: 3rem;
}
.pay-info-text > span > input {
	width: 250px;
	background-color: white;
	border: none;
}
.pay-info-value > span > input {
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
	height: 150px;
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
.goods-contents-title-1,
.goods-contents-value-1 > ul {
	clear: both;
	overflow: hidden;
}
.goods-contents-title-1 > ul > li:first-child,
.goods-contents-value-1 > ul > li:first-child {
	width: 5%;
}
.goods-contents-title-1 > ul > li:nth-child(2),
.goods-contents-value-1 > ul > li:nth-child(2) {
	width: 30%;
}
.goods-contents-title-1 > ul > li:nth-child(3),
.goods-contents-value-1 > ul > li:nth-child(3) {
	width: 8%;
}
.goods-contents-title-1 > ul > li:nth-child(4),
.goods-contents-value-1 > ul > li:nth-child(4) {
	width: 8%;
}
.goods-contents-title-1 > ul > li:nth-child(5),
.goods-contents-value-1 > ul > li:nth-child(5) {
	width: 8%;
}
.goods-contents-title-1 > ul > li:nth-child(6),
.goods-contents-value-1 > ul > li:nth-child(6) {
	width: 5%;
}
.goods-contents-title-1 > ul > li:nth-child(7),
.goods-contents-value-1 > ul > li:nth-child(7) {
	width: 8%;
}
.goods-contents-title-1 > ul > li:nth-child(8),
.goods-contents-value-1 > ul > li:nth-child(8) {
	width: 20%;
}
.goods-contents-title-1 > ul > li:nth-child(9),
.goods-contents-value-1 > ul > li:nth-child(9) {
	width: 8%;
}
.clear-condition {
	position: absolute;
	right: 40px;
	bottom: 40px;
}

.clear-condition > button {
	padding: 5px 25px;
}

.clear-condition2 {
	bottom: 100px;
	right: 50px;
}

/* 修改默认字体大小 */
>>> .ivu-form .ivu-form-item-label,
>>> .ivu-input,
>>> .ivu-btn,
>>> .ivu-table-cell {
	font-size: 18px;
}
>>> .ivu-modal-header p,
>>> .ivu-modal-header-inner {
	font-size: 20px;
}
>>> .ivu-modal-close .ivu-icon-ios-close {
	font-size: 33px;
}
</style>
