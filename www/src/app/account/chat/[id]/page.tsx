'use client'

import { useEffect, useRef, useState } from "react"
import { useTranslate } from "@tolgee/react"
import { useInView } from "react-intersection-observer"
import { useParams } from "next/navigation"
import supabase from "src/lib/supabase"
import { timeAgo } from "src/lib/utils/timeAgo"
import { cn } from "src/lib/utils"
import LoadingSpinnerComponent from "react-spinners-components"
import { createClient } from "@/app/lib/supabase/client"
import { useUserContext } from "@/providers/userProvider"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HeaderBackButton } from "@/components/Page"
import { watchMessages } from "@/app/account/chat/actions/chat.client"
import { getChatItem, sendMessage } from "@/app/account/chat/actions/chat.server"
import { Chat, Message } from "@/app/account/chat/actions/chat.types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ChatPage(): JSX.Element {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslate()
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const { id } = useParams()
    const [messages, setMessages] = useState<Message[]>([])
    const [chat, setChat] = useState<Chat>()
    const { user } = useUserContext()

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const onSend = async (text: string) => {
        setSending(true)
        const { data, error } = await sendMessage({ text }, id as string)

        if (data) {
            console.log(data)
        }
        if (error) {
            console.error("error from onSend :>> ", error)
        }
        setSending(false)
    }

    const onReceived = (message: Message) => setMessages((prev) => [...prev, message])

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return
        await onSend(newMessage)
        setNewMessage("")
        scrollToBottom()
    }

    const getAllMessages = async () => {

        setLoading(true)
        const chat = await getChatItem(id as string)
        setLoading(false)
        setChat(chat)
    }

    useEffect(() => {
        getAllMessages()
        const channel = watchMessages(id as string, (message) => {

            onReceived(message)
        })
        return () => {
            channel?.unsubscribe()
        }
    }, [id])

    if (loading) {
        return <LoadingSpinnerComponent type="Infinity" />
    }

    return (
        <div className="flex flex-col h-[90vh] relative overflow-clip ">
            <HeaderBackButton />
            <ScrollArea className="pb-16 ">
                <div className="  p-4 flex flex-col space-y-4  ">
                    {messages?.map((message, index) => (
                        <MessageBubble key={index} message={message} isSender={user.id === message.user_id} chat={chat as any} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>


            </ScrollArea>
            <form onSubmit={handleSend} className="flex-shrink-0 p-4 border-t bg-background absolute bottom-0 left-0 right-0">
                <div className="flex items-center space-x-2">
                    <Textarea
                        value={sending ? t("Sending ...") : newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t("Write ...")}
                        className="flex-grow"
                        disabled={sending}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || sending}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

interface MessageBubbleProps {
    message: Message
    isSender: boolean
    chat: Chat & { user: { full_name: string; avatar_url: string } }
}

const MessageBubble = ({ message, isSender, chat }: MessageBubbleProps) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    useEffect(() => {
        if (inView && !isSender && !message.is_read) {
            // Assuming you have a 'see' function to mark messages as read
            see(message.id)
        }
    }, [inView, isSender, message.id, message.is_read])

    return (
        <div
            ref={ref}
            className={cn(
                "flex w-min max-w-[70%]",
                isSender ? "float-left self-end justify-end" : "float-right self-start justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[70%]",
                isSender ? "flex-row-reverse" : "flex-row"
            )}>

                <Avatar className="w-8 h-8 mr-2 flex-shrink-0">
                    <AvatarImage src={chat.user.avatar_url} alt={chat.user.full_name} />
                    <AvatarFallback>{chat.user.full_name[0]}</AvatarFallback>
                </Avatar>

                <div className={cn(
                    "flex flex-col",
                    isSender ? "items-end" : "items-start"
                )}>
                    <div className={cn(
                        "p-3 rounded-lg",
                        isSender ? "bg-primary text-primary-foreground" : "bg-green-300 "
                    )}>
                        <p className="text-sm break-words">{message.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                        {timeAgo(new Date(message.created_at))}
                    </span>
                </div>
            </div>
        </div>
    )
}

const see = async (id: string) => {
    const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", id)
    if (!error) {
        console.log("message seen ", id)
    }
}

