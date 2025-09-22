import React, { useState } from "react";
import Page from "../components/Page";
import {
  IonButtons,
  IonContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import BackButton from "../components/BackButton";

const Demo: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <Page>
      <IonToolbar>
        <IonButtons>
          <BackButton />
          <IonTitle>demo</IonTitle>
        </IonButtons>
      </IonToolbar>

      <IonContent className={"ion-padding"}>
        {/* <form
          onSubmit={(e) =>{e.preventDefault();
             let title = (e.currentTarget.elements[0] as any).value!
             let body = (e.currentTarget.elements[1] as any).value!
             let token = (e.currentTarget.elements[2] as any).value! ||'d4Zy2tfDSBCfMeM7Ze9v5e:APA91bFqU2oBOPRmXKjNmHeN_qRgJis_F4KtxZFtN5E8tHc3TPbLcB8_hPpkxHHxcqKPXHBCajizPLGmSw1d4J2QfxkDyaEKeQ50C6q_i1xgmrjd3WJI1XYXoy208QdrHOP7TKkyG2Oc'
              fetch('https://shoflytawseel.com/api/push', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  notification:{
                    title,
                    body,
                  },
                  token:'d4Zy2tfDSBCfMeM7Ze9v5e:APA91bFqU2oBOPRmXKjNmHeN_qRgJis_F4KtxZFtN5E8tHc3TPbLcB8_hPpkxHHxcqKPXHBCajizPLGmSw1d4J2QfxkDyaEKeQ50C6q_i1xgmrjd3WJI1XYXoy208QdrHOP7TKkyG2Oc'
                })
              }).then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err))
            }}
          className={"grid grid-cols-1 divide-red-200 "}
        >
          <IonItem>
            <IonLabel>title</IonLabel>
            <IonInput type={"text"} name="title"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>body</IonLabel>
            <IonInput type={"text"} name="body"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>token</IonLabel>
            <IonInput type={"text"} name="token"></IonInput>
          </IonItem>
          <IonButton type={'submit'}>submit</IonButton>
        </form> */}
        <div >
        {Array.from({ length: 10 }).map((v, i) => 
          <div className={"shadow-xl m-2 animate-fade-up"} key={i}>
          <article className={"p-2 gap-5 space-y-3"}>
            <p onClick={()=>setShow(!show)} className={"text-2xl ml-2"}>title <span className={'text-sm ml-1'}>{`${show?'hide':'show'}`}</span></p>
            
            <p className={`${show?'h-[70px]':'h-0'} transition-all ease-in-out duration-500 overflow-hidden`}>
              absolute top-0 left-0 w-10 h-10 rounded-br-full text-xl
              bg-slate-300"
            </p>
          </article>
        </div>
        )}
        </div>
        
      </IonContent>
    </Page>
  );
};

export default Demo;
//chat demo

{
  /* <!-- Component Start --> */
}
//       <div classNameNameNameName="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
//         <div classNameNameNameName="flex flex-col flex-grow h-0 p-4 overflow-auto">
//           <div classNameNameNameName="flex w-full mt-2 space-x-3 max-w-xs">
//             <div classNameNameNameName="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
//             <div>
//               <div classNameNameNameName="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
//                 <p classNameNameNameName="text-sm">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 </p>
//               </div>
//               <span classNameNameNameName="text-xs text-gray-500 leading-none">
//                 2 min ago
//               </span>
//             </div>
//           </div>
//           <div classNameNameNameName="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
//             <div>
//               <div classNameNameNameName="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
//                 <p classNameNameNameName="text-sm">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
//                   do eiusmod.
//                 </p>
//               </div>
//               <span classNameNameNameName="text-xs text-gray-500 leading-none">
//                 2 min ago
//               </span>
//             </div>
//             <div classNameNameNameName="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
//           </div>
//           .
//         </div>

//         <div classNameNameNameName="bg-gray-300 px-2 py-2 flex flex-row justify-between">

