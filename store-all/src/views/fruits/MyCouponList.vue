<template>
	<div>
		<div><Head :title="title" /></div>
		<div class="tab">
			<div>
				<van-tabs v-model="active" animated color="#008000" title-active-color="#008000" title-inactive-color="#657180" @change="onChange">
					<van-tab :title="item.tabName" v-for="(item, index) in tabList" :key="item.tabId"></van-tab>
				</van-tabs>
			</div>
		</div>
		<div style="clear: both;height: 43px;width: 100%;"></div>
		<div class="coupon">
			<div class="coupon-list" v-for="(item, index) in couponList" :key="item.couponId">
				<div class="coupon-content">
					<div class="coupon-img"><img :src="item.couponImg" /></div>
					<div class="coupon-title">
						<span>{{ item.couponName }}</span>
						<span>{{ item.couponBegin }}-{{ item.couponEnd }}</span>
					</div>
				</div>
				<div class="coupon-use">
					<div><span :style="{ color: onClickStatus == 0 ? '#008000' : '#9ea7b4' }">立即使用</span></div>
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
			title: '我的优惠券',
			tabList: [],
			couponList: [],
			onClickStatus: 0,
			active: 0,
			testId: 0
		};
	},
	created() {
		this.tabList = [
			{
				tabId: 1,
				status: 0,
				tabName: '未使用'
			},
			{
				tabId: 2,
				status: 1,
				tabName: '已使用'
			},
			{
				tabId: 3,
				status: 2,
				tabName: '已失效'
			}
		];

		for (let i = 0; i < 10; i++) {
			this.testId = this.testId + 1;
			var obj = {
				couponId: this.testId,
				couponName: this.testId + '莎莎SUISSE 产品满700立减250优惠券',
				couponImg: 'https://img.yzcdn.cn/vant/apple-2.jpg',
				couponGet: 563253,
				couponBegin: '2020.01.01',
				couponEnd: '2020.02.02'
			};
			this.couponList.push(obj);
		}
	},
	methods: {
		onChange(index) {
			this.onClickStatus = this.tabList[index].status;
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

.tab > div {
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

.coupon > .coupon-list:not(:last-child) {
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
.coupon-title > span {
	display: block;
	color: #464c5b;
	font-weight: bold;
	padding: 5px 5px 0 5px;
	font-size: 14px;
}

.coupon-title > span:last-child {
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

.coupon-use > div {
	position: relative;
	overflow: hidden;
}

.coupon-use > div > span {
	font-size: 12px;
	text-align: center;
	color: #008000;
	line-height: 5rem;
}
</style>
