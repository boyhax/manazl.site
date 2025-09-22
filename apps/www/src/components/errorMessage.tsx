import { Calendar, X } from "lucide-react";

export function ErrorMessage({ message }: { message: string }) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <X className="h-16 w-16 text-red-500 mb-4" />
        <p className="text-xl text-center text-gray-600">{message}</p>
      </div>
    );
  }
  
  export function EmptyMessage({ message }: { message: string }) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Calendar className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-xl text-center text-gray-600">{message}</p>
      </div>
    );
  }
  
  