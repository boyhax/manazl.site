import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircleIcon, Share2, Star, CalendarIcon, BedIcon, HomeIcon } from "lucide-react";

import { useTranslate } from "@tolgee/react";
import { Link, useNavigate } from "react-router-dom";
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
  variant?: 'default' | 'compact' | 'big';
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
  variant = 'default',
  className
}: HostCardProps) {
  const isLiked = likes && likes.length ? likes[0].count : false;
  const { t } = useTranslate();
  const { currency, converted } = useCurrency();
  const reviewsCount = reviews && reviews.length ? reviews[0].count : 0;
  const goto = useNavigate();
  const onchat = () => {
    getChatId(id).then(({ id }) => { goto('/chat/' + id)});
  }
  let cost = get_cost(rooms);
  
  // Compact variant - small image, minimal info, smaller buttons
  if (variant === 'compact') {
    return (
      <Card key={id} className={cn("w-full max-w-[500px] mx-auto overflow-hidden border rounded-lg", className)}>
        <div className="flex items-center p-2 gap-3">
          <Link to={"/listing/" + short_id} className="w-20 h-20 flex-shrink-0">
            <img 
              src={images?.[0] || ''} 
              alt={title} 
              className="h-full w-full object-cover rounded-lg"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-1">
              <Link to={"/listing/" + short_id} className="block">
                <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
              </Link>
              {featured && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-[10px] h-4">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1 text-[10px]">
                {address?.city}, {address?.state}
              </span>
            </div>
            
            {cost && (
              <p className="text-sm font-bold mt-1">
                {currency}{Number(converted(cost)).toFixed(0)}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <LikeButton
                  id={id}
                  isliked={isLiked}
                  className="h-6 w-6 p-0"
                />
                <Button size="sm" onClick={onchat} variant="ghost" className="h-6 w-6 p-0">
                  <MessageCircleIcon className="h-3 w-3" />
                </Button>
              </div>
              
              <Link to={"/listing/" + short_id + "/available"}>
                <Button
                  className="text-[10px] h-6 px-2 bg-blue-500 hover:bg-blue-700"
                >
                  {cost ? t("Book") : t("Check")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Big variant - large image, detailed info
  if (variant === 'big') {
    return (
      <Card key={id} className={cn("w-full max-w-[800px] mx-auto overflow-hidden border rounded-xl", className)}>
        <div className="flex flex-col md:flex-row">
          <Link to={"/listing/" + short_id} className="w-full md:w-2/5 h-48 md:h-auto relative">
            <img 
              src={images?.[0] || ''} 
              alt={title} 
              className="h-full w-full object-cover"
            />
            {featured && (
              <Badge variant="secondary" className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
          </Link>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <Link to={"/listing/" + short_id}>
                <h3 className="text-xl font-semibold">{title}</h3>
              </Link>
              
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span dir="ltr" className="ml-1 font-medium">
                  {(rating / 20).toFixed(1)} ({reviewsCount})
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {address?.city}, {address?.state}
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {rooms && rooms.length > 0 && (
                <div className="flex items-center text-sm">
                  <BedIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{rooms.length} {rooms.length === 1 ? t("Room") : t("Rooms")}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <HomeIcon className="h-4 w-4 mr-1 text-muted-foreground" />
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
                <span className="text-sm font-medium">{user?.full_name}</span>
              </div>
              
              {cost && (
                <p className="text-xl font-bold">
                  {currency}{Number(converted(cost)).toFixed(0)}
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <div className="flex items-center gap-2">
                <LikeButton
                  id={id}
                  isliked={isLiked}
                  className="h-8 w-8 p-0"
                />
                <Button size="sm" onClick={onchat} variant="ghost" className="h-8 w-8 p-0">
                  <MessageCircleIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
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
                  className="text-sm py-2 px-4 bg-blue-500 hover:bg-blue-700"
                >
                  {cost ? t("Book Now") : t("Check Availability")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Default variant - improved responsive layout
  return (
    <Card key={id} className={cn("w-full max-w-[600px] mx-auto overflow-hidden group border-b pb-1", className)}>
      <div className="flex flex-col sm:flex-row">
        {/* Image Side - full width on mobile, 1/3 on tablet/desktop */}
        <Link to={"/listing/" + short_id} className="w-full sm:w-1/3 h-40 sm:h-auto relative">
          <img 
            src={images?.[0] || ''} 
            alt={title} 
            className="h-full w-full object-cover"
          />
          {featured && (
            <Badge variant="secondary" className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
              Featured
            </Badge>
          )}
        </Link>
        
        {/* Content Side */}
        <div className="flex-1 p-3">
          <div className="flex gap-2 items-center mb-2">
            <Link to={"/listing/" + short_id} className="flex-1">
              <h3 className="text-base font-semibold line-clamp-1">{title}</h3>
            </Link>
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
          
          {cost && (
            <p className="text-sm font-bold">
              {currency}{Number(converted(cost)).toFixed(0)}
            </p>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LikeButton
                id={id}
                isliked={isLiked}
                className="h-7 w-7 p-0"
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
                className="text-xs h-7 bg-blue-500 hover:bg-blue-700"
              >
                {cost ? t("Book Now") : t("Check Availability")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
