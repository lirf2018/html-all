<template>
	<div>
		<div class="coupon-line">
			<div class="line"><span></span></div>
			<div class="round-left_"><span></span></div>
			<div class="round-right_"><span></span></div>
			<div class="round-left"><span></span></div>
			<div class="round-right"><span></span></div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style>
/*  分割线 */
.coupon-line {
	height: 1rem;
	overflow: hidden;
	position: relative;
	z-index: 99;
	margin: 15px 0;
}

.round-left_,
.round-right_ {
	background-color: #ffffff;
	height: 1rem;
	width: 1rem;
}

.round-left_ {
	position: absolute;
	left: 0rem;
}

.round-right_ {
	position: absolute;
	right: 0rem;
}

.round-left,
.round-right {
	background-color: #008000;
	height: 1rem;
	width: 1rem;
	border-radius: 50px;
}

.round-left {
	position: absolute;
	left: -0.5rem;
}

.round-right {
	position: absolute;
	right: -0.5rem;
}

.line {
	height: 0px;
	width: 100%;
	border: 1px dashed #e1e1e1;
	text-align: center;
	margin: 0 auto;
	position: absolute;
	top: 50%;
}
</style>
