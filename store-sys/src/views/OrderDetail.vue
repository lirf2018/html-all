<template>
	<div>
		<div style="border: 1px solid grey;"><Table :columns="title" :data="detailList"></Table></div>
	</div>
</template>
<script>
import axios from '@/network/request.js';
export default {
	props: {
		row: Object,
		resetOrderData: Object()
	},
	data() {
		return {
			title: [],
			detailList: []
		};
	},
	created() {
		this.title = [
			{
				title: '详情标识',
				key: 'detail_id',
				align: 'center'
			},
			{
				title: '商品名称',
				key: 'goods_name',
				align: 'center'
			},
			{
				title: '商品条码',
				key: 'goods_code',
				align: 'center'
			},
			{
				title: '店铺条码',
				key: 'shop_code',
				align: 'center'
			},
			{
				title: '数量',
				key: 'buy_count',
				align: 'center'
			},
			{
				title: '实付单价',
				key: 'sale_price_true',
				align: 'center'
			},
			{
				title: '销售价',
				key: 'sale_price',
				align: 'center'
			},
			{
				title: '会员价',
				key: 'member_price',
				align: 'center'
			},
			{
				title: '促销价',
				key: 'discounts_price',
				align: 'center'
			},
			{
				title: '促销开始时间',
				key: 'discounts_start_time',
				align: 'center'
			},
			{
				title: '促销结束时间',
				key: 'discounts_end_time',
				align: 'center'
			},
			{
				title: '商品规格',
				key: 'goods_unit_name',
				align: 'center'
			},
			{
				title: '规格数',
				key: 'unit_count',
				align: 'center'
			},
			{
				title: '是否促销',
				key: 'is_discounts_name',
				align: 'center'
			}
		];
	},
	mounted: function() {
		let vm = this;
		this.$nextTick(function() {
			vm.searchList();
		});
	},
	methods: {
		searchList() {
			const vm = this;
			const params = {
				req_type: 'find_kc_order_detail',
				data: { order_id: vm.row.order_id }
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.detailList = res.data.detail_list;
					let resetOrder = res.data.reset_order;
					if (resetOrder && vm.detailList && vm.detailList.length > 0) {
						vm.$nextTick(function() {
							vm.resetOrderData(vm.detailList[0]);
						});
					}
				} else {
				}
			});
		}
	}
};
</script>

<style></style>
