export function getAcendingString(arry:string[]){
    let s ='';
     arry.sort((one:string, two:string) => (one > two ? -1 : 1)).forEach((v)=>{
      s+=v
    });
    return s
  }