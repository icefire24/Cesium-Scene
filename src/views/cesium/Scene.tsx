import { RainEffect, SnowEffect } from '@/util/cesiumUtil'
import { Button } from 'antd'
function Scene() {
 let snow, rain
 const initSnow=() => {
    rain&&rain.show(false)
    snow?snow.show(true):snow=new SnowEffect(window.viewer)
 } 
 const initRain=() => {
    snow&&snow.show(false)
    rain?rain.show(true):rain=new RainEffect(window.viewer)
 }
  return (
    <div className="absolute z-10 left-0 top-0 w50 h50 bg-green-200">
      <Button type="primary" onClick={() => {
        initSnow()
      }}>snow</Button>
      <Button type="primary" onClick={() => {
        initRain()
      }}>rain</Button>
    </div>
  )
}

export default Scene
