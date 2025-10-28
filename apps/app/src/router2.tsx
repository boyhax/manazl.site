import { isPlatform } from "@ionic/core";
import { IonPage } from "@ionic/react";
import { BrowserRouter, Navigate, Route, Routes, useRouteError } from "react-router";
import LoginPage from "src/pages/auth/loginPage";
import BackButton from "./components/BackButton";
import { ErrorMessage } from "./components/errorMessage";
import Layout from "./layout/layout";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/FeedbackPage";
import Home from "./pages/Home/HomePage";
import ListingPage from "./pages/ListingPage";
import PostPage from "./pages/PostPage";
import PostsPage, { PageMakePost } from "./pages/PostsSearchPage";
import Settings from "./pages/SettingsPage";
import AccountLayout from "./pages/account/AccountLayout";
import AccountPage from "./pages/account/AccountPage";
import BookingView from "./pages/account/BookingView";
import MyLiked from "./pages/account/myLikes";
import NotificationsView from "./pages/account/notifications";
import Admin from "./pages/admin/adminPage";
import { Users, UsersNew } from "./pages/admin/users";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import EmailConfirm from "./pages/auth/EmailConfirm";
import ResetPassword from "./pages/auth/resetPasswordCallback";
import AvailablePage from "./pages/availablePage";
import ChatPage from "./pages/chat/chatPage";
import ChatsPage from "./pages/chat/chatsPage";
import HostRoute from "./pages/host/HostRoute";
import EditListing from "./pages/host/listings/editListing";
import EditVariant from "./pages/host/variant/EditVariant";
import NewVariant from "./pages/host/variant/NewVariant";
import PlayGround from "./pages/playground";
import PolicyPage from "./pages/policyPage";
import ReservationsPage from "./pages/reservationsPage/reservationsPage";
import AuthRoute from "./protectedRoutes/AuthRoute";
import OnlineRequiredRoute from "./protectedRoutes/OnlineRequiredRoute";

export const ErrorBoundary = () => {
  let error = useRouteError();

  console.error(isPlatform("hybrid") ? JSON.stringify(error) : error);

  return (
    <IonPage className={"flex m-4  flex-col items-center justify-center "}>
      <div className={"flex gap-2 flex-col items-center"}>
        <ErrorMessage message="Sorry! Something Wrong happend" />

        <div className="h-full mt-4  w-full overflow-auto">
          {import.meta.env.MODE == "development" ? JSON.stringify(error) : null}
        </div>
      </div>
      <BackButton fab />
    </IonPage>
  );
};

export function AppRouter() {
  return (
    <BrowserRouter >
      <Routes >
        <Route path="*" ErrorBoundary={ErrorBoundary} element={<Navigate to="/" />} />
        <Route element={<OnlineRequiredRoute />}>
          <Route element={<Layout />}>
            <Route path="/playground" element={<PlayGround />} />
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/create" element={<PageMakePost />} />
            <Route path="/listing/:id/available" element={<AvailablePage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/emailconfirm" element={<EmailConfirm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<ContactUsPage />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/About" element={<AboutPage />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/confirmemail" element={<EmailConfirm />} />
            <Route element={<AuthRoute />}>
              <Route path="/changepassword" element={<ChangePasswordPage />} />
              <Route path="/admin" element={<Admin />}>
                <Route path="users">
                  <Route index element={<Users />} />
                  <Route path="new" element={<UsersNew />} />
                </Route>
              </Route>
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<AccountPage />} />
                <Route path="likes" element={<MyLiked />} />
                <Route path="bookings/:id" element={<BookingView />} />
                <Route element={<HostRoute />}>
                  <Route path="myHost" element={<EditListing />} />
                  <Route path="variant/:id" element={<EditVariant />} />
                  <Route path="variant" element={<NewVariant />} />
                  <Route index element={<Navigate to={"/account"} />} />
                </Route>
                <Route path="chat" element={<ChatsPage />} />
                <Route path="notifications" element={<NotificationsView />} />
              </Route>
              <Route path="/chat" element={<ChatsPage />} />
              <Route path="/chat/:id" element={<ChatPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
