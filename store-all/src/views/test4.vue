<template>
	<van-row>
		<van-col span="5">
			<van-sidebar v-model="activeKey" @change="onChange">
				<van-sidebar-item @click="change(index)" :title="item.name" v-for="(item, index) in goods" :key="index" />
			</van-sidebar>
		</van-col>
		<van-col span="19" class="ratings-main-col">
			<div class="ratings-main" ref="ratingsmain" v-show="goods">
				<div>
					<ul v-for="(item, index) in goods" :key="index" ref="vansticky">
						<div ref="rItem">
							<p class="ratings-p" ref="pItem">{{ item.name }}</p>
							<li v-for="(items, index) in item.foods" :key="index">
								<van-row class="ratings-row">
									<van-col span="8" class="ratings-col"><img :src="items.image" class="ratings-img" /></van-col>
									<van-col span="14" class="ratings-col">
										<div class="ratings-name">
											<p>{{ items.name }}</p>
										</div>
										<div class="ratings-description">
											<p>{{ items.description }}</p>
										</div>
										<div class="ratings-sellCount">
											<span>月售{{ items.sellCount }}份</span>
											<span class="ratings-sellCount-p">好评率{{ items.rating }}%</span>
										</div>
										<div class="ratings-price">
											<span class="ratings-newprice">￥{{ items.price }}</span>
											<span v-if="items.oldPrice" class="ratings-oldprice">￥{{ items.oldPrice }}</span>
										</div>
									</van-col>
									<van-col span="2" class="ratings-col"></van-col>
								</van-row>
							</li>
						</div>
					</ul>
				</div>
			</div>
		</van-col>
	</van-row>
</template>

<script>
import BScroll from 'better-scroll';
export default {
	data() {
		return {
			activeKey: 0,
			goods: [],
			heightList: [],
			testId:0
		};
	},
	created() {
		for (let i = 1; i < 15; i++) {
			var foods = [];
			for (let j = 0; j < 5; j++) {
				this.testId = this.testId + 1;
				var gObj = {
					oldPrice: '33.33',
					rating: 20,
					image:'https://img.yzcdn.cn/vant/apple-1.jpg',
					name:'',
					description:'',
					sellCount:12
				};
				foods.push(gObj);
			}
			var mObj = {
				menuId: i,
				name: i + '菜单名',
				foods: foods
			};
			this.goods.push(mObj);
		}
		
		
		this._Bscroll();
	},
	methods: {
		_GetGoods() {
		},
		getHeight() {
			// 获取每一个li的高度
			const lis = this.$refs.rItem;
			// 获取p标签的高度  这里想错，应该把上面的标题也列入进去
			/* const heightp = this.$refs.vansticky
      heightp.forEach(item => {
        //console.log(item.clientHeight)
      }) */
			// console.log(heightp.offsetHeight)
			// heightList的第一个元素为0
			let height = 0;
			this.heightList.push(height);
			// 之后的高度即为当前li的高度加上之前面li的高度和
			lis.forEach(item => {
				height += item.clientHeight;
				this.heightList.push(height);
				// console.log(this.heightList)
			});
		},
		currentIndex() {
			for (let i = -1; i < this.heightList.length; i++) {
				const height1 = this.heightList[i];
				const height2 = this.heightList[i + 1];
				if (this.scrollY < height2 && this.scrollY >= height1) {
					return i;
				}
				// 通过打印的控制台信息，，然后进行调试，我也不知道为啥第一个默认不出来，难搞
				this.activeKey = i + 1;
				// console.log(i)
			}
		},
		onChange(index) {
			this.activeKey = index;
			// console.log(index)
		},
		_Bscroll() {
			console.log("------63333-")
			this.$nextTick(() => {
				if (this.goods) {
					this.scroll = new BScroll(this.$refs.ratingsmain, {
						click: true,
						probeType: 3
					});
				}
				this.scroll.on('scroll', res => {
					// console.log(res)
					this.scrollY = Math.abs(res.y);
					// console.log(res.y)
					this.scrolly = res.y;
					this.getHeight();
					this.currentIndex();
				});
			});
		},
		change(index) {
			this.activeKey = index;
			this.scroll.scrollToElement(this.$refs.vansticky[index], 100, 0, 0);
		}
	}
};
</script>

<style lang="stylus" scoped>
	body{
		overflow hidden
	}
.van-sidebar-item--select
	color red
.ratings-main-col
	padding-left 10px
	.ratings-main
		height 635px
		overflow hidden
.ratings-p
	height 25px
	line-height 25px
	margin-left -10px
	padding-left 14px
	font-size 12px
	color rgb(147, 153, 159)
	background #F3F5F7
.ratings-row
	border-bottom 1px solid rgba(7, 17, 27, 0.1)
	.ratings-col
		margin-top 19px
		.ratings-img
			width 60px
			height 60px
			margin-left 19px
		.ratings-name
			margin-top 2px
			font-size 14px
			color rgb(7, 17, 27)
			line-height 14px
		.ratings-description, .ratings-sellCount
			font-size 10px
			color rgb(147, 153, 159)
			margin-top 8px
			.ratings-sellCount-p
				margin-left 12px
		.ratings-price
			margin-bottom 19px
			margin-top 8px
			.ratings-newprice
				font-size 12px
				color red
				font-weight 700
			.ratings-oldprice
				font-size 10px
				color rgb(147, 153, 159)
				font-weight normal
				line-height 10px
				text-decoration line-through
				margin-left 8px
</style>
