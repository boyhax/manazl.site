import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MapPin, Share2, Star } from "lucide-react";

import { Card } from "src/components/ui/card";
import Image from "next/image";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "src/components/ui/card";
import Link from "next/link";
import { useCurrency } from "@/hooks/useCurrency";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";
import { useSearchParams } from "next/navigation";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useUserContext } from "@/providers/userProvider";

function get_cost(rooms: any) {
  let cost: any = null;
  rooms.forEach((room: any) => {
    room.available.forEach((available: any) => {
      if (!cost || available.cost < cost) {
        cost = available.cost
      }
    })


  })

  return cost

}
type Props = {
  short_id: string;
  id: string;
  images: string[];
  likes: any[];
  title: string;
  description: string;
  rating: number;
  rooms: any,
  cost: number;
  user: { full_name: string; avatar_url: string };
  featured: boolean;
  reviews: any[];
  address: any;
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
}: {
  data: Props;
}) {
  const _like = likes && likes.length ? likes[0] : null;
  const [like, setlike] = useState(_like);
  const { t } = { t: (s: string) => s };
  const reviewsCount = reviews && reviews.length ? reviews[0].count : 0;
  const { converted, currency } = useCurrency()
  let cost = get_cost(rooms);
  const params = useSearchParams()
  const { user: me } = useUserContext()

  async function handlelike() {
    let client = createClient()
    if (like) {
      const { data, error } = await client.from('likes').delete().eq('id', like.id)
      console.log('like deleted :>> ', like.id);
      !error && setlike(null)

    } else {
      const { data, error } = await client.from('likes').insert({
        listing_id: id, user_id: me.id
      }).select('id').single()
      console.log('like made data,error:>> ', data, error);
      data && setlike(data)

    }
  }

  return (
    <Card key={id} className="w-full max-w-md mx-auto overflow-hidden group">
      <CardHeader className="p-0 relative">
        <Carousel dir="ltr" className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  width={414} height={323}
                  src={image}
                  alt={`Listing image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={"start-5 "} />
          <CarouselNext className={"end-5 "} />
        </Carousel>

        <Button
          onClick={handlelike}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-5 text-white hover:bg-white/20"
        >
          {like ? <HeartFilledIcon color={"red"} className="h-6 w-6" />
            : <Heart className="h-6 w-6" />}
        </Button>
        <Button
          onClick={() => ({
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
      <Link href={`/listing/${short_id}/?${params.toString()}`}>
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
            {user ? <AvatarImage src={user.avatar_url} alt="Host" /> : null}
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="ms-2 text-sm font-medium line-clamp-1">
              {user ? user.full_name : ""}
            </p>
          </div>
        </div>
        <Link href={`/listing/${short_id}/?${params.toString()}`}>
          <Button
            variant="outline"
            size="sm"
            className="transition-transform hover:scale-105"
          >
            {cost ? (
              <p className="">
                {currency}{converted(cost)}
              </p>
            ) : t("Check Availablity")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
