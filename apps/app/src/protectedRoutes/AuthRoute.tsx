import { Outlet } from "react-router-dom";
import LoginPage from "src/pages/auth/loginPage";
import { auth } from "src/state/auth";
import ProtectedRoute from "../components/protectedRoute";
import { IonContent, IonProgressBar } from "@ionic/react";

const AuthRoute = ({ children }: any) => {
  const { user, loading } = auth();
  if (loading) {
    return (
      <IonContent>
        <IonProgressBar type={"indeterminate"} />
      </IonContent>
    );
  }
  if (!user) {
    return <LoginPage />;
  }

  return children || <Outlet />;
};
export default AuthRoute;
