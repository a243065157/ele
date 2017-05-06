<template>
  <div class="ratingselect">
    <div class="ratings-type border-1px">
      <span class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">47</span></span>
      <span class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">40</span></span>
      <span class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">7</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      tylpe: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    position relative
    .ratings-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        line-height 16px
        border-radius 1px
        color rgb(77,85,93)
        font-size 12px
        &.active
          color #fff
        .count
          font-size 8px
          margin-left 2px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background-color rgb(0,160,200)
        &.negative
          background-color rgba(77,89,93,0.2)
          &.acitve
            background-color rgb(77,89,93)
    .switch
      line-height 24px
      padding 12px 18px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        margin-left 4px
        font-size 24px
        vertical-align top
        display inline-block
      .text
        font-size 12px
        vertical-align top
        display inline-block
</style>
