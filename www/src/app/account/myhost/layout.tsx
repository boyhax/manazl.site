
import { Suspense } from "react"
import LoadingSpinnerComponent from "react-spinners-components"


export default async function AccountPage({ children }) {

    return (
        <Suspense fallback={<div className="p-7">
            <LoadingSpinnerComponent />
        </div>}>

            {children}

        </Suspense>


    )
}