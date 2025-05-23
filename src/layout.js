import Sidenav from "./Home/sidenav";
import PrimarySearchAppBar from "./Home/topbar";
import { Outlet } from "react-router-dom";


function Layout (){
    return (
        <div>
            <Sidenav />
            <PrimarySearchAppBar />
            <Outlet />
            
            </div>
    )
}

export default Layout;