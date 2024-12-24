import { IonImg } from "@ionic/react";
import { SwiperSlide,Swiper } from "swiper/react";
import ImageCorousol2 from "./imageCorousol2";

export default function ({ images }) {
    return (
    <ImageCorousol2 images={images}/>
      // <div className="w-full rounded-lg h-60   overflow-hidden ">
        
        
      // </div>
    );
  }

  {/* <Swiper
          className={"h-auto "}
          slidesPerView={1}
          spaceBetween={1}
          navigation={true}
        >
          {images
            ? images?.map((url, i, array) => {
                return (
                  <SwiperSlide
                  onClick={(e) => e.stopPropagation()}
                    className={" overflow-hidden relative"}
                    key={"hostimagekey" + i}
                  >
                    <IonImg
                      key={"hostimagekey" + String(i)}
                      style={{ width: "100%" }}
                      src={url}
                      className={"object-cover w-full h-full "}
                    />
                  </SwiperSlide>
                );
              })
            : []}
        </Swiper> */}