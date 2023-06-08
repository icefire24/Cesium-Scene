import * as Cesium from 'cesium'
interface url {
  url: string
}
/**
 * @description:加载3dtiles
 * @param {cesium.Viewer} viewer
 * @param {Object} option 参数
 * @return {Promise<cesium.Cesium3DTileset>}
*/
const load3DTiles = (viewer: Cesium.Viewer, option: Cesium.Cesium3DTileset.ConstructorOptions & url):Promise<Cesium.Cesium3DTileset> => {
  return new Promise((resolve, reject) => {
    const tileset = new Cesium.Cesium3DTileset(option)
    viewer.scene.primitives.add(tileset)
    resolve(tileset)
  })
}
/**
 * @description:加载gltf
 * @param {cesium.Viewer} viewer
 * @param {Object} option 参数
 * @return {Promise<cesium.Model>}
*/
const loadGltf = (viewer: Cesium.Viewer, option:any):Promise<Cesium.Model> => {
  return new Promise((resolve, reject) => {
    const model = viewer.scene.primitives.add(Cesium.Model.fromGltf(option as any))
    resolve(model)
  })
}

/**
 * @description:初始化cesium
 * @param {cesium.Viewer} viewer
 * @param {HTMLDivElement} container
 */
function initCesium(viewer: null | Cesium.Viewer, container: string | HTMLDivElement) {
  viewer = new Cesium.Viewer(container, {
    homeButton: false, //是否显示主页按钮
    sceneModePicker: false, //是否显示场景按钮
    baseLayerPicker: false, //是否显示图层选择控件
    navigationHelpButton: false, //导航帮助按钮
    selectionIndicator: false, //鼠标选择指示器
    infoBox: false, //信息提示框
    animation: false, //是否创建动画小器件，左下角仪表
    timeline: false, //是否显示时间线控件
    geocoder: false, //是否显示地名查找控件
    fullscreenButton: false, //是否全屏按钮
    shouldAnimate: false,
    
    // terrainProvider: Cesium.createWorldTerrain()//加载cesium资源地形
  })
  //@ts-ignore
  viewer.cesiumWidget.creditContainer.style.display = 'none' //去除版权信息
  return viewer
}
/*
 * @description:下雨效果
 * @param {cesium.Viewer} viewer
 * @param {Object} options 参数
 */
interface RainEffectOptions {
  tiltAngle?: number
  rainSize?: number
  rainSpeed?: number
}
class RainEffect {
  tiltAngle: number
  rainSize: number
  rainSpeed: number
  viewer: Cesium.Viewer
  rainStage: null | Cesium.PostProcessStage
  isShow: boolean
  constructor(viewer: Cesium.Viewer, options: RainEffectOptions) {
    if (!viewer) throw new Error('no viewer object!')
    options = options || {}
    //倾斜角度，负数向右，正数向左
    this.tiltAngle = Cesium.defaultValue(options.tiltAngle, -0.6)
    this.rainSize = Cesium.defaultValue(options.rainSize, 0.3)
    this.rainSpeed = Cesium.defaultValue(options.rainSpeed, 60.0)
    this.viewer = viewer
    this.rainStage = null
    this.isShow = true
    this.init()
  }

  init() {
    this.rainStage = new Cesium.PostProcessStage({
      name: 'czm_rain',
      fragmentShader: this.rain(),
      uniforms: {
        tiltAngle: () => {
          return this.tiltAngle
        },
        rainSize: () => {
          return this.rainSize
        },
        rainSpeed: () => {
          return this.rainSpeed
        },
      },
    })
    this.viewer.scene.postProcessStages.add(this.rainStage)
  }

  destroy() {
    if (!this.viewer || !this.rainStage) return
    this.viewer.scene.postProcessStages.remove(this.rainStage)
    this.rainStage.destroy()
    // delete this.tiltAngle;
    // delete this.rainSize;
    // delete this.rainSpeed;
  }

  show(visible: boolean) {
    if (!this.rainStage) return
    this.rainStage.enabled = visible
    this.isShow = visible
  }

