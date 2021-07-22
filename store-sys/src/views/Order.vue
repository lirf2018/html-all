<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div class="search-form">
			<Form :model="searchForm" :label-width="120" :inline="true">
				<FormItem label="订单号"><Input placeholder="订单号" v-model="searchForm.order_no" @keyup.native="clickSearch()" /></FormItem>
				<FormItem label="手机号"><Input placeholder="手机号" v-model="searchForm.user_phone" @keyup.native="clickSearch()" /></FormItem>
				<FormItem label="桌号"><Input placeholder="桌号" v-model="searchForm.table_name" @keyup.native="clickSearch()" /></FormItem>
				<FormItem label="状态">
					<Select placeholder="选择状态" v-model="searchForm.order_status" @on-change="clickSearch">
						<Option :value="item.param_key" v-for="(item, index) in orderStatus" :key="index">{{ item.param_value }}</Option>
					</Select>
				</FormItem>
				<Button style="margin:0px 10px" @click="clickSearch">搜索</Button>
				<Button @click="clearSearch">清空</Button>
				&nbsp;&nbsp;&nbsp;
				<!-- <Checkbox v-model="searchForm.search_type" value="1" size="large" @on-change="searchList">&nbsp;详情汇总模式显示&nbsp;&nbsp;</Checkbox> -->
			</Form>
		</div>
		<Table :columns="title" :data="orderList" @on-row-click="clickRow"></Table>
		<div class="page-next">
			<Page
				:current="searchForm.curre_page"
				:page-size="searchForm.page_size"
				show-total
				:total="total"
				show-sizer
				prev-text="上一页"
				next-text="下一页"
				@on-change="changePage"
				@on-page-size-change="changePageSize"
			/>
		</div>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import OrderDetail from './OrderDetail.vue';
import axios from '@/network/request.js';
export default {
	components: { OrderDetail, Navigation },
	data() {
		return {
			total: 0,
			title: [],
			orderList: [],
			searchForm: {
				curre_page: 1,
				page_size: 10,
				order_no: null,
				user_phone: null,
				table_name: null,
				order_status: null,
				search_type: null
			},
			orderId: null,
			orderStatus: []
		};
	},
	created() {
		let vm = this;
		this.title = [
			{
				type: 'expand',
				width: 50,
				render: (h, params) => {
					return h(OrderDetail, {
						props: {
							row: params.row,
							resetOrderData: vm.resetOrderData
						}
					});
				}
			},
			{
				title: '订单标识',
				key: 'order_id',
				align: 'center'
			},
			{
				title: '订单号',
				key: 'order_num',
				align: 'center',
				width: 250
			},
			{
				title: '桌号',
				key: 'table_name',
				align: 'center'
			},
			{
				title: '用户手机号',
				key: 'user_phone',
				align: 'center',
				width: 180
			},
			{
				title: '商品总数',
				key: 'goods_count',
				align: 'center'
			},
			{
				title: '订单总价',
				key: 'order_price',
				align: 'center'
			},
			{
				title: '订单应付总价(实付款)',
				//key: 'real_price',
				align: 'center',
				render:(h,params) => {
					let realPrice = params.row.real_price;
					let realInPrice = params.row.real_inpay_price;
					let str = realPrice + " ("+realInPrice +")";
					return h("div",str)
				}
			},
			{
				title: '优惠券总价',
				key: 'discounts_ticket_price',
				align: 'center'
			},
			{
				title: '会员优惠总价',
				key: 'discounts_member_price',
				align: 'center'
			},
			{
				title: '促销优惠总价',
				key: 'discounts_price',
				align: 'center'
			},
			{
				title: '优惠明细',
				key: 'discounts_remark',
				align: 'center'
			},
			{
				title: '支付方式',
				key: 'pay_method_name',
				align: 'center'
			},
			{
				title: '订单状态 ',
				key: 'order_status_name',
				align: 'center'
			},
			{
				title: '创建时间',
				key: 'create_time',
				align: 'center'
			}
		];
	},
	mounted: function() {
		this.$nextTick(function() {
			this.searchList();
			this.findParam();
		});
	},
	methods: {
		changePage(current) {
			this.searchForm.curre_page = current;
			this.searchList();
		},
		changePageSize(pageSize) {
			this.searchForm.page_size = pageSize;
			this.searchForm.curre_page = 1;
			this.searchList();
		},
		clickRow(rows, index) {
			this.orderId = rows.order_id;
			for (let i = 0; i < this.orderList.length; i++) {
				if (this.orderId == this.orderList[i].order_id) {
					this.orderList[i]._expanded = !this.orderList[i]._expanded;
				}
			}
		},
		clickSearch(){
			this.searchForm.curre_page = 1;
			this.searchList();
		},
		searchList() {
			const vm = this;
			const params = {
				req_type: 'find_kc_order_page',
				data: vm.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.orderList = res.data.order_list;
					vm.total = res.data.total_num;
					vm.hasNext = res.data.has_next;
				} else {
				}
			});
		},
		clearSearch() {
			let vm = this;
			vm.searchForm.order_no = null;
			vm.searchForm.user_phone = null;
			vm.searchForm.table_name = null;
			vm.searchForm.order_status = null;
			vm.searchList();
		},
		findParam() {
			let vm = this;
			let params = {
				req_type: 'kc_list_param',
				data: { param_code: 'order_status' }
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.orderStatus = res.data.param_list;
				} else {
					vm.$Message.warning({ content: res.resp_desc, duration: 5 });
				}
			});
		},
		resetOrderData(obj) {
			let vm = this;
			let goodsCount = obj.goods_count; //订单数量
			let orderPrice = obj.order_price; //订单总价
			let realPrice = obj.real_price; //应实付总价
			let realInpayPrice = obj.realInpayPrice;//实付款
			let discountsPriceOrder = obj.discounts_price_order; //促销优惠价格
			let discountsMemberPrice = obj.discounts_member_price; //会员优惠价格
			let discountsTicketPrice = obj.discounts_ticket_price; //优惠券优惠价格
			let orderId = obj.order_id;
			for (let i = 0; i < vm.orderList.length; i++) {
				let orderId_ = vm.orderList[i].order_id;
				if (orderId == orderId_) {
					vm.orderList[i].goods_count = goodsCount;
					vm.orderList[i].order_price = orderPrice;
					vm.orderList[i].real_price = realPrice;
					vm.orderList[i].discounts_price = discountsPriceOrder;
					vm.orderList[i].discounts_member_price = discountsMemberPrice;
					vm.orderList[i].discounts_ticket_price = discountsTicketPrice;
					return;
				}
			}
		}
	}
};
</script>

<style scoped>
.page {
	padding: 10px 0;
	position: absolute;
	background-color: white;
	width: 100%;
	height: 100%;
	bottom: 0px;
	left: 0px;
}

.page-next {
	background-color: white;
	text-align: right;
	margin-right: 30px;
	padding: 15px 0;
}

.search-form {
	margin: 0px auto;
	text-align: center;
	padding-left: 50px;
}

/* 修改默认字体大小 */
>>> .ivu-form .ivu-form-item-label,
>>> .ivu-input,
>>> .ivu-btn,
>>> .ivu-table-cell {
	font-size: 12px;
}
>>> .ivu-modal-header p,
>>> .ivu-modal-header-inner {
	font-size: 12px;
}
</style>
