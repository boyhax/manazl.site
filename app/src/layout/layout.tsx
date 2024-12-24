import { Outlet } from "react-router";
import TabBar from "./TabBar";
import { useAppDirection } from "../hooks/useAppDirection";
import SetupWrapper from "../wrappers/setupWrapper";
import Nav from "./nav";

const Layout = () => {
  const dir = useAppDirection();

  return (
    <SetupWrapper>
      <div
        dir={dir}
        className={"h-[100vh] overflow-auto bg-background text-foreground "}
      >
        <Outlet />
        <TabBar />
      </div>
    </SetupWrapper>
  );
};

export default Layout;
