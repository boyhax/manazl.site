// import {
//   IonContent,
//   IonHeader,
//   IonItem,
//   IonLabel,
//   IonList,
//   IonMenu,
//   IonMenuToggle,
//   IonPage,
//   IonTitle,
// } from "@ionic/react";
// import { Outlet, useLocation } from "react-router";
// import { Link } from "react-router-dom";
// import { Button } from "src/components/ui/button";

// export function Users() {
//   const { pathname } = useLocation();
//   const routes = pathname.split("/");
//   const pagename = routes.pop();
  
//   return (
//     <IonContent>
//       <h1>Users List</h1>
//       <span>
//       <Link to="new">
//         <Button>New</Button>
//       </Link>
//       </span>
    
//     </IonContent>
//   );
// }

// export function UsersNew() {
//   const { pathname } = useLocation();
//   const routes = pathname.split("/");
//   const pagename = routes.pop();
//   return (
//     <IonContent>
//       <h1>New User</h1>
//     </IonContent>
//   );
// }
