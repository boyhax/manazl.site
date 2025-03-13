import { Heart } from "lucide-react";
import { useState } from "react";
import useLike from "src/hooks/useLike";
import { auth } from "src/state/auth";
import { Button } from "./ui/button";
import { cn } from "src/lib/utils";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "src/hooks/use-toast";

interface LikeButtonProps {
  id: string | number;
  isliked?: boolean;
  className?: string;
  iconSize?: number;
  showTooltip?: boolean;
  [key: string]: any;
}

export default function LikeButton({ 
  isliked, 
  id, 
  className,
  iconSize = 6,
  showTooltip = false,
  ...props 
}: LikeButtonProps) {
  const { session } = auth();
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const { error, liked, loading, onLike, ondisLike } = useLike(id as string, isliked);
  const {toast} = useToast()
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      toast({title:"Sign in First",duration:2000})
      return;
    }
    
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    
    if (liked) {
      ondisLike();
    } else {
      onLike();
    }
  };
  
  const button = (
    <Button
      onClick={handleClick}
      disabled={loading || error}
      variant="ghost"
      size="icon"
      className={cn(
        "relative transition-all duration-200 hover:scale-110 active:scale-90",
        liked ? "text-red-500" : "text-foreground hover:text-red-400",
        className
      )}
      {...props}
    >
      <Heart
        className={cn(
          `h-${iconSize} w-${iconSize} transition-all duration-200`,
          liked ? "fill-red-500 text-red-500" : "text-inherit",
          animating && liked ? "scale-110" : "",
          animating && !liked ? "animate-ping scale-125 opacity-70" : ""
        )}
      />
    </Button>
  );
  
  if (!showTooltip) return button;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          {session ? (liked ? "Remove from favorites" : "Add to favorites") : "Sign in to save"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function HeaderLikeButton({ 
  id, 
  iconSize = 6,
  ...props 
}: Omit<LikeButtonProps, "isliked"> & { 
  iconSize?: number 
}) {
  const { session } = auth();
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const { error, liked, loading, onLike, ondisLike } = useLike(id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    
    if (liked) {
      ondisLike();
    } else {
      onLike();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading || error}
      variant="ghost"
      className={cn(
        "relative transition-all duration-200",
        liked ? "text-red-500" : "text-foreground hover:text-red-400",
        props.className
      )}
      {...props}
    >
      <Heart
        className={cn(
          `h-${iconSize} w-${iconSize} transition-all duration-200`,
          liked ? "fill-red-500 text-red-500" : "text-inherit",
          animating && liked ? "scale-110" : "",
          animating && !liked ? "animate-ping scale-125 opacity-70" : ""
        )}
      />
    </Button>
  );
}
