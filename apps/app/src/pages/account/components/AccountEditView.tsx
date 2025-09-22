import {
  IonAvatar,
  IonSkeletonText,
  useIonToast
} from "@ionic/react";
import { useState } from "react";

import { useTranslate } from "@tolgee/react";
import { MdChangeCircle, MdPerson } from "react-icons/md";
import Input from "src/components/Input";
import useProfile from "src/hooks/useProfile";
import { updateUser } from "src/lib/db/profile";
import { auth } from "src/state/auth";
import LoginPage from "src/pages/auth/newFile";
import AccountAvatar from "../AccountAvatar";

export default function () {
  const { loading, updateAvatar,updateProfile } = useProfile();
  const session = auth((s) => s.session);
  const { t } = useTranslate();
  const [toast] = useIonToast();
  const [data, setData] = useState({
    full_name: session.user.user_metadata.full_name,
  });

  async function hundleSave() {
    await updateProfile(data)
  }
  if (!session) {
    return null;
  }
  return (
    <div className={" flex flex-col items-center pt-3 gap-2"}>
      {loading ? (
        <IonAvatar className={" w-20 h-20 rounded-full overflow-hidden"}>
          <IonSkeletonText animated />
        </IonAvatar>
      ) : (
        <div className={"relative"}>
          <AccountAvatar
            className={"w-20 h-20 rounded-full"}
            onClick={updateAvatar}
          />
          <div
            onClick={updateAvatar}
            className={
              "absolute flex items-center justify-center top-0 backdrop-blur-sm  w-full h-full opacity-0 hover:opacity-100 transition-opacity"
            }
          >
            <MdChangeCircle />
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          hundleSave();
        }}
        id={"editform"}
      >
        <Input
          before={<MdPerson />}
          inputMode={"text"}
          type={"text"}
          value={data.full_name}
          onChange={(e) => setData({ full_name: e.currentTarget.value })}
          minLength={5}
        />
      </form>
    </div>
  );
}
