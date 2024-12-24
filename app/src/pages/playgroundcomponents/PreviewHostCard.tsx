import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Share2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import Card from "../../components/Card";
import { CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import ImageCorousol from "../../components/imageCorousol";
import { useTranslate } from "@tolgee/react";

type Props = {
  id;
  images:string[];
  likes;
  title;
  description;
  rating;
  cost;
  user: { full_name; avatar_url };
  featured;
  reviews: { count: number };
};
export default function HostListingPreview({
  data: {
    cost,
    description,
    id,
    images,
    likes,
    rating,
    reviews,
    title,
    featured,
    user,
  },
}: {
  data: Props;
}) {
  const [isLiked, setIsLiked] = useState(!!likes);
  const { t } = useTranslate();
  const reviewsCount = reviews?reviews[0].count:0;
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden group">
      <CardHeader className="p-0 relative">
        <ImageCorousol images={images||[]} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-white/20"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
          />
        </Button>
        <Button
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
        <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full font-bold">
          {cost} <span className="text-sm font-normal">/ {t("night")}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">
              {(rating/20).toFixed(2)} ({reviewsCount})
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border-2 border-primary">
            <AvatarImage src={user?.avatar_url!} alt="Host" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="ms-2 text-sm font-medium line-clamp-1">{user.full_name}</p>
            {rating >= 60 ? (
              <p className="text-xs text-muted-foreground">Superhost</p>
            ) : null}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="transition-transform hover:scale-105"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
