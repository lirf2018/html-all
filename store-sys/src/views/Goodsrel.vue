<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="formItem" :label-width="100" :inline="true">
					<FormItem label="商品名称"><Input placeholder="商品名称" v-model="formItem.goodsName" /></FormItem>
					<FormItem label="条形码"><Input placeholder="条形码" v-model="formItem.goodsCode" /></FormItem>
					<FormItem label="商品编码"><Input placeholder="商品编码" v-model="formItem.shopCode" /></FormItem>
					<FormItem label="商品类别">
						<Select placeholder="选择商品类别" v-model="formItem.calssifyCode">
							<Option value="beijing">小吃</Option>
							<Option value="shanghai">日用百货</Option>
							<Option value="shenzhen">厨具</Option>
						</Select>
					</FormItem>
					<FormItem label="状态">
						<Select placeholder="选择状态" v-model="formItem.status">
							<Option value="beijing">已下架</Option>
							<Option value="shanghai">销售中</Option>
						</Select>
					</FormItem>
					<FormItem label="供应商">
						<Select placeholder="选择供应商" v-model="formItem.supplierCode">
							<Option value="beijing">淘宝</Option>
							<Option value="shanghai">天猫</Option>
							<Option value="shenzhen">京东</Option>
						</Select>
					</FormItem>
					<FormItem label="是否促销">
						<Select placeholder="选择是否促销" v-model="formItem.isDiscounts">
							<Option value="-1">选择是否促销</Option>
							<Option value="1">是</Option>
							<Option value="0">否</Option>
						</Select>
					</FormItem>
					<Button style="margin:0px 10px">搜索</Button>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle" :data="listContents" @on-selection-change="onSelectionChange"></Table>
				<div class="page-next"><Page :total="100" show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage" @on-page-size-change="changePageSize" /></div>
			</div>
		</div>
		<div style="margin-top: 30px;">
			<div class="search-form">
				<Form :model="formItem" :label-width="100" :inline="true">
					<FormItem label="商品名称"><Input placeholder="商品名称" v-model="formItem.goodsName" /></FormItem>
					<FormItem label="条形码"><Input placeholder="条形码" v-model="formItem.goodsCode" /></FormItem>
					<FormItem label="商品编码"><Input placeholder="商品编码" v-model="formItem.shopCode" /></FormItem>
					<FormItem label="商品类别">
						<Select placeholder="选择商品类别" v-model="formItem.calssifyCode">
							<Option value="beijing">小吃</Option>
							<Option value="shanghai">日用百货</Option>
							<Option value="shenzhen">厨具</Option>
						</Select>
					</FormItem>
					<FormItem label="状态">
						<Select placeholder="选择状态" v-model="formItem.status">
							<Option value="beijing">已下架</Option>
							<Option value="shanghai">销售中</Option>
						</Select>
					</FormItem>
					<FormItem label="供应商">
						<Select placeholder="选择供应商" v-model="formItem.supplierCode">
							<Option value="beijing">淘宝</Option>
							<Option value="shanghai">天猫</Option>
							<Option value="shenzhen">京东</Option>
						</Select>
					</FormItem>
					<FormItem label="是否促销">
						<Select placeholder="选择是否促销" v-model="formItem.isDiscounts">
							<Option value="-1">选择是否促销</Option>
							<Option value="1">是</Option>
							<Option value="0">否</Option>
						</Select>
					</FormItem>
					<Button style="margin:0px 10px">搜索</Button>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div class="in-btn"><Button style="margin-right: 20px">批量关联</Button></div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle2" :data="listContents" @on-selection-change="onSelectionChange">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button>添加关联</Button>
					</template>
				</Table>
				<div class="page-next"><Page :total="100" show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage" @on-page-size-change="changePageSize" /></div>
			</div>
		</div>
		<div style="margin-top: 30px;">
			<div class="in-btn"><Button style="margin-right: 20px">批量删除</Button></div>
			<Table size="large" border ref="selection" :columns="listTitle3" :data="listContents3" >
				<template slot-scope="{ row }" slot="name">
					<strong>操作</strong>
				</template>
				<template slot-scope="{ row, index }" slot="action">
					<Button>删除</Button>
				</template>
			</Table>
		</div>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
	components: { Navigation: Navigation },
	data() {
		return {
			title: '添加商品',
			addGoods: false,
			currentChoose: '',
			formItem: {
				current: 1,
				pageSize: 10,
				goodsName: '',
				goodsCode: '',
				shopCode: '',
				calssifyCode: '',
				status: -1,
				supplierCode: '',
				isDiscounts: 0 //是否促销， !(当前时间 > 促销结束时间)
			},
			// 结果
			listTitle: [],
			listTitle2: [],
			listTitle3:[],
			listContents: [],
			listContents3: [],
			// 商品列表
			listGoodsTitle: [],
			listGoodsContents: [],
			incomePrice: 0.0,
			moreIncomePrice: false
		};
	},
	created() {
		this.listTitle = [
			{
				title: '选择',
				width: 80,
				align: 'center',
				key: 'id',
				render: (h, params) => {
					let id = params.row.id;
					let flag = false;
					if (this.currentChoose === id) {
						flag = true;
					} else {
						flag = false;
					}
					let self = this;
					return h('div', [
						h('Radio', {
							props: {
								value: flag
							},
							on: {
								'on-change': () => {
									self.currentChoose = id;
								}
							}
						})
					]);
				}
			},
			{ title: '标识', key: 'id', align: 'center' },
			{ title: '供应商', key: 'supplierName', align: 'center' },
			{ title: '商品类别', key: 'calssifyName', align: 'center' },
			{ title: '商品条形码', key: 'goodsCode', align: 'center' },
			{ title: '商品编号', key: 'shopCode', align: 'center' },
			{ title: '商品名称', key: 'goodsName', align: 'center' },
			{ title: '商品拼音', key: 'goodsPy', align: 'center' },
			{ title: '商品规格', key: 'goodsUnit', align: 'center' },
			{ title: '规格数量', key: 'unitCount', align: 'center' },
			{ title: '库存', key: 'store', align: 'center' },
			{ title: '库存预警值', key: 'storeWarning', align: 'center' },
			{ title: '销售价格', key: 'salePrice', align: 'center' },
			{ title: '会员价格', key: 'memberPrice', align: 'center' },
			{ title: '促销价格', key: 'discountsPrice', align: 'center' },
			{ title: '促销开始时间', key: 'discountsStartTime', align: 'center' },
			{ title: '促销结束时间', key: 'discountsEndTime', align: 'center' },
			{ title: '状态', key: 'statusName', align: 'center' }
		];
		this.listTitle2 = [
			{ type: 'selection', width: 60, align: 'center' },
			{ title: '标识', key: 'id', align: 'center' },
			{ title: '供应商', key: 'supplierName', align: 'center' },
			{ title: '商品类别', key: 'calssifyName', align: 'center' },
			{ title: '商品条形码', key: 'goodsCode', align: 'center' },
			{ title: '商品编号', key: 'shopCode', align: 'center' },
			{ title: '商品名称', key: 'goodsName', align: 'center' },
			{ title: '商品拼音', key: 'goodsPy', align: 'center' },
			{ title: '商品规格', key: 'goodsUnit', align: 'center' },
			{ title: '规格数量', key: 'unitCount', align: 'center' },
			{ title: '库存', key: 'store', align: 'center' },
			{ title: '库存预警值', key: 'storeWarning', align: 'center' },
			{ title: '销售价格', key: 'salePrice', align: 'center' },
			{ title: '会员价格', key: 'memberPrice', align: 'center' },
			{ title: '促销价格', key: 'discountsPrice', align: 'center' },
			{ title: '促销开始时间', key: 'discountsStartTime', align: 'center' },
			{ title: '促销结束时间', key: 'discountsEndTime', align: 'center' },
			{ title: '状态', key: 'statusName', align: 'center' },
			{ title: '操作', slot: 'action', align: 'center' }
		];
		this.listTitle3 = [
			{ type: 'selection', width: 60, align: 'center' },
			{ title: '标识', key: 'id', align: 'center' },
			{ title: '商品条形码', key: 'goodsCode', align: 'center' },
			{ title: '商品名称', key: 'goodsName', align: 'center' },
			{ title: '商品规格', key: 'goodsUnit', align: 'center' },
			{ title: '规格数量', key: 'unitCount', align: 'center' },
			{ title: '关联', key: 'rel', align: 'center' },
			{ title: '标识', key: 'idR', align: 'center' },
			{ title: '商品条形码', key: 'goodsCodeR', align: 'center' },
			{ title: '商品名称', key: 'goodsNameR', align: 'center' },
			{ title: '商品规格', key: 'goodsUnitR', align: 'center' },
			{ title: '规格数量', key: 'unitCountR', align: 'center' },
			{ title: '操作', slot: 'action', align: 'center' }
		];
		this.listContents = [
			{
				id: 1,
				supplierName: '淘宝',
				calssifyName: '小吃',
				goodsCode: '0001',
				shopCode: '666661',
				goodsName: '肯德基腿1',
				goodsPy: 'kdjt',
				goodsUnit: '个',
				unitCount: 1,
				store: 11,
				storeWarning: 10,
				salePrice: 33.36,
				memberPrice: 30.33,
				discountsPrice: 20.38,
				discountsStartTime: '2020-01-01',
				discountsEndTime: '2020-03-04',
				statusName: '已上架'
			},
			{
				id: 2,
				supplierName: '淘宝',
				calssifyName: '小吃',
				goodsCode: '0001',
				shopCode: '666661',
				goodsName: '肯德基腿1',
				goodsPy: 'kdjt',
				goodsUnit: '个',
				unitCount: 1,
				store: 11,
				storeWarning: 10,
				salePrice: 33.36,
				memberPrice: 30.33,
				discountsPrice: 20.38,
				discountsStartTime: '2020-01-01',
				discountsEndTime: '2020-03-04',
				statusName: '已上架'
			}
		];
		this.listContents3 = [
			{
				id: 1,
				goodsCode: '0001',
				goodsName: '肯德基腿2',
				goodsUnit: '个',
				unitCount: 1,
				rel:"&&",
				idR: 2,
				goodsCodeR: '0001',
				goodsNameR: '肯德基腿1',
				goodsUnitR: '个',
				unitCountR: 1,
			},
			{
				id: 3,
				goodsCode: '0001',
				goodsName: '肯德基腿3',
				goodsUnit: '个',
				unitCount: 1,
				rel:"&&",
				idR: 4,
				goodsCodeR: '0001',
				goodsNameR: '肯德基腿4',
				goodsUnitR: '个',
				unitCountR: 1,
			}
		];
	},
	methods: {
		handleSelectAll(status) {
			this.$refs.selection.selectAll(status);
		},
		changePage(current) {
			this.formItem.current = current;
			this.searchList();
		},
		changePageSize(pageSize) {
			this.formItem.pageSize = pageSize;
			this.formItem.current = 1;
			this.searchList();
		},
		onSelectionChange(data) {
			data.forEach(item => {
				console.log('选中行=' + item.id);
			});
		},
		clearSearch() {
			this.formItem.goodsName = null;
			this.formItem.goodsCode = null;
			this.formItem.shopCode = null;
			this.formItem.calssifyCode = null;
			this.formItem.status = null;
			this.formItem.supplierCode = null;
			this.formItem.isDiscounts = null;
		},
		clicktRow(data, index) {
			this.incomePrice = data.incomePrice;
			this.moreIncomePrice = true;
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
/* 搜索表单 */
.search-form {
	margin: 0px auto;
	text-align: center;
	padding-left: 50px;
}
/* 入库操作 */
.in-btn {
	text-align: right;
	margin-right: 20px;
	padding-bottom: 20px;
}
/* 添加库存 */
.item {
	float: left;
	width: 45%;
}
.remark {
	clear: both;
	width: 90%;
}
.submitBtn {
	clear: both;
	text-align: center;
}
.store-div,
.goods-info-div {
	clear: both;
	border: 1px solid grey;
	padding: 10px 0;
	margin-top: 20px;
	position: relative;
}
.title-mark {
	position: absolute;
	background-color: white;
	left: 30px;
	height: 35px;
	line-height: 35px;
	padding: 0px 20px;
	top: -15px;
}
.store-div {
	display: none;
}
.income-price {
	/* width: 20%; */
}
.income-price-remark {
	color: red;
	margin-left: 10px;
}
.notice {
	padding: 15px 0;
	color: red;
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
>>> .ivu-input[disabled],
fieldset[disabled] .ivu-input {
	color: black;
}
</style>
