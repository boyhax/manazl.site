import React from "react";
import { CiMonitor, CiWifiOn } from "react-icons/ci";
import { FaKitchenSet } from "react-icons/fa6";

import { FaSwimmingPool } from "react-icons/fa";
import { CgGym } from "react-icons/cg";
import { RiParkingFill } from "react-icons/ri";
import { TbAirConditioning } from "react-icons/tb";

import { MdIron } from "react-icons/md";

 const  amenities=[
   
    {name:'Pool',value:'pool'},
    {name:'Wifi',value:'wifi'},
    {name:'TV',value:'tv'},
    {name:'Kitchen',value:'kitchen'},
    {name:'Iron',value:'iron'},
    {name:'Parking',value:'parking'},
    {name:'AC',value:'ac'}
 ]
 const icons= {
    pool:"hugeicons:pool",
    wifi:"iconoir:wifi"    ,
    tv:"solar:tv-line-duotone"  ,
    kitchen:"mdi:kitchen-counter-outline"  ,
    parking:"hugeicons:parking-area-square" ,
    ac:"material-symbols-light:ac-unit"    ,
    food:"mdi:food-outline",
    iron:"material-symbols-light:iron-outline"
 }
 export function AmentiesIcon(name:string){
   
 return icons[name]
}

 export default amenities