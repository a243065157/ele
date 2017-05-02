<template>
    <div class="line-box">
        <div class="line"></div>
        <div class="text">{{textname}}</div>
        <div class="line"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            textname: {
                type: String
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .line-box
      width 80%
      margin 30px auto
      display flex
      .line
        flex:1
        position relative
        top -6px
        border-bottom 1px solid rgba(255,255,255,.2)
      .text
        padding 0 12px
        font-size 14px
        font-weight 700
</style>
