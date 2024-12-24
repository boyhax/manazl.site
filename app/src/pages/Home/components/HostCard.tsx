import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Share2, Star } from "lucide-react";

import { useTranslate } from "@tolgee/react";
import { Link } from "react-router-dom";
import Card from "src/components/Card";
import LikeButton from "src/components/LikeButton";
import { shareHundler } from "src/components/ShareLink";
import ImageCorousol from "src/components/imageCorousol";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "src/components/ui/card";
import { useCurrency } from "src/hooks/useCurrency";

function get_cost(rooms) {
  let cost = null;
  rooms.forEach((room, index, array) => {
    room.available.forEach((available, index, array) => {
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
  const { currency, converted } = useCurrency()
  const reviewsCount = reviews && reviews.length ? reviews[0].count : 0;


  let cost = get_cost(rooms);
  return (
    <Card key={id} className="w-full max-w-md mx-auto overflow-hidden group">
      <CardHeader className="p-0 relative">
        <ImageCorousol images={images || []} />
        <LikeButton
          id={id}
          isliked={isLiked}
          className="absolute top-2 right-2 text-white hover:bg-white/20"
        />

        <Button
          onClick={shareHundler({
            text: "Find Your Next Amazing Travel Places Here check here",
            url: `/listing/${id}`,
          })}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-12 text-white hover:bg-white/20"
        >
          <Share2 className="h-6 w-6" />
        </Button>

        <div className="absolute top-2 left-2">
          {featured ? (
            <Badge
              variant="secondary"
              className="bg-primary text-primary-foreground"
            >
              Featured
            </Badge>
          ) : null}
        </div>

      </CardHeader>
      <Link to={"/listing/" + short_id}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span dir="ltr" className="ml-1 text-sm font-medium">
                {(rating / 20).toFixed(2).toString()}({reviewsCount})
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {address?.city}, {address?.state}
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border-2 border-primary">
            <AvatarImage src={user ? user.avatar_url : ""} alt="Host" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="ms-2 text-sm font-medium line-clamp-1">
              {user ? user.full_name : ""}
            </p>
          </div>
        </div>
        <Link to={"/listing/" + short_id}>
          <Button
            variant="outline"
            size="sm"
            className="transition-transform hover:scale-105"
          >{cost ?
            <p>
              {currency}{converted(cost)}{' '}
              {t("Book Now")} </p>
            : t("Check Availablity")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
