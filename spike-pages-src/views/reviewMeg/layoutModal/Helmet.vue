<template>
  <div class="helmet-page">
    <div v-if="showEmpty" class="helmet-no-data">
      {{ t('请先进行配准后才可查看3D拓扑图！') }}
    </div>
    <div ref="canvasContainer" class="flex-center" style="width: 100%; height: 100%; cursor: move;">
    </div>

    <!-- <div class="input-controls" v-if="!showEmpty">
      <a-input-number class="input-100" v-model:value="valueX" size="small" placeholder="" :step="10" @change="changeXYZ" />
      <a-input-number class="input-100" v-model:value="valueY" size="small" placeholder="" :step="10" @change="changeXYZ" />
      <a-input-number class="input-100" v-model:value="valueZ" size="small" placeholder="" :step="10" @change="changeXYZ" />
    </div> -->

    <!-- 视角控制按钮 -->
    <div class="view-controls" :class="{ 'view-controls-english': isEnglish }" v-if="!showEmpty">
      <button @click="toggleViewControls" class="control-btn btn-toggle" :title="showButton ? '收起' : '展开'">
        <svg v-if="!showButton" width="48" height="48" viewBox="0 0 48 48" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="19" width="10" height="10" />
          <rect x="19" y="3" width="10" height="10" />
          <rect x="19" y="35" width="10" height="10" />
          <rect x="3" y="19" width="10" height="10" />
          <rect x="35" y="19" width="10" height="10" />
        </svg>

        <svg v-if="showButton" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18L18 18L18 10" />
        </svg>
      </button>

      <!-- 五个视角按钮：仅展开时显示 -->
      <template v-if="showButton">
        <button @click="rotateView('front')" class="control-btn btn-front">{{ t('前') }}</button>
        <button @click="rotateView('top')" class="control-btn btn-top">{{ t('顶') }}</button>
        <button @click="rotateView('back')" class="control-btn btn-back">{{ t('后') }}</button>
        <button @click="rotateView('left')" class="control-btn btn-left">{{ t('左') }}</button>
        <button @click="rotateView('right')" class="control-btn btn-right">{{ t('右') }}</button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

const { t, locale } = useI18n()
const isEnglish = computed(() => locale.value === 'en-US')

// 5视角按钮是否展开
const showButton = ref(true)

const local_showHelmetViewButton = localStorage.getItem('showHelmetViewButton')
showButton.value = local_showHelmetViewButton !== 'false'

// 切换展开/收起
function toggleViewControls() {
  showButton.value = !showButton.value
  localStorage.setItem('showHelmetViewButton', String(showButton.value))
}


// 头盔数据
let helmet_color: any[]
let helmet_vertices: any[]
let helmet_faces: any[]

// 等高线数据
let contour_vertices: any[]
let contour_faces: any[]


const canvasContainer = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
// let controls: OrbitControls;
let controls: TrackballControls;
let animationFrameId: number | null = null; // 新增：用于存储 requestAnimationFrame 的 ID

// 定义引用变量
let helmetMesh: THREE.Mesh | null = null;
let contourLine: THREE.LineSegments | null = null;

const canvas_width = 300;
const canvas_height = 300;

onMounted(() => {
  init();
  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId); // 取消 requestAnimationFrame 循环
    animationFrameId = null;
  }
  // 移除旧的几何体（如果存在）
  removeOldMesh()
  renderer.dispose();
  canvasContainer.value.removeChild(renderer.domElement);
  scene = null;
  camera = null;
  renderer = null;
  controls.dispose(); // 如果有控制组件，记得释放控制组件的资源
  // window.removeEventListener('resize', onWindowResize)
})

const themeStore = useThemeStore()
const { chartTheme } = storeToRefs(themeStore)


const sceneBackground: any = {
  'light': new THREE.Color(0xd1d5d9), // 深一点的灰色
  // 'dark': new THREE.Color(0x303030),
  // 'light': new THREE.Color(0xf1f3f5),
  'dark': new THREE.Color(0x17181B),
  'eyecare': new THREE.Color(0xd1d5d9),
}

