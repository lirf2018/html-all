<template>
	<div class="body-bg">
		<div><van-search background="#F2F2F2" shape="round" v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" /></div>
		<div class="item-btn">
			<div><span>热门搜索</span></div>
			<div class="items">
				<span>大口久</span>
				<span>苹果</span>
			</div>
		</div>
		<div style="clear: both; height: 20px;"></div>
		<div class="item-btn">
			<div><span>历史搜索</span></div>
			<div class="items">
				<span>大口久</span>
				<span>苹果</span>
				<span>大口久</span>
				<span>苹果465465</span>
				<span>大口久</span>
				<span>苹果798</span>
				<span>大口久4654564666666666</span>
				<span>苹果</span>
				<span>大口久</span>
				<span>苹果</span>
			</div>
		</div>
		<div style="clear: both; height: 20px;"></div>
		<div class="clear-history">
			<div>
				<span><van-icon name="delete" /></span>
				<span>清空历史搜索</span>
			</div>
		</div>
		<EG />
	</div>
</template>

<script>
import EG from '@/components/EgMark.vue';
export default {
	components: { EG: EG },
	data() {
		return {
			value: ''
		};
	},
	methods: {
		onSearch() {},
		onCancel() {
			//返回Mian页
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
.item-btn {
	padding: 10px 0 0 10px;
	font-size: 14px;
	
}

.item-btn > div:first-child {
}

.item-btn > div:last-child {
	padding-top: 5px;
	color: #657180;
}
.items {
	overflow: auto;
	margin-bottom: 10px;
	font-size: 14px;
}
.items > span {
	display: block;
	float: left;
	background-color: #f2f2f2;
	margin-right: 10px;
	margin-top: 10px;
	padding: 6px 15px;
	border-radius: 50px;
	font-size: 12px;
}

.clear-history {
	border: 1px solid red;
	padding: 10px 20px;
	text-align: center;
	width: 50%;
	border: 1px solid #c3cbd6;
	margin: 15px auto;
	border-radius: 50px;
	overflow: auto;
}
.van-search__action{
	color: #9ea7b4 ;
	font-weight: normal;
}
.van-icon-delete {
	font-size: 16px !important;
	padding-right: 5px;
}
.clear-history > div {
	overflow: auto;
	text-align: center;
	position: relative;
	font-size: 14px;
}
.clear-history > div > span:first-child {
	position: absolute;
	top: 1px;
}
.clear-history > div > span:last-child {
	padding-left: 20px;
}
.van-search,.van-search--show-action{
	background: #FFFFFF !important;
	border-bottom: 1px solid #f0f0f0;
}
</style>
