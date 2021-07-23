<template>
	<!-- 订单收入图 -->
	<div class="page">
		<div style="position: absolute;top: 0px;left: 15px;z-index: 999;">
			<Navigation />
		</div>
		<div class="create-report">
			<Form :inline="true">
				<FormItem label="选择年份" prop="city" :label-width="80">
					<Select v-model="createYear" placeholder="选择年份">
						<Option :value="item" v-for="(item, index) in yearList" :key="index">{{ item }}</Option>
					</Select>
				</FormItem>
				<FormItem label="选择月份" :label-width="100">
					<Select v-model="createMonth" placeholder="选择月份">
						<Option :value="item" v-for="(item, index) in monthsList" :key="index">{{ item }}</Option>
					</Select>
				</FormItem>
				<Button @click="createReport">刷新报表</Button>
			</Form>
		</div>
		<div class="year-search">
			<Form :inline="true">
				<FormItem label="选择查询年" prop="city" :label-width="120">
					<Select v-model="year" placeholder="选择查询年" @on-change="initTableData">
						<Option :value="item" v-for="(item, index) in yearList" :key="index">{{ item }}</Option>
					</Select>
				</FormItem>
				<Button @click="initTableData">查询</Button>
			</Form>
		</div>
		<div class="report" id="myChart" :style="{ width: width, height: height }"></div>
		<div class="">
			<Table show-summary :columns="columns" :data="data" :summary-method="handleSummary"></Table>
		</div>
		<div style="height: 50px;"></div>
	</div>
</template>

<script>
	import Navigation from '@/components/Navigation.vue';
	import axios from '@/network/request.js';

	export default {
		components: {
			Navigation: Navigation
		},
		data() {
			return {
				width: '90%',
				height: '350px',
				year: '2021',
				columns: [],
				data: [],
				yearList: [],
				monthsList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				createYear: '',
				createMonth: ''
			};
		},
		mounted() {
			//
			let data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
			let dataValueIn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			let dataValueOut = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			let dataValueget = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.drawLine(data, dataValueIn, dataValueOut, dataValueget);
			this.$nextTick(function() {
				this.getYear();
			});
		},
		methods: {
			getYear() {
				let vm = this;
				let params = {
					req_type: 'year_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.yearList = res.data.year_list;
						vm.year = res.data.report_year;
						vm.createYear = res.data.report_year;
						vm.initTableData();
					} else {
						vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
					}
				});
			},
			initPic(obj) {
				let data = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
				let dataValueIn = [];
				let dataValueOut = [];
				let dataValueget = [];
				for (let i = 0; i < obj.list.length; i++) {
					dataValueIn.push(obj.list[i].order_price_all);
					dataValueOut.push(obj.list[i].goods_inprice_all);
					dataValueget.push(obj.list[i].get_price_all);
				}
				this.drawLine(data, dataValueIn, dataValueOut, dataValueget);
			},
			initTableData() {
				let vm = this;
				this.columns = [{
						title: '月份',
						key: 'year_sale_month',
						align: 'center'
					},
					{
						title: '收入',
						key: 'order_price_all',
						align: 'center'
					},
					{
						title: '支出',
						key: 'goods_inprice_all',
						align: 'center'
					},
					{
						title: '净收入',
						key: 'get_price_all',
						align: 'center'
						// render: (h, obj) => {
						// 	let getprice = obj.row.inprice - obj.row.outprice;
						// 	return h('span', getprice);
						// }
					}
				];
				let params = {
					req_type: 'order_report_table',
					data: {
						report_year: vm.year
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.data = res.data.list;
						if (vm.yearList.length == 0) {
							vm.yearList = res.data.year_list;
							vm.year = res.data.report_year;
						}
						vm.initPic(res.data);
					} else {
						vm.myDialog('error', res.resp_desc ? res.resp_desc : '操作失败');
					}
				});
			},
			drawLine(data, dataValueIn, dataValueOut, dataValueget) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'));
				// 绘制图表配置
				let option = {
					title: {
						text: '订单统计/元',
						subtext: '来自订单数据'
					},
					tooltip: {},
					xAxis: {
						data: data
					},
					legend: {
						data: ['收入', '支出', '净收入']
					},
					// color: ['#009900', '#c23531'],
					yAxis: {},
					series: [{
							name: '收入',
							type: 'bar',
							label: {
								show: true,
								position: 'top'
							},
							data: dataValueIn
						},
						{
							name: '支出',
							type: 'bar',
							label: {
								show: true,
								position: 'top'
							},
							data: dataValueOut
						},
						{
							name: '净收入',
							type: 'bar',
							label: {
								show: true,
								position: 'top'
							},
							data: dataValueget
						}
					]
				};
				// 窗口大小自适应方案
				myChart.setOption(option);
				setTimeout(function() {
					window.onresize = function() {
						myChart.resize();
					};
				}, 200);
			},
			handleSummary({
				columns,
				data
			}) {
				let vm = this;
				const sums = {};
				columns.forEach((column, index) => {
					const key = column.key;
					if (index === 0) {
						sums[key] = {
							key,
							value: '总价'
						};
						return;
					}
					const values = data.map(item => Number(item[key]));
					if (!values.every(value => isNaN(value))) {
						const v = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[key] = {
							key,
							value: vm.numFilter(v) + ' 元'
						};
					} else {
						sums[key] = {
							key,
							value: 'N/A'
						};
					}
				});

				return sums;
			},
			createReport() {
				let vm = this;
				if (vm.createYear == null || vm.createYear == '') {
					let msg = '请选择年份';
					vm.$Message.warning({
						content: msg,
						duration: 3
					});
					return;
				}

				let params = {
					req_type: 'create_order_report',
					data: {
						year: vm.createYear,
						month: vm.createMonth
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.myDialog('success', '请求成功,稍后刷新页面查看');
					} else {
						vm.$Message.warning({
							content: res.resp_desc,
							duration: 3
						});
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

	.report {
		text-align: center;
		margin: 0 auto;
	}

	.year-search {
		width: 60%;
		text-align: center;
		margin: 0 auto;
		padding-top: 20px;
	}

	.create-report {
		position: fixed;
		top: 20px;
		right: 10px;
		z-index: 9999999999999;
	}
</style>
