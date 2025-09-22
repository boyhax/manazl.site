import { BiChevronLeft } from "react-icons/bi"
import { useNavigate } from "react-router"


export default function () {
    const navigate = useNavigate()
    function goBack() {
        navigate(-1)
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
