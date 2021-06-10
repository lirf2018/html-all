<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="my-jf">
			<span>可用积分</span>
			<span>{{jifenCount}}</span>
			<div class="use-jifen" @click="toChangeJiFen">去兑换</div>
		</div>
		<div class="jf-items">
			<van-tabs v-model="active" color="#008000">
				<van-tab title="积分记录">
					<van-list v-model="loadingA" :finished="finishedA" finished-text="没有更多了" @load="onLoadA">
						<div class="no-list" v-show="!showJf">
							<span>
								<van-icon name="bookmark-o" />
							</span>
							<span>暂无积分记录</span>
						</div>
						<div class="ji-list" v-show="showJf">
							<div class="list-title">
								<div><span>事项</span></div>
								<div><span>分值</span></div>
								<div><span>时间</span></div>
							</div>
							<div style="width: 100%;clear: both;height: 35px;"></div>
							<div class="list-items">
								<div class="item-info" v-for="(item, index) in jiList" :key="index">
									<span>{{ item.title }}</span>
									<span>+{{ item.score }}</span>
									<span>{{ item.date }}</span>
								</div>
							</div>
							<div style="width: 100%;clear: both;"></div>
						</div>
					</van-list>
				</van-tab>
				<van-tab title="兑换记录">
					<van-list v-model="loadingB" :finished="finishedB" finished-text="功能敬请期待" @load="onLoadB">
						<!-- <div class="no-list">
							<span>
								<van-icon name="bookmark-o" />
							</span>
							<span>暂无兑换记录</span>
						</div> -->
						<div class="ji-change-record" >
							<div class="list-title">
								<div><span>事项</span></div>
								<div><span>分值</span></div>
								<div><span>时间</span></div>
							</div>
							<div style="width: 100%;clear: both;height: 35px;"></div>
							<div class="list-items">
								<!-- <div class="item-info" v-for="(item, index) in changeList" :key="index">
									<span>{{ item.title }}</span>
									<span>-{{ item.score }}</span>
									<span>{{ item.date }}</span>
								</div> -->
							</div>
							<div style="width: 100%;clear: both;"></div>
						</div>
					</van-list>
				</van-tab>
			</van-tabs>
		</div>
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
				title: '我的积分',
				jifenCount: 0,
				active: 0,
				jiList: [],
				changeList: [],
				loadingB: false,
				finishedB: false,
				refreshingB: false,
				loadingA: false,
				finishedA: false,
				refreshingA: false,
				showRecord: true,
				showJf: false,
				testindexB: 0,
				currePageA: 1,
				hasNextA: false,
				currePageB: 1,
				hasNextB: false
			};
		},
		mounted() {
			this.showJf = true;
			this.showRecord = false;
		},
		methods: {
			toChangeJiFen() {
				Toast('敬请期待');
			},
			onLoadB() {
				let vm = this;
				let params = {
					req_type: 'find_jifen_page',
					data: {
						currePage: vm.currePageB,
						userId: 0,
					}
				}; // 参数
				this.loadingB = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let dataList = res.data.jifenList;
							let hasNext = res.data.hasNext;
							vm.jifenCount = res.data.userJifen;
							vm.changeJifen(dataList, hasNext)
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
			changeJifen(dataList, hasNext) {
				let vm = this;
				for (let i = 0; i < dataList.length; i++) {
					var obj = {
						title: dataList[i].task_name,
						score: dataList[i].jifen,
						date: dataList[i].createtime
					};
					vm.changeList.push(obj);
				}
				vm.loadingB = false;
				if (hasNext == false) {
					vm.finishedB = true;
				}
				vm.showRecord = vm.changeList.length > 0 ? true : false;
			},
			onLoadA() {
				let vm = this;
				let params = {
					req_type: 'find_jifen_page',
					data: {
						currePage: vm.currePageA,
						userId: 0,
					}
				}; // 参数
				this.loadingA = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let dataList = res.data.jifenList;
							let hasNext = res.data.hasNext;
							vm.jifenCount = res.data.userJifen;
							vm.initJifen(dataList, hasNext)
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
			initJifen(dataList, hasNext) {
				let vm = this;
				for (let i = 0; i < dataList.length; i++) {
					var obj = {
						title: dataList[i].task_name,
						score: dataList[i].jifen,
						date: dataList[i].createtime
					};
					vm.jiList.push(obj);
				}
				vm.loadingA = false;
				if (hasNext == false) {
					vm.finishedA = true;
				}
				vm.showji = vm.jiList.length > 0 ? true : false;
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

	.my-jf {
		background-color: #008000;
		color: #ffffff;
		font-size: 16px;
		text-align: center;
		padding: 2.2rem 0;
		position: fixed !important;
		width: 100%;
		z-index: 9999999;
		font-weight: bold;
	}

	.my-jf>span {
		display: block;
	}

	.my-jf>span:last-child {
		padding-top: 5px;
		font-size: 20px;
	}

	.use-jifen {
		position: absolute;
		right: 15px;
		bottom: 10px;
		font-weight: normal;
		font-size: 14px;
		text-decoration: underline;
	}

	.no-list {
		text-align: center;
		color: #c3cbd6;
		padding-top: 4rem;
	}

	.no-list>span {
		display: block;
	}

	.no-list>span:last-child {
		font-size: 14px;
	}

	/*  */
	.ji-list,
	.ji-change-record {
		font-size: 14px;
		color: #323233;
		width: 100%;
		margin-top: 7rem !important;
	}

	.list-items {
		margin-top: 4rem;
		font-size: 12px;
	}

	.list-title {
		margin-top: 2.5rem !important;
		position: fixed;
		width: 100%;
		z-index: 999;
		background-color: #ffffff;
	}

	.list-title>div>span {
		border-right: 1px solid #ebedf0;
		display: block;
		padding: 10px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.list-title>div>span:last-child {
		border: nones;
	}

	.list-title,
	.item-info {
		text-align: center;
		overflow: hidden;
		padding: 8px 0;
	}

	.item-info {
		background-color: #ffffff;
		border-bottom: 1px solid #f0f0f0;
		color: #657180;
	}

	.list-title>div,
	.item-info>span {
		float: left;
		width: 33.3%;
		display: block;
	}

	>>>.van-tabs__wrap,
	.van-hairline--top-bottom {
		position: fixed !important;
		width: 100%;
		z-index: 999999;
		/* padding: 5px 0; */
	}


	.van-tab {
		font-size: 16px !important;
	}
</style>
