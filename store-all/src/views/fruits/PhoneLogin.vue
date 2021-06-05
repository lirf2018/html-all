<template>
	<div class="body-bg">
		<div class="user-img">
			<div>
				<van-image round width="7rem" height="7rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
			</div>
		</div>
		<div class="login-info">
			<van-cell-group>
				<van-field v-model="tel" type="tel" label="手机号" placeholder="请输入手机号" :error-message="telMsg"
					maxlength='11' />
				<van-field v-model="smsCode" center clearable label="验证码" placeholder="请输入短信验证码" :error-message="smsMsg"
					maxlength='4'>
					<template #button>
						<van-button size="small" type="primary" @click="sendToMsg()" :disabled="smsDisabled">{{sms}}
						</van-button>
					</template>
				</van-field>
				<van-field v-model="memberNum" type="tel" label="推荐人" placeholder="请输入推荐人"/>
			</van-cell-group>
		</div>
		<!-- <div class="forget-passwd">
			<div @click="accountLogin"><span>账号密码登录</span></div>
		</div> -->
		<div style="clear: both;"></div>
		<div class="login-btn">
			<div @click="login"><span>登录/注册</span></div>
		</div>
		<EG />
	</div>
</template>

<script>
	import EG from '@/components/EgMark.vue';
	import axios from '@/network/request.js';
	import {
		mapMutations
	} from 'vuex';
	import {
		validTelphone
	} from '@/commons/common.js'
	import {
		Toast
	} from 'vant';
	export default {
		components: {
			EG: EG
		},
		data() {
			return {
				tel: '13418915218',
				telMsg: '', //手机号错误
				sms: '发送验证码',
				smsCode: '1111',
				smsMsg: '', //验证码错误
				smsDisabled: false,
				times: 10, // 倒计时时间
				memberNum: '',
				timer: null,

			};
		},
		mounted: function() {
			let {
				member
			} = this.$route.query;
			this.memberNum = member;
		},
		methods: {
			...mapMutations(['userLogin']),
			accountLogin() {
				let url = "accountLogin";
				this.$router.push(url);
			},
			login() {
				let vm = this;
				if (vm.tel == null || vm.tel == '') {
					Toast('手机号不能为空');
					return;
				}
				if (!validTelphone(vm.tel)) {
					Toast('非法手机号');
					return;
				}
				if (vm.smsCode == '' || vm.smsCode == null) {
					Toast('验证码不能为空');
					return;
				}
				let params = {
					req_type: 'phone_code_login',
					data: {
						phone: vm.tel,
						phone_code: vm.smsCode,
						member_code: vm.memberNum
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let passTime = res.data.passTime;
						let token = res.data.token;
						Toast('登陆成功');
						vm.userLogin({
							Authorization: token,
							phone: vm.tel
						});
						vm.$router.push("main");
					} else {
						Toast(res.resp_desc);
					}
				});
			},
			sendToMsg() {
				let vm = this;
				let w = "重新获取";
				if (vm.tel == null || vm.tel == '') {
					Toast('手机号不能为空');
					return;
				}
				if (!validTelphone(vm.tel)) {
					Toast('非法手机号');
					return;
				}
				vm.sendCode();
				vm.sms = w + "(" + vm.times + "秒)";
				vm.smsDisabled = true;
				this.timer = setInterval(() => {
					this.times--;
					vm.sms = w + "(" + vm.times + "秒)";
					if (vm.times <= 0) {
						vm.sms = "发送验证码";
						vm.smsDisabled = false;
						vm.times = 10;
						clearInterval(this.timer);
					}
				}, 1000)
			},
			sendCode() {
				let vm = this;
				let params = {
					req_type: 'send_phone_code',
					data: {
						valid_type: 6,
						valid_param: vm.tel,
						valid_desc: '登录或者注册'
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						vm.list = res.data.user_addr_list;
					} else {
						Toast(res.resp_desc);
					}
				});
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
	}

	.forget-passwd {
		padding: 18px 0;
		font-size: 12px;
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
		font-size: 14px;
	}

	.login-btn>div {
		width: 90%;
		margin: 10px auto;
		padding: 8px 0;
		border-radius: 50px;
		color: #ffffff;
		background: #008000;
	}
	
	>>> .van-field__label{
		width: 4rem;
	}
</style>
