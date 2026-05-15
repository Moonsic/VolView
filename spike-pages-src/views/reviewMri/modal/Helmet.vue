<template>
  <div style="width: 100%; height: 100%;">
    <a-spin :spinning="loading">
      <div ref="canvasContainer" style="width: 100%; height: 100%; cursor: move;"></div>
    </a-spin>

    <div class="list" v-if="false">
      <div class="item">
        <span class="title">X :</span>
        <MinusCircleFilled class="icon" @click="changePosition('x', -1)" />
        <span class="value">{{ offsetX }}</span>
        <PlusCircleFilled class="icon" @click="changePosition('x', 1)" />
      </div>
      <div class="item">
        <span class="title">Y :</span>
        <MinusCircleFilled class="icon" @click="changePosition('y', -1)" />
        <span class="value">{{ offsetY }}</span>
        <PlusCircleFilled class="icon" @click="changePosition('y', 1)" />
      </div>
      <div class="item">
        <span class="title">Z :</span>
        <MinusCircleFilled class="icon" @click="changePosition('z', -1)" />
        <span class="value">{{ offsetZ }}</span>
        <PlusCircleFilled class="icon" @click="changePosition('z', 1)" />
      </div>
      <div class="item">
        <span class="title">θx :</span>
        <MinusCircleFilled class="icon" @click="rotatePosition('x', -1)" />
        <span class="value">{{ rotateX }}°</span>
        <PlusCircleFilled class="icon" @click="rotatePosition('x', 1)" />
      </div>
      <div class="item">
        <span class="title">θy :</span>
        <MinusCircleFilled class="icon" @click="rotatePosition('y', -1)" />
        <span class="value">{{ rotateY }}°</span>
        <PlusCircleFilled class="icon" @click="rotatePosition('y', 1)" />
      </div>
      <div class="item">
        <span class="title">θz :</span>
        <MinusCircleFilled class="icon" @click="rotatePosition('z', -1)" />
        <span class="value">{{ rotateZ }}°</span>
        <PlusCircleFilled class="icon" @click="rotatePosition('z', 1)" />
      </div>
      <a-button class="ml4 mt8" type="primary" ghost size="small" shape="round" @click="onSave">{{ t('保存') }}</a-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { message } from 'ant-design-vue'
import { confirmModal } from '@u/modal'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// import { html2 } from '@v/test/html2.js'

import {
  getCoreg3DDataApi,   // 10. 获取配准结果3d展示数据
  saveManualCoregResultApi,   // 10. 获取配准结果3d展示数据
} from '@/api/sl'

const { t } = useI18n()

const props = defineProps({
  coregId: {
    type: String,
    default: '',
  },
})


// 头盔数据
let helmet_color: any[]
let helmet_vertices: any[]
let helmet_faces: any[]

// 点数据
let ext_pts: { color: number[], points: number[][] }
let head_fiducials_pts: Record<string, { color: number[], point: number[] }>
// let mri_fiducials_pts: Record<string, { color: number[], point: number[] }>
let hpi_pts: Record<string, { color: number[], point: number[] }>


const canvasContainer = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
// let controls: OrbitControls;
let controls: TrackballControls;
let animationFrameId: number | null = null; // 新增：用于存储 requestAnimationFrame 的 ID


const width = 600
const height = 600


const offsetX = ref<number>(0)
const offsetY = ref<number>(0)
const offsetZ = ref<number>(0)
const rotateX = ref<number>(0)
const rotateY = ref<number>(0)
const rotateZ = ref<number>(0)

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

  offsetX.value = 0
  offsetY.value = 0
  offsetZ.value = 0
  rotateX.value = 0
  rotateY.value = 0
  rotateZ.value = 0

});

