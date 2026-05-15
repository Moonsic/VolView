<template>
  <!-- 切换菜单 -->
  <div class="switch-button-component">
    <a
      v-for="(item, index) in list" :key="index"
      :class="{ 'active': item.value === currentValue }"
      :style="{ width: `${itemWidth}px` }"
      @click="switchMenu(item.value)"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'SwitchMenu',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: [String, Number],
      default: null
    },
    itemWidth: {
      type: Number,
      default: 85
    }
  },
  data() {
    return {
      currentValue: null
    }
  },
  created() {
    if (this.value !== null) {
      this.currentValue = this.value
    }
  },
  methods: {
    switchMenu(value) {
      if (value !== this.currentValue) {
        this.currentValue = value
        this.$emit('change', value)
      }
    }
  },
};
</script>

<style lang="less" scoped>
.switch-button-component {
  width: 100%;
  position: relative;
  overflow: hidden;
  font-size: 0;
  white-space: nowrap;
  text-align: right;
  padding: 8px;

  >a {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    color: #78D9FF;
    line-height: 30px;
    text-align: center;
    user-select: none;
    box-sizing: border-box;
    background: rgba(54, 111, 207, 0.11);
    border: 1px solid rgba(54, 111, 207, 0.11);

    &:not(:first-child) {
      margin-left: 8px;
    }

    &.active {
      border-color: #40a1f7;
    }
  }
}
</style>