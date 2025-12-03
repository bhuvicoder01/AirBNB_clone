import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

//side navbar for admin dashboard
function AdminDashboardNavbar() {
    const [activeTab, setActiveTab] = useState(localStorage.getItem('adminActiveTab')||'dashboard');
    const {user}=useAuth()

    function NavItem({ icon, text }) {
        const [windowSize,setWindowSize]=useState(window.innerWidth);
        window.addEventListener('resize',()=>{
            setWindowSize(window.innerWidth)
        })




    return (
     
            <Link onClick={() => localStorage.setItem('adminActiveTab',text)} >
                <i className={`fas fa-${icon} ${localStorage.getItem('adminActiveTab') === text && 'activeTab'}  text-white`}>{windowSize>768 &&<span className="p-2">{text}</span>}</i>
                
            </Link>
    
    );
}
    return (
        <div className="admin-sidenav ">
            <div className="logo-container">
                {/* <img src="/admin-logo.png" alt="Admin Logo" /> */}
                {/* <i className="fas fa-user-shield"style={{fontSize:'2rem'}}/> */}
                <img src={user?.avatar.url} alt="profile picture" className="profile-picture rounded-circle"style={{maxWidth:'40px'}} />
                <span className="fas p-2">Admin <br/>dashboard</span>
            </div>
            <nav className="container admin-nav-container">
                <ul className="admin-nav-items  gap-5">
                    <NavItem icon="dashboard" text="dashboard" link="/admin" />
                    
                    <NavItem icon="users" text="users"  />
                    <NavItem icon="shopping-cart" text="properties"/>
                    <NavItem icon="shipping-fast" text="bookings"/>
                    <NavItem icon="cog" text="settings"  />
                    
                    
                </ul>
            </nav>
        </div>
    );
}




export default AdminDashboardNavbar;