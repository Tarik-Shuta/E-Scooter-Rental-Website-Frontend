import Navbar from "./Navbar.tsx";
import { Outlet } from "react-router-dom";

function Layout()
{
    return (
        <>

        <Navbar/>
    <main className="pt-19">
        <Outlet />
    </main>
        </>
    )
}
export default Layout