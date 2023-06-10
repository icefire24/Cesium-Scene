//@ts-nocheck
import { SnowEffect, initCesium, RainEffect, loadGltf, transformControl } from '@/util/cesiumUtil'
import * as Cesium from 'cesium'
import React, { useEffect } from 'react';
const CeisumMap = (): React.FC => {
    //ceisum token
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDFlYzljOC04YTQwLTQwZjUtOTY4My0yZDI5MjNiMzFjMDYiLCJpZCI6ODUxMDAsImlhdCI6MTY4NjA1ODI3M30.ZhBOypwDMw_O5U1ohT6Ch9NcK7p90E_XFAcfGihTwlM'
    let viewer: Cesium.Viewer | null = null;
    let uavmodel: Cesium.Model | null = null;
    let transformControl2: transformControl;
    const tranlatex = (x) => {
        let modelMatrix = uavmodel.modelMatrix;
        let translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-x, 0, 0));
        
        transformControl2.translateSelf(translation)
        return
        let newModelMatrix = Cesium.Matrix4.multiply(modelMatrix, translation, new Cesium.Matrix4());
        uavmodel.modelMatrix = newModelMatrix;
    }
    const location = () => {
        // viewer.camera.lookAt(
        //     uavmodel.boundingSphere.center,
        //     new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-20), 500)
        // )
        transformControl2.show(false)
        
    }
    useEffect(() => {

        viewer = initCesium(viewer, 'cesiumContainer');
        window.viewer = viewer;
        let uav = loadGltf(viewer, {
            url: 'man.glb',
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.39, 39.9, 0)),
            id: 'uav',
            scale: 1
        })    
        uav.then((model) => {
            uavmodel = model;
            let center = model.boundingSphere.center;
            let radius = model.boundingSphere.radius;
            let heading = Cesium.Math.toRadians(-30);
            let pitch = Cesium.Math.toRadians(-30);
            let range = radius * 5
            let hpr = new Cesium.HeadingPitchRange(heading, pitch, range);
            viewer.scene.camera.lookAt(center, hpr);
            transformControl2= new transformControl(model, viewer, center, radius);
        })


        return () => {
            viewer?.destroy();
            // viewer = null;
            // window.viewer = null;
        }
    }, []);
    return (<div id='cesiumContainer' className='w-full h-full'>
        <div className='absolute left-0 top-0 z-10'>
            <button onClick={() => {
                tranlatex(5)
            }}>移动</button>
            <button onClick={() => {
                location()
            }}>定位</button>
        </div>
    </div>);
}

export default CeisumMap;