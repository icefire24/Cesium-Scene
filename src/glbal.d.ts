import {Viewer} from 'cesium'
declare global{
    interface Window{
        viewer:Viewer|null
    }
}