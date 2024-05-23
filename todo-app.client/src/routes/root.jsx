import { Outlet } from "react-router-dom";


let Root = () => {
    return (
        <div className="container-fluid bg-light vh-100 p-0">
            <nav className="navbar bg-info-subtle vw-100 mb-5 text-center">
                <div className="container-fluid">
                    <p className="navbar-brand text-info-emphasis fs-1 ms-5 p-0">TODO App</p>
                </div>
            </nav>
            <div className="container-fluid">    
                <div className="row justify-content-center">
                <div className="col col-6">
                    <Outlet/>
                </div>
            </div>                
            </div>
            
        </div>
    )
}


export default Root;