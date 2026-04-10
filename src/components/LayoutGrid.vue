<template>
  <div class="layout-container flex-equal" :class="flexFlow">
    <div v-for="(item, i) in items" :key="i" class="d-flex flex-equal">
      <layout-grid v-if="item.type === 'layout'" :layout="item as Layout" />



      <LayoutGridItem
        v-else
        class="layout-item"
        :class="`layout-item-${item.viewId}`"
        :view-id="item.viewId"
        @pointerdown.capture="onFocusView(item.viewId)"
        @dblclick="maximize(item.viewId)"
      />
    </div>
      <!-- GZC -->
       <!-- <div v-else class="layout-item">
         <div class="color-border" :class="`layout-item-${item.id}`">
           <component
           :is="item.component"
           :key="item.id"
           :id="item.id"
           :type="item.viewType"
           v-bind="item.props"
           @focus="onFocusView(item.id!, item.viewType!)"
         />
         </div>
       </div> -->
    <!-- id: -->
    <!-- ObliqueCoronal -->
    <!-- ObliqueSagittal -->
    <!-- ObliqueAxial -->
    <!-- Oblique3D -->

    <!-- <div v-for="(item, i) in items" :key="i" class="d-flex flex-equal">
      <layout-grid v-if="item.type === 'layout'" :layout="(item as Layout)" />
      <div v-else class="layout-item">
        {{ item.id }}
        {{ item.props }}
        {{ item }}
      </div>
    </div> -->

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';
import { Layout } from '@/src/types/layout';
import { useViewStore } from '@/src/store/views';
import { useToolStore } from '@/src/store/tools';
import { Tools } from '@/src/store/tools/types';
import LayoutGridItem from '@/src/components/LayoutGridItem.vue';

export default defineComponent({
  name: 'LayoutGrid',
  components: {
    LayoutGridItem,
  },
  methods: {
    onFocusView(id: string) {
      useViewStore().setActiveView(id);
    },
    maximize(id: string) {
      const currentTool = useToolStore().currentTool;
      if (currentTool !== Tools.Polygon) {
        useViewStore().setActiveView(id);
        useViewStore().toggleActiveViewMaximized();
      }
    },
  },
  props: {
    layout: {
      type: Object as PropType<Layout>,
      required: true,
    },
  },
  setup(props) {
    const { layout } = toRefs(props);
    const viewStore = useViewStore();

    const flexFlow = computed(() => {
      return layout.value.direction === 'column' ? 'flex-column' : 'flex-row';
    });

    const items = computed(() => {
      return layout.value.items.map((item) => {
        if (item.type === 'slot') {
          const viewInfo = viewStore.visibleViews[item.slotIndex];
          return {
            ...item,
            viewId: viewInfo.id,
          };
        }
        return item;
      });
    });

    return {
      items,
      flexFlow,
    };
  },
});
</script>

<style scoped src="@/src/components/styles/utils.css"></style>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
}

.layout-item {
  display: flex;
  flex: 1;
  border: 1px solid #000;
  background-color: #000;
}

.color-border {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout-item-ObliqueCoronal {
  border: 2px solid rgba(255, 51, 51,.8);
}
.layout-item-ObliqueSagittal {
  border: 2px solid rgba(255, 255, 0,.8);
}
.layout-item-ObliqueAxial {
  border: 2px solid rgba(0, 128, 255,.8);
}
/* .layout-item-Oblique3D {
  border: 2px solid rgba(0, 0, 0,.6);
} */

</style>
