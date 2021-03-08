<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="searchForm" :label-width="120" :inline="true">
					<FormItem label="供应商名称"><Input placeholder="供应商名称" v-model="searchForm.supplier_name" @keyup.native="searchList()" /></FormItem>
					<FormItem label="供应商编码"><Input placeholder="供应商编码" v-model="searchForm.supplier_code" @keyup.native="searchList()" /></FormItem>
					<FormItem label="供应商电话"><Input placeholder="供应商编码" v-model="searchForm.supplier_phone" @keyup.native="searchList()" /></FormItem>
					<FormItem label="供应商地址"><Input placeholder="供应商编码" v-model="searchForm.supplier_addr" @keyup.native="searchList()" /></FormItem>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div v-show="msgInfo.showMsgFlag">
				<Alert :type="msgInfo.msgType" show-icon>
					{{ msgInfo.msgTitle }}
					<span slot="desc">{{ msgInfo.msgContents }}</span>
				</Alert>
			</div>
			<div class="in-btn"><Button style="margin-right: 20px" @click="showAddView">添加供应商</Button></div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle" :data="listContents">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button style="margin-right: 15px" @click="showAddView(row)">修改</Button>
						<Button @click="deleteData(row)">删除</Button>
					</template>
				</Table>
			</div>
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
		<div>
			<Modal v-model="addSupplierFlag" :title="title" @on-ok="saveData">
				<Form ref="addDataForm" :model="addFormData" :label-width="120" :rules="ruleValidate">
					<div class="item">
						<FormItem label="供应商编码" prop="supplierCode"><Input placeholder="" v-model="addFormData.supplierCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="供应商名称" prop="supplierName"><Input placeholder="" v-model="addFormData.supplierName" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="供应商电话" prop="supplierPhone"><Input placeholder="" v-model="addFormData.supplierPhone" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="供应商地址" prop="supplierAddr"><Input placeholder="" v-model="addFormData.supplierAddr" /></FormItem>
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
export default {
	components: { Navigation: Navigation },
	data() {
		return {
			title: '添加供应商',
			addSupplierFlag: false,
			total: 0,
			modal2: false,
			msgInfo: {
				showMsgFlag: false,
				msgType: 'error',
				msgTitle: '',
				msgContents: ''
			},
			searchForm: {
				curre_page: 1,
				page_size: 10,
				supplier_name: '',
				supplier_code: '',
				supplier_phone: '',
				supplier_addr: ''
			},
			ruleValidate: {
				supplierCode: [{ required: true, type: 'string', message: '供应商编码不能为空', trigger: 'blur' }],
				supplierName: [{ required: true, type: 'string', message: '供应商名称不能为空', trigger: 'blur' }],
			},
			addFormData: {
				supplierId: 0,
				supplierName: '',
				supplierCode: '',
				supplierAddr: '',
				supplierPhone: ''
			},
			// 结果
			listTitle: [],
			listContents: []
		};
	},
	created() {
		this.listTitle = [
			{ title: '标识', key: 'supplier_id', align: 'center' },
			{ title: '供应商名称', key: 'supplier_name', align: 'center' },
			{ title: '供应商编码', key: 'supplier_code', align: 'center' },
			{ title: '供应商电话', key: 'supplier_phone', align: 'center' },
			{ title: '供应商地址', key: 'supplier_addr', align: 'center' },
			{ title: '操作', slot: 'action', align: 'center', width: 400 }
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
			const params = {
				req_type: 'kc_page_supplier',
				data: vm.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.listContents = res.data.supplier_list;
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
			this.searchForm.supplier_name = null;
			this.searchForm.supplier_code = null;
			this.searchForm.supplier_phone = null;
			this.searchForm.supplier_addr = null;
			this.searchList();
			this.msgInfo.showMsgFlag = false;
		},
		showAddView(row) {
			this.addSupplierFlag = true;
			if (row.supplier_id) {
				this.addFormData.supplierId = row.supplier_id;
				this.addFormData.supplierName = row.supplier_name;
				this.addFormData.supplierCode = row.supplier_code;
				this.addFormData.supplierAddr = row.supplier_addr;
				this.addFormData.supplierPhone = row.supplier_phone;
			} else {
				this.addFormData.supplierId = 0;
				this.addFormData.supplierName = '';
				this.addFormData.supplierCode = '';
				this.addFormData.supplierAddr = '';
				this.addFormData.supplierPhone = '';
			}
		},
		checkSavedata(){
			const vm = this;
			if(!vm.addFormData.supplierCode || vm.addFormData.supplierCode == ''){
				let msg = '供应商编码不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if(!vm.addFormData.supplierName || vm.addFormData.supplierName == ''){
				let msg = '供应商名称不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			
			return false;
		},
		saveData() {
			const vm = this;
			if(vm.checkSavedata()){
				return
			}
			const params = {
				req_type: 'kc_add_supplier',
				data: this.addFormData
			}; // 参数
			vm.addSupplierFlag = false;
			axios.post('', params).then(function(res) {
				vm.clearSearch();
				vm.msgInfo.showMsgFlag = true;
				if (res.resp_code == 1) {
					vm.searchList();
					vm.msgInfo.msgType = 'success';
					vm.msgInfo.msgTitle = '操作成功';
					vm.msgInfo.msgContents = res.resp_desc;
				} else {
					vm.msgInfo.msgType = 'error';
					vm.msgInfo.msgTitle = '操作失败';
					vm.msgInfo.msgContents = res.resp_desc;
				}
			});
		},
		deleteData(row) {
			this.addFormData.supplierId = row.supplier_id;
			this.modal2 = true;
		},
		sureDeleteData() {
			const vm = this;
			const params = {
				req_type: 'kc_delete_supplier',
				data: this.addFormData
			}; // 参数
			vm.modal2 = false;
			vm.msgInfo.showMsgFlag = false;
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

.in-btn {
	text-align: right;
	padding: 15px 10px;
}

/* 添加库存 */
.item {
	text-align: center;
	padding-right: 20px;
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
