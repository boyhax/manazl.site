import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Home, MessageCircle, User, LogIn, Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";
import { useAppDirection } from "../hooks/useAppDirection";
import SetupWrapper from "../wrappers/setupWrapper";
import useAuth from "src/hooks/useAuth";

const FilterContent = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Price range</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min price"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <input
            type="number"
            placeholder="Max price"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Property type</h3>
        <div className="grid grid-cols-2 gap-2">
          {["House", "Apartment", "Villa", "Studio"].map((type) => (
            <button
              key={type}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Bedrooms</h3>
        <div className="flex gap-2">
          {["Any", "1", "2", "3", "4+"].map((num) => (
            <button
              key={num}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Amenities</h3>
        <div className="grid grid-cols-2 gap-2">
          {["WiFi", "Parking", "Pool", "Gym"].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-rose-500 rounded" />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Clear all
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
        >
          Show results
        </button>
      </div>
    </div>
  );
};

const MobileBottomNav = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const navItems = [
    { icon: Search, label: "Explore", path: "/" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: user ? User : LogIn, label: user ? "Profile" : "Log in", path: user ? "/account" : "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isActive ? "text-rose-500" : "text-gray-500"
                }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const MobileHeader = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname.startsWith("/chat")) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/" className="text-gray-600">
            <Home size={24} />
          </Link>
          <h1 className="text-lg font-semibold">Messages</h1>
          <div className="w-6" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-rose-500 text-2xl font-bold">manazl</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Menu</h2>
                </div>
                <nav className="flex-1 p-6">
                  <div className="flex flex-col gap-4">
                    <Link to="/" className="text-base hover:text-rose-500 transition-colors">
                      Explore
                    </Link>
                    <Link to="/chat" className="text-base hover:text-rose-500 transition-colors">
                      Messages
                    </Link>
                    {user ? (
                      <>
                        <Link to="/account" className="text-base hover:text-rose-500 transition-colors">
                          Profile
                        </Link>
                        <div className="border-t pt-4 mt-4">
                          <Link to="/settings" className="text-base hover:text-rose-500 transition-colors">
                            Settings
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="border-t pt-4 mt-4">
                        <Link
                          to="/login"
                          className="block text-center py-3 px-6 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
                        >
                          Log in
                        </Link>
                        <Link
                          to="/signup"
                          className="block text-center py-3 px-6 mt-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Sign up
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <button className="p-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={20} />
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="p-6 overflow-y-auto">
                <FilterContent onClose={() => setIsFilterOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

const DesktopHeader = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between gap-8 h-20 px-8 max-w-[2520px] mx-auto">
        <Link to="/" className="flex items-center flex-shrink-0">
          <span className="text-rose-500 text-3xl font-bold">manazl</span>
        </Link>

        <div className="flex-1 max-w-2xl flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <button className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium shadow-sm">
                <SlidersHorizontal size={20} />
                Filters
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <FilterContent onClose={() => setIsFilterOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <Link to="/chat" className="text-sm font-medium hover:text-rose-500 transition-colors">
            Messages
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/account"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow"
              >
                <Menu size={18} />
                <User size={24} className="text-gray-600" />
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const DesktopSidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const navItems = [
    { title: "Explore", icon: Search, url: "/" },
    { title: "Messages", icon: MessageCircle, url: "/chat" },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <Link to="/" className="flex items-center">
          <span className="text-rose-500 text-2xl font-bold">manazl</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-4">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/account" className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="block text-center py-2 px-4 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="block text-center py-2 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

const Layout = () => {
  const dir = useAppDirection();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isChatPage = pathname.startsWith("/chat");

  return (
    <SetupWrapper>
      <div dir={dir} className="h-[100vh] overflow-hidden">
        {isDesktop && isChatPage ? (
          <SidebarProvider>
            <div className="flex h-full">
              <DesktopSidebar />
              <main className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
              </main>
            </div>
          </SidebarProvider>
        ) : (
          <div className="flex flex-col h-full">
            {isDesktop ? <DesktopHeader /> : <MobileHeader />}
            <main className={`flex-1 overflow-auto bg-gray-50 ${!isDesktop ? "pb-16" : ""}`}>
              <Outlet />
            </main>
            {!isDesktop && <MobileBottomNav />}
          </div>
        )}
      </div>
    </SetupWrapper>
  );
};

export default Layout;