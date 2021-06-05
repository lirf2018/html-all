<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="activity-list" v-for="(item, index) in infoList" :key="item.infoId">
				<div>
					<div class="activity-title">
						<div>
							<span class="title">{{ item.infoTitle }}</span>
							<span class="is-new" v-show="item.activityIsNew">new</span>
						</div>
						<div>
							<span>{{ item.endTime }} 结束</span>
						</div>
					</div>
					<div class="activity-img">
						<div><img :src="item.infoImg" /></div>
					</div>
					<div class="activity-desc">
						<span>{{ item.markMsg }}</span>
					</div>
					<div class="activity-detail" @click="toDetailPage(item.infoId)">
						<div>
							<span>查看详情</span>
							<span>
								<van-icon name="arrow" />
							</span>
						</div>
					</div>
				</div>
			</div>
		</van-list>
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
				title: '活动资讯',
				infoList: [],
				loading: false,
				finished: false,
				testId: 0,
				currePage: 1,
				hasNext: false
			};
		},
		methods: {
			onLoad() {
				let vm = this;
				let params = {
					req_type: 'query_info_page',
					data: {
						currePage: vm.currePage
					}
				}; // 参数
				this.loading = true;
				axios.post('', params).then(function(res) {
						if (res.resp_code == 1) {
							let dataList = res.data.list;
							let hasNext = res.data.hasNext;
							vm.initDataList(dataList, hasNext);
							vm.currePage = vm.currePage + 1;
						} else {
							Toast(res.resp_desc);
						}
					}).catch(err => {
						// this.error = true;
					})
					.finally(() => {
						this.loading = false;
					});
			},
			initDataList(dataList, hasNext) {
				let vm = this;
				for (let i = 0; i < dataList.length; i++) {
					var obj = {
						infoId: dataList[i].infoId,
						infoTitle: dataList[i].infoTitle,
						endTime: dataList[i].endTime,
						activityIsNew: true,
						infoImg: dataList[i].infoImg,
						markMsg: dataList[i].markMsg
					};
					vm.infoList.push(obj);
				}
				vm.loading = false;
				if (hasNext == false) {
					vm.finished = true;
				}
			},
			toDetailPage(infoId) {
				let url = '/infoDetail?infoId=' + infoId;
				this.$router.push(url);
				//打开新页签
				//const page  = this.$router.resolve({path: url})
				//window.open(page.href,'_blank')
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

	.activity-list {
		background-color: #ffffff;
		margin: 10px 10px;
		color: #657180;
	}

	.activity-list>div {
		padding: 10px 10px;
	}

	.activity-title {
		padding: 5px 0;
		padding-bottom: 10px;
	}

	.activity-title>div:first-child {
		float: left;
		padding-bottom: 10px;
		font-weight: bold;
	}

	.is-new {
		font-weight: normal;
		font-size: 12px;
		background-color: #008000;
		color: #ffffff;
		padding: 0 3px;
		margin-left: 3px;
	}

	.activity-title>div:last-child {
		float: right;
		padding-bottom: 10px;
		font-size: 12px;
	}

	.activity-img img {
		width: 100%;
		border-radius: 10px;
	}

	.activity-desc {
		font-size: 12px;
		padding: 5px 0 10px 0;
	}

	.activity-detail {
		font-size: 12px;
		overflow: hidden;
		border-top: 1px solid #f0f0f0;
		padding-top: 10px;
	}

	.activity-detail>div>span {
		display: block;
		float: left;
		width: 50%;
	}

	.activity-detail>div>span:first-child {
		color: #008000;
	}

	.activity-detail>div>span:last-child {
		text-align: right;
		font-size: 14px;
	}
</style>
