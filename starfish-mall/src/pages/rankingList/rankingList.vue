<template>
    <view class="container">
        <image class="bg-image" src="/static/ranking/ranking-bg.png" mode="scaleToFill"></image>
        <view class="ranking">
            <view class="item runner-up" v-if="runnerUp">
                <image class="head" :src="runnerUp.user_data?.avatar" mode="aspectFit"></image>
                <image class="icon" src="/static/ranking/runner-up.png" mode="aspectFit"></image>
            </view>
            <view class="item champion" v-if="champion">
                <image class="head" :src="champion.user_data?.avatar" mode="aspectFit"></image>
                <image class="icon" src="/static/ranking/champion.png" mode="aspectFit"></image>
            </view>
            <view class="item third-place" v-if="thirdPlace">
                <image class="head" :src="thirdPlace.user_data?.avatar" mode="aspectFit"></image>
                <image class="icon" src="/static/ranking/third-place.png" mode="aspectFit"></image>
            </view>
        </view>
        <view class="list">
            <view class="my-ranking">
                <image class="icon" :src="userInfo.avatar" mode="aspectFit"></image>
                <view class="info">
                    <text class="color-333">我的排名</text>
                    <view class="desc">
                        <text class="color-333">{{rank.rank_num == 0 ? '目前还未上榜': `第${rank.rank_num}名`}}，</text>
                        <text class="color-theme" @tap="getStarfish">点击查看获取罗特币途径</text>
                    </view>
                </view>
            </view>
            <view class="tabs">
                <view class="item" :class="{active: activeTab == 1}" @tap="selectTab(1)">总榜</view>
                <view class="item" :class="{active: activeTab == 2}" @tap="selectTab(0)">月榜单{{ selectDate ? `(${selectDate})`: ''}}</view>
            </view>
        </view>
        <scroll-view scroll-y="true" class="data-list" @scrolltolower="nextPage">
            <view class="rows color-333">
                <view class="header">
                    <view class="col">排名</view>
                    <view class="col">昵称</view>
                    <view class="col">罗特币数</view>
                </view>
                <view class="item" v-for="(item, index) in others" :key="item.id">
                    <view class="col">{{index + 4}}</view>
                    <view class="col">昵称-{{item.user_data.nickname}}</view>
                    <view class="col">{{item.total_score}}</view>
                </view>
            </view>
        </scroll-view>
    </view>
    <uni-popup ref="datePopup" type="bottom" background-color="transparent">
        <view class="date-box">
            <view class="bar font-bold">
                <view class="cancel color-theme" @tap="closeDate">取消</view>
                <view class="title">月份</view>
                <view class="confirm color-theme" @tap="confirmDate">确定</view>
            </view>
            <picker-view indicator-style="height: 50px;" :value="value" @change="bindDateChange" class="picker-view">
                <picker-view-column>
                    <view class="item" v-for="(item, index) in years" :key="index">{{item}}年</view>
                </picker-view-column>
                <picker-view-column>
                    <view class="item" v-for="(item, index) in months" :key="index">{{item}}月</view>
                </picker-view-column>
            </picker-view>
        </view>
    </uni-popup>
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
    import usePage from '@utils/page'
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
    
    const year = new Date().getFullYear();
    const years = ref([]);
    for(let y = year - 5; y <= year; y ++) years.value.push(y);
    const months = ref([]);
    for(let m = 1; m <= 12; m ++) months.value.push(m);
    const value = ref([0, 0])
    
    const datePopup = ref();
    const activeTab = ref(1)
    const selectTab = (t) => {
        if(t == 0) {
            datePopup.value.open();
        }
        else {
            activeTab.value = t;
            loadList();
        }
    }
    const selectDate = ref();
    const closeDate = () => {
        datePopup.value.close();
    }
    const confirmDate = () => {
        activeTab.value = 2;
        datePopup.value.close();
        selectDate.value = years.value[value.value[0]] + '-' + months.value[value.value[1]];
        params.month = selectDate.value;
        loadList();
    }
    const bindDateChange = (e) => {
        value.value = e.detail.value;
    }
    
    const userInfo = ref({});
    const rank = ref({});
    const champion = ref();
    const runnerUp = ref();
    const thirdPlace = ref();
    const others = ref([])
    const params = reactive({month: null})
    const {
        hasNext,
        data,
        nextPage,
        loadList
    } = usePage(api.indexRankList, params, (res) => {
        rank.value = res.data;
        return res.data.list;
    });
    
    watch(data, (nval) => {
        champion.value = null;
        runnerUp.value = null;
        thirdPlace.value = null;
        others.value = [];
        if(nval && nval.length > 0) {
            champion.value = nval[0];
            if(nval.length > 1) {
                runnerUp.value = nval[1]
            }
            if(nval.length > 2) {
                thirdPlace.value = nval[2]
            }
            if(nval.length > 3) {
                others.value = nval.slice(3);
            }
        }
    },{ deep: true })
    const init = () => {
        loadList();
        api.userInfo({
            success(res) {
                userInfo.value = res.data.user_data;
            }
        })
    }
    init()
