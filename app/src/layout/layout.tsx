import { Outlet } from "react-router";
import TabBar from "./TabBar";
import { useAppDirection } from "../hooks/useAppDirection";
import SetupWrapper from "../wrappers/setupWrapper";
import Nav from "./nav";
import NavigationFAB from "src/components/landing/navigationFAB";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const dir = useAppDirection();
    const { pathname } = useLocation();
  const path = pathname.split("/")[1] || "/";
  const nav = path!=="chat"
  return (
    <SetupWrapper>
      <div
        dir={dir}
        className={"h-[100vh] overflow-auto bg-background text-foreground "}
      >
        <Outlet />
        {!nav ?null:<NavigationFAB />}
        {/* <TabBar /> */}
      </div>
    </SetupWrapper>
  );
};

export default Layout;
