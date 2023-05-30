import {createBrowserRouter,RouteObject} from 'react-router-dom'
import TheHome from '../views/Home'
const routes: RouteObject[] = [
    {
        path: '/',
        element: <TheHome />

    },
    
]
export default createBrowserRouter(routes)