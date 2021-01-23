<template>
	<div class="div-a">
		<div><Head :title="title" /></div>
		<div class="classfy-contents">
			<div class="left-menu" :style="myStyle">
				<van-sidebar v-model="activeKey" @change="onchange">
					<van-sidebar-item :style="{ color: item.menuId == onclickMenu ? '#008000' : '' }" :title="item.menuName" v-for="(item, index) in menuList" :key="index" />
				</van-sidebar>
			</div>
			<div class="right-contents" :style="myStyle">
				<div v-for="(item, index) in menuList" :key="index" class="goods-list">
					<div>
						<span>{{ item.menuId }}二级标一</span>
					</div>
					<div style="height: 100px;" v-for="g in item.goodsList" :key="g.goodsId">{{ g.goodsName }}{{ g.goodsId }}</div>
				</div>
				<div style="border: 1px solid black;" id="id"><div style="height: 30px;"></div></div>
			</div>
		</div>
	</div>
</template>

<script>
import Head from '@/components/Head.vue';
export default {
	components: { Head: Head },
	data() {
		return {
			title: '商品分类',
			activeKey: 0,
			onclickMenu: 0,
			heightList: [],
			menuList: [],
			myStyle: '',
			testId: 0
		};
	},
	created() {
		var h = document.documentElement.clientHeight || document.body.clientHeight;
		this.myStyle = 'height:' + (h - 50) + 'px';

		for (let i = 1; i < 11; i++) {
			var goodsList = [];
			for (let j = 0; j < 5; j++) {
				this.testId = this.testId + 1;
				var gObj = {
					goodsId: this.testId,
					goodsName: i + '商品名称'
				};
				goodsList.push(gObj);
			}
			var mObj = {
				menuId: i,
				menuName: i + '菜单名',
				goodsList: goodsList
			};
			this.menuList.push(mObj);
		}
	},
	mounted(){
		//增加滚动监听
		// window.addEventListener('scroll', this.handleScroll);
		document.addEventListener('scroll', this.handleScroll);
	},
	methods: {
		onchange(index) {
			this.onclickMenu = this.menuList[index].menuId;
		},
		handleScroll() {
			
			console.log("=========================")
			
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; //获取滚动的距离

			// var offsetTops = document.getElementsByClassName('goods-list');
			// offsetTops.forEach(function(e) {
			// 	console.log('---------------' + e.offsetTop);
			// });

			let listOffsetTop = [];

			var offsetTop = document.querySelector('#id').offsetTop; //通过Id获取距离
			console.log('---------44------' + offsetTop);

			/* 	//设置的距离
			var offsetTop = document.querySelector('#id').offsetTop; //通过Id获取距离
			//判断获取的id是否滚动顶
			if (scrollTop > offsetTop) {
				// true
			} else {
				//false
			} */
		},
		distroy() {
			// window.removeEventListener('scroll', this.handleScroll);
		}
	}
};
</script>

<style>
body {
	background-color: #f8f8f8;
	overflow: hidden;
}
.van-sidebar-item--select {
	border-color: #008000 !important;
}
.left-menu {
	float: left;
	width: 20%;
	overflow-y: auto;
	height: 100%;
}

.right-contents {
	float: left;
	width: 80%;
	height: 100%;
	background-color: #ffffff;
	overflow-y: auto;
}
.right-contents > div {
	padding: 10px 10px;
}
.goods-list {
	border: 1px solid red;
}
</style>
