import Image from "next/image"
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8 mt-8">
      <div className=" flex flex-row justify-between px-4 w-full">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Manazl</h2>
          <p className="text-sm mt-2">Find your perfect stay</p>
        </div>
        <div className="mt-8 text-center text-sm">
          © {new Date().getFullYear()} Manazl. All rights reserved.
        </div>
        <div className="flex flex-col items-center ">
          {/* <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-900 transition-colors duration-300" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-300" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors duration-300" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div> */}
          <a href="https://play.google.com/store/apps/details?id=com.boyhax.manazl&hl=ar" aria-label="Get it on Google Play">
            <Image
              alt="Get it on Google Play"
              width={135}
              height={40}
              src="/images/en_generic_rgb_wo_45.png"
            />
          </a>
        </div>
      </div>

    </footer>
  )
}