const init = () => {

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // 设置相机位置
  // camera.position.set(0, 0, 500);
  // camera.lookAt(0, 0, 0);
  camera.position.set(0, 300, -1); // xyz 脸朝正了

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // 初始化渲染器
  renderer.setSize(width, height);
  // 添加到 DOM
  canvasContainer.value?.appendChild(renderer.domElement);

  // 设置背景色为白色
  renderer.setClearColor(0xf1f3f5, 1); // 第一个参数是颜色（十六进制），第二个参数是透明度（范围从0到1）


  // 创建几何体、材质、网格等...
  // 添加光照、环境、背景等...


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


  // camera.lookAt(0, 0, 0);
  // camera.lookAt(scene.position);

  // 设置相机位置
  // camera.position.y = 300;
  // camera.position.set(0, 300, -1); // xyz 脸朝正了
  // camera.position.set(200, -200, -200); // xyz
  // // 让相机看向场景中心(0, 0, 0)，实现向下看的效果
  // camera.lookAt(0, 0, 0);
  //   camera.rotation.set(Math.PI,0,  0); // 这将相机绕Y轴旋转180度，即翻转
  // // 设置相机上方向
  // camera.up.set(0, 1, 0)


  initControls()

  // // 使用 OrbitControls 实现拖动旋转
  // controls = new OrbitControls(camera, canvasContainer.value);
  // controls.enableDamping = true; // 启用阻尼效果
  // controls.dampingFactor = 0.1; // 设置阻尼系数，越小越平滑
  // // controls.screenSpacePanning = false; // 禁止屏幕空间平移 // 默认true,右键平移
  // controls.minDistance = 2; // 最小缩放距离
  // controls.maxDistance = 1000; // 最大缩放距离
  // controls.maxPolarAngle = Math.PI; // 允许向上看90度，向下看90度，即完整360度旋转
  // controls.minPolarAngle = 0;

  // 渲染循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate); // 存储 requestAnimationFrame 的返回值
    controls.update(); // 更新 OrbitControls

    if (spheresGroup) {
      spheresGroup.children.forEach(sphere => {
        if (sphere.userData && sphere.userData.isText === true) {
          sphere.lookAt(camera.position); // 文字一直面向相机位置
        }
      });
    }

    renderer.render(scene, camera);
  };
  animate();

}

// 控制旋转的，之前用的是OrbitControls，但它不能完全自由旋转
function initControls() {
  controls = new TrackballControls(camera, canvasContainer.value);

  // 优化控制参数 - 解决卡顿核心
  controls.rotateSpeed = 15;              // 提高旋转速度
  controls.zoomSpeed = 0.5;
  controls.panSpeed = 0.8;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;   // 0.08最佳阻尼值，既平滑又有响应性
  controls.noPan = true;                  // 禁用平移
  controls.noZoom = false;                // 允许缩放
  controls.noRotate = false;              // 允许旋转
  controls.minDistance = 2;              // 限制最小距离
  controls.maxDistance = 1000;             // 限制最大距离，这个页面这个值要大很多
}

const loading = ref<boolean>(false)

const oldData = ref<any>(null)

// 获取头盔数据
async function getData(record?: any) {
  oldData.value = {...record}
  // setData({})
  // return
  const params = {
    coregId: props.coregId,
    headType: 'surface',
    simplifyPerc: 0.95, // 参数越大，数据量越小，图像越有棱角，越不像人脸
  }
  loading.value = true
  const { code, data } = await getCoreg3DDataApi(params)
  loading.value = false
  if (code === 200) {
    setData(data)
  }
}


function setData(data: any) {

  // 移除旧的几何体（如果存在）
  removeOldMesh()

  helmet_vertices = data.head_surface.head_vertices
  helmet_faces = data.head_surface.head_faces
  helmet_color = data.head_surface.color
  ext_pts = data.ext_pts // 448个点
  head_fiducials_pts = data.head_fiducials_pts // 3个点
  // mri_fiducials_pts = data.mri_fiducials_pts // 3个点，现在不展示了
  hpi_pts = data.hpi_pts // 4个点



  // helmet_vertices = html2.head_surface.head_vertices
  // helmet_faces = html2.head_surface.head_faces
  // helmet_color = html2.head_surface.color
  // ext_pts = html2.ext_pts // 448个点
  // head_fiducials_pts = html2.head_fiducials_pts // 3个点
  // mri_fiducials_pts = html2.mri_fiducials_pts // 3个点
  // hpi_pts = html2.hpi_pts // 4个点

  offsetX.value = 0
  offsetY.value = 0
  offsetZ.value = 0
  rotateX.value = 0
  rotateY.value = 0
  rotateZ.value = 0

  createHelmet() // 创建头盔
  createSpheres()

  nextTick(() => {
    if (oldData.value.offsetX) changePosition('x', oldData.value.offsetX)
    if (oldData.value.offsetY) changePosition('y', oldData.value.offsetY)
    if (oldData.value.offsetZ) changePosition('z', oldData.value.offsetZ)
    if (oldData.value.rotateX) rotatePosition('x', oldData.value.rotateX)
    if (oldData.value.rotateY) rotatePosition('y', oldData.value.rotateY)
    if (oldData.value.rotateZ) rotatePosition('z', oldData.value.rotateZ)
  })
}

