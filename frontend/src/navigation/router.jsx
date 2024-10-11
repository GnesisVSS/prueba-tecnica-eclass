import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
import Login from "../pages/login/Login";
import Inicio from "../pages/inicio/Inicio";
import VistaUsuario from "../pages/vista-usuario/VistaUsuario";
  

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Login/>}/>
            <Route path="/inicio" element={<Inicio/>}/>
            <Route path="/vista-usuario" element={<VistaUsuario/>}/>
        </>
    )
)

export default router;