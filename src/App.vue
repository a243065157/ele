<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <router-link to="/goods" class="tab-item">商品</router-link>
            <router-link to="/seller" class="tab-item">商家</router-link>
            <router-link to="/ratings" class="tab-item">评论</router-link>
        </div>
        <router-view :seller="seller"></router-view>
    </div>

</template>
<script type="text/ecmascript-6">
    import header from './components/header/header.vue';
    const ERR_OK = 0;
    export default{
        data() {
            return {
                seller: {}
            };
        },
        created() {
            this.$http.get('/api/seller').then((response) => {
                response = response.body;
//                判断数据返回是否成功
                if (response.erron === ERR_OK) {
                    this.seller = response.data;
                }
            });
        },
        components: {
            'v-header': header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "./common/stylus/mixin.styl";
    .tab
        display flex
        width 100%
        height 40px
        line-height 40px
        border-1px(rgba(7, 17, 21, .1));
        .tab-item
          flex 1
          text-align center
          & > a
            display block
          &.active
            color rgba(240, 20, 20, 1)
</style>

