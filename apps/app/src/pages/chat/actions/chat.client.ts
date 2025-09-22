'use client'
import { Chat, Message } from './chat.types'
import { getChatItem } from './chat.server'
import supabase from 'src/lib/supabase'

export const watchAllMessages = (
  chats: string[],
  onMessage: (message: Message) => void
) => {
  try {
    const chatsWatcher = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=cd.{${chats.join(',')}}`,
        },
        (payload) => {
          console.log('new message', payload)
          onMessage(payload.new as Message)
        }
      )
      .subscribe((status) => {
        console.log('status :>> ', status)
      })

    return chatsWatcher
  } catch (error) {
    console.log('eror chatwatcher :>> ', error)
  }
}
export const watchMessages = (
  chat_id: string,
  onMessage: (message: Message) => void
) => {
  try {
    const chatsWatcher = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chat_id}`,
        },
        (payload) => {
          console.log('new message', payload)
          onMessage(payload.new as Message)
        }
      )
      .subscribe((status) => {
        console.log('status :>> ', status)
      })

    return chatsWatcher
  } catch (error) {
    console.log('eror chatwatcher :>> ', error)
  }
}
export const watchChats = (Callback: (chat: Chat) => void) => {
  var chatsWatcher = { unsubscribe: async () => 'error' }

  chatsWatcher = supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        // filter: `users=cs.{${user.id}}`,//rls will do the filter job
      },
      async (payload) => {
        console.log('new chat', payload)
        const chat = await getChatItem(payload.new.id)
        chat && Callback(chat as any)
      }
    )
    .subscribe((status) => {
      console.log('status :>> ', status)
    })

  return chatsWatcher
}
