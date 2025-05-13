<template>
    <view class="container">
        <view class="date-title color-999">已选择日期</view>
        <view class="date color-333">
            <view class="name font-bold">请选择</view>
            <view class="select-date font-bold">
                <uni-datetime-picker
                    type="date"
                    :border="false"
                    :clear-icon="true"
                    :show-icon="false"
                    @change="changeDate"
                    placeholder="选择日期"
                />
            </view>            
            <image class="date-icon" src="/static/common/date-icon.png" mode="aspectFit"></image>
        </view>
        <view class="data-box">
            <view class="tabs font-bold color-333">
                <view class="tab" :class="{active: params.type == 0}" @tap="selectTab(0)">
                    <view class="name">全部</view>
                    <view class="active-line"></view>
                </view>
                <view class="tab" :class="{active: params.type == 1}" @tap="selectTab(1)">
                    <view class="name">消耗</view>
                    <view class="active-line"></view>
                </view>
                <view class="tab" :class="{active: params.type == 2}" @tap="selectTab(2)">
                    <view class="name">获取</view>
                    <view class="active-line"></view>
                </view>
            </view>
            <view class="total font-bold">
                <view class="total-num color-theme">罗特币数量：{{num.total_num}}</view>
                <view class="surplus-num color-theme">现剩余数量：{{num.residue_num}}</view>
            </view>
            <scroll-view scroll-y="true" class="data-list" @scrolltolower="nextPage">
                <view class="item font-bold" v-for="item in data" :key="item.id">
                    <view class="left">
                        <view class="name color-333">{{item.memo}}</view>
                        <view class="date-value color-999">{{item.createtime_text}}</view>
                    </view>
                    <view class="right">
                        <text class="value color-theme">{{item.score}}</text>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup>
    import usePage from '@utils/page'
    const params = reactive({day: null, type: 0})
    const num = ref({total_num: 0, residue_num: 0})
    const {
        hasNext,
        data,
        nextPage,
        loadList
    } = usePage(api.userScoreLog, params, (res) => {
        const {total_num, residue_num, list} = res.data;
        num.value = {
            total_num,
            residue_num
        }
        return list;
    });
    const selectTab = (type) => {
        params.type = type;
        loadList();
    }
    const changeDate = (date) => {
        params.day = date;
        loadList();
    }
    const init = () => {
        loadList();
    }
    init();
</script>

<style lang="scss" scoped>
    .container {
        background-color: #f7f7f7;
        min-height: calc(100vh - 44px);
        padding: 15px;
        .date-title {
            font-size: 13px;
        }
        .date {
            font-size: 15px;
            display: flex;
            align-items: center;
            padding: 15px 0;
            .select-date {
                margin-left: auto;
                margin-right: 5px;
            }
            .date-icon {
                width: 16px;
                height: 16px;
            }
        }
        .data-box {
            background-color: #fff;
            border-radius: 10px;
            .tabs {
                display: flex;
                border-bottom: 1px solid #E9E9E9;
                .tab {
                    display: flex;
                    justify-content: center;
                    padding: 4px 15px;
                    flex-direction: column;
                    .name {
                        padding: 10px 0;
                    }
                    .active-line {
                        height: 3.5px;
                        width: 30px;
                        border-radius: 2px;
                    }
                    &.active {
                        color: #2583F4;
                        .active-line {                            
                            background-color: #2583F4;
                        }
                    }
                }
            }
            .total {
                display: flex;
                column-gap: 50px;
                padding: 15px;
            }
            .data-list {
                padding: 10px;
                display: flex;
                flex-direction: column;
                height: calc(100vh - 260px);
                .item {
                    padding: 15px 10px;
                    background-color: #f7f7f7;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    .name {
                        font-size: 15px;
                    }
                    .date-value {
                        font-size: 12px;
                        padding: 15px 0 0;
                    }
                    .right {
                        text-align: right;
                        .value {
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
    :deep(.uni-date-x) {
        background-color: transparent;
    }
</style>
