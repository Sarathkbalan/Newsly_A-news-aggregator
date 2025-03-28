import React, { useEffect, useState } from 'react'
import Customnewscard from './Customnewscard'
import Navbar from '../components/Navbar'

const Customnewsgrid = () => {
          const [Customnews,setCustomnews]=useState([])
          const [loading,setLoading]=useState(true)
          

        useEffect(()=>{
          const fetchcustomnews=async ()=>{
                    try{
            const response=await fetch("/api/getAllCustomnews")

            if(!response.ok){
                      throw new Error(`HTTP error status:${response.status}`)

            }
            const data=await response.json()
            setCustomnews(data) 
            setLoading(false)

                    }catch(err){

                              console.log(err);
                              

                    }

          }
       fetchcustomnews()
        },[])
        
  return (
          <>
          <Navbar/>
          <div className=" mt-[100px] ml-[30px] grid sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3  gap-[40px] mb-[50px]">
          {loading ? (
            <p>Loading...</p>
          ) : (
            Customnews.map((item) => (
              <Customnewscard key={item.title} item={item} />
            ))
          )}
        </div>
        </>
  )
}

export default Customnewsgrid