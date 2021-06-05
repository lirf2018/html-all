<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="addrs-list">
			<div v-for="(item, index) in list" :key="index">
				<div class="first-name">
					<span>{{ item.first_name }}</span>
				</div>
				<div class="user-info">
					<div>
						<span user-name>{{ item.user_name }}</span>
						<span class="phone">{{ item.user_phone }}</span>
						<span class="is-default" v-if="item.is_default == 1">默认</span>
					</div>
					<div>
						<span class="user-addr">{{ item.addr_name}}</span>
					</div>
				</div>
				<div class="editer-text">
					<span @click="delAddr(item.id)">删除</span>
					&nbsp;
					<span @click="toPageDetail(item.id)">编辑</span>
					&nbsp;
				</div>
			</div>
		</div>
		<div style="height: 70px;"></div>
		<div class="add-btn" @click="toPage('addUserAddr')">
			<div><span>新增加地址</span></div>
		</div>
	</div>
</template>

<script>
	import Head from '@/components/Head.vue';
	import axios from '@/network/request.js';
	import {
		Dialog,
		Toast
	} from 'vant';
	export default {
		components: {
			Head: Head
		},
		data() {
			return {
				title: '收货地址',
				chosenAddressId: '1',
				list: []
			};
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findAddrList();
			});
		},
		methods: {
			findAddrList() {
				let vm = this;
				let params = {
					req_type: 'query_user_addr',
					data: {
						user_id: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.list = res.data.user_addr_list;
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			delAddr(id) {
				let vm = this;
				Dialog.confirm({
						title: '提示',
						message: '确认删除？'
					})
					.then(() => {
						let params = {
							req_type: 'delete_user_addr',
							data: {
								user_id: 0,
								id: id
							}
						}; // 参数
						axios.post('', params).then(function(res) {
							if (res.resp_code == 1) {
								Toast('操作成功');
								vm.$nextTick(function() {
									vm.findAddrList();
								});
							} else {
								Toast(res.resp_desc);
							}
						});
					})
					.catch(() => {
						// on cancel
					});
			},
			onAdd() {
				Toast('新增地址');
			},
			onEdit(item, index) {
				Toast('编辑地址:' + index);
			},
			toPage(path) {
				this.$router.push(path);
			},
			toPageDetail(id) {
				this.$router.push('addUserAddr?id=' + id);
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
		font-size: 12px;
		color: #323233;
		font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
	}

	.van-button--danger {
		background-color: #008000 !important;
		border: 1px solid #008000 !important;
	}

	.van-tag--danger {
		background-color: #008000;
	}

	.van-radio__icon--checked {
		background-color: #008000 !important;
		border: 1px solid #008000 !important;
	}

	/* addrs-list */
	.addrs-list>div {
		overflow: auto;
		padding: 15px 10px;
		position: relative;
	}

	.addrs-list>div:not(:last-child) {
		border-bottom: 1px solid #f0f0f0;
	}

	.first-name {
		text-align: center;
		position: absolute;
		top: 38%;
		width: 30px;
		height: 30px;
	}

	.user-info {
		margin-left: 40px;
		margin-right: 68px;
		position: relative;
		line-height: 15px;
	}

	.editer-text {
		/* width: 20%; */
		text-align: center;
		position: absolute;
		top: 38%;
		right: 8px;
		/* width: 50px; */
		/* line-height: 30px; */
		height: 30px;
		border-left: 1px solid #f8f8f8f8;
	}

	.first-name>span {
		border-radius: 50px;
		padding: 8px 8px;
		color: #ffffff;
		font-size: 14px;
		background-color: #9ea7b4;
	}

	.user-name {
		font-size: 16px;
	}

	.phone {
		font-size: 12px;
		margin-left: 15px;
	}

	.is-default {
		position: absolute;
		right: 0px;
	}

	.user-addr {
		font-size: 12px;
		line-height: 10px;
	}

	.editer-text,
	.phone,
	.is-default {
		color: #9ea7b4;
		font-size: 12px;
	}

	.add-btn>div {
		color: #ffffff;
		text-align: center;
		position: fixed;
		bottom: 0px;
		margin: 0 auto;
		width: 100%;
		background-color: #ffffff;
		height: 45px;
		overflow: hidden;
	}

	.add-btn span {
		background-color: #008000;
		border-radius: 50px;
		padding: 13px 30%;
		line-height: 45px;
	}
</style>
