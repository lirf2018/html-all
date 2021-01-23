<template>
	<div class="page">
		<div>
			<ul class="menu">
				<li @click="toPage(menu.url)" v-bind:key="index" v-for="(menu, index) in menuList" :class="menu.style" v-on:mouseover="mouseOver(menu.id)" v-on:mouseout="mouseOut(menu.id)">
					<span>{{ menu.name }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			menuList: []
		};
	},
	created() {
		this.menuList = [
			{ id: 1, style: 'items-out', name: '开单管理', url: '/index' },
			{ id: 2, style: 'items-out', name: '商品出入库', url: '/store' },
			{ id: 3, style: 'items-out', name: '商品管理', url: '/goods' },
			{ id: 4, style: 'items-out', name: '订单管理', url: '/order' },
			// { id: 5, style: 'items-out', name: '商品关联', url: 'goodsrel' },
			{ id: 6, style: 'items-out', name: '分类管理', url: '/classify' },
			// { id: 7, style: 'items-out', name: '优惠配置', url: '/discounts' },
			// { id: 8, style: 'items-out', name: '促销配置' },
			{ id: 9, style: 'items-out', name: '供应商管理', url: '/supplier' },
			// { id: 10, style: 'items-out', name: '异常信息', url: '/exception' },
			{ id: 11, style: 'items-out', name: '参数管理', url: '/param' },
			{ id: 12, style: 'items-out', name: '商品报表', url: '/goodsreport' },
			{ id: 13, style: 'items-out', name: '订单报表', url: '/orderreport' }
		];
	},
	methods: {
		mouseOver(id) {
			this.mouse(id, 'in');
		},
		mouseOut(id) {
			this.mouse(id, 'out');
		},
		mouse(id, type) {
			this.menuList.forEach(item => {
				let id_ = item.id;
				if ('in' == type) {
					if (id == id_) {
						item.style = 'items-in';
					} else {
						item.style = 'items-out';
					}
				} else {
					if (id == id_) {
						item.style = 'items-out';
					}
				}
			});
		},
		toPage(url) {
			this.$router.push(url);
			//打开新页签
			//const page  = this.$router.resolve({path: url})
			//window.open(page.href,'_blank')
		}
	}
};
</script>

<style scoped>
.page {
	/* background-color: #f0f0f0; */
}

.page > div {
	text-align: center;
	margin: 0 auto;
	margin-top: 2%;
	width: 700px;
	overflow: auto;
}
li {
	/* box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.5); */
	height: 200px;
	width: 200px;
	line-height: 200px;
	text-align: center;
	font-size: 2rem;
	font-weight: 900;
	margin: 20px 0;
	margin-left: 35px;
	float: left;
	margin-top: 20px;
	margin-left: 20px;
	list-style-type: none;
}
.items-out {
	border: 2px solid gray;
	color: #000000;
}

.items-in {
	border: 2px solid #2894ff;
	background-color: #2894ff;
	color: white;
	cursor: pointer;
}
</style>
