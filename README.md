# Manazl App and Site

### Overview
Manazl is a homestay rental platform similar to Airbnb and Booking.com, catering primarily to Oman. The platform includes features such as:
- Chat functionality for communication between hosts and guests.
- A booking service for short-term and long-term stays.
- Search functionality for listings using geolocation.
- Host and guest management tools.

### Key Features
1. **User Authentication**
   - Secure sign-up/login using email, social media, or phone numbers.
   - Two-factor authentication (2FA) for added security.

2. **Search and Listings**
   - Geolocation-based search to find listings near a user’s location.
   - Filters for price, amenities, guest capacity, and availability.
   - Map view integration for visualizing listings.

3. **Booking System**
   - Real-time availability checking.
   - Instant booking and host approval workflows.
   - Secure payment gateway integration.

4. **Chat System**
   - Real-time messaging between hosts and guests.
   - Support for file attachments (e.g., documents, images).
   - AI-based response suggestions for hosts.

5. **Host Management**
   - Dashboard to manage listings, bookings, and earnings.
   - Review and rating management.
   - Calendar synchronization with external tools like Google Calendar.

6. **Guest Experience**
   - Wishlist feature to save favorite listings.
   - Review system to share experiences.
   - Travel recommendations and nearby attractions.

7. **Admin Panel**
   - Monitoring platform activity, including bookings, reviews, and disputes.
   - Fraud detection and resolution tools.
   - Analytics for site performance and user behavior.

### Tech Stack
- **Frontend**: Next.js with Tailwind CSS for a responsive and performant user interface.
- **Backend**: Node.js with Express.js for the API layer.
- **Database**: PostgreSQL with Supabase for real-time updates and scalable data storage.
- **Geolocation**: Google Places API for search and geocoding.
- **Payments**: Stripe for secure transactions.
- **Chat**: WebSockets or Firebase for real-time communication.
- **Hosting**: AWS EC2 for backend and Vercel for frontend deployment.

### Integration Plan
1. **Search with Geolocation**
   - Replace PostGIS with Google Places API.
   - Use Google Geocoding API for resolving addresses.

2. **Chat System**
   - Implement with Firebase or a custom WebSocket server.
   - Ensure end-to-end encryption for secure messaging.

3. **Booking Workflow**
   - Build using a custom state machine to handle booking states (e.g., pending, confirmed, canceled).

### Deployment
- **Frontend**: Deployed via Vercel for automatic CI/CD.
- **Backend**: Hosted on AWS EC2 with scalable architecture.
- **Database**: Supabase for real-time database features.

### Future Enhancements
- Multilingual support, focusing on Arabic and English.
- AI-based personalized recommendations for users.
- Integration with local payment gateways in Oman.

Manazl aims to provide a seamless experience for hosts and guests, ensuring security, scalability, and convenience for all users.

