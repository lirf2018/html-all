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
							<div style="height: 20px;">
							</div>
							<!-- <div class="title">
								<span>下午15:00 后预约，将安排第二天配送或者自取。</span>
							</div> -->
							<div class="items-list items-list-effect-color" v-for=" (item,index) in listTab0"
								:key="index">
								<div class="items-title">
									<span style="text-decoration: underline;">{{item.private_code}}</span>
									<span>{{item.status == 0?'未预约':'已预约'}}</span>
								</div>
								<div class="items-title items-info">
									<span>付款时间</span>
									<span>{{item.pay_time}}</span>
								</div>
								<div class="items-title items-info" v-if="item.status == 1">
									<span>预约时间</span>
									<span>{{item.reservation_time}}</span>
								</div>
								<div class="items-title items-info" v-if="item.status == 1">
									<span>配送时间</span>
									<span>{{item.get_time}}</span>
								</div>
								<div style="text-align: right;margin:10px 15px;">
									<van-button size="small" color="#008000" v-if="item.status == 0"
										@click="showPickerPopup(item.id)">预约</van-button>
									<van-button size="small" color="#008000" v-if="item.status == 1"
										@click="cancelYuding(item.id)">取消预约</van-button>
								</div>
							</div>
						</div>
					</van-list>
				</van-tab>
				<van-tab title="已完成">
					<van-list v-model="loadingB" :finished="finishedB" finished-text="没有更多了" @load="onLoadB">
						<div style="height: 40px;">
						</div>
						<div class="items-list items-uneffect-color" v-for="(item,index) in listTab1">
							<div class="items-title">
								<span>{{item.private_code}}</span>
								<span>已完成</span>
							</div>
							<div class="items-title items-info">
								<span>付款时间</span>
								<span>{{item.pay_time}}</span>
							</div>
							<div class="items-title items-info">
								<span>预约时间</span>
								<span>{{item.reservation_time}}</span>
							</div>
							<div class="items-title items-info">
								<span>完成时间</span>
								<span>{{item.update_time}}</span>
							</div>
							<div style="text-align: right;margin:10px 15px;">
							</div>
						</div>
					</van-list>
				</van-tab>
			</van-tabs>
		</div>
		<van-popup v-model="showPicker" round position="bottom">
			<van-picker show-toolbar title="选择日期" :columns="columns" @cancel="showPicker = false"
				@confirm="onConfirm" />
		</van-popup>

	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head
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
				showPicker: false
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
					vm.listTab0.push(list[i]);
				}
				vm.loadingA = false;
				if (hasNext == false) {
					vm.finishedA = true;
				}
			},
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
			showPickerPopup(id) {
				this.showPicker = true;
				this.getDateList();
				this.id = id;
			},
			cancelYuding(id) {
				let vm = this;
				this.$dialog
					.confirm({
						title: '提示',
						message: '确认取消预约吗？'
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
					})
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
		margin-top: 30px;
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

	.items-title>span:first-child {
		display: block;
		float: left;
		width: 50%;
	}

	.items-title>span:last-child {
		display: block;
		float: right;
		width: 50%;
		text-align: right;
	}

	.items-info {
		color: grey;
	}

	>>>.van-tabs__wrap,
	.van-hairline--top-bottom {
		position: fixed !important;
		width: 100%;
		z-index: 2000;
		top: 40px;
	}
</style>