// 在组件的setup区域定义引用变量
let helmetMesh: THREE.Mesh | null = null;
let spheresGroup = new THREE.Group(); // 所以的球体集合

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
  if (spheresGroup) {
    scene.remove(spheresGroup);
    spheresGroup = null;
    spheresGroup = new THREE.Group();
  }
  // 如果使用了轨道控制器，记得更新它的目标，因为旧的目标可能已经被删除了
  if (controls) {
    controls.update();
  }
}

function flattenArray(arr: any[]): number[] {
  return arr.reduce((accumulator: number[], currentValue: any) => {
    return accumulator.concat(Array.isArray(currentValue) ? flattenArray(currentValue) : currentValue);
  }, []);
}

// 头皮
function createHelmet() {

  const newRr = flattenArray(helmet_vertices)
  newRr.forEach((item: number, index: number) => {
    newRr[index] = Number((item).toFixed(2))
  })
  const indices = flattenArray(helmet_faces)
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(newRr);
  geometry.setIndex(indices);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3)); // 为几何体设置顶点位置信息，itemSize = 3 因为每个顶点都是一个三元组。
  // MeshBasicMaterial/MeshStandardMaterial/MeshPhongMaterial
  const material = new THREE.MeshStandardMaterial({
    opacity: 0.8,
    depthWrite: true,       // 深度写入
    transparent: true,      // 启用透明度
    flatShading: true, // true为粗糙，默认为false，false保持光滑着色
    metalness: 0.8, // 调整金属度，1为完全金属反射，0为完全非金属
    roughness: 1, // 调整粗糙度，0为非常光滑，1为非常粗糙
    // 0.6+1 是一个黄色的头，效果还好；0.8+1 黄色更深的头；1+1是黄偏灰的头
    color: rgbArrayToHex(helmet_color)
  });

  helmetMesh = new THREE.Mesh(geometry, material);
  scene.add(helmetMesh);

}

// [252, 227, 188] => 0xfce3bc ;0xfce3bc是不需要加引号的，如果加上引号就是 '#fce3bc'
function rgbArrayToHex(rgbArray: number[]): string {
  return "#" +
    ("0" + rgbArray[0].toString(16)).slice(-2) +
    ("0" + rgbArray[1].toString(16)).slice(-2) +
    ("0" + rgbArray[2].toString(16)).slice(-2);
}


// 创建球体
function createSpheres() {
  const sphereRadius = 2 // 球的半径

  ext_pts.points.forEach((item: any) => {
    // 创建球体几何体
    const geometry = new THREE.SphereGeometry(1.5, 16, 16); // 半径，纬线细分，经线细分
    // 创建材质，使用颜色
    const material = new THREE.MeshStandardMaterial({
      opacity: 0.9,
      depthWrite: true,     // 深度写入
      transparent: true,    // 启用透明度
      flatShading: false,   // true为粗糙，默认为false，false保持光滑着色
      metalness: 0.8,       // 调整金属度，1为完全金属反射，0为完全非金属
      roughness: 1,         // 调整粗糙度，0为非常光滑，1为非常粗糙
      color: rgbArrayToHex(ext_pts.color)
    });
    // 创建球体Mesh
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(item[0], item[1], item[2]); // 设置球体位置
    sphere.userData.shouldMove = true; // 应该移动
    // 添加到组
    spheresGroup.add(sphere)
  })
  // {color: [],point:[]}

  // 其他8个球体，统一
  const materialObj = {
    opacity: 0.9,
    depthWrite: true,     // 深度写入
    transparent: true,    // 启用透明度
    flatShading: false,   // true为粗糙，默认为false，false保持光滑着色
    metalness: 0.8,       // 调整金属度，1为完全金属反射，0为完全非金属
    roughness: 1,         // 调整粗糙度，0为非常光滑，1为非常粗糙
  }

  Object.entries(head_fiducials_pts).forEach(item => {
    const [key, value] = item
    const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      ...materialObj,
      color: rgbArrayToHex(value.color)
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(value.point[0], value.point[1], value.point[2]); // 设置球体位置
    sphere.userData.shouldMove = true; // 应该移动
    sphere.userData.pointType = 'head_fiducials_pts'; // 点类型
    sphere.userData.pointName = key;   // 点名称
    spheresGroup.add(sphere)
    createText(key, value.point, value.color, true)
  })

  Object.entries(hpi_pts).forEach(item => {
    const [key, value] = item
    const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      ...materialObj,
      color: rgbArrayToHex(value.color)
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(value.point[0], value.point[1], value.point[2]); // 设置球体位置
    sphere.userData.shouldMove = true; // 应该移动
    spheresGroup.add(sphere)
    createText(key, value.point, value.color, true)
  })
  // mri_fiducials_pts是立方体，不应该移动（现在不展示，注释掉）
  // Object.entries(mri_fiducials_pts).forEach(item => {
  //   const [key, value] = item
  //   const geometry = new THREE.BoxGeometry(sphereRadius * 1.8, sphereRadius * 1.8, sphereRadius * 1.8);
  //   const material = new THREE.MeshStandardMaterial({
  //     ...materialObj,
  //     color: rgbArrayToHex(value.color)
  //   });
  //   const sphere = new THREE.Mesh(geometry, material);
  //   sphere.position.set(value.point[0], value.point[1], value.point[2]); // 设置球体位置
  //   sphere.userData.shouldMove = false; // 不应该移动
  //   spheresGroup.add(sphere)
  //   createText(key, value.point, value.color, false)
  // })

  // 将所有球体作为一个整体添加到场景
  scene.add(spheresGroup);

  // console.log('spheresGroup :>> ', spheresGroup);
}

