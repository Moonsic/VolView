<template>
  <div class="title-bg" :class="{ middle: type !== 'middle' }">
    <!-- <img src="@a/image/screen/titBg.png" class='img'/> -->
    <span class='title-text'>{{ title }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'left'
    }
  },
}
</script>
<style lang='less' scoped>
.title-bg {
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  font-size: 20px;
  position: relative;
  color: #adfcff;
  // border-bottom: 1px solid #adfcff;
  // border: 1px solid #ffcb10;

  .img {
    width: 100%;
    height: 32px;
  }

  .title-text {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}

.middle {
  background-image: linear-gradient(to right, rgba(62, 159, 245, 0), rgba(62, 159, 245, 0.26), rgba(62, 159, 245, 0));
}
</style>