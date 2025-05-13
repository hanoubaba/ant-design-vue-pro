<template>
    <view class="container header-bg">
        <image class="bg-image" src="/static/common/bj.png" mode="aspectFill"></image>
        <view class="header">
            <view class="big-title">
                <text class="text">小海星商城</text>
                <image class="icon" src="/static/common/starfish.png" mode="aspectFit"></image>
            </view>
            <view class="card">
                <view class="title">
                    <image class="icon" src="/static/common/starfish.png" mode="aspectFit"></image>
                    <text class="text1">小海星</text>
                    <text class="text2 color-red">商城</text>
                    <image class="corner" src="/static/common/card-corner.png" mode="aspectFit"></image>
                </view>
                <image class="card-bg" src="/static/common/starfish-logo.png" mode="aspectFit"></image>
                <view class="content">
                    <text class="value color-red">{{score || 0}}</text>
                    <text class="name">小海星数量</text>
                </view>
            </view>
        </view>
        <view class="menu-list">
            <image class="menu-icon" src="/static/index/menu-1.png" mode="aspectFit" @tap="toPage('starfishList/starfishList')"></image>
            <image class="menu-icon" src="/static/index/menu-2.png" mode="aspectFit" @tap="toPage('rankingList/rankingList')"></image>
            <image class="menu-icon" src="/static/index/menu-3.png" mode="aspectFit" @tap="toPage('transfer/transfer')"></image>
            <image class="menu-icon" src="/static/index/menu-4.png" mode="aspectFit" @tap="getStarfish"></image>
            <image class="menu-icon" src="/static/index/menu-5.png" mode="aspectFit" @tap="toPage('shoppingCart/shoppingCart')"></image>
        </view>
        <view class="page-container">
            <view class="search">
                <uni-icons class="icon" type="search" size="20"></uni-icons>
                <input class="search-input" type="text" placeholder="请输入商品名称" @input="input"/>
            </view>
            <scroll-view scroll-x="true" class="tabs" show-scrollbar="false">
                <view class="tab-box" :class="{active: params.category_id == null}" @tap="selectCategory(null)">
                    全部
                </view>
                <view class="tab-box" v-for="item in categoryList"
                    :key="item.id" :class="{active: params.category_id == item.id}" @tap="selectCategory(item.id)">
                    {{item.name}}
                </view>
            </scroll-view>
            <scroll-view scroll-y="true" class="scroll-view" @scrolltolower="nextPage">
                <view class="data-list">
                    <view class="item" v-for="item in data" :key="item.goods_id" @tap="toDetail(item)">
                        <view class="image-box">
                            <image class="item-image" :src="item.ImageFrist" mode="aspectFill"></image>
                        </view>
                        <view class="name">{{item.goods_name}}</view>
                        <view class="desc">
                            <text class="font-bold color-red">海星：{{item.goods_price}}</text>
                            <text class="exchange color-666">已兑换{{item.goods_sales}}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
    <uni-popup ref="describePopup" type="center">
        <view class="starfish-describe color-333">
            <view class="content">
                <rich-text :nodes="content"></rich-text>
            </view>
            <view class="button-box">
                <Btn name="我知道了" type="big" theme="theme" @tap="closeDescribe"></Btn>
            </view>
        </view>
    </uni-popup>
</template>

<script setup>
    const toDetail = (item) => {
        uni.navigateTo({
            url: '/pages/index/productDetail?id=' + item.goods_id
        })
    }
    const toPage = (page) => {
        uni.navigateTo({
            url: `/pages/${page}`
        })
    }
    const describePopup = ref();
    const content = ref();
    const getStarfish = () => {
        api.indexInit({
            success(res) {
                content.value = res.data.award_explain
                describePopup.value.open();
            }
        })
    }
    
    const closeDescribe = () => {
        describePopup.value.close();
    }
    const productName = ref();
    const input = (e) => {
        $$.debounce(() => {
            productName.value = e.detail.value;
            loadList();
        }, 'searchProduct')
    }
    const params = reactive({
        page: 1,
        limit: 10,
        category_id: null,
        name: productName
    });
    const selectCategory = (idx) => {
        params.category_id = idx;
        loadList();
    }
    const categoryList = ref([]);
    const productCategory = () => {
        api.productCategory({
            success(res) {
                categoryList.value = res.data;
            }
        }, false)
    }
    
    const hasNext = ref(true);
    const data = ref([]);
    const nextPage = () => {
        if(hasNext.value) {
            params.page = params.page + 1;
            productList();
        }
    }
    const productList = () => {
        api.productIndex({
            data: params,
            success(res) {
                if(res.data.length < params.limit) {
                    hasNext.value = false;
                }
                data.value.push(...res.data);
            }
        }, false)
    }
    
    const loadList = () => {        
        params.page = 1;
        params.name = productName.value;
        hasNext.value = true;
        data.value = [];
        productList();
    }
    const score = ref();
    const userScore = () => {
        api.userScore({
            success(res) {
                score.value = res.data.score;
            }
        }, false);
    }
    const init = () => {
        productCategory();
        loadList();
        userScore();
    }
    
    onShow(init);
