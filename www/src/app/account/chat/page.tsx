'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslate } from "@tolgee/react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import LoadingSpinnerComponent from "react-spinners-components"
import { MainContent } from "src/components/Page"
import { EmptyMessage } from "src/components/errorMessage"
import { timeAgo } from "src/lib/utils/timeAgo"
import { Menu } from "lucide-react"
import { watchChats } from "@/app/account/chat/actions/chat.client"
import { getChats } from "@/app/account/chat/actions/chat.server"
import { Chat } from "@/app/account/chat/actions/chat.types"

export default function ChatsPage() {
  const navigate = useRouter()
  const { t } = useTranslate()
  const params = useSearchParams()
  const { toast } = useToast()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const [showChats, setShowChats] = useState(false)


  useEffect(() => {
    setLoading(true)
    getChats()
      .then((chats) => {
        if (chats) {
          console.log('chats :>> ', chats);
          setChats(chats)
        }
      })
      .finally(() => setLoading(false))
    const channel = watchChats((chat) => setChats(prev => [...prev, chat,]))
    return () => {
      channel.unsubscribe()
    }
  }, [])

  const toggleChats = () => setShowChats(!showChats)

  if (loading) {
    return (
      <div className="p-10">
        <LoadingSpinnerComponent type="Infinity" />
      </div>
    )
  }

  return (
    <div className="flex-1 grow h-full">
      <div className="flex flex-col md:flex-row relative overflow-auto max-w-full ">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 left-0 md:hidden z-10 m-2"
          onClick={toggleChats}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <MainContent
          className={`w-1/3 md:w-80 ${showChats ? 'block' : 'hidden'
            } md:block transition-all duration-300 ease-in-out `}
        >
          {loading && <LoadingSpinnerComponent type={"Infinity"} />}
          {!loading && !chats || !chats.length && <EmptyMessage message={t('No Chats')} />}
          {!loading && (
            <div className={"flex flex-col w-full max-w-md me-auto "}>
              {chats?.map((chat, i) => (
                <div
                  className={
                    "cursor-pointer flex flex-row justify-between items-center px-3 gap-2 py-2 hover:bg-gray-100 transition-colors duration-200"
                  }
                  onClick={() => {
                    navigate.push(`/account/chat/${chat.id}`)
                    setShowChats(false)
                  }}
                  key={chat.id + i}
                >
                  <Avatar className="bg-slate-400">
                    <AvatarImage src={chat?.user?.avatar_url} />
                    <AvatarFallback>{chat?.user?.full_name ? chat?.user?.full_name[0] : "AB"}</AvatarFallback>
                  </Avatar>

                  <div className={"w-full flex flex-col items-start overflow-hidden"}>

                    {chat?.user?.full_name}
                    <p className={"font-bold text-sm"}>
                      <span className="text-gray-500 text-xs ml-2">
                        {timeAgo(new Date(chat.message
                          ? chat.message.created_at
                          : chat.created_at))}
                      </span>
                    </p>

                    <p className={"truncate overflow-hidden text-sm text-gray-600"}>
                      {chat?.message ? (chat?.message.text || "") : 'No meesages'}
                    </p>
                  </div>

                  {/* {chat?.message && (
                    <div className={"w-full flex flex-col items-start overflow-hidden"}>
                      <p className={"font-bold text-sm"}>
                        {chat?.user?.full_name}
                        <span className="text-gray-500 text-xs ml-2">
                          {timeAgo(new Date(chat.message?.created_at))}
                        </span>
                      </p>
                      <p className={"truncate overflow-hidden text-sm text-gray-600"}>
                        {chat?.message.text || ""}
                      </p>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          )}
        </MainContent>

      </div>
    </div>
  )
}

