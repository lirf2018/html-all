<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="radio-btn">
			<van-radio-group v-model="complainType" direction="horizontal" checked-color="#008000">
				<div>
					<van-radio name="1">提出建议</van-radio>
				</div>
				<div>
					<van-radio name="0">反馈问题</van-radio>
				</div>
			</van-radio-group>
		</div>
		<div class="contents-div">
			<div class="contents"><textarea v-model="contents" style="" placeholder="请详细描述您的建议或遇到的问题"
					maxlength="150"></textarea></div>
			<van-divider>添加图片</van-divider>
			<div class="upload-img">
				<van-field name="uploader">
					<template #input>
						<van-uploader v-model="fileList" :after-read="afterRead" :before-delete="beforeDelete" />
					</template>
				</van-field>
			</div>
		</div>
		<div class="user-phone">
			<div>
				<span><input placeholder="手机号码或者邮箱" v-model="information" /></span>
			</div>
		</div>
		<div class="submit-btn">
			<div @click="submitData"><span>提交</span></div>
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
				title: '新增建议反馈',
				complainType: '1',
				contents: '',
				information: '',
				index: 0, // 用于记录图片顺序
				//uploading 表示上传中，failed 表示上传失败，done 表示上传完成
				fileList: [], //{"url":"","imgPath":"","status":"failed","message":""}
			};
		},
		methods: {
			submitData() {
				let vm = this;
				if (this.contents == '' || this.contents == null) {
					Toast('请详细描述您的建议或遇到的问题');
					return;
				}
				let params = {
					req_type: 'add_suggest',
					data: {
						imgs: this.fileList,
						userId: 0,
						information: this.information,
						contents: this.contents,
						complainType: this.complainType
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						Toast('提交成功');
						vm.toPage();
					} else {
						Toast(res.resp_desc);
					}
				});

			},
			toPage() {
				this.$router.push("mySuggest")
			},
			beforeDelete(file) {
				let vm = this;
				let tmp = [];
				for (var i = 0; i < vm.fileList.length; i++) {
					if (vm.fileList[i].url != file.url) {
						tmp.push(vm.fileList[i]);
					}
				}
				vm.fileList = tmp;
				this.index = vm.fileList.length;
			},
			afterRead(file) {
				let vm = this;
				file.status = 'uploading';
				file.message = '上传中...';

				//请求接口前需要传的参数
				let formData = new FormData();
				formData.append('imgType', "")
				formData.append('from', "")
				formData.append('file', file.file)
				axios.fileUpload('', formData).then(function(res) {
					if (null != res.data && res.data.status == 'done') {
						let data = res.data;
						let obj = {
							url: data.url,
							imgPath: data.imgPath,
							status: data.status,
							message: ""
						}
						vm.fileList[vm.index] = obj;
						file.status = res.data.status;
						vm.index = vm.fileList.length;
					} else {
						file.status = 'failed';
						file.message = '上传失败';
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

	.radio-btn {
		padding: 20px 10px;
		padding-bottom: 10px;
		text-align: center;
		background-color: #ffffff;
		overflow: hidden;
	}

	.radio-btn>div>div {
		float: left;
		width: 50%;
		text-align: center;
	}

	.radio-btn>div>div>div {
		padding-left: 2.5rem;
	}

	.contents-div {
		background-color: #f8f8f8;
		margin: 15px 10px;
		border-radius: 20px;
		overflow: hidden;
	}

	.contents>textarea {
		height: 110px;
		border: none;
		width: 93%;
		background-color: #f8f8f8;
		overflow: auto;
		word-break: break-all;
		border-radius: 20px;
		color: #464c5b;
		padding: 10px 10px;
	}

	>>>.van-field__control,
	>>>.van-cell {
		background-color: #f8f8f8 !important;
	}

	>>>.van-image,
	>>>.van-uploader__preview-image,
	>>>.van-uploader__upload {
		border: 1px solid #9ea7b4 !important;
	}

	.user-phone input {
		width: 90%;
		padding: 10px 0;
		border: none;
		color: #464c5b;
		background-color: #f8f8f8;
		border-radius: 20px;
		padding-left: 10px;
		margin: 0 10px;
	}

	.submit-btn {
		bottom: 0px;
		text-align: center;
		padding: 10px 0;
		bottom: 0px;
		position: fixed;
		width: 100%;
	}

	.submit-btn>div {
		width: 80%;
		padding: 10px 0;
		color: #ffffff;
		font-size: 14px;
		background-color: #008000;
		margin: 0 auto;
		border-radius: 25px;
		text-align: center;
	}
</style>
