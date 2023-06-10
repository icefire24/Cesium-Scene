import CeisumMap from '@/views/cesium-map'
import {createBrowserRouter,RouteObject} from 'react-router-dom'
import TheHome from '../views/Home'
import CesiumMap from '@/views/cesium/index'
const routes: RouteObject[] = [
    {
        path: '/',
        element: <CeisumMap />
    }
]
export default createBrowserRouter(routes)