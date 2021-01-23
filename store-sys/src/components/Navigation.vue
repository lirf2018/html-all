<template>
	<div class="nav-menu">
		<div :class="styleNav" v-on:mouseover="mouseOver()"><Icon type="ios-home" /></div>
		<div>
			<Drawer title="导航" placement="left" :closable="false" v-model="openFlag" v-on:mouseout="mouseOver()">
				<p :key="item.id" :class="item.style" v-for="(item, index) in menuList" v-on:mouseover="mouseOverS(item.id)" @click="toPage(item.url)">
					<span>{{ item.name }}</span>
				</p>
			</Drawer>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			openFlag: false,
			styleNav: 'nav-menu-home-defualt',
			menuList: []
		};
	},
	mounted() {
		this.menuList = [
			{ id: 0, style: 'nav-item-out', name: '主页', url: '/main' },
			{ id: 1, style: 'nav-item-out', name: '开单管理', url: '/index' },
			{ id: 2, style: 'nav-item-out', name: '商品出入库', url: '/store' },
			{ id: 3, style: 'nav-item-out', name: '商品管理', url: '/goods' },
			{ id: 4, style: 'nav-item-out', name: '订单管理', url: '/order' },
			// { id: 5, style: 'nav-item-out', name: '商品关联', url: 'goodsrel' },
			{ id: 6, style: 'nav-item-out', name: '分类管理', url: '/classify' },
			// { id: 7, style: 'nav-item-out', name: '优惠配置', url: '/discounts' },
			// { id: 8, style: 'nav-item-out', name: '促销配置' },
			{ id: 9, style: 'nav-item-out', name: '供应商管理', url: '/supplier' },
			// { id: 10, style: 'nav-item-out', name: '异常信息', url: '/exception' },
			{ id: 11, style: 'nav-item-out', name: '参数管理', url: '/param' },
			{ id: 12, style: 'nav-item-out', name: '商品报表', url: '/goodsreport' },
			{ id: 13, style: 'nav-item-out', name: '订单报表', url: '/orderreport' }
		];
	},
	methods: {
		mouseOver() {
			this.openFlag = true;
		},
		mouseOverS(id) {
			this.menuList.forEach(item => {
				if (item.id == id) {
					item.style = 'nav-item-in';
				} else {
					item.style = 'nav-item-out';
				}
			});
		},
		toPage(url) {
			let path = this.$route.path;
			if (path.indexOf('index') >= 0 && url.indexOf('index') >= 0) {
				return;
			}
			if(url == path){
				return;
			}

			this.$router.push(url);
			//打开新页签
			//const page = this.$router.resolve({ path: url });
			//window.open(page.href, '_blank');
		}
	}
};
</script>

<style scoped>
.nav-menu-home-defualt {
	font-size: 3.5rem;
	color: gray;
	position: fixed;
	top: 0px;
	left: 15px;
}
.nav-menu-home-in {
	font-size: 3.5rem;
	color: #2894ff;
}

.nav-item-in {
	border-bottom: 1px solid #2894ff;
	color: white;
	background-color: #2894ff;
	padding: 15px 0;
	font-size: 1.3rem;
	cursor: pointer;
}
.nav-item-out {
	border-bottom: 1px solid #e8eaec;
	color: gray;
	background-color: white;
	padding: 15px 0;
	font-size: 1.2rem;
	font-weight: normal;
	cursor: pointer;
}
/* 覆盖样式 */
.ivu-drawer-body {
	padding: 0 0;
}
.ivu-drawer-header {
	border-bottom: 1px solid #e8eaec;
	text-align: center;
}
.ivu-drawer-header p,
.ivu-drawer-header-inner {
	text-align: center !important;
	font-size: 2rem !important;
	font-weight: 500;
	height: 30px;
	line-height: 30px;
}
.ivu-drawer-wrap * {
	text-align: center;
}
>>> .ivu-drawer-header-inner {
	text-align: center;
	font-size: 1.5rem;
}
</style>
