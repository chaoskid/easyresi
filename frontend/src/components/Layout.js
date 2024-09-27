import  Navbar  from './Navbar'
import { Outlet } from "react-router-dom"

const Layout = () => {
    <>
        <h1> HELP </h1>

        <Navbar />
        <main>
            <Outlet />
        </main>
    </>
}

export default Layout;