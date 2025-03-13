'use client'

import { useState, useEffect } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MessageCircle } from 'lucide-react'
import { motion } from "framer-motion"
import { watchChats } from "./actions/chat.client"
import { getChats } from "./actions/chat.server"
import { Chat } from "./actions/chat.types"
import { timeAgo } from "@/lib/utils/timeAgo"
import { useNavigate } from "react-router"
import { useTranslate } from "@tolgee/react"
import { Header, HeaderBackButton, HeaderTitle } from "src/components/Page"

export default function ChatsPage() {
  const navigate = useNavigate()
  const { t } = useTranslate()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getChats()
      .then((fetchedChats) => {
        if (fetchedChats) {
          setChats(fetchedChats)
        }
      })
      .finally(() => setLoading(false))

    const channel = watchChats((chat) => setChats(prev => [chat, ...prev]))
    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <Header >
        <HeaderBackButton/>
        <HeaderTitle >{t("Conversations")}</HeaderTitle>
      </Header>
      <Card className="flex-grow overflow-hidden rounded-none border-x-0">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full">
            {loading ? (
              <ChatsSkeleton />
            ) : chats && chats.length > 0 ? (
              chats.map((chat, i) => (
                <ChatItem key={chat.id} chat={chat} index={i} onClick={() => navigate(`/chat/${chat.id}`)} />
              ))
            ) : (
              <EmptyChats message={t('No Chats')} />
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

function ChatItem({ chat, index, onClick }: { chat: Chat; index: number; onClick: () => void }) {
  const { t } = useTranslate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-6  hover:bg-accent transition-colors duration-200"
        onClick={onClick}
      >
        <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
          <AvatarImage src={chat.user?.avatar_url} />
          <AvatarFallback>{chat.user?.full_name ? chat.user.full_name[0] : "AB"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm truncate">{chat.user?.full_name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {timeAgo(new Date(chat.message ? chat.message.created_at : chat.created_at))}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate text-start">
            {chat.message ? (chat.message.text || "") : t('No messages')}
          </p>
        </div>
      </Button>
    </motion.div>
  )
}

function EmptyChats({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
      <p className="text-lg font-semibold text-muted-foreground mb-2">{message}</p>
      <p className="text-sm text-muted-foreground">Start a new conversation to see it here.</p>
    </div>
  )
}

function ChatsSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 px-4 py-3">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </>
  )
}
