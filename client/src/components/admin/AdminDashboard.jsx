import { use, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../common/Card";
import AdminDashboardNavbar from "./AdminDashboardNavbar";
import AdminSettings from "./AdminSettings";
import AdminListings from "./AdminListings";
import AdminDashboardQuickDetails from "./AdminDashboardQuickDetails";
import AdminBookings from "./AdminBookings";
import AdminUsers from "./AdminUsers";

const AdminDashboard = () => {
    const {user}=useAuth()
    if(!localStorage.getItem("adminActiveTab")){
        localStorage.setItem("adminActiveTab","dashboard")
}
   const activeTab=(localStorage.getItem("adminActiveTab")||'dashboard')
 
    return (
       <>
       <div className="d-flex admin-dashboard column">
        
     <AdminDashboardNavbar/>
     <div className='container-fluid admin-main 'style={{backgroundColor:'rgba(95, 95, 95, 0.63)',background:'transparent',border:'1px solid black',borderRadius:'10px'}}>
        <h1 className='text-center fas bi-person-circle p-2  '>Welcome admin</h1>
    <div className='container row row-cols-1 row-cols-sm-12 p-2 overflow-auto ' style={{height:'90%'}}>
  {/*main content with listings */}
  {activeTab=="dashboard"&& <AdminDashboardQuickDetails/>}
   {activeTab=="users"&& <AdminUsers/>}
   {activeTab=="properties"&&<AdminListings/>}  
   {activeTab=="bookings"&&<AdminBookings/>}
   {activeTab=="settings"&&<AdminSettings/>}



</div>
</div>

</div>
       
       </>
    );
}

export default AdminDashboard;