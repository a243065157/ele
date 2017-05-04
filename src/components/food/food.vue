<template>
  <div>
    <transition name="slideLeft">
      <div v-show="showFlag" class="food" ref="food">
        <div class="food-container">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <div class="title">{{food.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="ratings">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span v-show="food.oldPrice" class="old">￥{{food.price}}</span>
            </div>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import Vue from 'vue';
import Bus from '../../common/js/bus.js';
import cartcontrol from '../cartcontrol/cartcontrol';
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      // 保证点击只生效一次
      if (!event._constructed) {
        return;
      }
      console.log(123123);
      Vue.set(this.food, 'count', 1);
      Bus.$emit('cart_add', event.target);
    }
  },
  components: {
    cartcontrol
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .food
    position fixed
    width 100%
    left 0
    top 0
    bottom 48px
    z-index 30
    background #fff
    transition all 0.3s linear
    &.slideLeft-enter-active, &.slideLeft-leave-active
      transform translate3d(100%,0,0)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display  block
          padding 10px
          font-size 20px
          color #fff
    .content
      padding 18px
      .title
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
        line-height 14px
        margin-bottom 8px
      .detail
        font-size 0
        color rgb(147,153,159)
        line-height 10px
        height 10px
        margin-bottom 8px
        .sell-count,.ratings
          font-size 10px
          color rgb(147,153,159)
        .sell-count
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
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10
      line-height 24px
      padding 0 12px
      box-sizing border-box
      font-size 10px
      background-color rgb(0,160,220)
      color #fff
      height 24px
      border-radius 12px
      transition all 0.1s
      &.fade-enter-active, &.fade-leave-active
        opacity 0

</style>
