import { IonPage } from "@ionic/react";
import BackButton from "./components/BackButton";
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
import PolicyPage from "./pages/policyPage";

import { isPlatform } from "@ionic/core";
import { Navigate, useRouteError } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import BookingView from "./pages/account/BookingView";
import MyLiked from "./pages/account/myLikes";
import NotificationsView from "./pages/account/notifications";
import Admin from "./pages/admin/adminPage";
import { Users, UsersNew } from "./pages/admin/users";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import EmailConfirm from "./pages/auth/EmailConfirm";
import LoginPage from "src/pages/auth/loginPage";
import ResetPassword from "./pages/auth/resetPasswordCallback";
import ChatPage from "./pages/chat/chatPage";
import ChatsPage from "./pages/chat/chatsPage";
import EditListing from "./pages/host/listings/editListing";
import EditVariant from "./pages/host/variant/EditVariant";
import NewVariant from "./pages/host/variant/NewVariant";
import ReservationsPage from "./pages/reservationsPage/reservationsPage";
import AuthRoute from "./protectedRoutes/AuthRoute";
import OnlineRequiredRoute from "./protectedRoutes/OnlineRequiredRoute";
import HostRoute from "./pages/host/HostRoute";
import PlayGround from "./pages/playground";
import { ErrorMessage } from "./components/errorMessage";
import AvailablePage from "./pages/availablePage";
import RealsSale from "./pages/Home/reals-sale";
import RealsRenting from "./pages/Home/reals-renting";
import LandsSale from "./pages/Home/lands-sale";

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

export const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/" />,
  },
  {
    element: <OnlineRequiredRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "/playground",
            element: <PlayGround />,
          },
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/reals-renting",
            element: <RealsRenting />,
          },
          {
            path: "/reals-sale",
            element: <RealsSale />,
          },
          {
            path: "/lands-sale",
            element: <LandsSale />,
          },
          {
            path: "/posts",
            element: <PostsPage />,
          },
          {
            path: "/posts/create",
            element: <PageMakePost />,
            children: [],
          },
          { path: '/listing/:id/available', element: <AvailablePage /> },


          {
            path: "/listing/:id",
            element: <ListingPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/emailconfirm",
            element: <EmailConfirm />,
            children: [],
            errorElement: <ErrorBoundary />,
          },

          {
            path: "/login",
            element: <LoginPage />,
            children: [],
            errorElement: <ErrorBoundary />,
          },

          {
            path: "/settings",
            element: <Settings />,
            children: [],
            errorElement: <ErrorBoundary />,
          },

          {
            path: "/feedback",
            element: <ContactUsPage />,

          },
          {
            path: "/policy",
            element: <PolicyPage />,

          },

          {
            path: "/About",
            element: <AboutPage />,
            children: [],
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/posts/:id",
            element: <PostPage />,
            children: [],
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/resetpassword",
            element: <ResetPassword />,
            children: [],
            errorElement: <ErrorBoundary />,
          },
          {
            path: "/confirmemail",
            element: <EmailConfirm />,
            errorElement: <ErrorBoundary />,
          },
          {
            element: <AuthRoute />,
            children: [
              {
                path: "/changepassword",
                element: <ChangePasswordPage />,
                children: [],
                errorElement: <ErrorBoundary />,
              },

              {
                element: <Admin></Admin>,
                path: "/admin",
                children: [
                  {
                    path: "users",
                    children: [
                      { index: true, element: <Users /> },
                      { path: "new", element: <UsersNew /> },
                    ],
                  },
                ],
              },
              {
                path: "/reservations",
                element: <ReservationsPage />,
                children: [{ path: ":view" }],
              },
              {
                path: "/account",
                errorElement: <ErrorBoundary />,
                element: <AccountLayout />,

                children: [
                  {
                    index: true,
                    element: <AccountPage />,

                  },

                  { path: "likes", element: <MyLiked /> },
                  {
                    path: "bookings/:id",
                    element: <BookingView />,
                  },


                  {
                    element: <HostRoute />,
                    children: [
                      {
                        path: "myHost",
                        element: <EditListing />,
                      },
                      {
                        path: "variant/:id",
                        element: <EditVariant />,
                      },
                      {
                        path: "variant",
                        element: <NewVariant />,
                      },
                      {
                        path: "",
                        element: <Navigate to={"/account"} />,
                        index: true,
                      },
                    ],
                  },
                  {
                    path: "chat",
                    element: <ChatsPage />,
                    children: [],
                  },
                  {
                    path: "notifications",
                    element: <NotificationsView />,
                    children: [],
                  },
                ],
              },
              {
                path: "/chat",
                element: <ChatsPage />,
                children: [],
                errorElement: <ErrorBoundary />,
              },
              {
                path: "/chat/:id",
                element: <ChatPage />,
                errorElement: <ErrorBoundary />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
