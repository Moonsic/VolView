<template>
  <div class="tab-wrap">
    <div class="tab-list">
      <div v-for="(item, index) in menuData" :key="index" class="item"
        :class="{ active: item.path === route.name }" @click="clickTab(item)">
        <!-- <img class="menu-icon" :src="item.icon" alt="" /> -->

        <span class="menu-name">{{ item.name }}</span>
        <DownOutlined v-if="item.children?.length" class="down" />

        <div v-if="item.children?.length" class="sub-list">
          <div v-for="sub in item.children" :key="sub.name" class="sub-item flex-start"
            :class="{ active: sub.path === route.name }" @click.stop="clickTab(sub)">

            <span class="circle"></span>
            <span class="menu-name">{{ sub.name }}</span>
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
  margin-right: 40px;
  position: relative;
  // &::-webkit-scrollbar {
  //     width: 5px;
  //     height: 5px;
  // }
  // &::-webkit-scrollbar-track {
  //     background: transparent;
  //     color: transparent;
  // }
  // &::-webkit-scrollbar-button {
  //     display: none;
  // }
  // &::-webkit-scrollbar-thumb {
  //     background: rgb(4, 4, 134);
  //     border-radius: 0px;
  // }
}

.tab-list {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #fff;

  .item {
    flex: 1;
    max-width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
    position: relative;

    &.active {
      font-weight: 600;

      >.menu-name {
        border-bottom: 4px inset #fff;
      }
    }

    &:hover {

      >.menu-name {
        border-bottom: 4px inset #fff;
      }

      .sub-list {
        font-weight: 400;
        display: block;
      }
    }

    .menu-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
      fill: currentColor;
    }

    >.menu-name {
      height: 70px;
      line-height: 70px;
    }

    .down {
      width: 14px;
      height: 14px;
      margin-left: 8px;
    }

    .sub-list {
      position: absolute;
      top: 64px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999;
      background: #307DF6;
      background: #175ccb;
      display: none;
      width: 120px;
      border-radius: 2px;

      &::before {
        content: "";
        display: block;
        border: 6px solid transparent;
        border-bottom: 6px solid #175ccb; //朝上
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
      }

      .sub-item {
        height: 50px;
        line-height: 50px;
        position: relative;

        .circle {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          opacity: .9;
          margin-left: 16px;
          margin-right: 8px;
        }

        &.active {
          font-weight: 600;
          background: #1f6ff0;
        }

        &:hover {
          font-weight: 600;
          background: #1868e9;
        }

      }
    }
  }
}

.tab-list2 {
  height: 70px;
  line-height: 66px;
  color: #fff;
  width: auto;

  .item {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    margin: 0 24px;
    cursor: pointer;
    position: relative;


    &.active {
      // background: #1f6ff0;
      font-weight: 600;
      border-bottom: 4px inset #fff;
    }

    &:hover {
      // background: #1868e9;
      font-weight: 600;
      border-bottom: 4px inset #fff;

      .sub-list {
        font-weight: 400;
        display: block;
      }
    }

    >.menu-name {
      transform: translateY(2px);
    }

    .down {
      width: 14px;
      height: 14px;
      margin-left: 8px;
      transform: translateY(2px);
    }

  }
}
</style>