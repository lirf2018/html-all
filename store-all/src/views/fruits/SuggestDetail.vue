<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="suggest">
			<div class="suggest-title"><span>反馈标题标题标题标题标题标题</span></div>
			<div class="suggest-contents">
				<span>反馈标题标题标题标题标题内容内容</span>
				<span><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></span>
			</div>
			<div class="suggest-time"><span>2020-11-11 12:01:01</span></div>
		</div>
		<div class="answer">
			<div class="answer-title"><span>回复</span></div>
			<div class="answer-contents">
				<span>回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容</span>
				<span><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></span>
			</div>
			<div class="answer-time"><span>2020-11-11 12:01:01</span></div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '建议反馈详情'
		};
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
.suggest,
.answer {
	color: #657180;
	padding: 10px 10px;
	margin: 0px 10px;
	background-color: #ffffff;
	border-radius: 10px;
}

.suggest-title {
	color: #464c5b;
	padding-bottom: 10px;
	margin-bottom: 10px;
	border-bottom: 1px solid #f0f0f0;
	font-weight: bold;
	font-size: 16px;
}
.suggest-contents > span,
.answer-contents > span {
	display: block;
}
.suggest-contents > span:first-child,
.answer-contents > span:first-child {
	margin-bottom: 10px;
}

.suggest-contents img,
.answer-contents img {
	display: block;
	width: 100%;
}

.suggest-time,
.answer-time {
	text-align: right;
	padding-top: 15px;
	font-size: 12px;
}

.answer {
	margin: 15px 10px;
}

.answer-title {
	padding-bottom: 10px;
	margin-bottom: 10px;
	border-bottom: 1px solid #f0f0f0;
	/* font-size: 1rem; */
	font-weight: bold;
	font-size: 16px;
}
</style>