const init = () => {

  // 创建场景
  scene = new THREE.Scene();
  scene.background = sceneBackground[chartTheme.value]

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, canvas_width / canvas_height, 0.1, 1000);
  // 设置相机位置(从顶部看)
  // camera.position.set(0, 50, 40);
  // camera.up.set(0, 0, 1);

  camera.position.set(0, 0, 50);
  camera.up.set(0, 1, 0);

  camera.lookAt(0, 0, 0);
  // 创建渲染器
  // renderer = new THREE.WebGLRenderer({ antialias: true });


  // 创建优化版渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // powerPreference: "high-performance",
    // precision: "mediump"
  });


  // 初始化渲染器
  renderer.setSize(canvas_width, canvas_height);

  // 添加到 DOM
  canvasContainer.value?.appendChild(renderer.domElement);


  // 添加环境光，否则透明物体可能看不见
  const ambientLight = new THREE.AmbientLight(0xffffff, 3); // 环境光
  scene.add(ambientLight);

  // 平行光源，即从一个特定方向均匀照射的光源，类似于太阳光
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight1.position.set(1, 1, 1).normalize(); // 朝向一个角落
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 3);
  dirLight2.position.set(-1, -1, -1).normalize(); // 朝向另一个相对的角落
  scene.add(dirLight2);


  initControls()


  // 渲染循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate); // 存储 requestAnimationFrame 的返回值
    controls.update(); // 更新 OrbitControls
    renderer.render(scene, camera);
  };

  animate();

}

// 控制旋转的，之前用的是OrbitControls，但它不能完全自由旋转
function initControls() {

  if (controls) {
    controls.dispose();
  }

  controls = new TrackballControls(camera, canvasContainer.value);

  // 优化控制参数 - 解决卡顿核心
  controls.rotateSpeed = 10;              // 降低旋转速度，让操作更钝一些，原来15
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.8;
  controls.staticMoving = false;          // 启用静态移动以减少抖动
  controls.dynamicDampingFactor = 0.3;    // 增加阻尼因子使运动更平滑但响应较慢，原来0.2
  controls.noPan = true;                  // 禁用平移
  controls.noZoom = false;                // 允许缩放
  controls.noRotate = false;              // 允许旋转
  controls.minDistance = 2;              // 限制最小距离
  controls.maxDistance = 30;             // 限制最大距离

  // 设置目标点
  controls.target.set(0, 0, 0);
}

const showEmpty = ref(false)
// 设置数据
function setData(data: any) {
  // data为空说明还没配准
  if (!data) {
    showEmpty.value = true
    return
  }
  showEmpty.value = false

  // 移除旧的几何体（如果存在）
  removeOldMesh()

  helmet_color = data.colormap
  helmet_vertices = data.helmet_vertices
  helmet_faces = data.helmet_faces
  contour_vertices = data.contour_vertices
  contour_faces = data.contour_faces

  createHelmet() // 创建头盔
  createContourGeometry() // 创建等高线数据
}

// 移除旧的几何体（如果存在）
function removeOldMesh() {
  if (helmetMesh) {
    scene.remove(helmetMesh);
    helmetMesh.geometry.dispose();
    // 使用类型断言，明确告诉 TypeScript 我们知道 helmetMesh.material 是 Material 类型
    (helmetMesh.material as THREE.Material).dispose();
    if (helmetMesh.geometry) {
      helmetMesh.geometry.dispose();
    }
    helmetMesh = null;
  }
  if (contourLine) {
    scene.remove(contourLine);
    // 使用类型断言，明确告诉 TypeScript 我们知道 contourLine.material 是 Material 类型
    (contourLine.material as THREE.Material).dispose();
    if (contourLine.geometry) {
      contourLine.geometry.dispose();
    }
    contourLine = null;
  }
}

