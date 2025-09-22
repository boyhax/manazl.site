import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonPopover,
  IonSkeletonText,
} from "@ionic/react";
import { callOutline, chatbubble, key } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "src/lib/supabase";

import Avatar from "src/components/Avatar";
import BackButton from "src/components/BackButton";
import useAsync from "src/hooks/useSupabaseQuery";
import { newChat } from "src/lib/db/chat";
import Img from "src/components/Image";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, loading } = useAsync(
    supabase.from("profiles").select("*,listings(*)").eq("id", id).single()
  );

  useEffect(() => {
    console.log("data, error, loading from profile page :>> ", data);
  }, [data]);

  if (loading) {
    return <PlaceHolder />;
  }
  if (error) {
    return <></>;
  }

  return (
    <IonPage>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
          >
            <span className="sr-only">Open dropdown</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 3"
            >
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
            </svg>
          </button>
          {/* <!-- Dropdown menu --> */}
          <div
            id="dropdown"
            className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Export Data
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={data?.avatar_url}
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {data.full_name}
          </h5>
          {/* <span className="text-sm text-gray-500 dark:text-gray-400">
            Visual Designer
          </span> */}
          <div className="flex mt-4 md:mt-6">
            
            <a
            onClick={async () => {
              const { data: chat, error } = await newChat(id);
              if (chat) {
                navigate("/chat/" + chat.id);
              }
              if (error) {
                console.trace("newChat error :>> ", error);
              }
            }}
              // href="#"
              className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Message
            </a>
          </div>
        </div>
      </div>

      <BackButton to={-1} fab />
      <IonContent key={key} className={"animate-fade-up ion-padding"}>
       

        {/* <IonCard>
          <IonCardContent>
            <IonButton id="contact-trigger">
              <IonLabel>Contact</IonLabel>
              <IonIcon icon={callOutline} />
            </IonButton>
            <IonPopover trigger={"contact-trigger"}>
              <IonLabel>
                <h1>Email: </h1>
                <span>{data?.contact?.email}</span>{" "}
              </IonLabel>
              <IonLabel>
                <h1>Phone: </h1>
                <span>{data?.contact?.phone}</span>{" "}
              </IonLabel>
            </IonPopover>

            <IonButton
              
              fill="outline"
            >
              Chat
              <IonIcon icon={chatbubble} />
            </IonButton>
          </IonCardContent>
        </IonCard> */}
        <IonCard>
          <IonCardTitle className={"inset-3"}>host</IonCardTitle>
          <IonCardContent>
            {data?.listings && (
              <Link to={"/listing/" + data.listings[0].id}>
                <div className={"grid grid-cols-3  "}>
                  <div className={"col-span-2 p-4"}>
                    <IonLabel>{data.listings[0].title}</IonLabel>
                  </div>

                  <Img
                    className={" object-cover overflow-hidden"}
                    src={data.listings[0].thumbnail}
                  />
                </div>
              </Link>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;

const PlaceHolder = () => (
  <IonPage>
    <BackButton fab />
    <IonContent key={key} className={"animate-fade-up ion-padding"}>
      <IonCard>
        <IonCardContent>
          <IonSkeletonText />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardContent>
          <IonButton>
            <IonSkeletonText />
          </IonButton>
          <IonButton fill="outline">
            <IonSkeletonText />
          </IonButton>
          <IonButton fill="outline" onClick={() => {}}>
            <IonSkeletonText />
          </IonButton>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
);
