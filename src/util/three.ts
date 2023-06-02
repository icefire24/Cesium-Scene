import * as THREE from 'three' //导入three.js核心库
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' //导入轨道控制器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' //导入GLTF模型加载器
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader' //导入GLTF模型加载器
function addSky(scene:THREE.Scene) {
    scene.background = new THREE.CubeTextureLoader().setPath('assets/sky/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']) 
}
class Motro3d {
  container: HTMLElement | null
  // @ts-ignore
  scene: THREE.Scene
  // @ts-ignore
  camera: THREE.PerspectiveCamera
  // @ts-ignore
  renderer: THREE.WebGLRenderer
  // @ts-ignore
  objLoader: OBJLoader
  constructor(selector: string) {
    this.container = document.querySelector(selector)
    this.init()
  }

  init() {
    this.initScene()
    // this.initAxis()
    this.initCamera()
    this.initLight()
    this.initRender()
    this.initControls()
    this.initOBJLoader()
    this.render()
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  initOBJLoader() {
    const loader = new OBJLoader()
    this.objLoader = loader
  }
  initScene() {
    this.scene = new THREE.Scene()
  }
  initAxis() {
    const axesHelper = new THREE.AxesHelper(1000)
    this.scene?.add(axesHelper)
  }
  initCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(100, 100, 100)
    camera.lookAt(0, 0, 300)
    this.scene?.add(camera)
    this.camera = camera
  }
  initLight() {
    const hesLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hesLight.intensity = 0.6
    this.scene?.add(hesLight)
    const dirLight = new THREE.DirectionalLight()
    dirLight.position.set(5, 5, 5)
    this.scene?.add(dirLight)
  }
  initControls() {
    const controls = new OrbitControls(this.camera , this.renderer.domElement)
    // controls.update()
  }
  initRender() {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    this.container?.appendChild(renderer.domElement)
    this.renderer = renderer
  }
  render() {
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }
  loadObj(url: string) {
    this.objLoader.load(url, (obj) => {
      this.scene.add(obj)
    })
  }
}
export default Motro3d
export {addSky}