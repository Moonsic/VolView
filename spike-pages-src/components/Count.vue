<template>
  <span>{{ displayValue }}</span>
</template>

<script>
let lastTime = 0
const prefixes = 'webkit moz ms o'.split(' ') // 各浏览器前缀

let requestAnimationFrame
let cancelAnimationFrame

const isServer = typeof window === 'undefined'
if (isServer) {
  requestAnimationFrame = function () {
    return
  }
  cancelAnimationFrame = function () {
    return
  }
} else {
  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
  let prefix
  // 通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) { break }
    prefix = prefixes[i]
    requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame']
    cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame']
  }

  // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime()
      // 为了使setTimteout的尽可能的接近每秒60帧的效果
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

    cancelAnimationFrame = function (id) {
      window.clearTimeout(id)
    }
  }
}

export default {
  name: 'Count',
  props: {
    //  duration, 时间
    time: {
      type: Number,
      required: false,
      default: 2000,
    },
    // 开始值
    startVal: {
      type: Number,
      required: false,
      default: 0
    },
    // endVal，结束值
    data: {
      type: [Number, String],
      required: false,
      default: 0
    },
    // 自动播放
    autoplay: {
      type: Boolean,
      required: false,
      default: true
    },
    // 十进制分割
    decimal: {
      type: String,
      required: false,
      default: '.'
    },
    // 分隔符:,
    separator: {
      type: String,
      required: false,
      default: ''
    },
    // 前缀
    prefix: {
      type: String,
      required: false,
      default: ''
    },
    // 后缀
    suffix: {
      type: String,
      required: false,
      default: ''
    },
    // 使用缓和功能
    useEasing: {
      type: Boolean,
      required: false,
      default: true
    },
    // 缓和回调
    easingFn: {
      type: Function,
      default(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
      }
    }
  },

  data() {
    return {
      localStartVal: this.startVal,
      displayValue: this.formatNumber(this.startVal),
      printVal: null,
      paused: false,
      localDuration: this.time,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null,
      decimals: 0, //要显示的小数位数
    };
  },
  computed: {
    countDown() {
      return this.startVal > this.data
    }
  },
  watch: {
    startVal() {
      if (this.autoplay) {
        this.start();
      }
    },
    data(val) {
      if (this.autoplay) {
        this.start();
      }
    }
  },
  mounted() {
    if (this.autoplay) {
      this.start();
    }
    this.$emit('mountedCallback')
  },
  methods: {
    start() {
      if (this.data === null || this.data === 'undfined' || this.data === '') {
        this.displayValue = ''
        return false
      }
      // 几位小数
      if (this.data.toString().split('.')[1]) {
        this.decimals = this.data.toString().split('.')[1].length
      } else {
        this.decimals = 0
      }
      this.localStartVal = this.startVal;
      this.startTime = null;
      this.localDuration = this.time;
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    },
    pauseResume() {
      if (this.paused) {
        this.resume();
        this.paused = false;
      } else {
        this.pause();
        this.paused = true;
      }
    },
    pause() {
      cancelAnimationFrame(this.rAF);
    },
    resume() {
      this.startTime = null;
      this.localDuration = +this.remaining;
      this.localStartVal = +this.printVal;
      requestAnimationFrame(this.count);
    },
    reset() {
      this.startTime = null;
      cancelAnimationFrame(this.rAF);
      this.displayValue = this.formatNumber(this.startVal);
    },
    count(timestamp) {
      if (!this.startTime) this.startTime = timestamp;
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;
      this.remaining = this.localDuration - progress;

      if (this.useEasing) {
        if (this.countDown) {
          this.printVal = this.localStartVal - this.easingFn(progress, 0, this.localStartVal - this.data, this.localDuration)
        } else {
          this.printVal = this.easingFn(progress, this.localStartVal, this.data - this.localStartVal, this.localDuration);
        }
      } else {
        if (this.countDown) {
          this.printVal = this.localStartVal - ((this.localStartVal - this.data) * (progress / this.localDuration));
        } else {
          this.printVal = this.localStartVal + (this.data - this.localStartVal) * (progress / this.localDuration);
        }
      }
      if (this.countDown) {
        this.printVal = this.printVal < this.data ? this.data : this.printVal;
      } else {
        this.printVal = this.printVal > this.data ? this.data : this.printVal;
      }
      this.printVal = Number(this.printVal)
      this.displayValue = this.formatNumber(this.printVal)
      if (progress < this.localDuration) {
        this.rAF = requestAnimationFrame(this.count);
      } else {
        this.$emit('callback');
      }
    },
    isNumber(val) {
      return !isNaN(parseFloat(val))
    },
    formatNumber(num) {
      num = num.toFixed(this.decimals);
      num += '';
      const x = num.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? this.decimal + x[1] : '';
      const rgx = /(\d+)(\d{3})/;
      if (this.separator && !this.isNumber(this.separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + this.separator + '$2');
        }
      }
      return this.prefix + x1 + x2 + this.suffix;
    }
  },
  destroyed() {
    cancelAnimationFrame(this.rAF)
  }
};
</script>

<style lang="less" scoped>
// span {
//   font-weight: 500;
//   font-family: BEBAS-1;
// }
</style>