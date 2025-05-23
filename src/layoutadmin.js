import { useState } from 'react'
import Adminsidenav from "./orphanagestats/adminsidenav";
import { Outlet } from "react-router-dom";
import Admintopbar from "./orphanagestats/Admintopbar";

const Layoutadmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const drawerWidth = 240;
    const collapsedWidth=56;

    return (
        <div >
            <Adminsidenav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div style={{ marginLeft:  `${isSidebarOpen ? drawerWidth : collapsedWidth}px`, width: `calc(100% - ${isSidebarOpen ? drawerWidth : collapsedWidth}px)`, transition: "margin-left 0.3s ease, width 0.3s ease" }}>
                <Admintopbar isSidebarOpen={isSidebarOpen} />
                <div style={{ marginTop: 20, padding: 20 }}>
                    <Outlet />
                </div>
            </div>
            </div>
    )
}

export default Layoutadmin;