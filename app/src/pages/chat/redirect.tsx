
import { useEffect } from "react";


import { useNavigate, useParams } from "react-router";

import LoadingSpinnerComponent from "react-spinners-components";
import { getChatId } from "./actions/chat.server";

export default function ChatRedirect(): JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getChatId(id as string).then(({ id }) => {
      navigate('/chat/' + id)
    })
  }, []);


  return (<div className="p-10">
    <LoadingSpinnerComponent type='Infinity' />
  </div>)
}
