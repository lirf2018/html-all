<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="searchForm" :label-width="100" :inline="true">
					<FormItem label="分类名称"><Input placeholder="分类名称" v-model="searchForm.classify_name" @keyup.native="searchList()" /></FormItem>
					<FormItem label="分类编码"><Input placeholder="分类编码" v-model="searchForm.classify_code" @keyup.native="searchList()" /></FormItem>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div v-show="msgInfo.showMsgFlag">
				<Alert :type="msgInfo.msgType" show-icon>
					{{ msgInfo.msgTitle }}
					<span slot="desc">{{ msgInfo.msgContents }}</span>
				</Alert>
			</div>
			<div class="in-btn"><Button style="margin-right: 20px" @click="showAddModel(0, '', '', '')">添加分类</Button></div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle" :data="listContents">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button style="margin-right: 15px" @click="showAddModel(row.classify_id, row.classify_name, row.classify_code, row.classify_sort)">修改</Button>
						<Button @click="showDeleteDialog(row.classify_id)">删除</Button>
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
			<Modal v-model="addClassifyFlag" :title="title" @on-ok="saveData">
				<Form ref="addForm" :model="addFormData" :label-width="100" :rules="ruleValidate">
					<input type="hidden" v-model="addFormData.classifyId" />
					<div class="item">
						<FormItem label="分类名称" prop="classifyName"><Input placeholder="分类名称" v-model="addFormData.classifyName" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="分类编码" prop="classifyCode"><Input placeholder="分类编码" v-model="addFormData.classifyCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="排序" prop="classifySort"><Input string placeholder="排序" v-model="addFormData.classifySort" /></FormItem>
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
					<Button type="error" size="large" @click="deleteData">删除</Button>
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
			title: '添加分类',
			addClassifyFlag: false,
			total: 0,
			hasNext: false,
			msgInfo: {
				showMsgFlag: false,
				msgType: 'error',
				msgTitle: '',
				msgContents: ''
			},
			searchForm: {
				curre_page: 1,
				page_size: 10,
				classify_name: '',
				classify_code: ''
			},
			addFormData: {
				classifyId: 0,
				classifyName: '',
				classifyCode: '',
				classifySort: 1
			},
			ruleValidate: {
				classifyName: [{ required: true, type: 'string', message: '分类名称不能为空', trigger: 'blur' }],
				classifyCode: [{ required: true, type: 'string', message: '分类编码不能为空', trigger: 'blur' }],
			},
			// 结果
			listTitle: [],
			listContents: [],
			classifyId: null,
			modal2: false,
			rules: {
				required: [{}]
			}
		};
	},
	created() {
		this.listTitle = [
			{ title: '标识', key: 'classify_id', align: 'center' },
			{ title: '分类名称', key: 'classify_name', align: 'center' },
			{ title: '分类编码', key: 'classify_code', align: 'center' },
			{ title: '排序', key: 'classify_sort', align: 'center' },
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
			let vm = this;
			let params = {
				req_type: 'kc_find_classify_page',
				data: this.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.listContents = res.data.classify_list;
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
		checkSavedata(){
			let vm = this;
			if(!vm.addFormData.classifyName || vm.addFormData.classifyName == ''){
				let msg = '分类名称不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			if(!vm.addFormData.classifyCode || vm.addFormData.classifyCode == ''){
				let msg = '分类编码不能为空';
				vm.$Message.warning({ content: msg, duration: 5 });
				return true;
			}
			return false;
		},
		saveData() {
			let vm = this;
			if(vm.checkSavedata()){
				return;
			}
			let params = {
				req_type: 'kc_add_classify',
				data: this.addFormData
			}; // 参数
			vm.addClassifyFlag = false;
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
		showAddModel(classifyId, classifyName, classifyCode, classifySort) {
			this.addClassifyFlag = true;
			this.addFormData.classifyId = classifyId;
			this.addFormData.classifyName = classifyName;
			this.addFormData.classifyCode = classifyCode;
			this.addFormData.classifySort = classifySort?classifySort:1;
		},
		clearSearch() {
			this.searchForm.curre_page = 1;
			this.searchForm.page_size = 10;
			this.searchForm.classify_name = null;
			this.searchForm.classify_code = null;
			this.searchList();
			this.msgInfo.showMsgFlag = false;
		},
		showDeleteDialog(id) {
			this.modal2 = true;
			this.classifyId = id;
		},
		deleteData() {
			let vm = this;
			vm.addFormData.classifyId = vm.classifyId;
			let params = {
				req_type: 'kc_del_classify',
				data: vm.addFormData
			}; // 参数
			vm.modal2 = false;
			vm.msgInfo.showMsgFlag = false;
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
	/* font-size: 18px; */
	font-size: 12px;
}
>>> .ivu-modal-header p,
>>> .ivu-modal-header-inner {
	/* font-size: 20px; */
	font-size: 12px;
}
>>> .ivu-table{
	font-size: 12px;
}
</style>
