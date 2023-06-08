import React from 'react'
import CeisumMap from '../cesium-map'
import Scene from './Scene'
function Cesium() {
  return (
    <div className="relative w-full h-full">
      <Scene></Scene>
      <CeisumMap></CeisumMap>
    </div>
  )
}

export default Cesium