function flattenArray(arr: any[]): number[] {
  return arr.reduce((accumulator: number[], currentValue: any) => {
    return accumulator.concat(Array.isArray(currentValue) ? flattenArray(currentValue) : currentValue);
  }, []);
}

// 头盔
function createHelmet() {
  // 将颜色数组转换为 Float32Array 类型，因为 BufferAttribute 需要这种格式
  const vertexColors = new Float32Array(helmet_color.flatMap(color => color))

  const newRr = flattenArray(helmet_vertices)
  newRr.forEach((item: number, index: number) => {
    newRr[index] = Number((item).toFixed(2))
  })
  const indices = flattenArray(helmet_faces)

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(newRr);
  geometry.setIndex(indices);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 为几何体设置顶点位置信息，itemSize = 3 因为每个顶点都是一个三元组。
  geometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3)); // 颜色不带透明度为3： R, G, B 三个分量；颜色带透明度为4： R, G, B A 四个分量


  const material = new THREE.MeshBasicMaterial({
    opacity: 1,
    depthWrite: true,       // 深度写入
    transparent: true,      // 启用透明度
    vertexColors: true,     // 开启顶点颜色
    side: THREE.DoubleSide, // 设置双面渲染
    // wireframe: false // 默认关闭线框，在低性能时打开
  });

  helmetMesh = new THREE.Mesh(geometry, material);

  // helmetMesh!.rotation.set(0, 0, 0);

  // console.log('count', geometry.index.count)
  //geometry.index.count只有1704个
  // 优化性能 - 限制几何体精度
  // if (geometry.index && geometry.index.count > 10000) {
  //   console.log(`高面数几何体: ${geometry.index.count}个三角面，启用性能模式`);
  //   material.wireframe = true;
  // }


  scene.add(helmetMesh);

  // 更新控制器目标
  controls.target.copy(helmetMesh.position);
  controls.update();
}

// 创建等高线数据
function createContourGeometry() {

  const geometry = new THREE.BufferGeometry;

  const newRr = flattenArray(contour_vertices)
  newRr.forEach((item: number, index: number) => {
    newRr[index] = Number((item).toFixed(2))
  })

  const indices = flattenArray(contour_faces)
  const vertices = new Float32Array(newRr);

  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));


  // 创建一个材质，用于绘制等高线
  const materialLine = new THREE.LineBasicMaterial({
    color: 0xeeeeee,
  });

  contourLine = new THREE.LineSegments(geometry, materialLine);
  scene.add(contourLine);
}

// 缩放弹窗
function setResize(res: { width: number, height: number }) {

  // 谁小用谁，保持一个正方形
  const min = Math.min(res.width, res.height);
  if (renderer) {
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize(min, min);
    controls.handleResize(); // 确保控制器的尺寸更新
  }
}

const onWindowResize = () => {
  if (renderer) {
    camera.aspect = canvas_width / canvas_height;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas_width, canvas_height);
    controls.handleResize(); // 关键：更新控制器尺寸
  }
}

function setChartTheme(value: string) {
  // 只是改变背景色
  scene.background = sceneBackground[value]
  renderer.render(scene, camera)
}

const valueX = ref(0)
const valueY = ref(0)
const valueZ = ref(0)
function changeXYZ() {
  controls.enabled = false;
  camera.position.set(valueX.value, valueY.value, valueZ.value);
  camera.lookAt(0, 0, 0);
  // 更新控制器
  controls.target.copy(new THREE.Vector3(0, 0, 0));
  controls.update();

  // 重新启用控制器
  setTimeout(() => {
    controls.enabled = true;
  }, 100); // 短暂延迟以避免冲突

}

