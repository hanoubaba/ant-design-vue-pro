<template>
    <view class="container">
        <view class="transfer color-333">
            <view class="item line">
                <view class="name">转赠类型</view>
                <view class="input" style="padding: 0 20px;">
                    <text class="color-theme font-bold">转赠小海星</text>
                    <!-- <input type="text" placeholder="请选择转赠类型" />
                    <image class="arrow" src="/static/common/arrow-bottom.png" mode="aspectFit"></image> -->
                </view>
            </view>
            <view class="item">
                <view class="name">转赠数量</view>
                <view class="input">
                    <input type="number" placeholder="请输入转赠数量" maxlength="8" v-model="params.score"/>
                </view>
            </view>
            <view class="tips">
                <text class="color-theme font-bold">您有 {{score}} 朵小海星可以转赠</text>
            </view>
            <view class="item line">
                <view class="name">转赠人</view>
                <view class="input" @tap="selectPerson" style="padding: 0 20px;">
                    <text v-show="selectItemUser.id">{{selectItemUser.nickname}}</text>
                    <text v-show="!selectItemUser.id" class="color-999">请选择转赠人</text>
                    <image class="arrow" src="/static/common/arrow-bottom.png" mode="aspectFit"></image>
                </view>
            </view>
            <view class="item">
                <view class="name">备注</view>
                <view class="input">
                    <input type="text" placeholder="请输入内容" v-model="params.remark"/>
                </view>
            </view>
        </view>
        <view class="transfer-list">
            <text class="color-theme font-bold" @tap="toTransferList">转赠记录 ></text>
        </view>
        <view class="button-box">
            <Btn name="确定转赠" type="big" theme="theme" @tap="submit"></Btn>
        </view>
    </view>
    <uni-popup ref="personPopup" type="bottom" background-color="#fff">
        <view class="person-box">
            <view class="bar">
                <text class="font-bold">选择转赠人</text>
            </view>
            <view class="search-box">
                <input class="search-input" type="text" placeholder="请输入姓名" @input="searchUser"/>
                <uni-icons type="search" size="25" color="#999"></uni-icons>
            </view>
            <view class="list">
                <view class="item" v-for="item in uList" :key="item.id" @tap="selectItem(item)">
                    <image class="head" :src="item.avatar" mode="aspectFit"></image>
                    <view class="info">
                        <text class="name color-333">{{item.nickname}}</text>
                        <text class="starfish color-999">海星数量：{{item.score}}</text>
                    </view>
                    <view class="select-box">
                        <image class="select-icon"
                            :src="`/static/transfer/${selectUserTemp.id == item.id? 'selected': 'not-selected'}.png`" mode="aspectFill"></image>
                    </view>
                </view>
            </view>
            <view class="botton-box">
                <Btn name="确定" type="big" theme="theme" @tap="selectUser"></Btn>
            </view>
        </view>
    </uni-popup>
</template>

<script setup>
    const personPopup = ref();
    const selectPerson = () => {
        selectUserTemp.value = {};
        personPopup.value.open();
    }
    const selectUserTemp = ref({});
    const selectItem = (user) => {
        selectUserTemp.value = user;
    }
    const selectItemUser = ref({});
    const selectUser = () => {
        if(!selectUserTemp.value.id) {
            uni.showToast({
                title: '请选择需要转赠的用户',
                icon: 'none'
            })
            return;
        }
        params.accept_uid = selectUserTemp.value.id;
        selectItemUser.value = selectUserTemp.value;
        personPopup.value.close();
    }
    const toTransferList = () => {
        uni.navigateTo({
            url: '/pages/transfer/transferList'
        })
    }
    const score = ref(0);
    const userScore = () => {
        api.userScore({
            success(res) {
                score.value = res.data.score;
            }
        });
    }
    const uList = ref([]);
    const searchUser = (e) => {
        api.userList({
            data: {
                name: e.detail.value
            },
            success(res) {
                uList.value = res.data.list;
            }
        })
    }
    const params = reactive({
        accept_uid: null,
        score: 0,
        remark: null
    })
    const submit = () => {
        if(!params.score) {
            uni.showToast({
                title: '请输入要转赠的海星数量',
                icon: 'none'
            })
            return;
        }
        if(params.score > score.value) {
            uni.showToast({
                title: '输入的海星数量超出拥有数量',
                icon: 'none'
            })
            return;
        }
        if(!params.accept_uid) {
            uni.showToast({
                title: '请选择要转赠的用户',
                icon: 'none'
            })
            return;
        }
        api.userGive({
            data: params,
            success(res) {
                uni.navigateTo({
                    url: '/pages/transfer/transferSucc'
                })
            }
        })
    }
    const init = () => {
        userScore();
    }
    init();
</script>

<style lang="scss" scoped>
    .container {
        background-color: #f7f7f7;
        min-height: calc(100vh - 44px);
        padding: 15px;
        .transfer {
            background-color: #fff;
            border-radius: 10px;
            padding: 20px 0;
            .item {
                display: flex;
                align-items: center;
                padding: 15px 0;
                .name {
                    width: 90px;
                    padding-left: 15px;
                }
                .input {
                    padding-right: 15px;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    input {
                        font-size: 14px;
                        flex: 1;
                        padding: 0 20px;
                    }
                    .arrow {
                        width: 16px;
                        height: 16px;
                    }
                }
            }
            .tips {
                background-color: #f7f7f7;
                border-radius: 15px;
                margin: 0 10px;
                padding: 15px;
            }
            .line {
                border-bottom: 1px solid #ccc;
            }
        }
        .transfer-list {
            text-align: right;
            padding: 20px 0;
        }
        .button-box {
            width: calc(100% - 30px);
            position: absolute;
            bottom: 50px;
        }
    }
    .person-box {
        padding: 15px;
        .bar {
            display: flex;
            justify-content: center;
        }
        .search-box {
            height: 40px;
            background-color: #f7f7f7;
            border-radius: 20px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            padding: 0 15px;
            .search-input {
                flex: 1;
                padding: 5px;
            }
        }
        .list {
            height: 300px;
            .item {
                background-color: #f7f7f7;
                border-radius: 10px;
                padding: 15px;
                display: flex;
                align-items: center;
                column-gap: 10px;
                margin-bottom: 10px;
                .head {
                    height: 50px;
                    width: 50px;
                    border-radius: 25px;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    row-gap: 10px;
                    flex: 1;
                    .starfish {
                        font-size: 12px;
                    }
                }
                .select-box {
                    .select-icon {
                        width: 20px;
                        height: 20px;
                    }
                }
            }
        }
        .botton-box {
            padding: 30px 0;
        }
    }
</style>
