import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircleIcon, Share2, Star } from "lucide-react";

import { useTranslate } from "@tolgee/react";
import { Link, useNavigate } from "react-router-dom";
import Card from "src/components/Card";
import LikeButton from "src/components/LikeButton";
import { shareHundler } from "src/components/ShareLink";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { useCurrency } from "src/hooks/useCurrency";
import { getChatId } from "src/pages/chat/actions/chat.server";

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

export default function ({
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
}: {
  data: Props;
}) {
  const isLiked = likes && likes.length ? likes[0].count : false;
  const { t } = useTranslate();
  const { currency, converted } = useCurrency();
  const reviewsCount = reviews && reviews.length ? reviews[0].count : 0;
  const goto = useNavigate();
  const onchat = () => {
    getChatId(id).then(({ id }) => { goto('/chat/' + id)});
  }
  let cost = get_cost(rooms);
  
  return (
    <Card key={id} className="w-full mx-auto overflow-hidden group">
      <div className="flex flex-row">
        {/* Content Side */}
        <div className="flex-1 p-3">
          <div className="flex gap-2 items-center mb-2">
            <Link to={"/listing/" + short_id} className="flex-1">
              <h3 className="text-base font-semibold line-clamp-1">{title}</h3>
            </Link>
            {featured && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">
              {address?.city}, {address?.state}
            </span>
          </div>
          
          <div className="flex items-center text-xs mb-2">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span dir="ltr" className="ml-1 font-medium">
              {(rating / 20).toFixed(1)}({reviewsCount})
            </span>
          </div>
          
          <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
            {description}
          </p>
          
          {cost && (
            <p className="text-sm font-bold">
              {currency}{Number(converted(cost)).toFixed(0)}
            </p>
          )}
        </div>
        
        {/* Image Side */}
        <Link to={"/listing/" + short_id} className="w-1/3 relative">
          <img 
            src={images?.[0] || ''} 
            alt={title} 
            className="h-full w-full object-cover"
          />
          
        </Link>
      </div>
      
      {/* Action Footer */}
      <div className="px-3 py-2 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LikeButton
            id={id}
            isliked={isLiked}
            className=" h-6 w-6"
          />
          <Button size="sm" onClick={onchat} variant="ghost" className="h-7 w-7 p-0">
            <MessageCircleIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={shareHundler({
              text: "Find Your Next Amazing Travel Places Here check here",
              url: `/listing/${id}`,
            })}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        
        <Link to={"/listing/" + short_id + "/available"}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
          >
            {cost ? t("Book Now") : t("Check Availability")}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
