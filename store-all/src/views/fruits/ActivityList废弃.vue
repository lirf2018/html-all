<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="activity-list" v-for="(item, index) in activityList" :key="item.activityId">
				<div>
					<div class="activity-title">
						<div>
							<span class="title">{{ item.activityTitle }}</span>
							<span class="is-new" v-show="item.activityIsNew">new</span>
						</div>
						<div>
							<span>{{ item.activityEndDate }} 结束</span>
						</div>
					</div>
					<div class="activity-img">
						<div><img :src="item.activityImg" /></div>
					</div>
					<div class="activity-desc">
						<span>{{ item.activityDesc }}</span>
					</div>
					<div class="activity-detail">
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
				title: '优惠活动',
				activityList: [],
				loading: false,
				finished: false,
				testId: 0
			};
		},
		methods: {
			onLoad() {
				// 异步更新数据
				// setTimeout 仅做示例，真实场景中一般为 ajax 请求
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.testId = this.testId + 1;
						var obj = {
							activityId: this.testId,
							activityTitle: '一次领取大红包的机会',
							activityEndDate: '2020.05.04',
							activityIsNew: true,
							activityImg: 'https://img.yzcdn.cn/vant/apple-8.jpg',
							activityDesc: '每人限领一次'
						};
						this.activityList.push(obj);
					}

					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if (this.activityList.length >= 40) {
						this.finished = true;
					}
				}, 1000);
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
