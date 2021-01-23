<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="items-list">
			<div><van-cell title="绑定手机" is-link value="134189152165" /></div>
			<div><van-cell title="绑定微信" is-link value="已绑定" /></div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '绑定列表'
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
.items-list>div:not(:last-child){
	border-bottom: 1px solid #f0f0f0;
}
</style>
