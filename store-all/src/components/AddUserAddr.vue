<template>
	<div class="body-bg">
		<div></div>
		<div style="height: 45px;"></div>
		<div class="addrs-list">
			<div class="user-info">
				<div><van-field v-model="username" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" /></div>
				<div><van-field v-model="phone" placeholder="手机号码" :rules="[{ required: true, message: '请填写手机号码' }]" /></div>
				<div class="addr" @click="showAddrDiv">
					<div class="addr-left">
						<div v-if="province != ''">
							<div class="province"><span>{{province}}</span></div>
							<div class="city"><span>{{city}}</span></div>
							<div class="county"><span>{{county}}</span></div>
							<div class="town"><span>{{town}}</span></div>
						</div>
						<div v-if="province == ''">
							<div class="area"><span>所在地区</span></div>
						</div>
					</div>
					<div class="addr-right">
						<span><van-icon name="arrow" /></span>
					</div>
				</div>
				<div class="addr-detail">
					<van-field lock-scroll="false" v-model="addrDetail" rows="2" type="textarea" placeholder="详细地址:如道路、门牌号、小区、楼栋号、单元室等" />
				</div>
			</div>
			<div class="is-default">
				<div>
					<div><span>设为默认地址</span></div>
					<div><van-switch size="18" v-model="checked" active-color="#008000" inactive-color="#9ea7b4" /></div>
				</div>
			</div>
		</div>
		<div style="height: 45px;"></div>
		<div class="add-btn">
			<div><span>保存地址</span></div>
		</div>
		<div class="addrs"><AddrPanel :showp="show" @closeAddrDivS="closeAddrDiv" @setAddrDataS="setAddrData"></AddrPanel></div>
	</div>
</template>

<script>
import AddrPanel from '@/components/AddrPanel.vue';
export default {
	components: { AddrPanel: AddrPanel },
	data() {
		return {
			title: '添加收货地址',
			checked: false,
			username: '',
			phone: '',
			addrCodes: '',
			province: '',
			city: '',
			county: '',
			town: '',
			addrDetail: '',
			show: false
		};
	},
	methods: {
		showAddrDiv() {
			this.show = true;
		},
		closeAddrDiv() {
			this.show = false;
		},
		setAddrData(data) {
			this.addrCodes = data.addrCodes;
			this.province = data.province;
			this.city = data.city;
			this.county = data.county;
			this.town = data.town;
		}
	},
	mounted() {
		this.show = false;
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
/* addrs-list */
.addrs-list {
	padding: 10px 10px;
}

.user-info {
	margin-bottom: 10px;
}

.user-info > div {
	border-bottom: 1px solid #f0f0f0;
}

.addr {
	padding: 15px 10px;
	position: relative;
}
.addr-left > div > div {
	padding: 2px 0;
}
.area {
	color: #969799;
}
.addr-right {
	height: 15px;
	width: 15px;
	font-size: 18px;
	color: #c3cbd6;
	position: absolute;
	right: 0px;
	top: 35%;
}

/* add-btn */
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

/* is-default */

.is-default {
	position: relative;
	overflow: hidden;
	padding: 10px 10px;
}
.is-default > div > div:first-child {
	float: left;
}
.is-default > div > div:last-child {
	float: right;
}

.addrs {
	position: relative;
}

.van-action-sheet__header {
	position: fixed;
	width: 100%;
	top: 0px;
	border-bottom: 1px solid #f0f0f0;
}
</style>