</script>

<style lang="scss" scoped>
    .container {
        padding: 15px 15px 0;
        min-height: calc(100vh - 50px);
    }
    .header-bg {
        .bg-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            aspect-ratio: 1.5 / 1;
        }
    }
    .header {
        padding: 15px 0;
        position: relative;
        .big-title {
            display: flex;
            align-items: center;
            padding: 50px 0 20px;
            column-gap: 5px;
            .text {
                font-size: 19px;
                font-weight: bold;
                color: #fff;
            }
            .icon {
                width: 40px;
                height: 40px;
            }
        }
        .card {
            background-color: #e9f3ff;
            border-radius: 13px;
            padding-bottom: 15px;
            .title {
                display: flex;
                align-items: center;
                height: 40px;
                margin-left: 15px;
                font-weight: bold;
                .icon {
                    width: 30px;
                    height: 30px;
                }
                .corner {
                    height: 40px;
                    width: auto;
                    margin-left: auto;
                    aspect-ratio: 3.585 / 1;
                }
            }
            .card-bg {
                width: 132px;
                height: 106px;
                position: absolute;
                top: 70px;
                right: 0;
            }
            .content {
                margin: 0 10px;
                background-color: #fff;
                padding: 10px 20px;
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                .value {
                    font-size: 26px;
                    font-weight: bold;
                }
                .name {
                    font-size: 10px;
                }
            }
        }
    }
    .menu-list {
        display: flex;
        column-gap: 10px;
        .menu-icon {
            aspect-ratio: 0.92 / 1;
            display: inline;
            height: auto;
        }
    }
    .search {
        background-color: #F2F2F2;
        border-radius: 20px;
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 15px 0;
        height: 40px;
        .icon {
            width: 25px;
        }
        .search-input {
            font-size: 13px;
            flex: 1;
            line-height: 20px;
        }
    }
    .tabs {
		line-height: 65rpx;
        display: flex;
        background-color: #F2F8FF;
		
		white-space: nowrap;
		flex-direction: row;
		// justify-content: center;
        border-radius: 10px;
        height: 40px;
        .tab-box {
            display: flex;
			display: inline-block;
            align-items: center;
            margin: 0 15px;
            font-size: 13px;
            border-bottom: 3.5px solid transparent;
            height: 100%;
            &.active {
                font-size: 15px;
                color: #2583F4;
                font-weight: bold;
                border-bottom-color: #2583F4;
            }
        }
    }
    .data-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 15px 0;
        column-gap: 10px;
        row-gap: 10px;
        .item {
            border-radius: 7.5px;
            background-color: #fff;
            overflow: hidden;
            .image-box {
                width: 100%;
                aspect-ratio: 1 / 1;
                .item-image {
                    width: 100%;
                    height: 100%;
                }
            }
            .name, .desc {
                margin: 10px;
            }
            .desc {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
        }
    }
    :deep(.uni-popup__wrapper) {
        width: calc(100% - 30px);
    }
    .starfish-describe {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px 15px 15px;
        .content {
            margin-bottom: 20px;
            overflow-y: auto;
            max-height: 70vh;
        }
        .button-box {
            padding: 15px;
        }
    }
    .page-container {
        height: calc(100vh - 60px);
        .scroll-view {
            height: calc(100% - 100px);
        }
    }
</style>