// 创建文字
function createText(text: string, point: number[], color: number[], shouldMove: boolean) {
  const loader = new FontLoader();
  loader.load('/static/threejs/optimer_regular.typeface.json', function (font) {
    const geometry = new TextGeometry(text, {
      font: font,
      size: 2, // 文本大小
      depth: 1, // 文本厚度 (原来的height:0.1)

      // curveSegments: 12, // 曲线细分
      // bevelEnabled: true, // 是否开启倒角
      // bevelThickness: 2, // 倒角厚度
      // bevelSize: 0.5, // 倒角尺寸
      // bevelOffset: 0, // 倒角偏移
      // bevelSegments: 5 // 倒角细分
    }).center()
    // 应用材质并添加到场景
    var textMaterial = new THREE.MeshBasicMaterial({
      color: rgbArrayToHex(color),
    });
    const textMesh = new THREE.Mesh(geometry, textMaterial);
    textMesh.position.set(point[0], point[1] + 2, point[2] + 5); // 设置球体位置
    textMesh.userData.shouldMove = shouldMove; // 应该移动
    textMesh.userData.isText = true; // 应该移动
    spheresGroup.add(textMesh)
  });
}

// 修改所有点的位置
// mri_fiducials_pts是立方体 是不动的
function changePosition(direction: 'x' | 'y' | 'z', num: number) {
  // console.log('修改所有点的位置 :>> ', direction);

  // 为了和结构像中的3d方向一样而改的。
  if (direction === 'x') {
    num = -num
  } else if (direction === 'y') {
    direction = 'z'
    num = -num
  } else if (direction === 'z') {
    direction = 'y'
  }

  if (spheresGroup) {
    // // 获取当前球体组的位置，并沿xyz轴正方向+-1
    // const newPosition = new THREE.Vector3(
    //   spheresGroup.position.x + (direction === 'x' ? num : 0),
    //   spheresGroup.position.y + (direction === 'y' ? num : 0),
    //   spheresGroup.position.z + (direction === 'z' ? num : 0),
    // );
    // // 设置新的位置
    // spheresGroup.position.copy(newPosition);

    spheresGroup.children.forEach(sphere => {
      if (sphere.userData && sphere.userData.shouldMove) {
        // 获取当前球体组的位置，并沿xyz轴正方向+-1
        const newPosition = new THREE.Vector3(
          sphere.position.x + (direction === 'x' ? num : 0),
          sphere.position.y + (direction === 'z' ? num : 0),
          sphere.position.z + (direction === 'y' ? num : 0),
        );
        // 感觉改成这样就对了，但保存后返回的又是错的
        // sphere.position.y - (direction === 'y' ? num : 0),
        // sphere.position.z + (direction === 'z' ? num : 0),
        // 设置新的位置
        sphere.position.copy(newPosition);
      }
    });

    if (direction === 'x') {
      offsetX.value += num
    }
    if (direction === 'y') {
      offsetY.value += num
    }
    if (direction === 'z') {
      offsetZ.value += num
    }

  }
}

