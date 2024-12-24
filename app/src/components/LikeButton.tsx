import { Heart } from "lucide-react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";

import useLike from "src/hooks/useLike";
import { auth } from "src/state/auth";
import { Button } from "./ui/button";

export default function ({ isliked, id, ...props }) {
  const { session } = auth();

  const { error, liked, loading, onLike, ondisLike } = useLike(id, isliked);
  return (
    <Button
      onClick={liked ? ondisLike : onLike}
      disabled={loading || !session || error}
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 text-white hover:bg-white/20"
    >
      <Heart
        className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
      />
    </Button>
  );

}

export function HeaderLikeButton({ id, ...props }) {
  const { session } = auth();

  const { error, liked, loading, onLike, ondisLike } = useLike(id);

  return (
    <Button
      onClick={liked ? ondisLike : onLike}
      disabled={loading || !session || error}
      {...props}
      variant="ghost"
    >
      <Heart
        className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`}
      />
    </Button>
  );
}
