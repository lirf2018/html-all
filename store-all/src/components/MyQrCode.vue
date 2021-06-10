<template>
	<div class="body-bg">
		<div class="code-div">
			<div class="qr-1">
				<barcode :value="memberCode" :options="barcodeOption" tag="svg"></barcode>
			</div>
			<div class="qr-2">
				<div class="qrcode" >
					<div id="drQrcode" ref="qrcode"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcodejs2';
	export default {
		props: ['memberCode'],
		watch: {
			memberCode: {
				handler: function(val, oldVal) {
					if (val != null && val != '') {
						this.$nextTick(function() {
							this.$nextTick(function() {
								this.$refs.qrcode.innerHTML = '';
								this.drQrcode(); //调用二维码生成的方法
							});
						});
					}
				},
				deep: true,
				immediate: true
			}
		},
		data() {
			return {
				barcodeOption: {
					displayValue: true, //是否默认显示条形码数据 //textPosition  :'top', //条形码数据显示的位置
					background: '#fff', //条形码背景颜色
					valid: function(valid) {},
					width: '2px', //单个条形码的宽度
					height: '55px',
					fontSize: '16px', //字体大小
					fontOptions: 'bold'
				}
			};
		},
		mounted: function() {

		},
		methods: {
			drQrcode() {
				let vm = this;
				// 和div的id相同 必须是id  class类名会报错
				// 第二参数是他的配置项
				let drQrcode = new QRCode('drQrcode', {
					width: 150,
					height: 150,
					text: vm.memberCode,
					colorDark: '#000000',
					correctLevel: QRCode.CorrectLevel.H
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

	.code-div {
		text-align: center;

	}

	.code-div>div {
		text-align: center;
		padding: 0px 10px;
	}
	
	.qr-1{
		margin-top: 15px;
	}
	
	.qr-2{
		margin: 20px 10px 35px 10px;
	}
	
	
	.qrcode {
		margin: 0 auto;
		padding-bottom: 8px;
		font-size: 12px;
		width: 150px;
		height: 150px;
	}
	
	.qrcode img {
		width: 150px;
		height: 150px;
		margin: 0 auto;
	}
	
	
</style>
