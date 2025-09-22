ALTER TABLE "bookings"
RENAME TO "reservations"; 

ALTER TABLE "variants"
RENAME column "inventory" TO slots; 