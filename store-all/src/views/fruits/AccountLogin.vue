<template>
	<div class="body-bg">
		<div class="user-img">
			<div>
				<van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
			</div>
		</div>
		<div class="msg"><span>没有账号，请使用手机验证码登录</span></div>
		<div class="login-info">
			<van-cell-group>
				<van-field v-model="phone" label="账号:" required placeholder="请输入手机号" error-message="账号错误" />
				<van-field v-model="password" :type="inputType" label="密码:" placeholder="请输入密码" error-message="密码错误">
					<template #button>
						<van-icon @click="showPasswd" :name="eye" />
					</template>
				</van-field>
			</van-cell-group>
		</div>
		<div class="forget-passwd">
			<div @click="resetPasswd"><span>忘记密码</span></div>
			<div @click="phoneLogin"><span>手机验证码登录</span></div>
		</div>
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div @click="loginSuccess"><span>登录</span></div>
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
				password: '79865',
				inputType: 'password',
				eye: 'closed-eye'
			};
		},
		methods: {
			showPasswd() {
				this.inputType = this.inputType == 'password' ? 'text' : 'password';
				this.eye = this.eye == 'closed-eye' ? 'eye-o' : 'closed-eye';
			},
			loginSuccess() {
				let url = "center";
				this.$router.push(url);
			},
			phoneLogin() {
				let url = "phoneLogin";
				this.$router.push(url);
			},
			resetPasswd() {
				// 重置密码
				let url = "resetPasswd";
				this.$router.push(url);
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

	.user-img {
		text-align: center;
		padding: 30px 0;
		background: #008000;
		margin-bottom: 10px;
	}

	.msg {
		font-size: 12px;
		color: #9ea7b4;
		margin-bottom: 30px;
		padding: 0 10px;
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

	.forget-passwd {
		padding: 18px 0;
		color: #9ea7b4;
		overflow: auto;
		font-size: 12px;
	}

	.forget-passwd>div {
		float: right;
		padding: 0 15px;
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
