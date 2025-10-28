import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircleIcon, Share2, Star, BedIcon, HomeIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslate } from "@tolgee/react";
import { Link, useNavigate } from "react-router";
import Card from "src/components/Card";
import LikeButton from "src/components/LikeButton";
import { shareHundler } from "src/components/ShareLink";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { useCurrency } from "src/hooks/useCurrency";
import { getChatId } from "src/pages/chat/actions/chat.server";
import { cn } from "src/lib/utils";

function get_cost(rooms) {
  let cost = null;
  rooms.forEach((room) => {
    room.available.forEach((available) => {
      if (!cost || available.cost < cost) {
        cost = available.cost
      }
    })
  })
  return cost
}

type Props = {
  short_id;
  id;
  images: string[];
  likes;
  title;
  description;
  rating;
  rooms,
  cost;
  user: { full_name; avatar_url };
  featured;
  reviews;
  address;
};

type HostCardProps = {
  data: Props;
  className?: string;
};

export default function HostCard({
  data: {
    rooms,
    description,
    id,
    images,
    likes,
    rating,
    reviews,
    title,
    featured,
    short_id,
    address,
    user,
  },
  className
}: HostCardProps) {
  const isLiked = likes && likes.length ? likes[0].count : false;
  const { t } = useTranslate();
  const { currency, converted } = useCurrency();
  const reviewsCount = reviews && reviews.length ? reviews[0].count : 0;
  const goto = useNavigate();
  const onchat = () => {
    getChatId(id).then(({ id }) => { goto('/chat/' + id)});
  };
  let cost = get_cost(rooms);

  // Carousel state
  const [current, setCurrent] = useState(0);
  const totalImages = images?.length || 0;
  const goPrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };
  const goNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <Card key={id} className={cn("w-full max-w-2xl mx-auto overflow-hidden border rounded-2xl shadow bg-white relative", className)}>
      <div className="relative w-full h-80 sm:h-[400px]">
        {/* Image Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {images && images.length > 0 ? (
            <img
              src={images[current]}
              alt={title}
              className="w-full h-full object-cover"
              style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {/* Carousel Controls */}
          {totalImages > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 z-10 hover:bg-black/70"
                onClick={goPrev}
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 z-10 hover:bg-black/70"
                onClick={goNext}
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "block w-2 h-2 rounded-full",
                      idx === current ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
          {/* Featured Badge */}
          {featured && (
            <Badge variant="secondary" className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs z-10">
              Featured
            </Badge>
          )}
        </div>
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent px-6 pb-6 pt-24">
          <div className="flex justify-between items-start mb-2">
            <Link to={"/listing/" + short_id}>
              <h3 className="text-2xl font-semibold text-white drop-shadow">{title}</h3>
            </Link>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span dir="ltr" className="ml-1 font-medium text-white drop-shadow">
                {(rating / 20).toFixed(1)} ({reviewsCount})
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm text-white/80 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {address?.city}, {address?.state}
            </span>
          </div>
          <p className="text-white/90 text-sm line-clamp-2 mb-2 drop-shadow">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 mb-2">
            {rooms && rooms.length > 0 && (
              <div className="flex items-center text-sm text-white/90">
                <BedIcon className="h-4 w-4 mr-1" />
                <span>{rooms.length} {rooms.length === 1 ? t("Room") : t("Rooms")}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-white/90">
              <HomeIcon className="h-4 w-4 mr-1" />
              <span>{t(address?.type || "Property")}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              {user?.avatar_url && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm font-medium text-white drop-shadow">{user?.full_name}</span>
            </div>
            {cost && (
              <p className="text-xl font-bold text-white drop-shadow">
                {currency}{Number(converted(cost)).toFixed(0)}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/30">
            <div className="flex items-center gap-3">
              <LikeButton
                id={id}
                isliked={isLiked}
                className="h-8 w-8 p-0 text-white"
              />
              <Button size="sm" onClick={onchat} variant="ghost" className="h-8 w-8 p-0 text-white">
                <MessageCircleIcon className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white"
                onClick={shareHundler({
                  text: "Find Your Next Amazing Travel Places Here check here",
                  url: `/listing/${id}`,
                })}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Link to={"/listing/" + short_id + "/available"}>
              <Button className="text-base py-2 px-6 bg-blue-500 hover:bg-blue-700 rounded shadow">
                {cost ? t("Book Now") : t("Check Availability")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
