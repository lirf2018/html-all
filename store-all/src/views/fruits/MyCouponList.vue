<template>
	<div>
		<div>
			<Head :title="title" />
		</div>
		<div class="tab">
			<div>
				<van-tabs v-model="active" animated color="#008000" title-active-color="#008000"
					title-inactive-color="#657180" @change="onChange">
					<van-tab :title="item.tabName" v-for="(item, index) in tabList" :key="item.tabId"></van-tab>
				</van-tabs>
			</div>
		</div>
		<div style="clear: both;height: 43px;width: 100%;"></div>
		<div class="coupon">
			<div class="coupon-list" v-for="(item, index) in qrList" :key="index">
				<div class="coupon-content">
					<div class="coupon-img"><img :src="item.coupon_img" /></div>
					<div class="coupon-title">
						<span>{{ item.coupon_name }}</span>
						<span v-if="item.appoint_type == 2">限当日使用：{{item.change_out_date}}</span>
						<span v-if="item.appoint_type != 2">有效期至：{{item.change_out_date}}</span>
					</div>
				</div>
				<div class="coupon-use" @click="toQRDetailPage(item.id)">
					<div v-if="onClickStatus == 1"><span style="color:#008000;">立即使用</span></div>
					<div v-if="onClickStatus == 2"><span style="color:#9ea7b4;">已使用</span></div>
					<div v-if="onClickStatus == 4"><span style="color:#9ea7b4;">已失效</span></div>
				</div>
			</div>
		</div>
		<div v-if="qrList.length == 0 && onClickStatus == 1" class="no-data">
			<span style="text-decoration: underline;" @click="toPage('couponList')">空空如也 &gt;&gt;</span>
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
				title: '我的优惠券',
				tabList: [],
				list: [],
				qrList: [],
				onClickStatus: 1,
				active: 0
			};
		},
		created() {
			this.tabList = [{
					tabId: 1,
					status: 1,
					tabName: '未使用'
				},
				{
					tabId: 2,
					status: 2,
					tabName: '已使用'
				},
				{
					tabId: 3,
					status: 4,
					tabName: '已失效'
				}
			];
		},
		mounted: function() {
			this.$nextTick(function() {
				this.findData();
			});
		},
		methods: {
			onChange(index) {
				this.onClickStatus = this.tabList[index].status;
				this.initData()
			},
			findData() {
				let vm = this;
				let params = {
					req_type: 'query_user_qr_list',
					data: {}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.list = res.data.list;
						vm.initData()
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			initData() {
				let vm = this;
				vm.qrList = [];
				for (var i = 0; i < vm.list.length; i++) {
					var status = vm.list[i].recode_state;
					if (status == vm.onClickStatus) {
						vm.qrList.push(vm.list[i]);
					}
				}
			},
			toPage(path) {
				this.$router.push(path);
			},
			toQRDetailPage(id) {
				this.$router.push("myCouponDetail?qrId=" + id);
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

	.tab {
		position: fixed;
		background-color: #f8f8f8;
		z-index: 99999999;
		width: 100%;
	}

	.tab>div {
		margin: 0px 5px;
	}

	.coupon {
		background-color: #ffffff;
		padding: 10px 10px;
		padding-bottom: 0px;
		overflow: hidden;
		color: #464c5b;
		padding-bottom: 25px;
	}

	.coupon>.coupon-list:not(:last-child) {
		margin-bottom: 20px;
	}

	.coupon-list {
		height: 5rem;
		border-radius: 8px;
		display: flex;
		position: relative;
	}

	.coupon-content {
		display: flex;
		overflow: hidden;
		position: relative;
		margin-right: 5rem;
		border: 1px solid #c3cbd6;
		border-radius: 5px 10px 10px 5px;
		border-right: 1px dashed #e1e1e1;
		width: 100%;
		height: 5rem;
	}

	.coupon-img,
	.coupon-use {
		height: 5rem;
		width: 5rem;
	}

	.coupon-img img {
		height: 5rem;
		width: 4.5rem;
		display: block;
		border: none;
	}

	.coupon-title>span {
		display: block;
		color: #464c5b;
		font-weight: bold;
		padding: 5px 5px 0 5px;
		font-size: 14px;
		line-height: 17px;
	}

	.coupon-title>span:last-child {
		position: absolute;
		bottom: 5px;
		font-size: 12px;
		color: #657180;
		font-weight: normal;
	}

	.coupon-use {
		border: 1px solid #c3cbd6;
		right: 0px;
		background-color: #f0f0f0;
		text-align: center;
		position: absolute;
		margin: 0 auto;
		height: 4.9rem;
		border-radius: 10px 8px 8px 10px;
		border-left: 1px dashed #e1e1e1;
	}

	.coupon-use>div {
		position: relative;
		overflow: hidden;
	}

	.coupon-use>div>span {
		font-size: 12px;
		text-align: center;
		color: #008000;
		line-height: 5rem;
	}
	
	.no-data{
		text-align: center;
	}
</style>
