<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="activity-contnets">
			<div class="div-c" v-html="activityContents"></div>
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
				title: '活动详情',
				activityContents: '666'
			};
		},
		created() {
			this.activityContents =
				"<p style='margin-top: 0px; margin-bottom: 0px; padding: 0px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; white-space: normal; background-color: rgb(255, 255, 255);'>" +
				"<span class='bjh-p'></span>" +
				'</p>' +
				"<h2 style='margin: 0px; padding: 41px 0px 21px; font-size: 30px; line-height: 58px; text-align: center; font-family: &quot;Microsoft Yahei&quot;, 微软雅黑, 宋体; white-space: normal; background-color: rgb(248, 248, 249);'>" +
				'如何活动详情方案' +
				'</h2>' +
				"<p style='margin-top: 0px; margin-bottom: 0px; padding: 0px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; white-space: normal; background-color: rgb(255, 255, 255);'>" +
				"<span class='bjh-p'></span><br/>" +
				'</p>' +
				"<p style='margin-top: 0px; margin-bottom: 0px; padding: 0px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; white-space: normal; background-color: rgb(255, 255, 255);'>" +
				"<span class='bjh-p'>营销策划是对企业未来营销行为的超前决策，是企业开展营销活动的前提。通过市场营销策划，企业可以对营销环境做出具体分析，根据要达到的营销目标，制订具体的营销方案，从而有效地完成任务。</span>" +
				'</p>' +
				'<p>' +
				"<img class='normal' width='450px' src='https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2774076760,1128863997&fm=173&app=49&f=JPEG?w=450&h=338&s=1FE6C816C2C55AE20E6DF1E40300B023'/>" +
				'</p>' +
				"<p style='margin-top: 26px; margin-bottom: 0px; padding: 0px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; white-space: normal; background-color: rgb(255, 255, 255);'>" +
				"<span class='bjh-p'>推广和营销的工作是根据公司的营销目标制定策划方案，通过策划的方案来指导公司的实践行动。因此，策划方案的好坏是影响推广和营销结果的一个因素，营销策划方案应该包括以下内容。</span>" +
				'</p>' +
				'<p>' +
				'<br/>' +
				'</p>';
		}
	};
</script>

<style scoped>
	.body-bg {
		border: none;
		background-color: #F8F8F8;
		line-height: 20px;
		margin: 0;
		padding: 0;
		font-size: 14px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.activity-contnets {
		margin: 10px 10px;
		background-color: #ffffff;
		border-radius: 10px;
	}

	.activity-contnets>div {
		padding: 10px 10px;
	}

	.div-c>>>img {
		width: 100%;
	}
</style>
