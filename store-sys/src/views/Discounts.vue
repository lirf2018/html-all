<template>
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;"><Navigation /></div>
		<div>
			<div class="search-form">
				<Form :model="formItem" :label-width="120" :inline="true">
					<FormItem label="优惠码"><Input placeholder="优惠码" v-model="formItem.discountsCode" /></FormItem>
					<FormItem label="优惠类型">
						<Select v-model="formItem.discountsType" style="width:200px">
							<Option value="1">待金券</Option>
							<Option value="2">打折券</Option>
							<Option value="3">满减券</Option>
						</Select>
					</FormItem>
					<FormItem label="状态">
						<Select placeholder="选择状态" v-model="formItem.status">
							<Option value="beijing">有效</Option>
							<Option value="shanghai">无效</Option>
						</Select>
					</FormItem>
					<Button style="margin:0px 10px">搜索</Button>
					<Button @click="clearSearch">清空</Button>
				</Form>
			</div>
			<div class="in-btn"><Button style="margin-right: 20px" @click="addFlag = true">配置优惠</Button></div>
			<div class="list">
				<Table size="large" border ref="selection" :columns="listTitle" :data="listContents">
					<template slot-scope="{ row }" slot="name">
						<strong>操作</strong>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<Button style="margin-right: 15px">修改</Button>
						<Button>删除</Button>
					</template>
				</Table>
			</div>
			<div class="page-next"><Page :total="100" show-sizer prev-text="上一页" next-text="下一页" @on-change="changePage" @on-page-size-change="changePageSize" /></div>
		</div>
		<div>
			<Modal v-model="addFlag" :title="title" @on-ok="saveData">
				<Form ref="formGoodsInfo" :model="formAddDataInfo" :label-width="120" :rules="ruleValidate">
					<div class="item">
						<FormItem label="优惠码" prop="discountsCode"><Input placeholder="优惠码" v-model="formAddDataInfo.discountsCode" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="优惠描述" prop="discountsDesc"><Input placeholder="优惠描述" v-model="formAddDataInfo.discountsDesc" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="优惠类型" prop="discountsType">
							<Select v-model="formAddDataInfo.discountsType" style="width:200px">
								<Option value="1">待金券</Option>
								<Option value="2">打折券</Option>
								<Option value="3">满减券</Option>
							</Select>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="待金券金额" prop="discountsPrice"><Input placeholder="待金券金额" v-model="formAddDataInfo.discountsPrice" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="折扣率" prop="discountsPercent">
							<Select v-model="formAddDataInfo.discountsPercent" style="width:200px">
								<Option v-for="item in discountsPercentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
					</div>
					<div class="item">
						<FormItem label="满" prop="enoughMoney"><Input placeholder="满" v-model="formAddDataInfo.enoughMoney" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="减" prop="subtractMoney"><Input placeholder="减" v-model="formAddDataInfo.subtractMoney" /></FormItem>
					</div>
					<div class="item">
						<FormItem label="过期时间" prop="passTime">
							<DatePicker type="date" placeholder="过期时间" :editable="false" v-model="formAddDataInfo.passTime"></DatePicker>
						</FormItem>
					</div>
				</Form>
			</Modal>
		</div>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
	components: { Navigation: Navigation },
	data() {
		return {
			title: '配置优惠',
			addFlag: false,
			formItem: {
				current: 1,
				pageSize: 10,
				discountsCode: '',
				discountsType: '',
				status: null
			},
			formAddDataInfo: {
				discountsCode: '',
				discountsDesc: '',
				discountsType: null,
				discountsPrice: null,
				discountsPercent: null,
				enoughMoney: null,
				subtractMoney: null,
				passTime: null
			},
			discountsPercentList: [{ id: 1, name: '95折' }, { id: 2, name: '9折' }],
			ruleValidate: {},
			// 结果
			listTitle: [],
			listContents: []
		};
	},
	created() {
		this.listTitle = [
			{ title: '标识', key: 'discountsId', align: 'center' },
			{ title: '优惠码', key: 'discountsCode', align: 'center' },
			{ title: '优惠描述', key: 'discountsDesc', align: 'center' },
			{ title: '优惠类型', key: 'discountsType', align: 'center' },
			{ title: '待金券金额', key: 'discountsPrice', align: 'center' },
			{ title: '折扣率', key: 'discountsPercent', align: 'center' },
			{ title: '满', key: 'enoughMoney', align: 'center' },
			{ title: '减', key: 'subtractMoney', align: 'center' },
			{ title: '过期时间', key: 'passTime', align: 'center' },
			{ title: '状态', key: 'statusName', align: 'center' },
			{ title: '操作', slot: 'action', align: 'center', width: 400 }
		];
		this.listContents = [
			{
				discountsId: 1,
				discountsCode: 'xiochi',
				discountsDesc: '淘宝',
				discountsType: 0,
				discountsPrice:null,
				discountsPercent:null,
				enoughMoney:30,
				subtractMoney:10,
				passTime:'2020-01-01',
				statusName: '有效'
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
		clearSearch() {
			this.formItem.supplierName = null;
			this.formItem.supplierCode = null;
			this.formItem.statusName = null;
		},
		saveData() {
			alert();
		},
		searchList() {}
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

>>> .ivu-form-item-content {
	text-align: left;
}
</style>
