import { use, useEffect, useState } from 'react'
import React from 'react'
import Loading from '../common/Loading'
import { userAPI } from '../../services/api'
import Input from '../common/Input'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState({ name: 'asc', email: 'asc', role: 'asc' })
  const[filteredUsers,setFilteredUsers]=useState(users)
 

  const fetchUsers=async()=>{
    try {
      const response=await userAPI.getAllUsers()
      setUsers(response.data.users)
      setFilteredUsers(response.data.users)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const sortBy = (field) => {
    const order = sortOrder[field] === 'asc' ? 'desc' : 'asc'
    const sorted = [...users].sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1
      }
      return a[field] < b[field] ? 1 : -1
    })
    setUsers(sorted)
    setFilteredUsers(sorted)
    setSortOrder({ ...sortOrder, [field]: order })
  }

 
  const filterBy=(e)=>{
    const value=e.target.value
    const filtered=users.filter(user=>user.firstName.toLowerCase().includes(value.toLowerCase())||user.email.toLowerCase().includes(value.toLowerCase())||user.role.toLowerCase().includes(value.toLowerCase()))
    setFilteredUsers(filtered)
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  if(loading){
    return <Loading text='Loading users'/>
  }
  return (
    <>
    <div className="container mt-5 ">
      <h2 className="mb-2">Users</h2>
      <Input type='text' label='Search' placeholder='Search by name/email/role' onChange={filterBy}  />
      <table className="table custom-table table-striped">
        <thead>
          <tr>
            <th onClick={() => sortBy('name')} style={{cursor: 'pointer'}}>Name <i className="bi bi-sort-alpha-down"></i></th>
            <th onClick={() => sortBy('email')} style={{cursor: 'pointer'}}>Email <i className="bi bi-sort-alpha-down"></i></th>
            <th onClick={() => sortBy('role')} style={{cursor: 'pointer'}}>Role <i className="bi bi-sort-alpha-down"></i></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.firstName}{" "}{user.lastName}</td>
              <td>{user.email}</td>
              <td>{<>
              <select className="form-select" value={user.role} onChange={async(e)=>{await userAPI.updateUser(user._id,{role:e.target.value})
              fetchUsers()
              }}>
                <option value="user">User</option>
                <option value="host">Host</option>
                <option value="admin">Admin</option>
              </select>
               
              </>
              }</td>
              <td>
                <button className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    </>
  )
}

export default AdminUsers