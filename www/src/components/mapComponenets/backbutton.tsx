'use client'
import { useRouter } from "next/navigation"
import { BiChevronLeft } from "react-icons/bi"


export default function MapBackButton() {
    const navigate = useRouter()
    function goBack() {
        navigate.back()
    }
    return (
        <button
            onClick={goBack}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Go back"
        >
            <BiChevronLeft className="text-xl text-gray-700" />
        </button>

    )
}
