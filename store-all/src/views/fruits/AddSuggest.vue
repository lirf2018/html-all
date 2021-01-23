<template>
	<div class="body-bg">
		<div><Head :title="title" /></div>
		<div class="radio-btn">
			<van-radio-group v-model="radio" direction="horizontal" checked-color="#008000">
				<div><van-radio name="1">提出建议</van-radio></div>
				<div><van-radio name="2">反馈问题</van-radio></div>
			</van-radio-group>
		</div>
		<div class="contents-div">
			<div class="contents"><textarea style="" placeholder="请详细描述您的建议或遇到的问题"></textarea></div>
			<van-divider>添加图片</van-divider>
			<div class="upload-img">
				<van-field name="uploader">
					<template #input>
						<van-uploader v-model="uploader" />
					</template>
				</van-field>
			</div>
		</div>
		<div class="user-phone">
			<div>
				<span><input placeholder="手机号码或者邮箱" /></span>
			</div>
		</div>
		<div style="height: 100px;"></div>
		<div class="submit-btn">
			<div><span>提交</span></div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '新增建议反馈',
			radio: '1',
			uploader: [{ url: 'https://img.yzcdn.cn/vant/leaf.jpg' }]
		};
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
.radio-btn > div > div {
	float: left;
	width: 50%;
	text-align: center;
}
.radio-btn > div > div > div {
	padding-left: 2.5rem;
}
.contents-div {
	background-color: #f8f8f8;
	margin: 15px 10px;
	border-radius: 20px;
	overflow: hidden;
}

.contents > textarea {
	height: 150px;
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
	padding: 18px 0;
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

.submit-btn > div {
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
