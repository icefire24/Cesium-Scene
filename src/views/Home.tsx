import { useEffect } from "react";
import Motro3d from "./three";

function Home() {
    function loadObj(modelName:string) {
        
    }
    useEffect(() => {
        const moto=new Motro3d('#scene')        
        moto.loadObj('ship.obj')
    }, []);
  return (
    <div id="scene" className="w-full h-full relative">
    </div>
  )
}

export default Home
