<template>
    <view :class="{'btn-box': type == 'small'}">
        <button class="btn" :style="{width: (width? `${width}px`: false)}" :class="[type, theme]">{{name}}</button>
    </view>
</template>

<script setup>
    defineProps({
        name: {
            type: String
        },
        type: {
            type: String,
            default: 'small'
        },
        theme: {
            type: String,
            default: 'default'
        },
        width: {
            type: Number
        }
    })
</script>

<style lang="scss" scoped>
    .btn-box {
        display: inline-block;
    }
    .btn {
        border: 1px solid #2583F4;
        border-radius: 40px;
        font-size: 14px;
        padding: 0 15px;
    }
    .theme {
        background-color: #2583F4;
        color: #fff;
    }
    .orange {
        border: 1px solid #FF7B23;
        background-color: #FF7B23;
        color: #fff;
    }
    .default {
        color: #2583F4;
        background-color: #fff;
    }
    .big {
        height: 40px;
        line-height: 40px;
    }
    .small {
        height: 30px;
        line-height: 30px;
    }
</style>
