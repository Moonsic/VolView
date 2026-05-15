<template>
  <div class="tab-wrap">
    <div class="tab-list">
      <div v-for="(item, index) in menuData" :key="index" class="item" :class="{ active: item.path === route.name }"
        @click="clickTab(item)">

        <span class="menu-name">{{ item.name }}</span>
        <IconDown v-if="item.children?.length" class="icon-down" />

        <div v-if="item.children?.length" class="sub-list">
          <div v-for="sub in item.children" :key="sub.name" class="sub-item flex-start"
            :class="{ active: sub.path === route.name }" @click.stop="clickTab(sub)">

            <!-- <span class="circle"></span> -->
            <span class="menu-name">{{ sub.name }}</span>
            <IconArrowRight class="icon-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const props = defineProps({
  menuData: {
    type: Array as PropType<IMenuData[]>,
    default: () => [],
  },
})

interface IMenuData {
  path: string
  name: string
  icon: string
  permiss: string
  isFolder: boolean
  children?: IMenuData[]
}

const route = useRoute()
const router = useRouter()

function clickTab(item: IMenuData) {
  if (!item.children?.length) {
    router.push({ name: item.path });
  }
}

</script>

<style lang="less" scoped>
.tab-wrap {
  position: relative;
}

.tab-list {
  display: flex;
  color: #fff;
  line-height: 1.2;

  .item {
    height: 60px;
    margin: 0 8px;
    padding: 0 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: pointer;
    position: relative;

    &.active {
      font-weight: 600;
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.20);
    }

    &:hover {
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.20);

      .sub-list {
        font-weight: 400;
        display: block;
      }
    }

    .icon-down {
      font-size: 18px;
      margin-left: 8px;
    }

    .sub-list {
      display: none; // 一开始不显示
      position: absolute;
      top: 60px;
      left: 90%;
      transform: translateX(-50%);
      z-index: 999;
      width: 160px;
      padding: 4px;
      color: var(--color-t2);
      background: var(--color-bg);
      border: var(--border-transparent);
      border-radius: 18px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.10);
      .sub-item {
        height: 56px;
        line-height: 56px;
        display: flex;
        justify-content: space-between;
        padding: 0 16px;
        border-radius: 18px;

        &:not(:last-child) {
          margin-bottom: 4px;
        }

        &.active {
          color: var(--color-primary);
          background: var(--color-primary-01);
          font-weight: 500;
        }

        &:hover {
          color: var(--color-primary);
          background: var(--color-primary-01);
          // font-weight: 500;

          .icon-right {
            display: block;
          }
        }

        .icon-right {
          display: none;
          font-size: 24px;
        }

      }
    }
  }
}
</style>