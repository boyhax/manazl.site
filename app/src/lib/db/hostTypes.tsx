import { ListingType } from "./listings";

export const typeimage = (type: ListingType) => {
   switch (type) {
     case "Apartment":
       return "src/assets/types/apartment.jpeg";
     case "villa":
       return "src/assets/types/villa.jpeg";
     case "camp":
       return "src/assets/types/camp.jpeg";
     case "tents":
       return "src/assets/types/tents.jpeg";
     case "caravan":
       return "src/assets/types/caravan.jpeg";
 
     case "room":
       return "src/assets/types/room.jpeg";
 
     default:
       return "src/assets/types/camp.jpeg";
   }
 };

   