  rain() {
    return 'uniform sampler2D colorTexture;\n\
        in vec2 v_textureCoordinates;\n\
      \n\
        float hash(float x){\n\
          return fract(sin(x*133.3)*13.13);\n\
      }\n\
      \n\
      out vec4 vFragColor;\n\
        \n\
      void main(void){\n\
      \n\
        float time = czm_frameNumber / 60.0;\n\
      vec2 resolution = czm_viewport.zw;\n\
      \n\
      vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
      vec3 c=vec3(.6,.7,.8);\n\
      \n\
      float a=-.4;\n\
      float si=sin(a),co=cos(a);\n\
      uv*=mat2(co,-si,si,co);\n\
      uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
      \n\
      float v=1.-sin(hash(floor(uv.x*100.))*100.);\n\
      float b=clamp(abs(sin(15.*time*v+uv.y*(10./(2.+v))))-.95,0.,1.)*4.;\n\
      c*=v*b; \n\
      \n\
      vFragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
      }\n\
    '
  }
}
interface SnowEffectOptions {
  snowSize?: number
  snowSpeed?: number
}
/**
 * @description:下雪效果
 * @param {cesium.Viewer} viewer
 * @param {Object} options 参数
 *
 */
class SnowEffect {
  snowSize: number
  snowSpeed: number
  viewer: Cesium.Viewer
  snowStage: null | Cesium.PostProcessStage
  isShow: boolean
  constructor(viewer: Cesium.Viewer, options: SnowEffectOptions) {
    if (!viewer) throw new Error('no viewer object!')
    options = options || {}
    //倾斜角度，负数向右，正数向左
    this.snowSize = Cesium.defaultValue(0.02, options.snowSize)
    this.snowSpeed = Cesium.defaultValue(60.0, options.snowSpeed)
    this.viewer = viewer
    this.snowStage = null
    this.isShow = true
    this.init()
  }

  init() {
    this.snowStage = new Cesium.PostProcessStage({
      name: 'czm_snow',
      fragmentShader: this.snow(),
      uniforms: {
        snowSize: () => {
          return this.snowSize
        },
        snowSpeed: () => {
          return this.snowSpeed
        },
      },
    })
    this.viewer.scene.postProcessStages.add(this.snowStage)
  }

  destroy() {
    if (!this.viewer || !this.snowStage) return
    this.viewer.scene.postProcessStages.remove(this.snowStage)
    this.snowStage.destroy()
    // delete this.tiltAngle;
    // delete this.rainSize;
    // delete this.rainSpeed;
  }

  show(visible: boolean) {
    if (!this.snowStage) return
    this.snowStage.enabled = visible
    this.isShow = visible
  }

  snow() {
    return 'uniform sampler2D colorTexture;\n\
        in vec2 v_textureCoordinates;\n\
        uniform float snowSpeed;\n\
                uniform float snowSize;\n\
        float snow(vec2 uv,float scale)\n\
        {\n\
            float time=czm_frameNumber/snowSpeed;\n\
            float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;\n\
            uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;\n\
            uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;\n\
            p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);\n\
            k=smoothstep(0.,k,sin(f.x+f.y)*snowSize);\n\
            return k*w;\n\
        }\n\
        out vec4 vFragColor;\n\
        void main(void){\n\
            vec2 resolution=czm_viewport.zw;\n\
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
            vec3 finalColor=vec3(0);\n\
            //float c=smoothstep(1.,0.3,clamp(uv.y*.3+.8,0.,.75));\n\
            float c=0.;\n\
            c+=snow(uv,30.)*.0;\n\
            c+=snow(uv,20.)*.0;\n\
            c+=snow(uv,15.)*.0;\n\
            c+=snow(uv,10.);\n\
            c+=snow(uv,8.);\n\
            c+=snow(uv,6.);\n\
            c+=snow(uv,5.);\n\
            finalColor=(vec3(c));\n\
            vFragColor=mix(texture(colorTexture,v_textureCoordinates),vec4(finalColor,1),.5);\n\
            }\n\
            '
  }
}
export { RainEffect, SnowEffect, initCesium,load3DTiles,loadGltf }
