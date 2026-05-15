<template>
  <div class="page">
    <div ref="canvasContainer" style="width: 100%; height: 100%; cursor: move;"></div>
  </div>

</template>

<script lang="ts" setup>
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { html } from './html.js'
import { helmet_color } from './color2.js'

// 头盔数据
const helmet_vertices = html.helmet_vertices
const helmet_faces = html.helmet_faces
const helmet_scalars = html.helmet_scalars

// 等高线数据
const contour_vertices = html.contour_vertices
const contour_faces = html.contour_faces
const contour_scalars = html.contour_scalars

// console.log('helmet_vertices :>> ', helmet_vertices.length);
// console.log('helmet_faces :>> ', helmet_faces.length);
// console.log('helmet_scalars :>> ', helmet_scalars.length);

// console.log('contour_vertices :>> ', contour_vertices.length);
// console.log('contour_faces :>> ', contour_faces.length);
// console.log('contour_scalars :>> ', contour_scalars.length);

const canvasContainer = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let textMesh: any;


const width = window.innerWidth * 1;
const height = window.innerHeight * 1;


onMounted(() => {
  init();
  window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
  renderer.dispose();
  canvasContainer.value.removeChild(renderer.domElement);
  scene = null;
  camera = null;
  renderer = null;
});

const init = () => {

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f3f5);

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // 设置相机位置
  camera.position.z = 50;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // 初始化渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 添加到 DOM
  canvasContainer.value?.appendChild(renderer.domElement);

  // 设置背景色为白色
  renderer.setClearColor(0xf1f3f5, 1); // 第一个参数是颜色（十六进制），第二个参数是透明度（范围从0到1）

  // 创建几何体、材质、网格等...
  // 添加光照、环境、背景等...

  createCube()   // 正方形
  // createPlane() // 一个面
  // createLine()  // 线段
  createText()  // 文字
  // createPoints()   // 点
  createSpheres() // 球体

  createHelmet() // 创建头盔
  createContourGeometry() // 创建等高线数据






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

  // 点光源，像灯泡
  // const pointLight = new THREE.PointLight( 0xffffff, 4.5, 0, 0 );
  // pointLight.position.set( 0, 0, 20 );
  // scene.add( pointLight );

  // const pointLight2 = new THREE.PointLight( 0xffffff, 4.5, 0, 0 );
  // pointLight2.position.set( 0, 0, -20 );
  // scene.add( pointLight2 );

  // 设置相机位置
  // camera.position.set(100, 0, 100);
  camera.lookAt(0, 0, 0);
  // camera.lookAt(scene.position);



  // 使用 OrbitControls 实现拖动旋转
  controls = new OrbitControls(camera, canvasContainer.value);
  controls.enableDamping = true; // 启用阻尼效果
  controls.dampingFactor = 0.1; // 设置阻尼系数，越小越平滑
  controls.screenSpacePanning = false; // 禁止屏幕空间平移
  controls.minDistance = 2; // 最小缩放距离
  controls.maxDistance = 30; // 最大缩放距离



  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update(); // 更新 OrbitControls
    textMesh.lookAt(camera.position); // 文字一直面向相机位置
    renderer.render(scene, camera);
  };
  animate();

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

  // // 底色
  // const materialBg = new THREE.MeshBasicMaterial({
  //   color: 0xc1c3c5,
  //   opacity: 1,
  //   depthWrite: true,       // 深度写入
  //   transparent: false,     // 启用透明度
  //   side: THREE.DoubleSide, // 设置双面渲染
  // });
  // const meshBg = new THREE.Mesh(geometry, materialBg);
  // scene.add(meshBg);


  const material = new THREE.MeshBasicMaterial({
    opacity: 0.8,
    depthWrite: true,       // 深度写入
    transparent: true,      // 启用透明度
    vertexColors: true,     // 开启顶点颜色
    side: THREE.DoubleSide, // 设置双面渲染
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  // // 头盔三角形的线，不展示
  // const materialLine = new THREE.LineBasicMaterial({
  //   color: 0x00ff00,
  // });
  // const line = new THREE.LineSegments(geometry, materialLine);
  // scene.add(line);

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
  const line = new THREE.LineSegments(geometry, materialLine);
  scene.add(line);

}

// 创建球体
function createSpheres() {
  const numSpheres = 10
  const sphereRadius = 0.5
  const minPosition = -5
  const maxPosition = 5

  const spheresGroup = new THREE.Group();

  for (let i = 0; i < numSpheres; i++) {
    // 随机生成球体的位置
    const xPos = (Math.random() * (maxPosition - minPosition)) + minPosition;
    const yPos = (Math.random() * (maxPosition - minPosition)) + minPosition;
    const zPos = (Math.random() * (maxPosition - minPosition)) + minPosition;
    // 随机生成球体的颜色
    // const color = new THREE.Color(1, 0, 0);
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    // 创建球体几何体
    const geometry = new THREE.SphereGeometry(sphereRadius, 16, 16); // 半径，纬线细分，经线细分
    // 创建材质，使用颜色 MeshBasicMaterial/MeshStandardMaterial/MeshPhongMaterial
    const material = new THREE.MeshStandardMaterial({ color });
    // // 如果要在非物理渲染器下获得较好效果，可以开启以下设置：
    material.flatShading = false; // 默认为false，保持光滑着色
    material.metalness = 0.5; // 调整金属度，1为完全金属反射，0为完全非金属
    material.roughness = 1; // 调整粗糙度，0为非常光滑，1为非常粗糙
    // 创建球体Mesh
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(xPos, yPos, zPos); // 设置球体位置
    // 添加到组
    spheresGroup.add(sphere);
  }
  // 将所有球体作为一个整体添加到场景
  scene.add(spheresGroup);
}

// 创建点
function createPoints() {
  // 示例点坐标和颜色数据
  const numPoints = 100;
  const pointsPositions = new Float32Array(numPoints * 3);
  const pointColors = new Float32Array(numPoints * 3);

  for (let i = 0; i < numPoints; i++) {
    // 随机生成点的坐标
    pointsPositions[i * 3] = (Math.random() - 0.5) * 10;
    pointsPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pointsPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // 随机生成点的颜色
    pointColors[i * 3] = Math.random(); // r
    pointColors[i * 3 + 1] = Math.random(); // g
    pointColors[i * 3 + 2] = Math.random(); // b
  }

  // 创建BufferGeometry并设置顶点和颜色数据
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

  // 创建材质（只有绿色）
  const material = new THREE.PointsMaterial({
    color: 0x00ff00,
    opacity: 0.5,
    transparent: true, // 启用透明度
    vertexColors: true, // 开启顶点颜色
    side: THREE.DoubleSide, // 设置双面渲染
    size: 0.2, // 点的大小
  });
  // 创建Points对象
  const points = new THREE.Points(geometry, material);

  // 添加到场景
  scene.add(points);

}
// 创建立方体
function createCube() {

  // 创建几何体
  const geometry = new THREE.BoxGeometry(2, 2, 2); // x宽,y高,z深
  // 创建材质（只有绿色）
  const material = new THREE.MeshStandardMaterial({
    opacity: 0.8,
    depthWrite: true,       // 深度写入
    transparent: true,      // 启用透明度
    flatShading: true, // true为粗糙，默认为false，false保持光滑着色
    metalness: 0.8, // 调整金属度，1为完全金属反射，0为完全非金属
    roughness: 1, // 调整粗糙度，0为非常光滑，1为非常粗糙
    // 0.6+1 是一个黄色的头，效果还好；0.8+1 黄色更深的头；1+1是黄偏灰的头
    color: 0x00ff00
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 定义六种不同的颜色，每个颜色包含透明度（alpha）
  const colors = [
    new THREE.Color(0xff0000), // 红色
    new THREE.Color(0x00ff00), // 绿色
    new THREE.Color(0x0000ff), // 蓝色
    new THREE.Color(0xffff00), // 黄色
    new THREE.Color(0xff00ff), // 紫色
    new THREE.Color(0x00ffff), // 青色
  ];
  // 创建几何体
  const geometry2 = new THREE.BoxGeometry(2, 2, 2); // x宽,y高,z深
  // 创建多材质
  const materials = [];
  for (let i = 0; i < 6; i++) {
    const material = new THREE.MeshStandardMaterial({
      opacity: 0.8,
      transparent: true,
      color: colors[i],
    });
    materials.push(material);
  }
  // 创建立方体网格模型，使用多材质
  const cube2 = new THREE.Mesh(geometry2, materials);
  cube2.position.set(3, 3, 3); // 设置球体位置
  scene.add(cube2);
}

// 创建面
function createPlane() {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -1.0, -1.0, 1.0, // v0
    1.0, -1.0, 1.0, // v1
    1.0, 1.0, 1.0, // v2
    -1.0, 1.0, 1.0, // v3
  ]);
  const indices = [
    0, 1, 2,
    2, 3, 0,
  ];
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

// 创建线
function createLine() {
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

// 创建文字
function createText() {
  const loader = new FontLoader();
  loader.load('/static/threejs/optimer_regular.typeface.json', function (font) {
    const geometry = new TextGeometry('Hello, Three.js!', {
      font: font,
      size: 0.5, // 文本大小
      height: 0.1, // 文本厚度
      // curveSegments: 12, // 曲线细分
      // bevelEnabled: true, // 是否开启倒角
      // bevelThickness: 2, // 倒角厚度
      // bevelSize: 0.5, // 倒角尺寸
      // bevelOffset: 0, // 倒角偏移
      // bevelSegments: 5 // 倒角细分
    }).center()
    //
    // 应用材质并添加到场景
    var textMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    textMesh = new THREE.Mesh(geometry, textMaterial);
    textMesh.position.set(0, 0, 3); // 设置球体位置
    scene.add(textMesh);
  });
}


const onWindowResize = () => {
  if (renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};



</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100vh;
}
</style>