<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;">
			<Navigation />
		</div>
		<div class="title">
			<div>
				<h2>商品管理</h2>
			</div>
		</div>
		<div>
			<div class="search-form">
				<Form :model="searchForm" :label-width="120" :inline="true">
					<FormItem label="商品名称"><Input placeholder="商品名称" v-model="searchForm.goods_name"
							@keyup.native="clickSearch()" /></FormItem>
					<FormItem label="商品店铺码"><Input placeholder="商品店铺码" v-model="searchForm.shop_code"
							@keyup.native="clickSearch()" /></FormItem>
							<FormItem label="商品条形码"><Input placeholder="商品条形码" v-model="searchForm.goods_code"
									@keyup.native="clickSearch()" /></FormItem>
					<FormItem label="状态">
						<Select placeholder="选择状态" v-model="searchForm.status" @on-change="clickSearch">
							<Option :value="1">销售中</Option>
							<Option :value="2">已下架</Option>
						</Select>
					</FormItem>
					<FormItem label="是否促销">
						<Select placeholder="选择是否促销" v-model="searchForm.is_discounts" @on-change="clickSearch">
							<Option :value="0">否</Option>
							<Option :value="1">是</Option>
						</Select>
					</FormItem>
					<Button @click="clearSearch">清空</Button>
					&nbsp;
					<Button @click="clickSearch">搜索</Button>
				</Form>
			</div>
			<div class="in-btn">
				<Button style="margin-right: 20px" @click="deleteGoods(0)">批量删除</Button>
				<Button style="margin-right: 20px" @click="updateGoodsStatus(0, 2)">批量下架</Button>
				<Button style="margin-right: 20px" @click="updateGoodsStatus(0, 1)">批量上架</Button>
				<Button style="margin-right: 20px" @click="showAddView">添加商品</Button>
			</div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle" :data="listContents"
					@on-selection-change="onSelectionChange">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button v-if="row.status == 2 || row.status == 0" @click="deleteGoods(row.goods_id)"
							style="margin-right: 15px">删除</Button>
						<Button v-if="row.status == 1" style="margin-right: 15px"
							@click="updateGoodsStatus(row.goods_id, 2)">下架</Button>
						<Button v-if="row.status == 2 || row.status == 0" style="margin-right: 15px"
							@click="updateGoodsStatus(row.goods_id, 1)">上架</Button>
						<Button v-if="row.status == 2 || row.status == 0" @click="showAddView(row)">修改</Button>
					</template>
				</Table>
			</div>
			<div class="page-next">
				<Page :current="searchForm.curre_page" :page-size="searchForm.page_size" show-total :total="total"
					show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage"
					@on-page-size-change="changePageSize" />
			</div>
		</div>
		<div>
			<Modal v-model="addGoodsFlag" :title="title" :fullscreen="true">
				<div class="goods-info-div">
					<div class="title-mark"><span>商品信息</span></div>
					<Form ref="addFormData" :model="addFormData" :label-width="300" :rules="ruleValidate">
						<div class="item">
							<FormItem label="商品条件码"><Input readonly v-model="addFormData.goodsCode" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="商品名称" prop="goodsPy"><Input placeholder="商品名称"
									v-model="addFormData.goodsName" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="拼音码" prop="goodsPy"><Input placeholder="拼音码"
									v-model="addFormData.goodsPy" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="库存预警值" prop="storeWarning"><Input placeholder="库存预警值"
									v-model="addFormData.storeWarning" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="销售价格"><Input placeholder="销售价格" number v-model="addFormData.salePrice"
									@keyup.native="setPrice()" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="促销开始时间" prop="discountsStartTimeShow">
								<DatePicker type="date" placeholder="促销开始时间" :editable="false"
									v-model="addFormData.discountsStartTimeShow"></DatePicker>
							</FormItem>
						</div>
						<div class="item">
							<FormItem label="会员价格" prop="memberPrice"><Input placeholder="会员价格" number
									v-model="addFormData.memberPrice" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="促销结束时间" prop="discountsEndTimeShow">
								<DatePicker type="date" placeholder="促销结束时间" :editable="false"
									v-model="addFormData.discountsEndTimeShow"></DatePicker>
							</FormItem>
						</div>
						<div class="item">
							<FormItem label="促销价格" prop="discountsPrice"><Input placeholder="促销价格" number
									v-model="addFormData.discountsPrice" /></FormItem>
						</div>
						<!-- <div class="item income-price">
							<FormItem label="参考进货价" prop="incomePrice">
								<Row>
									<Col span="5"><Input  placeholder="最新进货价" number disabled v-model='addFormData.incomePrice' /></Col>
									 <Col span="15"><span class="income-price-remark" v-if="moreIncomePrice">当前商品存在多个进货价格</span></Col> 
								</Row>
						     </FormItem>
							<FormItem label="最新进货价"><Input placeholder="最新进货价" disabled v-model="addFormData.incomePrice" /></FormItem>
						</div> -->
						<div class="item">
							<FormItem label="商品规格"><Input placeholder="商品规格" disabled
									v-model="addFormData.goodsUnitName" /></FormItem>
						</div>
						<div class="item">
							<FormItem label="是否促销">
								<Select v-model="addFormData.isDiscounts">
									<Option :value="0">否</Option>
									<Option :value="1">是</Option>
								</Select>
							</FormItem>
						</div>
						<div class="item">
							<FormItem label="规格数"><Input placeholder="规格数" disabled v-model="addFormData.unitCount" />
							</FormItem>
						</div>
						<Form :label-width="120" :inline="true">
							<div class="submitBtn">
								<FormItem><Input placeholder="商品条形码" v-model="searchForm2.goods_code"
										@keyup.native="clickSearch2()" /></FormItem>
								<Button @click="clickSearch2()">搜索</Button>
								<Button style="margin:0px 10px" type="primary" @click="save(0)">保存</Button>
								<Button style="margin:0px 10px" @click="save(1)">保存并继续添加</Button>
								<Button style="margin:0px 10px" @click="addGoodsFlag = false">取消</Button>
							</div>
						</Form>
					</Form>
				</div>
				<div style="height: 20px;clear: both;"></div>
				<div class="notice"><span>更新/更改商品其它信息，请从库存管理中统一修改</span></div>
				<div>
					<div class="list">
						<Table size="large" border :columns="listStoreTitle" :data="listStoreContents"
							@on-row-click="addStoreDetail">
							<template slot-scope="{ row }" slot="name">
								<strong>操作</strong>
							</template>
							<template slot-scope="{ row, index }" slot="action">
								<Button style="margin-right: 15px" @click="showStoreDetail(row)">查看进货价</Button>
								<Button style="margin-right: 15px" @click="addStoreDetail(row)"
									type="primary">复制商品信息</Button>
							</template>
						</Table>
					</div>
					<div class="page-next">
						<Page show-total :current="searchForm.curre_page" :page-size="searchForm.page_size"
							:total="total2" show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage2"
							@on-page-size-change="changePageSize2" />
					</div>
				</div>
			</Modal>
			<Modal v-model="modal3" width="750px" title="库存详情">
				<div class="list">
					<Table size="large" border :columns="listStoreInfoTitle" :data="listStoreInfoContents"></Table>
				</div>
			</Modal>
			<Modal v-model="modal4" width="360">
				<p slot="header" style="color:#f60;text-align:center">
					<Icon type="ios-information-circle"></Icon>
					<span>提示</span>
				</p>
				<div style="text-align:center">
					<p>确认删除?</p>
				</div>
				<div slot="footer">
					<Button type="error" size="large" @click="sureDeleteData">删除</Button>
					<Button @click="modal4 = false">取消</Button>
				</div>
			</Modal>
		</div>
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
				title: '添加商品',
				total: 0,
				total2: 0,
				modal2: false,
				addGoodsFlag: false,
				modal3: false,
				modal4: false,
				searchForm: {
					curre_page: 1,
					page_size: 10,
					goods_name: '',
					goods_code: '',
					shop_code:'',
					classify_code: '',
					supplier_code: '',
					is_discounts: null,
					status: null
				},
				searchForm2: {
					curre_page: 1,
					page_size: 10,
					goods_code: ''
				},
				addFormData: {
					//商品信息
					goodsId: 0,
					goodsPy: null,
					storeWarning: 10,
					salePrice: 0.0,
					memberPrice: 0.0,
					discountsPrice: 0.0,
					incomePrice: 0.0,
					discountsStartTime: null,
					discountsEndTime: null,
					discountsStartTimeShow: null,
					discountsEndTimeShow: null,
					goodsCode: null,
					isDiscounts: 0,
					status: 2,
					goodsName: null,
					goodsUnit: null,
					goodsUnitName: null,
					unitCount: null,
					goodsIds: null,
					store: 0,
					storeSale: 0
				},
				ruleValidate: {
					goodsPy: [{
						required: true,
						type: 'string',
						message: '拼音不能为空',
						trigger: 'blur'
					}],
					salePrice: [{
						required: true,
						type: 'number',
						message: '销售价格式有误, 数字',
						trigger: 'blur'
					}],
					memberPrice: [{
						type: 'number',
						message: '会员价格式有误, 数字',
						trigger: 'blur'
					}],
					discountsPrice: [{
						type: 'number',
						message: '促销价格式有误, 数字',
						trigger: 'blur'
					}],
					storeWarning: [{
						required: true,
						type: 'integer',
						message: '库存预警值只能是数字',
						trigger: 'blur'
					}],
					discountsStartTimeShow: [{
						type: 'date',
						message: '日期格式有误, 例如2020-01-01',
						trigger: 'blur'
					}],
					discountsEndTimeShow: [{
						type: 'date',
						message: '日期格式有误, 例如2020-01-01',
						trigger: 'blur'
					}]
				},
				// 结果
				listTitle: [],
				listContents: [],
				// 商品列表
				listStoreTitle: [],
				listStoreContents: [],
				// 库存详情列表
				listStoreInfoTitle: [],
				listStoreInfoContents: []
			};
		},
		created() {
			this.listTitle = [{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '标识',
					key: 'goods_id',
					align: 'center',
					width: 80
				},
				{
					title: '商品条形码',
					key: 'goods_code',
					align: 'center',
					width: 180
				},
				{
					title: '商品名称',
					key: 'goods_name',
					align: 'center'
				},
				{
					title: '商品拼音',
					key: 'goods_py',
					align: 'center',
					width: 110
				},
				{
					title: '商品规格',
					key: 'goods_unit_name',
					align: 'center',
					width: 110
				},
				{
					title: '规格数量',
					key: 'unit_count',
					align: 'center',
					width: 110
				},
				{
					title: '库存',
					key: 'store',
					align: 'center',
					width: 80
				},
				{
					title: '库存预警值',
					key: 'store_warning',
					align: 'center',
					width: 130
				},
				{
					title: '销售价格',
					key: 'sale_price',
					align: 'center',
					width: 110
				},
				{
					title: '会员价格',
					key: 'member_price',
					align: 'center',
					width: 110
				},
				{
					title: '促销价格',
					key: 'discounts_price',
					align: 'center',
					width: 110
					// ,render: (h, obj) => {
					// 	let isDiscounts = obj.row.is_discounts;
					// 	switch (isDiscounts) {
					// 		case 0:
					// 			return h('span', '');
					// 			break;
					// 		default:
					// 			return h('span', obj.row.discounts_price);
					// 			break;
					// 	}
					// }
				},
				{
					title: '促销开始时间',
					key: 'discounts_start_time_name',
					align: 'center',
					render: (h, obj) => {
						let isDiscounts = obj.row.is_discounts;
						switch (isDiscounts) {
							case 0:
								return h('span', '');
								break;
							default:
								return h('span', obj.row.discounts_start_time_name);
								break;
						}
					}
				},
				{
					title: '促销结束时间',
					key: 'discounts_end_time_name',
					align: 'center',
					render: (h, obj) => {
						let isDiscounts = obj.row.is_discounts;
						switch (isDiscounts) {
							case 0:
								return h('span', '');
								break;
							default:
								return h('span', obj.row.discounts_end_time_name);
								break;
						}
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, obj) => {
						let incomType = obj.row.status;
						switch (incomType) {
							case 0:
								return h('span', '草稿');
								break;
							case 1:
								return h('span', '销售中');
								break;
							case 2:
								return h('span', '已下架');
								break;
						}
					},
					width: 100
				},
				{
					title: '操作',
					slot: 'action',
					align: 'center',
					width: 280
				}
			];

			this.listStoreTitle = [{
					title: '标识',
					key: 'income_id',
					align: 'center'
				},
				{
					title: '商品名称',
					key: 'goods_name',
					align: 'center'
				},
				{
					title: '商品条形码',
					key: 'goods_code',
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
					title: '平均进货价',
					key: 'income_price',
					align: 'center'
				},
				{
					title: '操作',
					slot: 'action',
					align: 'center',
					width: 320
				}
			];
			this.listStoreInfoTitle = [{
					title: '标识',
					key: 'income_id',
					align: 'center',
					width: 80
				},
				{
					title: '商品名称',
					key: 'goods_name',
					align: 'center'
				},
				{
					title: '进货价',
					key: 'income_price',
					align: 'center',
					width: 100
				},
				{
					title: '入库时间',
					key: 'in_time_name',
					align: 'center',
					width: 220
				}
			];
		},
		mounted: function() {
			this.$nextTick(function() {
				this.searchList();
			});
		},
		methods: {
			clickSearch() {
				this.searchForm.curre_page = 1;
				this.searchList();
			},
			searchList() {
				let vm = this;
				if (vm.searchForm.goods_code && !(vm.searchForm.goods_code.length == 13 || vm.searchForm.goods_code
						.length == 23)) {
					return;
				}
				let params = {
					req_type: 'kc_page_goods',
					data: vm.searchForm
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.listContents = res.data.goods_list;
						vm.total = res.data.total_num;
						vm.hasNext = res.data.has_next;
					} else {}
				});
			},
			changePage(currePage) {
				this.searchForm.curre_page = currePage;
				this.searchList();
			},
			changePageSize(pageSize) {
				this.searchForm.page_size = pageSize;
				this.searchForm.curre_page = 1;
				this.searchList();
			},
			showAddView(row) {
				let vm = this;
				vm.resetAddFormData();
				if (row && row.goods_id) {
					vm.setAddFormData(row);
				}
				vm.addGoodsFlag = true;
				vm.searchList2();
			},
			resetAddFormData() {
				let vm = this;
				vm.addFormData.goodsId = 0;
				vm.addFormData.goodsPy = null;
				vm.addFormData.storeWarning = 10;
				vm.addFormData.salePrice = 0.0;
				vm.addFormData.memberPrice = 0.0;
				vm.addFormData.discountsPrice = 0.0;
				vm.addFormData.incomePrice = 0.0;
				vm.addFormData.discountsStartTime = null;
				vm.addFormData.discountsEndTime = null;
				vm.addFormData.discountsStartTimeShow = null;
				vm.addFormData.discountsEndTimeShow = null;
				vm.addFormData.goodsCode = null;
				vm.addFormData.isDiscounts = 0;
				vm.addFormData.status = 2;
				vm.addFormData.goodsName = null;
				vm.addFormData.goodsName = null;
				vm.addFormData.goodsUnit = null;
				vm.addFormData.goodsUnitName = null;
				vm.addFormData.unitCount = null;
				vm.addFormData.store = 0;
				vm.addFormData.storeSale = 0;
			},
			setAddFormData(row) {
				let vm = this;
				vm.addFormData.goodsId = row.goods_id;
				vm.addFormData.goodsPy = row.goods_py;
				vm.addFormData.storeWarning = row.store_warning;
				vm.addFormData.salePrice = row.sale_price;
				vm.addFormData.memberPrice = row.member_price;
				vm.addFormData.discountsPrice = row.discounts_price;
				vm.addFormData.discountsStartTime = row.discounts_start_time;
				vm.addFormData.discountsEndTime = row.discounts_end_time;
				vm.addFormData.discountsStartTimeShow = row.discounts_start_time_name;
				vm.addFormData.discountsEndTimeShow = row.discounts_end_time_name;
				vm.addFormData.goodsCode = row.goods_code;
				vm.addFormData.isDiscounts = row.is_discounts;
				vm.addFormData.status = row.status;
				vm.addFormData.goodsName = row.goods_name;
				vm.addFormData.goodsUnit = row.goods_unit;
				vm.addFormData.goodsUnitName = row.goods_unit_name;
				vm.addFormData.unitCount = row.unit_count;
				vm.addFormData.store = row.store;
				vm.addFormData.storeSale = row.store_sale;
			},
			clickSearch2() {
				this.searchForm2.curre_page = 1;
				this.searchList2();
			},
			//查询未添加的入库商品
			searchList2() {
				let vm = this;
				let params = {
					req_type: 'kc_page_goods_store',
					data: vm.searchForm2
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.listStoreContents = res.data.goods_store_list;
						vm.total2 = res.data.total_num;
						vm.hasNext = res.data.has_next;
					} else {}
				});
			},
			changePage2(current) {
				this.searchForm2.curre_page = current;
				this.searchList2();
			},
			changePageSize2(pageSize) {
				this.searchForm2.page_size = pageSize;
				this.searchForm2.curre_page = 1;
				this.searchList2();
			},
			showStoreDetail(row) {
				let vm = this;
				let data = {
					goods_code: row.goods_code
				};
				let params = {
					req_type: 'kc_list_store',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.listStoreInfoContents = res.data.store_list;
						vm.modal3 = true;
					} else {}
				});
			},
			addStoreDetail(row) {
				let vm = this;
				let data = {
					goods_code: row.goods_code
				};
				let params = {
					req_type: 'kc_list_store',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.listStoreInfoContents = res.data.store_list;
						let goodsCode = res.data.store_list[0].goods_code;
						let goodsName = res.data.store_list[0].goods_name;
						let incomePrice = res.data.store_list[0].income_price;
						let goodsUnit = res.data.store_list[0].goods_unit;
						let goodsUnitName = res.data.store_list[0].goods_unit_name;
						let unitCount = res.data.store_list[0].unit_count;
						vm.addFormData.goodsCode = goodsCode;
						vm.addFormData.incomePrice = incomePrice;
						vm.addFormData.goodsUnit = goodsUnit;
						vm.addFormData.goodsUnitName = goodsUnitName;
						vm.addFormData.unitCount = unitCount;
						vm.addFormData.goodsName = goodsName;
					} else {}
				});
			},
			clearSearch() {
				let vm = this;
				Object.keys(vm.searchForm).map(i => {
					vm.searchForm[i] = null;
				});
				vm.searchForm.curre_page = 1;
				vm.searchForm.page_size = 10;
				vm.$refs.selection.selectAll(false);
				vm.searchList();
			},
			save(type) {
				let vm = this;
				if (!vm.addFormData.goodsCode) {
					let msg = '请点击添加商品';
					vm.myDialog('success', msg);
					return;
				}
				if (vm.addFormData.discountsStartTimeShow > vm.addFormData.discountsEndTimeShow) {
					let msg = '促销开始时间不能大于促销结束时间';
					vm.myDialog('success', msg);
					return;
				}
				if (vm.addFormData.salePrice < vm.addFormData.discountsPrice) {
					let msg = '销售价格不能小于促销价格';
					vm.myDialog('success', msg);
					return;
				}
				if (vm.addFormData.salePrice < vm.addFormData.memberPrice) {
					let msg = '销售价格不能小于会员价格';
					vm.myDialog('success', msg);
					return;
				}
				debugger
				if (vm.addFormData.isDiscounts == 1 && (!vm.addFormData.discountsStartTimeShow || !vm.addFormData
						.discountsEndTimeShow)) {
					let msg = '促销时间不能为空';
					vm.myDialog('success', msg);
					return;
				}
				vm.addFormData.discountsStartTime = timeToTimestamp(vm.addFormData.discountsStartTimeShow);
				vm.addFormData.discountsEndTime = timeToTimestamp(vm.addFormData.discountsEndTimeShow);
				let params = {
					req_type: 'kc_add_goods',
					data: vm.addFormData
				}; // 参数

				// let formData = JSON.parse(JSON.stringify(vm.addFormData));
				// delete formData.discountsEndTime;
				// for(let key in formData){
				// 	if(formData[key] ===""){
				// 		delete formData[key];
				// 	}
				// }
				// Object.keys(vm.addFormData).map(i=>{
				// 	vm.addFormData[i] = row[i]
				// });

				axios.post('', params).then(function(res) {
					//vm.clearSearch();
					if (res.resp_code == 1) {
						vm.myDialog('success', '操作成功');
						vm.addGoodsFlag = type == 1 ? true : false;
						if (type == 1) {
							vm.resetAddFormData();
						}
						vm.searchList();
						vm.searchList2();
					} else {
						vm.searchList2();
						vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
					}
				});
			},
			myDialog(type, content) {
				let title = '提示';
				switch (type) {
					case 'info':
						this.$Modal.info({
							title: title,
							content: content
						});
						break;
					case 'success':
						this.$Modal.success({
							title: title,
							content: content
						});
						break;
					case 'warning':
						this.$Modal.warning({
							title: title,
							content: content
						});
						break;
					case 'error':
						this.$Modal.error({
							title: title,
							content: content
						});
						break;
				}
			},
			asyncDialog() {
				setTimeout(() => {
					this.$Modal.remove();
				}, 2000);
			},
			onSelectionChange(data) {
				let vm = this;
				vm.addFormData.goodsIds = null;
				let size = data.length;
				let i = 1;
				data.forEach(item => {
					if (size == i) {
						vm.addFormData.goodsIds = vm.addFormData.goodsIds + item.goods_id;
					} else {
						vm.addFormData.goodsIds = vm.addFormData.goodsIds + item.goods_id + ',';
					}
					i++;
				});
			},
			deleteGoods(goodsId) {
				let vm = this;
				if (goodsId != 0) {
					vm.addFormData.goodsIds = goodsId;
				} else {
					if (!vm.addFormData.goodsIds || vm.addFormData.goodsIds == '') {
						let msg = '请选择商品';
						vm.$Message.warning({
							content: msg,
							duration: 5
						});
						return
					}
				}
				vm.modal4 = true;

			},
			sureDeleteData() {
				let vm = this;
				let data = {
					goods_ids: vm.addFormData.goodsIds
				};
				let params = {
					req_type: 'kc_del_goods',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.searchList();
						vm.myDialog('success', '操作成功');
						vm.modal4 = false;
					} else {
						vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
					}
				});
				vm.addFormData.goodsIds = '';
			},
			updateGoodsStatus(goodsId, status) {
				let vm = this;
				if (goodsId != 0) {
					vm.addFormData.goodsIds = goodsId;
				}
				if (!vm.addFormData.goodsIds) {
					let msg = '请选择数据';
					// vm.$Message.warning({ content: msg, duration: 5 });
					vm.myDialog('success', msg);
					return
				}
				let data = {
					goodsIds: vm.addFormData.goodsIds,
					status: status
				};
				let params = {
					req_type: 'kc_update_goods_status',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.searchList();
						vm.myDialog('success', '操作成功');
					} else {
						vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
					}
				});
			},
			setPrice() {
				this.addFormData.memberPrice = this.addFormData.salePrice;
				this.addFormData.discountsPrice = this.addFormData.salePrice;
			},
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

	.title {
		text-align: center;
		padding-bottom: 10px;
	}

	.page-next {
		background-color: white;
		text-align: right;
		margin-right: 30px;
		padding: 50px 0;
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
	>>>.ivu-form .ivu-form-item-label,
	>>>.ivu-input,
	>>>.ivu-btn,
	>>>.ivu-table-cell {
		font-size: 12px;
	}

	>>>.ivu-modal-header p,
	>>>.ivu-modal-header-inner {
		font-size: 12px;
	}

	>>>.ivu-input[disabled],
	fieldset[disabled] .ivu-input {
		color: black;
	}
</style>
