<template>
  <a-empty v-if="!list.length" class="mt32" />
  <div v-else class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="rightTop">
        <span>标签</span>
      </div>
      <div class="left">
        <img src="https://s.cn.bing.net/th?id=OHR.LacMontagnon_ZH-CN8301464080_1920x1080.jpg&rf=LaDigue_1920x1080.jpg"
          alt="">
      </div>
      <div class="center">
        <div class="title" @click="clickRow(item)">{{ item.resourceName }}</div>
        <div class="info infoTwo">
          <div>
            <span>数源单位：</span>
            <span>{{ item.unitName }}</span>
          </div>
          <div>
            <span>申请量：</span>
            <span>{{ item.applyNum }}</span>
          </div>
        </div>
        <div class="info infoTwo">
          <div>
            <span>发布时间：</span>
            <span>{{ item.createDate?.replace('T', ' ') }}</span>
          </div>
          <div>
            <span>更新频率：</span>
            <span>{{ item.rateValue }}</span>
          </div>
        </div>
        <div class="info infoOne">
          <div>
            <span>信息资源摘要：</span>
            <span>{{ item.description }}</span>
          </div>
        </div>
        <div class="bottomInfo">
          <span>访问量({{ Math.ceil(Math.random() * 10000) }})</span>
          <span>申请量({{ Math.ceil(Math.random() * 1000) }})</span>
          <span>{{ item.updateDate?.replace('T', ' ').substring(0, 16) }}</span>
        </div>
      </div>
      <div class="right">
        <a-space direction="vertical">
          <a href="javascript:;" @click="onRefresh">清空</a>
          <a href="javascript:;" @click="setData">填入数据</a>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script setup>

// 已有的全部数据
const allList = []
for (let i = 0; i < 8; i++) {
  allList.push({
    id: i,
    name: `张三${i}`,
    resourceName: `标题${i + 1}`,
    resourceType: i,
    unitName: '单位名称',
    applyNum: i,
    rateValue: '一周',
    description: '这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述',
    createDate: '2022-12-12 12:12:12',
    updateDate: '2022-12-12 12:12:12',
  })
}

const list = ref([])

function onRefresh() {
  list.value = []
}
function setData() {
  list.value = allList
}

setData()

function clickRow(item) {
  // emit('clickRow', item)
}

</script>
<style lang="less" scoped>
.list {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  .item {
    padding: 15px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    &:nth-child(odd) {
      background: #fff;
    }

    &:nth-child(even) {
      background: #fafafa;
    }

    &:hover {
      .title {
        text-decoration: underline;
      }
    }

    .rightTop {
      position: absolute;
      top: 15px;
      right: 0px;
      padding: 0 8px 0 10px;
      border-radius: 10px 0 0 10px;
      color: #fff;
      background-color: rgb(137, 137, 240);

      >span {
        font-size: 12px;
      }
    }

    .left {
      width: 100px;
      margin: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100px;
        height: 80px;
        border-radius: 4px;
      }
    }

    .center {
      flex: 1;

      .title {
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }

      .info {
        display: flex;

        >div {
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          >span:first-child {
            color: var(--color-t3);
          }
        }

        &.infoOne {
          >div {
            width: 80%;
          }
        }

        &.infoTwo {
          >div:first-child {
            width: 60%;
          }

          >div:last-child {
            width: 40%;
          }
        }

      }

      .bottomInfo {
        margin-top: 5px;
        font-size: 12px;
        color: var(--color-t4);

        span {
          margin-right: 8px;
        }
      }
    }

    .right {
      width: 100px;
      margin-right: 20px;
    }
  }
}
</style>