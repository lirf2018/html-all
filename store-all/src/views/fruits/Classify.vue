<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="classify-items">
			<div class="items">
				<div class="level1">一级分类</div>
				<div class="level2">
					<span>热血虫潮</span>
					<span>热血</span>
					<span>水果套餐</span>
					<span>套餐</span>
				</div>
			</div>
			<div class="items">
				<div class="level1">一级分类</div>
				<div class="level2">
					<span>热血虫潮</span>
					<span>热血</span>
					<span>水果套餐</span>
					<span>套餐</span>
				</div>
			</div>
			<div class="items">
				<div class="level1">一级分类</div>
				<div class="level2">
					<span>热血虫潮</span>
					<span>热血</span>
					<span>水果套餐</span>
					<span>套餐</span>
				</div>
			</div>
			<div class="items">
				<div class="level1">一级分类</div>
				<div class="level2">
					<span>热血虫潮</span>
					<span>热血</span>
					<span>水果套餐</span>
					<span>套餐</span>
				</div>
			</div>
			<div class="items">
				<div class="level1">一级分类</div>
				<div class="level2">
					<span>热血虫潮</span>
					<span>热血</span>
					<span>水果套餐</span>
					<span>套餐</span>
				</div>
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
			title: '商品分类'
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
.items {
	padding: 10px 10px;
	overflow: auto;
	font-size: 14px;
	background-color: #FFFFFF;
}
.level1 {
	padding-bottom: 5px;
	border-bottom: 1px solid #c3cbd6;
	margin-bottom: 10px;
	padding-left: 10px;
}
.level2 {
	padding-left: 10px;
}
.level2 > span {
	display: block;
	background-color: #ffffff;
	padding: 5px 15px;
	float: left;
	margin-right: 8px;
	border-radius: 50px;
	color: #657180;
	margin-bottom: 8px;
	background-color: #f8f8f8;
	font-size: 12px;
}
</style>
