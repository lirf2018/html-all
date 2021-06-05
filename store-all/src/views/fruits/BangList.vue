<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="items-list">
			<div>
				<van-cell title="手机" :value="phone==''?'未绑定':phone" />
			</div>
			<div>
				<van-cell title="微信" is-link :value="weixin==''?'未绑定':'已绑定' " />
			</div>
			<div @click="toPage('bangMemberNum')">
				<van-cell title="会员号" is-link :value="memberNum==''?'未绑定':memberNum" />
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
				title: '绑定列表',
				phone: '',
				weixin: '',
				memberNum: ''
			};
		},
		mounted: function() {
			this.findUserBangList();
		},
		methods: {
			findUserBangList() {
				let vm = this;
				let params = {
					req_type: 'find_sns_bang_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						// 1、腾讯微博；2、新浪微博；3、人人网；4、微信；5、服务窗；6、一起沃；7、QQ;8、绑定会员号；9、绑定手机号
						let data = res.data.list;
						for (var i = 0; i < data.length; i++) {
							if (data[i].snsType == 9) {
								vm.phone = data[i].phone;
							} else if (data[i].snsType == 8) {
								vm.memberNum = data[i].memberNum;
							} else if (data[i].snsType == 4) {
								vm.weixin = "";
							}
						}
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			toPage(path) {
				this.$router.push(path);
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

	.items-list>div:not(:last-child) {
		border-bottom: 1px solid #f0f0f0;
	}
</style>