// 旋转所有点的位置
// mri_fiducials_pts是立方体 是不动的
function rotatePosition(direction: 'x' | 'y' | 'z', degree: number) {

  // 为了和结构像中的3d方向一样而改的。
  if (direction === 'x') {
    degree = -degree
  } else if (direction === 'y') {
    direction = 'z'
    degree = -degree
  } else if (direction === 'z') {
    direction = 'y'
  }



  if (spheresGroup) {
    // 定义旋转轴向量
    const axis = {
      'x': new THREE.Vector3(1, 0, 0),
      'y': new THREE.Vector3(0, 0, 1),
      'z': new THREE.Vector3(0, 1, 0),
    }[direction];

    // 确保axis存在
    if (!axis) return;

    // 将角度转换为弧度
    const angleInRadians = THREE.MathUtils.degToRad(degree);
    // 创建四元数用于旋转操作
    const quaternion = new THREE.Quaternion();
    // 根据方向设置旋转四元数
    quaternion.setFromAxisAngle(axis, angleInRadians);

    // 对整个球体组应用旋转
    // spheresGroup.quaternion.multiply(quaternion);


    spheresGroup.children.forEach(sphere => {
      if (sphere.userData && sphere.userData.shouldMove) {
        // 对每个符合条件的球体应用旋转
        // 首先保存当前位置到一个临时向量，以便围绕原点旋转后重新定位
        const tempPosition = sphere.position.clone().sub(spheresGroup.position); // 移动到局部坐标系
        tempPosition.applyQuaternion(quaternion); // 应用旋转
        sphere.position.copy(tempPosition.add(spheresGroup.position)); // 移回世界坐标系
      }
    });

    if (direction === 'x') {
      rotateX.value += degree
    }
    if (direction === 'y') {
      rotateY.value += degree
    }
    if (direction === 'z') {
      rotateZ.value += degree
    }

  }
}



const onWindowResize = () => {
  if (renderer) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
};

// 保存
async function onSave() {
  confirmModal(t('保存'), t('修改配准结果后需要重新发起前向任务和聚类任务，是否确认修改？'), async () => {

    // 假设spheresGroup是包含多个球体的Group实例
    const vector = new THREE.Vector3(); // 重用同一个向量以节省内存
    const headFiducialsPtsAfterPosition: any = {}; // 用于存储head_fiducials_pts之后的坐标

    spheresGroup.children.forEach(sphere => {
      if (sphere.userData && sphere.userData.pointType === 'head_fiducials_pts') {
        sphere.getWorldPosition(vector);
        // 创建当前球体坐标的一个副本，并存储到数组中
        const positionCopy = vector.clone();
        headFiducialsPtsAfterPosition[sphere.userData.pointName] = [positionCopy.x, positionCopy.y, positionCopy.z]
      }
    });


    const params = {
      coregId: props.coregId,
      offsetX: offsetX.value,
      offsetY: offsetY.value,
      offsetZ: offsetZ.value,
      rotateX: rotateX.value,
      rotateY: rotateY.value,
      rotateZ: rotateZ.value,
      headFiducialsPts: headFiducialsPtsAfterPosition, // 之后的坐标

      headFiducialsPtsOrigin: {
        LPA: head_fiducials_pts?.LPA.point,
        NAS: head_fiducials_pts?.NAS.point,
        RPA: head_fiducials_pts?.RPA.point,
      },                                               // 之前的坐标
      // mriFiducialsPts: {
      //   LPA: mri_fiducials_pts?.LPA.point,
      //   NAS: mri_fiducials_pts?.NAS.point,
      //   RPA: mri_fiducials_pts?.RPA.point,
      // }                                              // 之前的坐标
    }
    const { code, msg } = await saveManualCoregResultApi(params)
    if (code === 200) {
      message.success(msg)
      getData()
    }
  })

}

// function changePosition(direction: 'x' | 'y' | 'z', num: number) {
//   helmetRef.value.changePosition(direction, num)
// }
// function rotatePosition(direction: 'x' | 'y' | 'z', num: number) {
//   helmetRef.value.rotatePosition(direction, num)
// }



// 暴露方法
defineExpose({
  getData,
  changePosition,
  rotatePosition
})
</script>

<style lang="less" scoped>
.list {
  position: absolute;
  top: 10px;
  left: 6px;
  z-index: 999;
  color: rgba(255, 255, 255, 0.89);

  .item {
    margin-bottom: 4px;
    display: flex;

    .title {
      width: 25px;
      margin-right: 8px;
      text-align: right;
    }

    .value {
      width: 22px;
      margin: 0 4px;
      text-align: center;
    }

    .icon {
      color: rgba(255, 255, 255, 0.2);

      &:hover {
        color: rgba(255, 255, 255, 0.38);
      }
    }
  }
}
</style>