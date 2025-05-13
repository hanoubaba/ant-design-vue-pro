<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
    page {
        background: linear-gradient( 180deg, #FFFFFF 0%, #F5F5F5 100%);
        font-size: 14px;
    }
    view, scroll-view {
        box-sizing: border-box;
    }
    .container {
        min-height: 100vh;
        position: relative;
    }
    .back-icon {
        width: 32px;
        height: 32px;
        position: absolute;
        left: 15px;
        top: 40px;
        z-index: 1;
    }
    .color-theme {
        color: #2583F4;
    }
    .color-red {
        color: #E84B49;
    }
    .color-fff {
        color: #fff;
    }
    .color-333 {
        color: #333;
    }
    .color-666 {
        color: #666;
    }
    .color-999 {
        color: #999;
    }
    .font-bold {
        font-weight: bold;
    }
</style>
