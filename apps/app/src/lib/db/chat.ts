import supabase from '../supabase'

interface NewMessage {
  text: string
  url?: string
}
export const sendMessage = async (message: NewMessage, chat_id: string) => {
  try {
    const res = await supabase
      .from('messages')
      .insert({ ...message, chat_id })
      .select()
      .single()
    return res
  } catch (error) {
    console.trace(error)
    throw new Error('message send failed')
  }
}
export const getMessages = async (id: string) => {
  try {
    return await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at')
      .limit(50)
  } catch (error) {
    console.trace(error)
    throw new Error('messages fetch failed')
  }
}

export const newChat = async (user_id: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      data: null,
      error: { message: 'sorry you should sign in first' },
    }
  }
  if (user.id === user_id) {
    return {
      data: null,
      error: { message: 'sorry not possible to chat with self' },
    }
  }
  const { data, error } = await supabase
    .from('listings')
    .select('id,chats(id,user_id)')
    .eq('chats.user_id', user.id)
    .eq('user_id', user_id)
    .single()
  if (data) {
    if (!!data.chats) {
      return { data: data.chats[0], error: null }
    } else {
      console.log('creating new chat :>> ')

      const { data: chat, error } = await supabase
        .from('chats')
        .insert({ users: [user_id, user.id], listing_id: data.id })
        .select()
        .single()
      if (error) throw Error(error.message)
      return { data: chat, error }
    }
  }
}
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
          // filter: `chat_id=eq.${chat_id}`,
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
export const watchChats = (userid: string, Callback: (chat: Chat) => void) => {
  try {
    const chatsWatcher = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          // filter: `users=cs.{${userid}}`,
        },
        async (payload) => {
          console.log('new chat', payload)
          const { data: chat, error } = await getChatItem(payload.new.id)
          chat && Callback(chat)
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
export function getChats() {
  return supabase
    .from('chats')
    .select(
      '*,listing:listings(full_name:title,avatar_url:thumbnail),user:profiles(avatar_url,full_name),messages(*)'
    )
    .limit(1, { referencedTable: 'messages' })
    .order('created_at', { ascending: false, referencedTable: 'messages' })
}

const getChatItem = async (id: string | number) => {
  return supabase
    .from('chats')
    .select(
      '*,listing:listings(full_name:title,avatar_url:thumbnail),user:profiles(avatar_url,full_name),messages(*)'
    )
    .eq('id', id)
    .limit(1, { referencedTable: 'messages' })
    .order('created_at', { ascending: false, referencedTable: 'messages' })
    .single()
}
export const updateMessage = (id: string, data: any) => {
  try {
    return supabase.from('messages').update(data).eq('id', id).select().single()
  } catch (error) {
    console.trace(error)
    throw new Error('message update failed')
  }
}
export interface Message {
  text: string
  created_at: string
  id: string
  url?: string
  user_id: string
  chat_id: string
  is_read: boolean
}
export interface Chat {
  users: string[]
  user: { avatar_url; full_name }
  listing: { avatar_url; full_name }
  id: string
  unseen: number
  messages: Message[]
}
