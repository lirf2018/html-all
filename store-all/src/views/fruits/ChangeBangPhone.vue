<template>
	<div class="body-bg">
		<div class="user-img">
			<div>
				<van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
			</div>
		</div>
		<div class="login-info">
			<van-cell-group>
				<van-field v-model="tel" type="tel" label="原手机号:" placeholder="请输入手机号" error-message="原手机号错误" />
				<van-field v-model="sms" center clearable label="验证码:" placeholder="请输入原手机短信验证码"
					error-message="原手机短信验证码错误">
					<template #button>
						<van-button size="small" type="primary">发送验证码</van-button>
					</template>
				</van-field>
			</van-cell-group>
			<van-cell-group>
				<van-field v-model="tel" type="tel" label="新手机号:" placeholder="请输入新手机号" error-message="新手机号错误" />
				<van-field v-model="sms" center clearable label="验证码:" placeholder="请输入新手机短信验证码"
					error-message="新手机短信验证码错误">
					<template #button>
						<van-button size="small" type="primary">发送验证码</van-button>
					</template>
				</van-field>
			</van-cell-group>
		</div>
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div><span>更换绑定</span></div>
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
				sms: ''
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

	.forget-passwd {
		padding: 18px 0;
		font-size: 14px;
		color: #9ea7b4;
		overflow: auto;
	}

	.forget-passwd>div {
		float: right;
		padding: 0 15px;
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
