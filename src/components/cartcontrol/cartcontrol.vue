<template>
    <div class="cartcontrol">
        <transition-group name="move">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)" :key="1">
                <div class="inner icon-remove_circle_outline" :key="2"></div>
            </div>
        </transition-group>
    
        <div class="count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
import Bus from '../../common/js/bus.js';
export default {
    props: {
        food: {
            type: Object
        }
    },
    created() {
        //            console.log(this.food);
    },
    methods: {
        addCart(event) {
            if (!event._constructed) {
                //                    禁用浏览器触发
                return;
            }
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            Bus.$emit('cart_add', event.target);
        },
        decreaseCart(event) {
            if (!event._constructed) {
                //                    禁用浏览器触发
                return;
            }
            if (this.food.count) {
                this.food.count--;
            }
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .cartcontrol
      font-size 0
      .cart-decrease
        display inline-block
        padding 6px
        transition all .4s linear
        &.fade-enter-active, &.fade-leave-active
          opacity 1
          transform translate3d(0,0,0)
        .inner
          display inline-block
          font-size 24px
          line-height 24px
          color rgb(0,160,220)
          transition all .4s linear
          transform rotate(0)
        &.move-enter, &.move-leave-active
          opacity 0
          transform translate3d(240px,0,0)
          .inner
            transform rotate(180deg)
      .count
        display inline-block
        vertical-align top
        font-size 10px
        padding-top 6px
        color rgb(147,153,159)
        line-height 24px
        width 24px
        text-align center
      .cart-add
        display inline-block
        padding 6px
        font-size 24px
        line-height 24px
        color rgb(0,160,220)
</style>
