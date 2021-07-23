<template>
	<!-- 商品销售排行 -->
	<div class="">
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
				<FormItem label="选择月份" :label-width="80">
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
					<Select v-model="year" placeholder="选择查询年" @on-change="clickYear()">
						<Option :value="item" v-for="(item, index) in yearList" :key="index">{{ item }}</Option>
					</Select>
				</FormItem>
				<FormItem label="查询维度" :label-width="150">
					<Select v-model="showSearchCondition" placeholder="查询维度" @on-change="clickWd()">
						<Option value="month">按月</Option>
						<Option value="season">按季度</Option>
						<Option value="year">按年</Option>
					</Select>
				</FormItem>
				<FormItem v-if="showSearchCondition == 'month'" label="选择查询月分" :label-width="150">
					<Select v-model="searchConditionValue" placeholder="选择查询月份" @on-change="clickMonth()">
						<Option :value="item" v-for="(item, index) in defaultMonthList" :key="index">{{ item }}</Option>
					</Select>
				</FormItem>
				<FormItem v-if="showSearchCondition == 'season'" label="选择查询季度" :label-width="150">
					<Select v-model="searchConditionValue" placeholder="选择查询季度" @on-change="clickJidu()">
						<Option value="1">1季度</Option>
						<Option value="2">2季度</Option>
						<Option value="3">3季度</Option>
						<Option value="4">4季度</Option>
					</Select>
				</FormItem>
				<Button @click="searchData">查询</Button>
			</Form>
			<div class="report" id="myChart" :style="{ width: width, height: height }"></div>
			<div class="page-next">
				<Page :total="total" :current="searchForm.curre_page" :page-size="searchForm.page_size"
					@on-change="changePage" prev-text="上一页" next-text="下一页" />
			</div>
		</div>
		<div class="">
			<Table show-summary :columns="columns" :data="data2" :summary-method="handleSummary"></Table>
		</div>
		<div class="page-next">
			<Page :total="total2" :current="searchForm2.curre_page" :page-size="searchForm2.page_size"
				@on-change="changePage2" prev-text="上一页" next-text="下一页" />
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
				total: 0,
				total2: 0,
				hasNext: false,
				hasNext2: false,
				backgroundColor: 'white',
				width: '90%',
				height: '850px',
				searchConditionValue: null, // 默认查询最进时间
				showSearchCondition: 'month',
				searchForm: {
					curre_page: 1,
					page_size: 5
				},
				searchForm2: {
					curre_page: 1,
					page_size: 10
				},
				columns: [],
				data2: [],
				countMap: null,
				year: '2021',
				yearList: [],
				defaultMonthList: [],
				monthsList: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				createYear: '',
				createMonth: ''
			};
		},
		mounted() {
			this.getYear();
			this.columns = [{
					title: '商品名称',
					key: 'goods_name',
					align: 'center'
				},
				{
					title: '收入(订单)',
					key: 'sale_price_all',
					align: 'center'
				},
				{
					title: '支出(进货)',
					key: 'income_price_all',
					align: 'center'
				},
				{
					title: '净收入',
					key: 'get_price',
					align: 'center'
				}
			];
		},
		methods: {
			monthList(year) {
				let vm = this;
				vm.defaultMonthList = [];
				vm.defaultMonthList.push(year + '-01');
				vm.defaultMonthList.push(year + '-02');
				vm.defaultMonthList.push(year + '-03');
				vm.defaultMonthList.push(year + '-04');
				vm.defaultMonthList.push(year + '-05');
				vm.defaultMonthList.push(year + '-06');
				vm.defaultMonthList.push(year + '-07');
				vm.defaultMonthList.push(year + '-08');
				vm.defaultMonthList.push(year + '-09');
				vm.defaultMonthList.push(year + '-10');
				vm.defaultMonthList.push(year + '-11');
				vm.defaultMonthList.push(year + '-12');
			},
			getYear() {
				let vm = this;
				let params = {
					req_type: 'year_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.yearList = res.data.year_list;
						vm.searchConditionValue = res.data.default_month;
						vm.year = res.data.report_year;
						vm.createYear = res.data.report_year;
						vm.monthList(vm.year);
						vm.initData();
					} else {}
				});
			},
			searchData() {
				let vm = this;
				let msg = '查询条件不能为空';
				if (this.showSearchCondition != 'year' && (this.showSearchCondition == null || this.showSearchCondition ==
						'')) {
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return;
				}
				if (this.showSearchCondition != 'year' && (this.searchConditionValue == null || this
						.searchConditionValue == '')) {
					vm.$Message.warning({
						content: msg,
						duration: 5
					});
					return;
				}
				if (this.showSearchCondition == 'year') {
					this.searchConditionValue = this.year;
				}
				vm.initTable();
				vm.initPic();
			},
			clickYear() {
				this.searchConditionValue = null;
				this.showSearchCondition = null;
				this.monthList(this.year);
				this.data2 = [];
				this.initPage();
			},
			clickWd() {
				this.initPage();
			},
			clickMonth() {
				this.initPage();
			},
			clickJidu() {
				this.initPage();
			},
			initPage() {
				let vm = this;
				this.data2 = [];
				this.searchForm.curre_page = 1;
				this.searchForm2.curre_page = 1;
				this.searchForm.page_size = 5;
				this.searchForm2.page_size = 10;
			},
			initData() {
				let vm = this;
				this.$nextTick(function() {
					vm.initPic();
				});
				this.$nextTick(function() {
					vm.initTable();
				});
			},
			changePage(current) {
				this.searchForm.curre_page = current;
				this.initPic();
			},
			changePage2(current) {
				this.searchForm2.curre_page = current;
				this.initTable();
			},
			initTable() {
				let vm = this;
				let data = {
					report_type: vm.showSearchCondition,
					report_condition: vm.searchConditionValue,
					report_year: vm.year,
					curre_page: vm.searchForm2.curre_page,
					page_size: vm.searchForm2.page_size
				};
				let params = {
					req_type: 'goods_report_table',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.data2 = res.data.goods_list;
						vm.total2 = res.data.total_num;
						vm.hasNext2 = res.data.has_next;
						vm.countMap = res.data.countMap;
					} else {}
				});
			},
			initPic() {
				let vm = this;
				let data = {
					report_type: vm.showSearchCondition,
					report_condition: vm.searchConditionValue,
					report_year: vm.year,
					curre_page: vm.searchForm.curre_page,
					page_size: vm.searchForm.page_size
				};
				let params = {
					req_type: 'goods_report_table',
					data: data
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let list = res.data.goods_list;
						vm.total = res.data.total_num;
						vm.hasNext = res.data.has_next;
						//
						let data = [];
						let dataValue = [];
						let dataValue2 = [];
						let dataValue3 = [];
						for (let i = list.length - 1; i >= 0; i--) {
							data.push(list[i].goods_name);
							dataValue.push(list[i].sale_price_all); // 订单收入价格
							dataValue2.push(list[i].income_price_all); // 进货价格
							dataValue3.push(list[i].get_price); // 净收入
						}
						vm.drawLine(data, dataValue, dataValue2, dataValue3);
					} else {}
				});
			},
			drawLine(data, dataValue, dataValue2, dataValue3) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(document.getElementById('myChart'));
				// 绘制图表配置
				let option = {
					title: {
						text: '商品销售统计/元',
						subtext: '来自订单数据'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: ['收入', '支出', '净收入']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: 'category',
						data: data
					},
					series: [{
							name: '收入',
							type: 'bar',
							label: {
								show: true,
								position: 'right'
							},
							data: dataValue
						},
						{
							name: '支出',
							type: 'bar',
							label: {
								show: true,
								position: 'right'
							},
							data: dataValue2
						},
						{
							name: '净收入',
							type: 'bar',
							label: {
								show: true,
								position: 'right'
							},
							data: dataValue3
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
			intDataTitle() {
				this.data = [{
						goodsName: '商品8',
						inprice: 10,
						outprice: 15,
						getprice: 0
					},
					{
						goodsName: '商品9',
						inprice: 10,
						outprice: 10,
						getprice: 0
					},
					{
						goodsName: '商品10',
						inprice: 10,
						outprice: 10,
						getprice: 0
					},
					{
						goodsName: '商品11',
						inprice: 10,
						outprice: 10,
						getprice: 0
					},
					{
						goodsName: '商品12',
						inprice: 10,
						outprice: 10,
						getprice: 0
					}
				];
			},
			handleSummary({
				columns,
				data
			}) {
				let vm = this;
				let count = [vm.countMap.sale_price_all, vm.countMap.income_price_all, vm.countMap.get_price_all];
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
					let v = count[index - 1];
					sums[key] = {
						key,
						value: vm.numFilter(v) + ' 元'
					};
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
					req_type: 'create_goods_report',
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
		position: relative;
		background-color: white;
		width: 100%;
		height: 100%;
		bottom: 0px;
		left: 0px;
	}

	.page-next {
		background-color: white;
		text-align: center;
		margin-right: 30px;
		padding: 15px 0;
	}

	.report {
		text-align: center;
		margin: 0 auto;
	}

	.year-search {
		text-align: center;
		margin: 0 auto;
		padding-top: 20px;
	}

	.create-report {
		position: fixed;
		top: 20px;
		right: 10px;
	}
</style>
