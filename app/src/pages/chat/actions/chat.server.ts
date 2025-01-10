'use server'
import supabase from 'src/lib/supabase'
import { Chat, NewMessage } from './chat.types'

export const sendMessage = async (message: NewMessage, chat_id: string) => {
  const res = await supabase
    .from('messages')
    .insert({ ...message, chat_id })
    .select()
    .single()

  return res
}
export const getMessages = async (id: string) => {
  return await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', id)
    .order('created_at')
    .limit(50)
}

export async function getChatId(listing_id: string): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('chats')
    .select('id')
    .eq('listing_id', listing_id)
    .single()

  if (!data || error) {
    const id = await newChat(listing_id)
    return { id }
  } else {
    return data
  }
}
async function newChat(listing_id) {
  const { data, error } = await supabase
    .from('chats')
    .upsert({ listing_id })
    .select('id')
    .single()
  if (error) throw Error(error.message)
  return data.id as string
}
const emptyMessage = {
  id: 0,
  url: null,
  text: 'No messages',
  chat_id: null,
  is_read: false,
  user_id: '',
  created_at: '',
}
export const getChats = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw Error('user_not_found')
  var { data, error } = await supabase
    .from('chats')
    .select(
      '*,user:profiles(full_name,avatar_url),listings(full_name:title,avatar_url:thumbnail,user_id),messages(*)'
    )
    .limit(1, { referencedTable: 'messages' })
    .order('created_at', { referencedTable: 'messages', ascending: false })
  if (error) throw Error(error.message)
  if (!data) return []
  let chats = data.map((chat) => {
    if (chat.user_id == user.id) {
      chat.user = chat.listings
    }
    console.log('chat.messages :>> ', !!chat.messages)

    if (!!chat.messages) {
      chat.message = chat.messages[0]
    } else {
      chat.message = emptyMessage
    }
    console.log('chat :>> ', chat)
    return chat
  })
  return chats
}

export async function updateMessage(id: string, data: any) {
  return await supabase
    .from('messages')
    .update(data)
    .eq('id', id)
    .select()
    .single()
}
export async function getChatItem(id: string | number): Promise<Chat> {
  var { data, error } = await supabase
    .from('chats')
    .select(
      '*,user:profiles(full_name,avatar_url),listings(full_name:title,avatar_url:thumbnail,user_id),messages(*)'
    )
    .eq('id', id)
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .single()

  if (error) throw Error(error.message)
  return data
}
