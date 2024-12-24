import { Network,ConnectionStatus } from "@capacitor/network";
import { create } from 'zustand'


export const useNetworkStore = create((set)=>({
  connected:true,
  connectionType: "wifi",
  
})) 

useNetworkStore.subscribe((state)=>{
console.log('state online :>> ', state);
})
const updateNetworkStatus = (status: ConnectionStatus) => {
  useNetworkStore.setState(status);
};
Network.getStatus().then((s)=>{
  updateNetworkStatus(s)
})

  
Network.addListener("networkStatusChange",(s)=> updateNetworkStatus(s));
  
