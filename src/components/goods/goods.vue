<template>
    <div>
        <div class="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                        <span class="text border-1px">
                                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list food-list-hook">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                                <div class="icon">
                                    <img :src="food.icon" width="57px" height="57px">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}</span>
                                        <span>好评{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span>
                                        <span v-show="food.oldPrice" class="old">￥{{food.price}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol :food="food"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopCart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
        </div>
        <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import shopCart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import Bus from '../../common/js/bus.js';
import food from '../food/food';
const ERR_OK = 0;
export default {
    props: {
        seller: Object
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        };
    },
    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },
    created() {
        let that = this;
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then((response) => {
            response = response.body;
            //                判断数据返回是否成功
            if (response.erron === ERR_OK) {
                this.goods = response.data;
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                });
            }
        });
        Bus.$on('cart_add', function (tName) {
            that._drop(tName);
        });
    },
    methods: {
        selectMenu(index, event) {
            if (!event._constructed) {
                //                    禁用浏览器触发
                return;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let el = foodList[index];
            this.foodScroll.scrollToElement(el, 300);
        },
        selectFood(food, event) {
            // 保证点击只生效一次
            if (!event._constructed) {
               return;
            }
            this.selectedFood = food;
            this.$refs.food.show();
        },
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true
            });
            this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
                probeType: 3,
                click: true
            });
            this.foodScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        _calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (var i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        _drop(target) {
            this.$refs.shopcart.drop(target);
        }
    },
    components: {
        shopCart,
        cartcontrol,
        food
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl";
    .goods
      position absolute
      top 174px
      bottom 46px
      display flex
      width 100%
      overflow hidden
      .menu-wrapper
        flex 0 0 80px
        width 80px
        background-color #f3f5f7
        .menu-item
          display table
          height 54px
          width 56px
          line-height 14px
          padding 0 12px
          &.current
            background-color #fff
            position relative
            margin-top -1px
            z-index 10
            .text
              border-none()
              font-weight 700
          .text
            display table-cell
            vertical-align middle
            font-size 12px
            border-1px(rgba(7,17,27,.1))
            .icon
              display inline-block
              width 12px
              height 12px
              margin-right 2px
              background-repeat no-repeat
              background-size 12px 12px
              vertical-align top
              &.decrease
                bg-img(decrease_3)
              &.discount
                bg-img(discount_3)
              &.guarantee
                bg-img(guarantee_3)
              &.invoice
                bg-img(invoice_3)
              &.special
                bg-img(special_3)
      .foods-wrapper
        flex 1
        .title
          padding-left 14px
          height 26px
          line-height 26px
          border-left 2px solid #d9dde1
          font-size 12px
          color rgb(147,153,159)
          background-color #f3f5f7
        .food-item
          display flex
          margin 18px
          padding-bottom 18px
          border-1px(rgba(7,17,21,.1))
          &:last-child
            border-none()
            margin-bottom 0
          .icon
            flex 0 0 57px
            margin-right 10px
          .content
            flex 1
            .name
              margin 2px 0 8px 0
              height 14px
              line-height 14px
              font-size 14px
              color rgb(7,17,27)
            .desc,.extra
              font-size 10px
              color rgb(147,153,159)
              line-height 12px
            .desc
              margin-bottom 8px
              font-size 10px
            .extra
              font-size 10px
              .count
                margin-right 12px
            .price
              font-weight 700
              font-size 0
              .now
                font-weight: 700
                margin-right 8px
                line-height 24px
                font-size 14px
                color rgb(240,24,24)
              .old
                font-weight: 700
                font-size 10px
                line-height 24px
                color rgb(147,153,159)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 12px
</style>
