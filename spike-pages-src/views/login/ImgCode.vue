<template>
  <div class="canvas-box" @click="changeCode" title="更换验证码">
    <canvas id="canvas-img-code" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<script>

export default {
  name: 'ImgCode',
  data() {
    return {
      identifyCode: ''
    };
  },
  props: {
    identifyCodes: {
      //验证码从该字段中抽取生成
      type: String,
      // default: "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz235678"
      default: "abcdefghijkmnprstuvwxyz1235678912356789"
      // default: "12356789"
    },
    fontSizeMin: {
      // 字体最小值
      type: Number,
      default: 28
    },
    fontSizeMax: {
      // 字体最大值
      type: Number,
      default: 34
    },
    backgroundColorMin: {
      // 验证码图片背景色最小值
      type: Number,
      default: 240 // 240
    },
    backgroundColorMax: {
      // 验证码图片背景色最大值
      type: Number,
      default: 250 // 250
    },
    dotColorMin: {
      // 背景干扰点最小值
      type: Number,
      default: 60
    },
    dotColorMax: {
      // 背景干扰点最大值
      type: Number,
      default: 120
    },
    contentWidth: {
      //容器宽度
      type: Number,
      default: 100
    },
    contentHeight: {
      //容器高度
      type: Number,
      default: 36
    }
  },
  watch: {
    identifyCode() {
      this.drawPic()
    }
  },
  mounted() {
    this.drawPic()
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return "rgb(" + r + "," + g + "," + b + ")"
    },
    drawPic() {
      let canvas = document.getElementById("canvas-img-code")
      let ctx = canvas.getContext("2d")
      ctx.textBaseline = "bottom"
      // 绘制背景
      // ctx.fillStyle = this.randomColor(
      //   this.backgroundColorMin,
      //   this.backgroundColorMax
      // )

      ctx.fillStyle = "rgb(9,21,35)"
      ctx.fillStyle = "rgb(21,43,61)"
      // ctx.fillStyle = "rgb(15,32,48)"

      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i);
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    // 绘制文字
    drawText(ctx, txt, i) {
      // ctx.fillStyle = this.randomColor(10, 180) //随机生成字体颜色
      ctx.fillStyle = this.randomColor(100, 250) //随机生成字体颜色
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + "px SimHei" //随机生成字体大小
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-20, 20)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate((deg * Math.PI) / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate((-deg * Math.PI) / 180)
      ctx.translate(-x, -y)
    },
    // 绘制干扰线
    drawLine(ctx) {
      for (let i = 0; i < 1; i++) {
        ctx.strokeStyle = this.randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        )
        ctx.lineTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        )
        ctx.stroke()
      }
    },
    // 绘制干扰点
    drawDot(ctx) {
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(
          this.randomNum(1, this.contentWidth - 1),
          this.randomNum(1, this.contentHeight - 1),
          0.6,
          0,
          2 * Math.PI
        )
        ctx.fill()
      }
    },
    // 切换验证码
    changeCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(e, n) {
      for (let i = 0; i < n; i++) {
        this.identifyCode += e[this.randomNum(0, e.length)]
      }
      // console.log('code = ',this.identifyCode)
      this.$emit("changeCode", this.identifyCode)
    },
  }
};
</script>
<style scoped>
.canvas-box {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(7px, -2px);
  border-radius: 6px;
  overflow: hidden;
}
</style>