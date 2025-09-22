'use client'
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/app/lib/supabase/client";
import { format } from 'date-fns'
import { Bell, Loader2 } from 'lucide-react'
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface Notification {
  id: string; title: string; description: string; created_at: string; topic: string, received: boolean
}
function NotificationsSummary({ data, isLoading }: { data: Notification[], isLoading: boolean }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })


  useEffect(() => {
    if (inView && data) {
      // Assuming you have a 'see' function to mark messages as read
      let newrecivied = data.filter((n) => !n.received).map(n => n.id)
      see(newrecivied)
    }
  }, [inView])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Bell className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">No new notifications</p>
        <p className="text-sm text-gray-500">We will notify you when something important happens.</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Notifications</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {data.map((notification: Notification) => (
          <li key={notification.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-primary truncate">{notification.title}</h4>
                <p className="mt-1 text-xs text-gray-500">{notification.topic}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="text-xs text-gray-500">
                  {format(new Date(notification.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{notification.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationsSummary


const see = async (data: string[]) => {
  const client = createClient()
  const { error } = await client
    .from("notifications")
    .update({ received: true })
    .in("id", data)
  if (!error) {
    console.log("notifications received ",)
  } else {
    console.log('error :>> ', error);
  }
}