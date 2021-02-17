<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="classify-items">
			<div class="items" v-for="(items, index) in levelList" :key="index" v-if="items.category_list.length > 0">
				<div class="level1">{{ items.level_name }}</div>
				<div class="level2">
					<span v-for="(item, index) in items.category_list" :key="item.category_id" @click="toPage(item.category_id)">{{ item.category_name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
import axios from '@/network/request.js';

export default {
	components: { Head: Head },
	data() {
		return {
			title: '商品分类',
			levelList: []
		};
	},
	mounted: function(e) {
		this.$nextTick(function() {
			this.findAllClassify();
		});
	},
	methods: {
		findAllClassify() {
			let vm = this;
			let params = {
				req_type: 'query_classify_all',
				data: {}
			}; // 参数
			axios.post('', params).then(function(res) {
				if (res.resp_code == 1) {
					vm.levelList = res.data.level_list;
				}
			});
		},
		toPage(id) {
			let url = 'classifyGoods2?catogeryId=' + id;
			this.$router.push(url);
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
.items {
	padding: 10px 10px;
	overflow: auto;
	font-size: 14px;
	background-color: #ffffff;
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
