import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function toggleValueInArray(value:any,array:any|any[]){
  if(Array.isArray( array)){
    if(array.includes(value)){
      return array.filter(v=>!value)
    }else return [...array,value]
  }else{
    if(value==array){
      return null
    }else return value
  }
}