//           <button classNameNameNameName="flex-shrink-0 flex items-center justify-center  px-2 rounded-full bg-gray-300">
//           <IonIcon size={'large'} icon={attach}/>
//           </button>
//           <input
//             classNameNameNameName="flex items-center h-10 w-full rounded px-3 text-sm"
//             type="text"
//             placeholder="Type your message…"
//           />
//       <button classNameNameNameName="flex-shrink-0 items-center justify-center px-2 rounded-full bg-gray-300">
//             <IonIcon size={'large'} icon={send}/>
//           </button>
//         </div>
//       </div>
// {
/*    <a href="#" classNameNameNameNameName="w-[30rem] border-2 border-b-4 border-gray-200 rounded-xl hover:bg-gray-50">

          // <!-- Badge --> 
          <p classNameNameNameNameName="bg-sky-500 w-fit px-4 py-1 text-sm font-bold text-white rounded-tl-lg rounded-br-xl"> FEATURED </p>

          <div classNameNameNameNameName="grid grid-cols-6 p-5 gap-y-2">

            {/* <!-- Profile Picture --> 
            <div>
              <img src="https://picsum.photos/seed/2/200/200" classNameNameNameNameName="max-w-16 max-h-16 rounded-full" />
            </div>

             <!-- Description --> 
            <div classNameNameNameNameName="col-span-5 md:col-span-4 ml-4">

              <p classNameNameNameNameName="text-sky-500 font-bold text-xs"> 20+ SPOTS LEFT </p>

              <p classNameNameNameNameName="text-gray-600 font-bold"> [Intermediate/Advanced] Tea Time Conversation </p>

              <p classNameNameNameNameName="text-gray-400"> Sat, Mar 12 . 7:00 - 8:30 AM </p>

              <p classNameNameNameNameName="text-gray-400"> Beginner speakers </p>

            </div>

            {/* <!-- Price --> 
            <div classNameNameNameNameName="flex col-start-2 ml-4 md:col-start-auto md:ml-0 md:justify-end">
              <p classNameNameNameNameName="rounded-lg text-sky-500 font-bold bg-sky-100  py-1 px-3 text-sm w-fit h-fit"> $ 5 </p>
            </div>

          </div>

        </a>*/

/* <div classNameNameNameNameNameName='flex items-center justify-center min-h-screen from-red-100 via-red-300 to-blue-500 bg-gradient-to-br'>
          <div classNameNameNameNameNameName="p-4 items-center justify-center w-[680px] rounded-xl group sm:flex space-x-6 bg-white bg-opacity-50 shadow-xl hover:rounded-2xl">
            <img classNameNameNameNameNameName="mx-auto w-full block w-4/12 h-40 rounded-lg" alt="art cover" loading="lazy" src='https://picsum.photos/seed/2/2000/1000' />
            <div classNameNameNameNameNameName="sm:w-8/12 pl-0 p-5">
              <div classNameNameNameNameNameName="space-y-2">
                <div classNameNameNameNameNameName="space-y-4">
                  <h4 classNameNameNameNameNameName="text-md font-semibold text-cyan-900 text-justify">
                    Provident de illo eveniet commodi fuga fugiat laboriosam expedita.
                  </h4>
                </div>
                <div classNameNameNameNameNameName="flex items-center space-x-4 justify-between">
                  <div classNameNameNameNameNameName="flex gap-3 space-y-1">
                    <img src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" classNameNameNameNameNameName="rounded-full h-8 w-8" />
                    <span classNameNameNameNameNameName="text-sm">Yeah same question here too 🔥</span>
                  </div>
                  <div classNameNameNameNameNameName=" px-3 py-1 rounded-lg flex space-x-2 flex-row">
                    <div classNameNameNameNameNameName="cursor-pointer text-center text-md justify-center items-center flex">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" classNameNameNameNameNameName="text-md"><path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path></svg>
                      <span classNameNameNameNameNameName="text-md mx-1">80</span>
                    </div>
                    <div classNameNameNameNameNameName="cursor-pointer text-center text-md justify-center items-center flex">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" classNameNameNameNameNameName="text-md"><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path><circle cx="15" cy="10" r="2"></circle><circle cx="9" cy="10" r="2"></circle></svg>
                      <span classNameNameNameNameNameName="text-md mx-1">80</span>
                    </div>
                  </div>
                </div>
                <div classNameNameNameNameNameName="flex items-center space-x-4 justify-between">
                  <div classNameNameNameNameNameName="text-grey-500 flex flex-row space-x-1  my-4">
                    <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p classNameNameNameNameNameName="text-xs">2 hours ago</p>
                  </div>
                  <div classNameNameNameNameNameName="flex flex-row space-x-1">
                    <div
                      classNameNameNameNameNameName="bg-red-500 shadow-lg shadow- shadow-red-600 text-white cursor-pointer px-3 py-1 text-center justify-center items-center rounded-xl flex space-x-2 flex-row">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" classNameNameNameNameNameName="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z"></path></svg>
                      <span>23</span>
                    </div>
                    <div
                      classNameNameNameNameNameName="bg-green-500 shadow-lg shadow- shadow-green-600 text-white cursor-pointer px-3 text-center justify-center items-center py-1 rounded-xl flex space-x-2 flex-row">
                      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" classNameNameNameNameNameName="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg>
                      <span>23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */
