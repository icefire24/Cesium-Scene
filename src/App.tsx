import './App.css'
import { RouterProvider } from 'react-router-dom'
import routers from './router'
import React from 'react'
function App(){
  return (
    <RouterProvider router={routers}></RouterProvider>
  )
}

export default App