</script>

<style lang="scss" scoped>
    .container {
        min-height: calc(100vh - 44px);
        background-color: #fff;
        .bg-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 400px;
        }
        .ranking {
            position: relative;
            height: 400px;
            .item {
                position: absolute;
                .head {
                    position: absolute;
                    border-radius: 50%;
                }
            }
            .champion {
                .icon {
                    width: 130px;
                    height: 130px;
                }
                .head {
                    width: 100px;
                    height: 100px;
                    bottom: 10px;
                    right: 10px;
                }
                bottom: 44%;
                left: 49%;
                transform: translateX(-50%);
            }
            .runner-up {                
                .icon {
                    width: 90px;
                    height: 90px;
                }
                .head {
                    width: 70px;
                    height: 70px;
                    bottom: 7px;
                    right: 7px;
                }
                bottom: 35%;
                left: 40px;
            }
            .third-place {
                .icon {
                    width: 90px;
                    height: 90px;
                }
                .head {
                    width: 70px;
                    height: 70px;
                    bottom: 7px;
                    right: 7px;
                }
                bottom: 32%;
                right: 50px;
            }
        }
        .list {
            position: relative;
            z-index: 1;
            background-color: #fff;
            padding: 15px 15px 0;
            border-radius: 10px 10px 0 0;
            margin-top: -10px;
            .my-ranking {
                border: 1px solid #2583F4;
                border-radius: 10px;
                padding: 15px;
                display: flex;
                background-color: #F5F9FF;
                .icon {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    row-gap: 10px;
                    justify-content: center;
                    padding-left: 10px;
                    .desc {
                        font-size: 12px;
                    }
                }
            }
            .tabs {
                margin: 15px 0 0;
                border-radius: 20px;
                height: 40px;
                border: 1px solid #2583F4;
                display: flex;
                align-items: center;
                overflow: hidden;
                .item {
                    flex: 1;
                    height: 40px;
                    font-size: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 20px;
                    &.active {
                        background-color: #2583F4;
                        color: #fff;
                    }
                }
            }
        }
        .rows {
            .header, .item {
                display: flex;
                justify-content: center;
                .col {
                    width: 33%;
                    text-align: center;
                }
            }
            .header {
                padding: 15px 0 10px;
            }
            .item {
                padding: 15px 0;
                border-bottom: 1px solid #ccc;
            }
        }        
        .data-list {
            height: 400px;
        }
    }
    .date-box {
        background-color: #fff;
        border-radius: 15px 15px 0 0;
        overflow: hidden;
        padding: 15px;
        margin: 0;
        .bar {
            display: flex;
            justify-content: space-between;
            .cancel, .confirm {
                padding: 0 15px;
            }
            .title {
                font-size: 15px;
            }
        }
        .picker-view {
            height: 250px;
            .item {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }    
    .starfish-describe {
        width: calc(100vw - 30px);
    }
    .starfish-describe {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px 15px 15px;
        .content {
            margin-bottom: 20px;
        }
        .button-box {
            padding: 15px;
        }
    }
</style>
