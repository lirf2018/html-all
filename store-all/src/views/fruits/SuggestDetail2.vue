<template>
	<div class="body-bg">
		<div>
			<Head :title="title" />
		</div>
		<div class="radio-btn">
			<van-radio-group v-model="complainType" direction="horizontal" checked-color="#008000" :disabled='true'>
				<div>
					<van-radio name="1">提出建议</van-radio>
				</div>
				<div>
					<van-radio name="0">反馈问题</van-radio>
				</div>
			</van-radio-group>
		</div>
		<div class="contents-div">
			<div class="contents"><textarea readonly="" v-model="contents" style=""
					placeholder="请详细描述您的建议或遇到的问题"></textarea></div>
			<van-divider>图片</van-divider>
			<div class="upload-img">
				<van-field name="uploader">
					<template #input>
						<van-uploader v-model="fileList" :deletable='false' :show-upload='false' />
					</template>
				</van-field>
			</div>
		</div>
		<div class="user-phone">
			<div>
				<span><input readonly="" placeholder="手机号码或者邮箱" v-model="information" /></span>
			</div>
		</div>
		<div style="height: 100px;"></div>
		<div class="submit-btn">
			<div @click="toPage()"><span>返回</span></div>
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
				title: '建议反馈详情',
				id: 0,
				complainType: '1',
				contents: '',
				information: '',
				index: 0, // 用于记录图片顺序
				//uploading 表示上传中，failed 表示上传失败，done 表示上传完成
				fileList: [], //{"url":"","imgPath":"","status":"failed","message":""}
			};
		},
		mounted: function() {
			let {
				id
			} = this.$route.query;
			this.id = id;
			this.onload();
		},
		methods: {
			onload() {
				let vm = this;
				let params = {
					req_type: 'suggest_list',
					data: {
						id: this.id,
						userId: 0
					}
				}; // 参数
				axios.post('', params).then(function(res) {
					if (res.resp_code == 1) {
						let listSuggest = res.data.listSuggest;
						if (listSuggest.length > 0) {
							console.log("  listSuggest[0].complain_type=" + listSuggest[0].complain_type)
							vm.complainType = listSuggest[0].complain_type + "";
							vm.contents = listSuggest[0].contents;
							vm.information = listSuggest[0].information;
							vm.createDate = listSuggest[0].createDate;
							let listImg = res.data.listImg;
							for (var i = 0; i < listImg.length; i++) {
								let obj = {
									"url": listImg[i].img_url2,
									"imgPath": "",
									"status": "done",
									"message": ""
								}
								vm.fileList.push(obj);
							}
						}
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
		background-color: white;
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
