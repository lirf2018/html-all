<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="msg-div" v-for="(item, index) in msgList" :key="item.msgId">
				<div>
					<div class="msg-time">
						<span>{{ item.msgTime }}</span>
					</div>
					<div class="title">
						<span>{{ item.msgTitle }}</span>
					</div>
					<div class="msg-info">
						<div v-show="!item.isShow" class="default-msg" v-html="item.msgContens"></div>
						<div v-show="item.isShow" class="all-msg" v-html="item.msgContens"></div>
					</div>
					<div class="show-div" v-show="!item.isShow">
						<span @click="item.isShow = true">展开</span>
						<span @click="item.isShow = true"><van-icon name="arrow-down" /></span>
					</div>
					<div class="hide-div" v-show="item.isShow">
						<span @click="item.isShow = false">收起</span>
						<span @click="item.isShow = false"><van-icon name="arrow-up" /></span>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '系统消息',
			msgList: [],
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
						isShow: false,
						msgId: this.testId,
						msgTime: '2020-11-11 12:10:12',
						msgTitle: '【升级】5月消息队列MQ升级计划通知',
						msgContens:
							'尊敬的用户： <br>北京时间2020年5月7日 01:00 - 09:00 北京时间2020年5月11日 01:00 - 09:00 北京时间2020年5月14日 01:00 - 09:00 北京时间2020年5月18日 01:00 -09:00 北京时间2020年5月21日 01:00 - 09:00 北京时间2020年5月25日 01:00 - 09:00 北京时间2020年5月28日 01:00 - 09:00升级内容：所有地域的MQ服务（包含Tcp、Mqtt、Http接入方式）。升级影响：升级期间MQ控制台和集群中每个服务节点可能出现秒级闪断（闪断时间和集群规模正相关），客户端会自动重试机制，一般不会影响业务，但可能会有异常日志。'
					};
					this.msgList.push(obj);
				}

				// 加载状态结束
				this.loading = false;

				// 数据全部加载完成
				if (this.msgList.length >= 40) {
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
.msg-div {
	color: #464c5b;
	font-size: 14px;
	padding: 0 10px;
	margin: 0 10px;
	background-color: #ffffff;
	border-radius: 20px;
}

.msg-div > div {
	margin-top: 15px;
}

.title {
	font-size: 16px;
	font-weight: bold;
	color: #464c5b;
	padding: 10px 0;
}

.msg-time,
.show-div,
.hide-div {
	text-align: right;
	font-size: 12px;
}

.msg-time {
	padding: 10px 0;
	border-bottom: 1px solid #f0f0f0;
}

.show-div,
.hide-div {
	color: #008000;
	margin-top: 10px;
}

.default-msg,
.all-msg {
	line-height: 25px;
}

.default-msg {
	display: -webkit-box;
	/* -webkit-box-orient: vertical; */
	/*! autoprefixer: off */
	-webkit-box-orient: vertical;
	/* autoprefixer: on */
	-webkit-line-clamp: 2;
	overflow: hidden;
}
</style>
