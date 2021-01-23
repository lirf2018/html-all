<template>
	<div class="body-bg">
		<div class="header">
			<van-nav-bar :title="title" left-text="返回" left-arrow>
				<template #right>
					<van-icon name="wap-home-o" size="25" @click="toMain" />
				</template>
			</van-nav-bar>
		</div>
		<div style="height: 46px;"></div>
		<EgMark />
	</div>
</template>

<script>
import EgMark from '@/components/EgMark.vue';
export default {
	components: { EgMark: EgMark },
	props: ['title'],
	methods:{
		toMain(){
			this.$router.push("/main");
		}
	}
};
</script>

<style scoped>
.body-bg {
	border: none;
	line-height: 20px;
	margin: 0;
	background-color: #FFFFFF;
	padding: 0;
	font-size: 14px;
	color: #323233;
	font-family: Avenir, PingFang SC, Arial, Helvetica, STHeiti STXihei, Microsoft YaHei, Tohoma, sans-serif;
}
.header {
	position: fixed;
	height: 50px;
	width: 100%;
	z-index: 1000;
	top: 0;
}

.van-grid-item__icon {
	font-size: 3.5rem !important;
}

.van-nav-bar__title {
	color: #000000 !important;
	font-weight: bold !important;
}
.van-nav-bar__text {
	color: #008000 !important;
}
.header .van-icon,
.van-nav-bar__text {
	color: #9ea7b4 !important;
}
.van-nav-bar .van-icon {
	color: #008000 !important;
}

</style>
