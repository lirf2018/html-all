<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="searchForm" :label-width="120" :inline="true">
					<FormItem label="参数名称"><Input placeholder="参数名称" v-model="searchForm.param_name" @keyup.native="searchList()" /></FormItem>
					<FormItem label="参数编码"><Input placeholder="参数编码" v-model="searchForm.param_code" @keyup.native="searchList()" /></FormItem>
					<FormItem label="参数key"><Input placeholder="参数key" v-model="searchForm.param_key" @keyup.native="searchList()" /></FormItem>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div v-show="msgInfo.showMsgFlag">
				<Alert :type="msgInfo.msgType" show-icon>
					{{ msgInfo.msgTitle }}
					<span slot="desc">{{ msgInfo.msgContents }}</span>
				</Alert>
			</div>
			<div class="in-btn"><Button style="margin-right: 20px" @click="showAddView">添加参数</Button></div>
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
			<div class="page-next"><Page :page-size="searchForm.page_size" show-total :total="total" show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage" @on-page-size-change="changePageSize" /></div>
		</div>
		<div>
			<Modal v-model="addParamFlag" :title="title" @on-ok="saveData">
				<Form ref="formGoodsInfo" :model="addFormData" :label-width="120" :rules="ruleValidate">
					<div class="item">
						<FormItem label="参数名称" prop="paramName"><Input placeholder="参数名称" v-model="addFormData.paramName" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="参数编码" prop="paramCode"><Input placeholder="参数编码" v-model="addFormData.paramCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="参数key" prop="paramKey"><Input placeholder="参数key" v-model="addFormData.paramKey" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="参数value1" prop="paramValue1"><Input placeholder="参数value1" v-model="addFormData.paramValue" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="参数value2" prop="paramValue2"><Input placeholder="参数value2" v-model="addFormData.paramValue1" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="参数value3" prop="paramValue3"><Input placeholder="参数value3" v-model="addFormData.paramValue2" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="排序" prop="paramIndex"><Input string placeholder="排序" v-model="addFormData.paramIndex" /></FormItem>
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
			title: '添加参数',
			addParamFlag: false,
			total: 1,
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
				param_name: '',
				param_code: '',
				param_key: ''
			},
			addFormData: {
				paramId: 0,
				paramCode: '',
				paramName: '',
				paramKey: '',
				paramValue: '',
				paramValue1: '',
				paramValue2: '',
				paramIndex: 1
			},
			ruleValidate: {},
			// 结果
			listTitle: [],
			listContents: []
		};
	},
	created() {
		this.listTitle = [
			{ title: '标识', key: 'param_id', align: 'center' },
			{ title: '参数名称', key: 'param_name', align: 'center' },
			{ title: '参数编码', key: 'param_code', align: 'center' },
			{ title: '参数key', key: 'param_key', align: 'center' },
			{ title: '参数value', key: 'param_value', align: 'center' },
			{ title: '参数value2', key: 'param_value1', align: 'center' },
			{ title: '参数value3', key: 'param_value2', align: 'center' },
			{ title: '排序', key: 'data_index', align: 'center' },
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
				req_type: 'kc_page_param',
				data: vm.searchForm
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.listContents = res.data.param_list;
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
			this.searchForm.param_name = null;
			this.searchForm.param_code = null;
			this.searchForm.param_key = null;
			this.searchList();
			this.msgInfo.showMsgFlag = false;
		},
		showAddView(row) {
			this.addParamFlag = true;
			if (row.param_id) {
				this.addFormData.paramId = row.param_id;
				this.addFormData.paramName = row.param_name;
				this.addFormData.paramCode = row.param_code;
				this.addFormData.paramKey = row.param_key;
				this.addFormData.paramValue = row.param_value;
				this.addFormData.paramValue1 = row.param_value1;
				this.addFormData.paramValue2 = row.param_value2;
				this.addFormData.dataIndex = row.data_index;
			} else {
				this.addFormData.paramId = 0;
				this.addFormData.paramName = '';
				this.addFormData.paramCode = '';
				this.addFormData.paramKey = '';
				this.addFormData.paramValue = '';
				this.addFormData.paramValue1 = '';
				this.addFormData.paramValue2 = '';
				this.addFormData.dataIndex = 1;
			}
		},
		saveData() {
			const vm = this;
			const params = {
				req_type: 'kc_add_param',
				data: this.addFormData
			}; // 参数
			vm.addParamFlag = false;
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
			this.addFormData.paramId = row.param_id;
			this.modal2 = true;
		},
		sureDeleteData() {
			const vm = this;
			const params = {
				req_type: 'kc_delete_param',
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
	font-size: 18px;
}
>>> .ivu-modal-header p,
>>> .ivu-modal-header-inner {
	font-size: 20px;
}
</style>