// 视角切换函数
// 视角切换函数 - 修复版
function rotateView(direction: string) {

  // console.log('切换视角到:', direction);
  // logCameraInfo();


  // 1. 先禁用控制器
  controls.enabled = false;

  const targetPosition = new THREE.Vector3(0, 0, 0); // 看向的目标点（原点）
  const distance = 50; // 相机距离目标的距离

  // 2. 根据方向设置相机位置
  switch (direction) {
    case 'front':
      // camera.position.set(0, 0, distance); // 前视图：从Z轴正方向看
      // camera.up.set(0, 1, 0); // 设置上方向为Y轴正方向

      camera.position.set(0, 50, 40);
      camera.up.set(0, 0, 1);

      break;
    case 'back':
      // camera.position.set(0, 0, -distance); // 后视图：从Z轴负方向看
      // camera.up.set(0, 1, 0);

      camera.position.set(0, -50, -10);
      camera.up.set(0, 0, 1);
      break;
    case 'left':
      // camera.position.set(-distance, 0, 0); // 左视图：从X轴负方向看
      // camera.up.set(0, 1, 0);

      camera.position.set(-50, 0, 20);
      camera.up.set(0, 0, 1);
      break;
    case 'right':
      // camera.position.set(distance, 0, 0); // 右视图：从X轴正方向看
      // camera.up.set(0, 1, 0);

      camera.position.set(50, 0, 20);
      camera.up.set(0, 0, 1);

      break;
    case 'top':
      // camera.position.set(0, distance, 0); // 顶视图：从Y轴正方向看
      // camera.up.set(0, 0, 1); // 注意：从顶部看时，上方向应该是Z轴

      camera.position.set(0, 0, 50);
      camera.up.set(0, 1, 0);
      break;
  }

  // 3. 确保相机看向目标点
  camera.lookAt(targetPosition);

  // 4. 更新控制器状态，这是关键！
  controls.target.copy(targetPosition);

  // 对于TrackballControls，需要重置其内部状态
  // 方法1：重新创建控制器（简单但有效）
  controls.dispose();
  initControls();

  // 或者方法2：重置控制器参数（如果支持）
  // controls.reset();

  // 5. 立即更新相机矩阵
  camera.updateMatrixWorld();

  // 6. 手动渲染一次
  renderer.render(scene, camera);

  // 7. 短暂延迟后重新启用控制器
  setTimeout(() => {
    controls.enabled = true;
  }, 100);
}


function logCameraInfo() {
  console.log('相机位置:', camera.position);
  console.log('相机朝向:', camera.rotation);
  console.log('控制器目标:', controls.target);
}


// 暴露方法
defineExpose({
  setData,
  setResize,
  setChartTheme,
})
</script>

<style lang="less" scoped>
.helmet-page {
  position: relative;
  width: 100%;
  height: 100%;

  .helmet-no-data {
    width: 100%;
    font-size: 13px;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-t4);
  }

  .input-controls {
    position: absolute;
    top: 24px;
    right: 4px;
    z-index: 10;
  }

  @width: 22px;

  .view-controls {
    position: absolute;
    bottom: 2px;
    right: 2px;
    z-index: 10;
    width: @width * 3; // 66px
    height: @width * 3; // 66px

    .control-btn {
      position: absolute;
      width: @width;
      height: @width;
      background-color: var(--color-t2-white);
      border: 1px solid #ccc;
      color: var(--color-t2);
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      transition: all 0.2s;

      &:hover {
        background-color: var(--color-t1-white);
      }

      // 触发按钮（中心）
      &.btn-toggle {
        width: @width * 0.8;
        height: @width * 0.8;
        bottom: 0px;
        right: 0px;
        z-index: 20; // 确保在最上层
        font-size: 14px; // 图标稍大
        color: var(--color-t4);
      }

      // 原有五个按钮的位置保持不变
      &.btn-top {
        top: @width;
        left: @width;
      }

      &.btn-front {
        top: 0;
        left: @width;
      }

      &.btn-back {
        top: @width * 2;
        left: @width;
      }

      &.btn-left {
        top: @width;
        left: 0;
      }

      &.btn-right {
        top: @width;
        left: @width * 2;
      }
    }

    &.view-controls-english {
      .control-btn {
        font-size: 8px;
      }
    }
  }

}

// 深色主题适配
.dark {
  .view-controls {
    .control-btn {
      border: var(--border-card);
    }
  }
}
</style>