<template>
	<div class="body-bg">
		<div class="user-img">
			<div>
				<van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
			</div>
		</div>
		<div class="login-info">
			<van-cell-group>
				<van-field v-model="password" type="password" label="旧密码:" error-message="旧密码有误" />
				<van-field v-model="password" type="password" label="新密码:" />
				<van-field v-model="password" type="password" label="重复密码:" error-message="两次密码不一致" />
			</van-cell-group>
		</div>
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div><span>修改密码</span></div>
		</div>
		<EG />
	</div>
</template>

<script>
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			EG: EG
		},
		data() {
			return {
				phone: '',
				tel: '',
				sms: '',
				password: '666'
			};
		},
		methods: {}
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

	.user-img {
		text-align: center;
		padding: 30px 0;
		background: #008000;
	}

	.login-info {
		padding: 0 15px;
	}

	.login-info .van-field__label {
		width: auto !important;
		padding-right: 15px !important;
	}

	.login-btn {
		text-align: center;
		padding: 20px 0;
	}

	.login-btn>div {
		width: 90%;
		margin: 10px auto;
		padding: 15px 0;
		border-radius: 50px;
		color: #ffffff;
		background: #008000;
	}
</style>
