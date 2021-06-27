<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="">
			<van-tabs v-model="active" color="#008000">
				<van-tab title="待使用">
					<van-list v-model="loadingA" :finished="finishedA" finished-text="没有更多了" @load="onLoadA">
						<div class="item-div">
							<!-- <div class="title">
								<span>下午15:00 后预约，将安排第二天配送或者自取。</span>
							</div> -->
							<div class="items-list items-list-effect-color" v-for=" (item,index) in listTab0"
								:key="index">
								<div class="items-title">
									<span class="items-info-name-title" style="text-decoration: underline;">{{item.private_code}}</span>
									<span class="items-info-value-title">{{item.status == 0?'未预约':'已预约'}}</span>
								</div>
								<div class="items-title items-info">
									<span class="items-info-name">商品名称</span>
									<span class="items-info-value">{{item.goods_name}}</span>
								</div>
								<div class="items-title items-info">
									<span class="items-info-name">付款时间</span>
									<span class="items-info-value">{{item.pay_time}}</span>
								</div>
								<div class="items-title items-info" v-if="item.status == 1">
									<span class="items-info-name">预约时间</span>
									<span class="items-info-value">{{item.reservation_time}}</span>
								</div>
								<div class="items-title items-info" v-if="item.status == 1">
									<span class="items-info-name">配送时间</span>
									<span class="items-info-value">{{item.get_time}}
									<span v-if="item.get_time_flag == 1 && item.out_time_flag == 1" style="color: #008000;font-weight: 900;">({{item.flow_status_name}})</span>
									<span v-if="item.get_time_flag == 0 && item.out_time_flag == 1" >({{item.flow_status_name}})</span>
									<span v-if="item.out_time_flag == 0" style="color: red;">(已过期)</span></span>
								</div>
								<div class="desc">
									<van-collapse v-model="item.activeName" accordion>
										<van-collapse-item title="内容">
											<div class="item-contents" v-html="item.contents">
											</div>
										</van-collapse-item>
									</van-collapse>
								</div>
								<div style="text-align: right;margin:10px 15px;">
									<van-button size="small" color="#008000" v-if="item.status == 0"
										@click="showPickerPopup(item.id)">预约</van-button>
									<van-button size="small" color="#008000" v-if="item.status == 1"
										@click="cancelYuding(item.id,item.get_time)">取消预约</van-button>
								</div>
							</div>
						</div>
					</van-list>
				</van-tab>
				<van-tab title="已完成">
					<van-list v-model="loadingB" :finished="finishedB" finished-text="没有更多了" @load="onLoadB">
						<div class="items-list items-uneffect-color" v-for="(item,index) in listTab1">
							<div class="items-title">
								<span class="items-info-name-title" style="text-decoration: underline;">{{item.private_code}}</span>
								<span class="items-info-value-title">已完成</span>
							</div>
							<div class="items-title items-info">
								<span class="items-info-name">商品名称</span>
								<span class="items-info-value">{{item.goods_name}}</span>
							</div>
							<div class="items-title items-info">
								<span class="items-info-name">付款时间</span>
								<span class="items-info-value">{{item.pay_time}}</span>
							</div>
							<div class="items-title items-info">
								<span class="items-info-name">预约时间</span>
								<span class="items-info-value">{{item.reservation_time}}</span>
							</div>
							<div class="items-title items-info">
								<span class="items-info-name">完成时间</span>
								<span class="items-info-value">{{item.update_time}}</span>
							</div>
							<div class="desc">
								<van-collapse v-model="item.activeName" accordion>
									<van-collapse-item title="内容">
										<div class="item-contents" v-html="item.contents">
										</div>
									</van-collapse-item>
								</van-collapse>
							</div>
							<div style="text-align: right;margin:10px 15px;">
							</div>
						</div>
					</van-list>
				</van-tab>
			</van-tabs>
		</div>
		<van-popup v-model="showPicker" round position="bottom">
			<ChoseDate :onConfirm="onConfirm" :onCancel="onCancel" />
		</van-popup>

	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import ChoseDate from '@/components/ChoseDate.vue'
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head,
			ChoseDate: ChoseDate
		},
		data() {
			return {
				title: '定制套餐',
				id: 0,
				active: 0,
				columns: [],
				listTab0: [],
				listTab1: [],
				loadingB: false,
				finishedB: false,
				refreshingB: false,
				loadingA: false,
				finishedA: false,
				refreshingA: false,
				currePageA: 1,
				hasNextA: false,
				currePageB: 1,
				hasNextB: false,
				showPicker: false,
				statusName:''
			};
		},
		mounted() {

		},
		methods: {
			toPage(orderNo) {
				this.$router.push("orderDetail?orderNo=" + orderNo);
			},
			getDateList() {
				let vm = this;
				let params = {
					req_type: 'get_date_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.columns = res.data.date_list;
					} else {
						Toast(res.resp_desc);
					}
				}).catch(err => {
					// this.error = true;
				})
			},
			onLoadB() {
				let vm = this;
				let params = {
					req_type: 'query_user_private',
					data: {
						currePage: vm.currePageB,
						findType: 1,
						userId: 0,
					}
				}; // 参数
				this.loadingB = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let list = res.data.list;
							let hasNext = res.data.hasNext;
							vm.finishPrivate(list, hasNext)
							vm.currePageB = vm.currePageB + 1;
						} else {
							Toast(res.resp_desc);
						}
					}).catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.loadingA = false;
					});
			},
			finishPrivate(dataList, hasNext) {
				let vm = this;
				for (let i = 0; i < dataList.length; i++) {
					vm.listTab1.push(dataList[i]);
				}
				vm.loadingB = false;
				if (hasNext == false) {
					vm.finishedB = true;
				}
			},
			onLoadA() {
				let vm = this;
				let params = {
					req_type: 'query_user_private',
					data: {
						currePage: vm.currePageA,
						findType: 0,
						userId: 0,
					}
				}; // 参数
				this.loadingA = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let list = res.data.list;
							let hasNext = res.data.hasNext;
							vm.initList(list, hasNext)
							vm.currePageA = vm.currePageA + 1;
						} else {
							Toast(res.resp_desc);
						}
					}).catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.loadingA = false;
					});
			},
			initList(list, hasNext) {
				let vm = this;
				for (let i = 0; i < list.length; i++) {
					list[i].activeName=1
					vm.listTab0.push(list[i]);
				}
				vm.loadingA = false;
				if (hasNext == false) {
					vm.finishedA = true;
				}
			},
			showPickerPopup(id) {
				this.showPicker = true;
				this.getDateList();
				this.id = id;
			},
			cancelYuding(id, time) {
				let vm = this;
				this.$dialog
					.confirm({
						title: '提示',
						message: '确认取消预约吗？<br/>取消预约时间：' + time
					})
					.then(() => {
						let params = {
							req_type: 'cancel_user_private',
							data: {
								id: id
							}
						}; // 参数
						axios.post('', params).then(function(res) {
							if (res.resp_code == 1) {
								Toast("取消成功");
								vm.listTab0 = [];
								vm.currePageA = 1;
								vm.onLoadA();
							} else {
								Toast(res.resp_desc);
							}
						}).catch(err => {
							// this.error = true;
						})
					}).catch((e) => {})
			},
			// 日期选择
			onConfirm(value) {
				let vm = this;
				this.value = value;
				this.showPicker = false;
				let params = {
					req_type: 'update_user_private',
					data: {
						id: vm.id,
						get_date: value
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast("预约成功");
						vm.listTab0 = [];
						vm.currePageA = 1;
						vm.onLoadA();
					} else {
						Toast(res.resp_desc);
					}
				}).catch(err => {
					// this.error = true;
				})
			},
			onCancel() {
				this.showPicker = false;
			}
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.item-div {
		margin-top: 10px;
	}

	.items-list-effect-color {
		border: 1px solid #008000;
		border-left: 8px solid #008000;
	}

	.items-uneffect-color {
		border: 1px solid #C0C0C0;
		border-left: 8px solid #C0C0C0;
	}

	.link-to-item {
		text-decoration: underline;
	}

	.items-list {
		margin: 10px 10px;
		border-radius: 8px 8px;
		font-size: 12px;
	}

	.items-title {
		clear: both;
		overflow: auto;
		padding: 0 15px;
		padding-top: 10px;
	}

	.items-info-name-title ,.items-info-name {
		display: block;
		float: left;
		width: 30%;
	}

	.items-info-value-title ,.items-info-value {
		display: block;
		float: right;
		width:70%;
		text-align: right;
	}

	.items-info {
		color: grey;
	}
	
	.desc{
		overflow: auto;
		position: relative;
		clear: both;
		
	}
	
	.item-contents{
		font-size: 12px;
		border: 1px solid #ebedf0;
		padding: 0 5px;
	}
	
	.desc>>>.van-cell{
		color: grey;
	}

	/* >>>.van-tabs__wrap,
	.van-hairline--top-bottom {
		position: fixed !important;
		width: 100%;
		z-index: 2000;
		top: 40px;
	} */
</style>
