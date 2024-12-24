import { Swiper, SwiperSlide } from "swiper/react";

const ExploreLine = ({
  placeholder,
  items,
  slides,space
}: {
  placeholder;
  items?: JSX.Element[];
  
  slides?,space?
}) => {
  return (
    <Swiper

      spaceBetween={space}
      slidesPerView={slides}
    >
      {items &&
        items.map((element, i) => {
          return <SwiperSlide key={i}>{element}</SwiperSlide>;
        })}
    </Swiper>
  );
};
export default ExploreLine;
