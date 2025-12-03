import React from 'react'
import PropertyGrid from '../property/PropertyGrid'
import { useProperty } from '../../contexts/PropertyContext'

function AdminListings() {
    const {properties}=useProperty()
  return (

    
       
        <PropertyGrid properties={properties.slice(0, 12)} />
    
   
  )
}

export default AdminListings