<template>
	<div>
		<div><Head :title="title" /></div>
		<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
			<div class="suggest-list" v-for="(item, index) in suggestList" :key="item.suggestId">
				<div>
					<div class="suggest-title">
						<span>·</span>
						<span>{{ item.suggestTitle }}</span>
					</div>
					<div class="suggest-time">
						<span>{{ item.suggestTime }}</span>
					</div>
					<div class="to-detail">
						<span><van-icon name="arrow" /></span>
					</div>
				</div>
			</div>
		</van-list>
		<div>
			<div style="height: 50px;"></div>
			<div class="add-suggest">
				<span>+</span>
				<span>提交反馈</span>
			</div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '建议反馈列表',
			suggestList: [],
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
				console.log('---------------------' + this.testId);
				for (let i = 0; i < 20; i++) {
					this.testId = this.testId + 1;
					var obj = {
						suggestId: this.testId,
						suggestTitle: this.testId + '标题',
						suggestTime: '2020-11-11'
					};
					this.suggestList.push(obj);
				}

				// 加载状态结束
				this.loading = false;

				// 数据全部加载完成
				if (this.suggestList.length >= 40) {
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
.suggest-list > div {
	overflow: hidden;
	font-size: 14px;
	padding: 10px 10px;
	background-color: #ffffff;
}
.suggest-list > div {
	border-top: 1px solid #f0f0f0;
}

.suggest-title {
	float: left;
	width: 70%;
	color: #464c5b;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.suggest-title > span:first-child {
	color: #008000;
	font-weight: bold;
}

.suggest-time {
	float: left;
	width: 28%;
	text-align: right;
	color: #657180;
}

.to-detail {
	float: right;
	width: 2%;
	font-size: 14px;
	color: #657180;
	margin-top: 2px;
}

.add-suggest {
	text-align: center;
	background-color: #ffffff;
	padding: 10px 0;
	position: fixed;
	bottom: 0px;
	width: 100%;
	color: #ffffff;
	background-color: #008000;
}

.add-suggest > span:first-child {
	font-size: 14px;
	font-weight: bold;
}
</style>
