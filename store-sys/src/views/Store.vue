<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="searchForm" :label-width="100" :inline="true">
					<FormItem label="商品名称"><Input placeholder="商品名称" v-model="searchForm.goods_name" @keyup.native="searchList()" /></FormItem>
					<FormItem label="编号日期">
						<DatePicker type="date" :editable="false" placeholder="编号日期" v-model="searchForm.shop_code_date" @on-change="searchDateList"></DatePicker>
					</FormItem>
					<FormItem label="商品"><Input placeholder="商品条形码/商品编号" v-model="searchForm.goods_code" @keyup.native="searchList()" /></FormItem>
					<FormItem label="商品规格">
						<Select v-model="searchForm.goods_unit" @on-change="searchList">
							<Option v-bind:key="index" :value="item.param_key" v-if="item.param_code == 'goods_unit'" v-for="(item, index) in listParam">
								{{ item.param_value }}
							</Option>
						</Select>
					</FormItem>
					<FormItem label="规格数">
						<Select v-model="searchForm.unit_count" @on-change="searchList">
							<Option v-bind:key="index" :value="item.param_key" v-if="item.param_code == 'unit_count'" v-for="(item, index) in listParam">
								{{ item.param_value }}
							</Option>
						</Select>
					</FormItem>
					<FormItem label="商品类别">
						<Select placeholder="选择商品类别" v-model="searchForm.classify_code" @on-change="searchList">
							<Option v-bind:key="index" :value="item.classify_code" v-for="(item, index) in listClassify">{{ item.classify_name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="入库类型">
						<Select placeholder="入库类型" v-model="searchForm.income_type" @on-change="searchList">
							<Option value="2">待入库</Option>
							<Option value="1">已入库</Option>
							<Option value="0">已出库</Option>
						</Select>
					</FormItem>
					<FormItem label="供应商">
						<Select placeholder="选择供应商" v-model="searchForm.supplier_code" @on-change="searchList">
							<Option v-bind:key="index" :value="item.supplier_code" v-for="(item, index) in listSupplier">{{ item.supplier_name }}</Option>
						</Select>
					</FormItem>
					<Button @click="clearSearch">清空</Button>
					&nbsp;
					<Button @click="searchList">搜索</Button>
				</Form>
			</div>
			<div class="in-btn">
				<Checkbox v-model="searchForm.search_type" value="1" size="large" @on-change="searchList">&nbsp;数据汇总模式显示库存&nbsp;&nbsp;</Checkbox>
				<Button style="margin-right: 20px" @click="showAddView">添加入库商品</Button>
				<Button style="margin-right: 20px" @click="batchSureStore(0)">批量确认出库</Button>
				<Button style="margin-right: 20px" @click="batchSureStore(1)">批量确认入库</Button>
			</div>
			<div class="list">
				<Table :stripe="true" size="large" border ref="selection" :columns="listTitle" :data="listContents" @on-selection-change="onSelectionChange">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button @click="deleteData(row)" style="margin-right: 15px" v-if="searchForm.search_type != 1 && row.income_type == 2">删除</Button>
						<Button @click="postIncomeType(row, 0)" v-if="searchForm.search_type != 1 && row.income_type == 1">出库</Button>
						<Button @click="postIncomeType(row, 1)" v-if="searchForm.search_type != 1 && (row.income_type == 0 || row.income_type == 2)" style="margin-right: 15px">
							入库
						</Button>
						<Button @click="showAddView(row)" v-if="searchForm.search_type != 1 && (row.income_type == 0 || row.income_type == 2)">修改</Button>
					</template>
				</Table>
			</div>
			<div class="page-next">
				<Page
					:total="total"
					:current="searchForm.curre_page"
					:page-size="searchForm.page_size"
					show-sizer
					prev-text="上一页"
					next-text="下一页"
					@on-change="changePage"
					@on-page-size-change="changePageSize"
				/>
			</div>
		</div>
		<div>
			<Modal v-model="addGoodsFlag" :title="title" :fullscreen="true" @on-ok="saveData(0)">
				<div style="text-align: center;width: 65%;margin: 0 auto;">
					<Form :model="searchForm" :label-width="300" :inline="true">
						<FormItem label="编号日期">
							<DatePicker type="date" :editable="false" placeholder="编号日期" v-model="searchForm.shop_code_date" @on-change="searchGoodsData"></DatePicker>
						</FormItem>
						<FormItem label="查询商品">
							<Input
								style="width: 300px"
								placeholder="商品编号/商品条形码"
								v-model="searchForm.goods_code"
								@change.native="searchGoodsData"
								@keyup.native="searchGoodsData"
							/>
						</FormItem>
						<Button @click="searchGoodsData">查询商品</Button>
						<Button @click="clearSearch">清空</Button>
					</Form>
				</div>
				<div style="width: 100%;border-bottom: 1px solid gray;margin-bottom: 20px;"></div>
				<Form ref="formValidate" :model="addFormData" :label-width="300" :rules="ruleValidate">
					<div class="item">
						<FormItem label="商品分类" prop="classifyCode">
							<Select v-model="addFormData.classifyCode">
								<Option v-bind:key="index" :value="item.classify_code" v-for="(item, index) in listClassify">{{ item.classify_name }}</Option>
							</Select>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="供应商" prop="supplierCode">
							<Select v-model="addFormData.supplierCode">
								<Option v-bind:key="index" :value="item.supplier_code" v-for="(item, index) in listSupplier">{{ item.supplier_name }}</Option>
							</Select>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="商品名称" prop="goodsName"><Input placeholder="商品名称" v-model="addFormData.goodsName" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="商品条形码" prop="goodsCode"><Input placeholder="商品条形码" v-model="addFormData.goodsCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="商品店铺码" prop="shopCode"><Input :readonly="shopCodeRead" string placeholder="商品编号" v-model="addFormData.shopCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="商品规格" prop="goodsUnit">
							<Select v-model="addFormData.goodsUnit">
								<Option v-bind:key="index" :value="item.param_key" v-if="item.param_code == 'goods_unit'" v-for="(item, index) in listParam">
									{{ item.param_value }}
								</Option>
							</Select>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="进货价" prop="incomePrice"><Input placeholder="进货价" number v-model="addFormData.incomePrice" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="规格数" prop="unitCount"><Input placeholder="规格数" number v-model="addFormData.unitCount" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="生产日期" prop="makeDayTime">
							<DatePicker type="date" format="yyyy-MM-dd" :editable="false" placeholder="生产日期" v-model="addFormData.makeDay" prop="date"></DatePicker>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="有效天数" prop="effectDay"><Input placeholder="有效天数" number v-model="addFormData.effectDay" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="有效截止日期" prop="effectToDayTime">
							<DatePicker type="date" format="yyyy-MM-dd" :editable="false" placeholder="有效截止日期" v-model="addFormData.effectToTime" prop="date"></DatePicker>
						</FormItem>
					</div>
					<div class="item" v-if="showAddBtn">
						<FormItem label="库存"><Input placeholder="库存" number v-model="addFormData.store" @keyup.native="storeMoreThenOne" /></FormItem>
					</div>
					<div class="item remark">
						<FormItem label="备注"><Input type="textarea" :autosize="{ minRows: 4, maxRows: 9 }" placeholder="备注" v-model="addFormData.remark" /></FormItem>
					</div>
					<div class="submitBtn">
						<Button style="margin:0px 10px" @click="saveData(0)" type="primary">保存</Button>
						<Button style="margin:0px 10px" @click="saveData(1)" v-if="showAddBtn">继续添加</Button>
						<!-- <Button style="margin:0px 10px" @click="saveData(2)" v-if="showAddBtn">添加相同商品</Button> -->
					</div>
				</Form>
			</Modal>
			<Modal v-model="modal2" width="360">
				<p slot="header" style="color:#f60;text-align:center">
					<Icon type="ios-information-circle"></Icon>
					<span>提示</span>
				</p>
				<div style="text-align:center"><p>确认删除?</p></div>
				<div slot="footer">
					<Button type="error" size="large" @click="sureDeleteData">删除</Button>
					<Button @click="modal2 = false">取消</Button>
				</div>
			</Modal>
		</div>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import axios from '@/network/request.js';
import { timeToTimestamp } from '@/commons/common.js';
export default {
	components: { Navigation: Navigation },
	data() {
		return {
			title: '添加商品',
			total: 0,
			modal2: false,
			addGoodsFlag: false,
			shopCodeRead: true,
			showAddBtn: false,
			incomIdsFlag: false,
			searchForm: {
				curre_page: 1,
				page_size: 10,
				goods_name: '',
				goods_code: '',
				classify_code: '',
				supplier_code: '',
				shop_code_date: '',
				goods_unit: '',
				unit_count: '',
				search_type: null
			},
			addFormData: {
				incomeId: 0,
				supplierCode: null,
				goodsCode: null,
				shopCode: null,
				goodsName: null,
				goodsUnit: null,
				incomePrice: 0.0,
				unitCount: 1,
				incomeType: 1, //入库
				makeDay: null,
				effectDay: 1,
				effectToTime: null,
				effectDay: null,
				status: 1,
				createTime: null,
				isMatching: 0, //未匹配商品
				classifyCode: null,
				remark: null,
				inTime: null,
				outTime: null,
				shopCodeDate: null,
				incomIds: '',
				store: 1,
				warning: null
			},
			ruleValidate: {
				classifyCode: [{ required: true, message: '商品分类不能为空', trigger: 'change' }],
				supplierCode: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
				goodsCode: [{ required: true, type: 'string', message: '商品编号不能为空', trigger: 'blur' }],
				goodsName: [
					{
						required: true,
						type: 'string',
						message: '商品名称不能为空',
						min: 1,
						max: 20,
						trigger: 'blur',
						transform(value) {
							return value.trim();
						}
					}
				],
				goodsUnit: [{ required: true, message: '规格不能为空', trigger: 'change' }],
				incomePrice: [{ required: true, type: 'number', message: '进货价格式有误, 数字', trigger: 'blur' }],
				unitCount: [{ required: true, type: 'integer', message: '规格数格式有误, 正整数', trigger: 'blur' }],
				effectDay: [{ required: true, type: 'integer', message: '有效天数只能是数字', trigger: 'blur' }],
				makeDayTime: [{ required: true, type: 'datetime', message: '日期格式有误, 例如2020-01-01', trigger: 'blur' }],
				effectToDayTime: [{ required: true, type: 'datetime', message: '日期格式有误, 例如2020-01-01', trigger: 'blur' }]
			},
			// 结果
			listTitle: [],
			listContents: [],
			listClassify: [],
			listSupplier: [],
			listParam: []
		};
	},
	created() {
		this.listTitle = [
			{ type: 'selection', width: 60, align: 'center' },
			{ title: '标识', key: 'income_id', align: 'center', width: 75 },
			{ title: '商品编号', key: 'shop_code', align: 'center' },
			{ title: '供应商', key: 'supplier_name', align: 'center' },
			{ title: '商品类别', key: 'classify_name', align: 'center' },
			{ title: '商品名称', key: 'goods_name', align: 'center' },
			{ title: '商品条形码', key: 'goods_code', align: 'center' },
			{ title: '商品规格', key: 'goods_unit_name', align: 'center', width: 80 },
			{ title: '规格数/库存', key: 'unit_count', align: 'center', width: 100 },
			{ title: '进货价', key: 'income_price', align: 'center', width: 100 },
			{ title: '生产日期', key: 'make_day_name', align: 'center', width: 135 },
			{ title: '有效截止日期', key: 'effect_to_time_name', align: 'center', width: 135 },
			{ title: '有效天数', key: 'effect_day', align: 'center', width: 80 },
			{
				title: '入库类型',
				key: 'income_type',
				align: 'center',
				width: 95,
				render: (h, obj) => {
					const incomType = obj.row.income_type;
					switch (incomType) {
						case 1:
							return h('span', '已入库');
							break;
						case 0:
							return h('span', '已出库');
							break;
						default:
							return h('span', '待入库');
							break;
					}
				}
			},
			{ title: '入库时间', key: 'in_time_name', align: 'center', width: 135 },
			{ title: '出库时间', key: 'out_time_name', align: 'center', width: 135 },
			{
				title: '匹配商品',
				key: 'is_matching',
				align: 'center',
				width: 60,
				render: (h, obj) => {
					const incomType = obj.row.is_matching;
					switch (incomType) {
						case 0:
							return h('span', '否');
							break;
						case 1:
							return h('span', '是');
							break;
					}
				}
			},
			{ title: '操作', slot: 'action', align: 'center', width: 320 }
		];
	},
	mounted: function() {
		this.$nextTick(function() {
			this.searchList();
		});
	},
	methods: {
		searchList() {
			const vm = this;
			if (vm.searchForm.goods_code && !(vm.searchForm.goods_code.length == 13 || vm.searchForm.goods_code.length == 23)) {
				return;
			}
			const params = {
				req_type: 'kc_page_store',
				data: vm.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.listContents = res.data.store_list;
					vm.listClassify = res.data.classify_list;
					vm.listSupplier = res.data.supplier_list;
					vm.listParam = res.data.param_list;
					vm.total = res.data.total_num;
					vm.hasNext = res.data.has_next;
				} else {
				}
			});
		},
		handleSelectAll(status) {
			this.$refs.selection.selectAll(status);
		},
		changePage(current) {
			this.searchForm.curre_page = current;
			this.searchList();
		},
		changePageSize(pageSize) {
			this.searchForm.page_size = pageSize;
			this.searchForm.curre_page = 1;
			this.searchList();
		},
		clearSearch() {
			this.searchForm.curre_page = 1;
			this.searchForm.page_size = 10;
			this.searchForm.goods_name = null;
			this.searchForm.goods_code = null;
			this.searchForm.classify_code = null;
			this.searchForm.supplier_code = null;
			this.searchForm.status = -1;
			this.searchForm.income_type = -1;
			this.searchForm.shop_code_date = null;
			this.searchForm.incomIds = '';
			this.searchForm.unit_count = null;
			this.searchForm.goods_unit = null;
			this.$refs.selection.selectAll(false);
			this.searchList();
		},
		showAddView(row) {
			if (this.searchForm.search_type == 1) {
				this.myDialog('warning', '当前为数据汇总模式,不能操作商品');
				return;
			}
			this.addGoodsFlag = true;
			this.addFormData.incomeType = 2; //待入库
			this.addFormData.isMatching = 0; //未匹配商品
			this.addFormData.status = 0;
			this.addFormData.incomeId = 0;
			this.addFormData.store = 1;
			this.addFormData.supplierCode = null;
			this.addFormData.goodsCode = null;
			this.addFormData.shopCode = null;
			this.addFormData.goodsName = null;
			this.addFormData.goodsUnit = null;
			this.addFormData.incomePrice = 0.0;
			this.addFormData.unitCount = null;
			this.addFormData.makeDay = null;
			this.addFormData.effectDay = null;
			this.addFormData.effectToTime = null;
			this.addFormData.effectDay = null;
			this.addFormData.createTime = null;
			this.addFormData.classifyCode = null;
			this.addFormData.remark = null;
			this.addFormData.inTime = null;
			this.addFormData.outTime = null;
			this.showAddBtn = true;
			if (row && row.income_id) {
				// let vm =  this;
				// Object.keys(this.addFormData).map(i=>{
				// 	vm.addFormData[i] = row[i];
				// })
				this.showAddBtn = false;
				this.addFormData.incomeId = row.income_id;
				this.addFormData.supplierCode = row.supplier_code;
				this.addFormData.goodsCode = row.goods_code;
				this.addFormData.shopCode = row.shop_code;
				this.addFormData.goodsName = row.goods_name;
				this.addFormData.goodsUnit = row.goods_unit;
				this.addFormData.incomePrice = row.income_price;
				this.addFormData.unitCount = row.unit_count;
				this.addFormData.makeDay = row.make_day_name;
				this.addFormData.effectDay = row.effect_day;
				this.addFormData.effectToTime = row.effect_to_time_name;
				this.addFormData.status = row.status;
				this.addFormData.createTime = row.create_time;
				this.addFormData.classifyCode = row.classify_code;
				this.addFormData.remark = row.remark;
				this.addFormData.inTime = row.in_time;
				this.addFormData.outTime = row.out_time;
				this.addFormData.shopCodeDate = row.shop_code_date;
			}
		},
		saveData(type) {
			const vm = this;
			if (vm.checkSubmitData()) {
				return;
			}
			this.addFormData.makeDay = timeToTimestamp(this.addFormData.makeDay);
			this.addFormData.effectToTime = timeToTimestamp(this.addFormData.effectToTime);
			this.addFormData.warning = '';
			let { warning } = this.$route.query;
			if (warning) {
				this.addFormData.warning = warning;
			}
			const params = {
				req_type: 'kc_add_store',
				data: this.addFormData
			}; // 参数
			axios.post('', params).then(function(res) {
				vm.clearSearch();
				if (res.resp_code == 1) {
					vm.myDialog('success', '操作成功');
					vm.addGoodsFlag = type == 1 ? true : false;
					if (type == 1) {
						vm.showAddView(null);
					} else if (type == 2) {
						vm.addGoodsFlag = true;
						vm.addFormData.shopCode = row.shop_code;
					}
					vm.searchList();
				} else {
					vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
				}
			});
		},
		deleteData(row) {
			this.addFormData.incomeId = row.income_id;
			this.modal2 = true;
		},
		sureDeleteData() {
			const vm = this;
			const params = {
				req_type: 'kc_delete_store',
				data: this.addFormData
			}; // 参数
			vm.modal2 = false;
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.searchList();
					vm.modal2 = false;
					vm.myDialog('success', '操作成功');
					vm.asyncDialog();
				} else {
					vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
				}
			});
		},
		myDialog(type, content) {
			const title = '提示';
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
		searchDateList(shopCodeDate) {
			this.searchForm.shop_code_date = shopCodeDate;
			this.searchList();
		},
		searchGoodsData() {
			debugger;
			const vm = this;
			const params = {
				req_type: 'kc_page_store',
				data: vm.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					// vm.clearSearch();
					if (res.data.store_list.length > 0) {
						const row = res.data.store_list[0];
						vm.addFormData.supplierCode = row.supplier_code;
						vm.addFormData.goodsCode = row.goods_code;
						vm.addFormData.goodsName = row.goods_name;
						vm.addFormData.goodsUnit = row.goods_unit;
						vm.addFormData.incomePrice = row.income_price;
						vm.addFormData.unitCount = row.unit_count;
						vm.addFormData.makeDay = row.make_day_name;
						vm.addFormData.effectDay = row.effect_day;
						vm.addFormData.effectToTime = row.effect_to_time_name;
						vm.addFormData.status = 0;
						vm.addFormData.store = 1;
						vm.addFormData.classifyCode = row.classify_code;
						vm.addFormData.remark = row.remark;
					}
				} else {
				}
			});
		},
		storeMoreThenOne() {
			if (this.addFormData.store > 1) {
				this.addFormData.shopCode = null;
			}
		},
		onSelectionChange(selectDatas) {
			const vm = this;
			let incomIds = '';
			let count = 1;
			let selectCount = selectDatas.length;
			let incomeType = -1;
			vm.incomIdsFlag = false;
			selectDatas.forEach(function(e) {
				if (incomeType == -1) {
					incomeType = e.income_type;
				}
				if (incomeType != e.income_type) {
					vm.incomIdsFlag = true;
				}
				if (count == selectCount) {
					incomIds = incomIds + e.income_id;
				} else {
					incomIds = incomIds + e.income_id + ',';
				}
				count++;
			});
			vm.addFormData.incomIds = incomIds;
		},
		postIncomeType(row, incomeType) {
			this.addFormData.incomIds = row.income_id;
			this.batchSureStore(incomeType);
		},
		batchSureStore(incomeType) {
			const vm = this;
			if (vm.searchForm.search_type == 1) {
				vm.myDialog('warning', '当前为数据汇总模式,不能操作商品');
				return;
			}
			if (vm.incomIdsFlag) {
				vm.myDialog('warning', '请选择相同入库类型的商品');
				return;
			}
			const data = {
				incomeIds: vm.addFormData.incomIds,
				incomeType: incomeType
			};
			const params = {
				req_type: 'batch_sure_store',
				data: data
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.searchList();
					vm.myDialog('success', '操作成功');
					vm.asyncDialog();
				} else {
					vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
				}
			});
		},
		checkSubmitData() {
			let vm = this;
			if (!vm.addFormData.classifyCode || vm.addFormData.classifyCode == '') {
				const msg = '商品分类不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.supplierCode || vm.addFormData.supplierCode == '') {
				const msg = '供应商不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.goodsName || vm.addFormData.goodsName == '') {
				const msg = '商品名称不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.goodsCode || vm.addFormData.goodsCode == '') {
				const msg = '商品条形码不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.goodsUnit || vm.addFormData.goodsUnit == '') {
				const msg = '商品规格不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.incomePrice || vm.addFormData.incomePrice == '') {
				const msg = '进货价不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (!vm.addFormData.unitCount || vm.addFormData.unitCount == '') {
				const msg = '规格数不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (vm.addFormData.makeDay ==null || vm.addFormData.makeDay == '') {
				const msg = '生产日期不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if ((vm.addFormData.effectDay != '' || vm.addFormData.effectDay != null) && vm.addFormData.effectDay <= 0) {
				const msg = '有效天数为大于1的整数';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			
			if ((vm.addFormData.effectToTime == '' || vm.addFormData.effectToTime == null) && (vm.addFormData.effectDay == '' || vm.addFormData.effectDay == null)) {
				const msg = '有效截止日期和有效天数不能同时为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if (vm.addFormData.makeDay != '' && vm.addFormData.makeDay != null && vm.addFormData.effectToTime != null && vm.addFormData.effectToTime != '') {
				if (vm.addFormData.makeDay > vm.addFormData.effectToTime) {
					const msg = '生产日期不能大于有效截止日期';
					vm.$Message.warning({ content: msg, duration: 5 });
					return true;
				}
			}
			return false;
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
</style>
