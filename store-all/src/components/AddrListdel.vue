<template>
	<div class="body-bg">
		<!-- <div style="height: 45px;"></div>
		<div class="addrs-list">
			<div v-for="(item, index) in list" :key="index">
				<div class="first-name"><span>李</span></div>
				<div class="user-info">
					<div>
						<span user-name>{{ item.name }}</span>
						<span class="phone">{{ item.tel }}</span>
						<span class="is-default" v-if="item.isDefault">默认</span>
					</div>
					<div>
						<span class="user-addr">{{ item.address }}</span>
					</div>
				</div>
				<div class="editer-text"><span>编辑</span></div>
			</div>
		</div>
		<div style="height: 45px;"></div>
		<div class="add-btn">
			<div><span>新增加地址</span></div>
		</div> -->
	</div>
</template>

<script>
export default {
	data() {
		return {
			title: '收货地址',
			chosenAddressId: '1',
			list: [
				{
					id: '1',
					name: '张三',
					tel: '13000000000',
					address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
					isDefault: true
				},
				{
					id: '2',
					name: '李四',
					tel: '1310000000',
					address: '浙江省杭州市拱墅区莫干山路 50 号'
				}
			]
		};
	},
	methods: {
		onAdd() {
			Toast('新增地址');
		},
		onEdit(item, index) {
			Toast('编辑地址:' + index);
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
.addrs-list > div {
	overflow: auto;
	padding: 15px 10px;
	position: relative;
}

.addrs-list > div:not(:last-child) {
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
	margin-right: 50px;
	position: relative;
}

.editer-text {
	width: 15%;
	text-align: center;
	position: absolute;
	top: 38%;
	right: 0px;
	width: 50px;
	line-height: 30px;
	height: 30px;
	border-left: 1px solid #f8f8f8f8;
}
.first-name > span {
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
}
.editer-text,
.phone,
.is-default {
	color: #9ea7b4;
	font-size: 12px;
}

.add-btn > div {
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
