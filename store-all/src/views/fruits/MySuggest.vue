<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="suggest-list" v-for="(item, index) in suggestList" :key="item.suggestId">
			<div @click="toPage('suggestDetail2?id='+item.suggestId)">
				<div class="suggest-title">
					<span>·</span>
					<span>{{ item.suggestTitle }}</span>
				</div>
				<div class="suggest-time">
					<span>{{ item.suggestTime }}</span>
				</div>
				<div class="to-detail">
					<span>
						<van-icon name="arrow" />
					</span>
				</div>
			</div>
		</div>
		<div>
			<div style="height: 50px;"></div>
			<div class="add-suggest" @click="toPage('addSuggest')">
				<span>+</span>
				<span>提交反馈</span>
			</div>
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
				title: '建议反馈列表',
				suggestList: []
			};
		},
		mounted: function() {
			this.onLoad();
		},
		methods: {
			onLoad() {
				let vm = this;
				let params = {
					req_type: 'suggest_list',
					data: {
						userId: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let listSuggest = res.data.listSuggest;
						for (var i = 0; i < listSuggest.length; i++) {
							var obj = {
								suggestId: listSuggest[i].id,
								suggestTitle: listSuggest[i].contents,
								suggestTime: listSuggest[i].createDate
							};
							vm.suggestList.push(obj);
						}
					} else {
						Toast(res.resp_desc);
					}
				});

			},
			toPage(path) {
				this.$router.push(path)
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

	.suggest-list>div {
		overflow: hidden;
		font-size: 14px;
		padding: 10px 10px;
		background-color: #ffffff;
	}

	.suggest-list>div {
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

	.suggest-title>span:first-child {
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

	.add-suggest>span:first-child {
		font-size: 14px;
		font-weight: bold;
	}
</style>
