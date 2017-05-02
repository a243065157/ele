<template>
    <div>
        <div class="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
                    <div class="desc">需要配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" :class="payClass">{{payDesc}}</div>
                </div>
            </div>
            <!--<div class="ball-container">-->
            <!--<transition-group v-on:before-enter="dropBeforeEnter" v-on:enter="dropEnter">-->
            <!--<div v-for="(ball,index) in balls" v-show="ball.show" class="ball" :key="index">-->
            <!--<div class="inner inner-hook" :key="8"></div>-->
            <!--</div>-->
            <!--</transition-group>-->
            <!--</div>-->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food" v-for="food in selectFoods">
                                <div class="name">{{food.name}}</div>
                                <div class="price">{{food.price}}</div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol :food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
export default {
    props: {
        selectFoods: {
            type: Array,
            default() {
                return [
                    {
                        price: 11,
                        count: 1
                    }
                ];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            fold: true,
            balls: [
                { Show: false },
                { Show: false },
                { Show: false },
                { Show: false },
                { Show: false }
            ],
            dropBalls: []
        };
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((food) => {
                total += food.price * food.count;
            });
            return total;
        },
        totalCount() {
            let count = 0;
            this.selectFoods.forEach((food) => {
                count += food.count;
            });
            return count;
        },
        payDesc() {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}元起送`;
            } else {
                return '去结算';
            }
        },
        payClass() {
            if (this.totalPrice < this.minPrice) {
                return 'not-enough';
            } else {
                return 'enough';
            }
        },
        listShow() {
            // 判断是否有添加商品
            if (!this.totalCount) {
                this.fold = true;
                return false;
            }
            let show = !this.fold;
            if (show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                        console.log('123123');
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    components: {
        cartcontrol
    },
    methods: {
        drop(el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i];
                if (!ball.show) {
                    ball.show = true;
                    ball.el = el;
                    this.dropBalls.push(ball);
                    return;
                }
            }
        },
        dropBeforeEnter(el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    //                        获取元素相对于视口的位置
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = (window.innerHeight - rect.top - 22);
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        dropEnter(el) {
            //                获取offsetHeight目的是触发浏览器重绘，此变量不使用
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                //                    还原状态
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
            });
        },
        dropAfter(el) {
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        toggleList() {
            if (!this.totalCount) {
                return false;
            }
            this.fold = !this.fold;
        },
        empty() {
            this.selectFoods.forEach((food) => {
                food.count = 0;
            });
        },
        hideList() {
            this.fold = true;
        },
        pay() {
            // 总价小于配送价格
            if (this.totalPrice < this.minPrice) {
                return;
            }
            window.alert(`支付${this.totalPrice}元`);
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl";
    .list-mask
      position fixed
      top 0
      opacity 1
      left 0
      width 100%
      height 100%
      z-index: 40
      background rgba(7,17,27,0.6)
      backdrop-filter blur(10px)
      transition all 0.4s
      &.fade-enter-active, &.fade-leave-active
        opacity 1
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background rgba(7,17,27,0)
    .shopcart   
      position fixed
      left 0
      bottom 0
      z-index 500
      width 100%
      height 48px
      .content
        display flex
        font-size 0
        color rgba(255,255,255,.4)
        background-color #141d27
        .content-left
          flex 1
          .logo-wrapper
            display inline-block
            position relative
            top -10px
            margin 0 12px
            padding 6px
            width 56px
            height 56px
            box-sizing border-box
            vertical-align top
            border-radius 50%
            background-color #141d27
            .logo
              width 100%
              height 100%
              border-radius 50%
              background-color #2b343c
              text-align center
              &.highlight
                background-color rgb(0,160,220)
              .icon-shopping_cart
                font-size 24px
                color #80858a
                line-height 44px
                &.highlight
                  color #fff
            .num
              position absolute
              top 0
              right 0
              width 24px
              height 24px
              padding 0 6px
              font-size 6px
              line-height 24px
              color #fff
              text-align center
              font-weight 700
              background-color rgb(240,20,20)
              box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
              border-radius 20px
          .price
            display inline-block
            vertical-align top
            margin 12px 0
            font-size 16px
            font-weight 700
            line-height 24px
            margin-top 12px
            padding-right 12px
            box-sizing border-box
            border-right 1px solid rgba(255,255,255,.1)
            &.highlight
              color #fff
          .desc
            display inline-block
            margin 12px 0 0 12px
            font-size 10px
            line-height 24px
            font-weight 400
            vertical-align top
        .content-right
          flex 0 0 105px
          width 105px
          .pay
            font-size 12px
            height 48px
            line-height 48px
            background-color #2B333B
            text-align center
            font-weight 700
            &.not-enough
              background-color #2B333B
            &.enough
              background-color #048B41
              color #fff
      .ball-container
        .ball
          left 32px
          bottom 22px
          z-index 200
          transition all 4s
          .inner
            width 16px
            height 16px
            border-radius 50%
            background-color rgb(0,160,220)
            transition all 4s
      .shopcart-list
        position absolute
        width 100%
        bottom 48px
        max-height 257px
        left 0
        z-index -1
        transition all .5s
        &.fold-enter-active, &.fold-leave-active
          transform translate3d(0,-100%,0)
        &.fold-enter, &.fold-leave-active
          transform translate3d(0,0,0)
        .list-header
          width 100%
          background-color #f3f5f7
          height 40px
          padding 0 18px
          box-sizing border-box
          .title
            display inline-block
            font-size 14px
            color rgb(7,17,27)
            line-height 40px
            height 40px
          .empty
            position absolute
            display inline-block
            right 0
            font-size 12px
            color rgb(0,160,220)
            padding-right 18px
            line-height 40px
            height 40px
        .list-content
          padding 0 18px
          max-height 217px
          overflow hidden
          background #fff
          .food
            position relative
            padding 12px 0
            box-sizing border-box
            border-1px rgba(7,17,27,.1)
            .name
              line-height 24px
              font-size 14px
              color rgb(7,17,27)
            .price
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-size 14px
              font-weight 800
              padding 0 12px
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 6px
</style>
