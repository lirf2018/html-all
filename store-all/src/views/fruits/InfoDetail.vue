<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="activity-contnets">
			<div class="div-c" v-html="contents"></div>
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
				title: '资讯活动详情',
				contents: '',
				info: null
			};
		},
		created() {},
		mounted: function() {
			this.$nextTick(function() {
				this.findInfoDetail();
			});
		},
		methods: {
			findInfoDetail() {
				let vm = this;
				let {
					infoId
				} = this.$route.query;
				let params = {
					req_type: 'query_info_detail',
					data: {
						info_id: infoId,
						userId: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.info = res.data;
						vm.contents = vm.info.info_content;
					} else {
						Toast(res.resp_desc);
					}
				});
			}
		}
	};
</script>

<style  scoped >
	.body-bg {
		background-color: #F8F8F8;
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

	.div-c >>> img {
	    max-width: 100%;
	    height: auto;
	  }
</style>
