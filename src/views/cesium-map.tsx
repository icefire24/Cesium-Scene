import {SnowEffect,initCesium, RainEffect} from '@/util/cesiumUtil'
import * as Cesium from 'cesium'
import React, { useEffect } from 'react';
function CeisumMap():React.FC<any> {
    //ceisum token
    Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMDFlYzljOC04YTQwLTQwZjUtOTY4My0yZDI5MjNiMzFjMDYiLCJpZCI6ODUxMDAsImlhdCI6MTY4NjA1ODI3M30.ZhBOypwDMw_O5U1ohT6Ch9NcK7p90E_XFAcfGihTwlM'
    let viewer;
    useEffect(() => {
        viewer=initCesium(viewer, 'cesiumContainer'); 
        window.viewer=viewer;
        return () => {
         viewer?.destroy();
            viewer = null;
            window.viewer=null;
        }
    }, []);
    return ( <div id='cesiumContainer' className='w-full h-full'></div> );
}

export default CeisumMap;