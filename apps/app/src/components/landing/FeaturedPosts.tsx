import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  testimonial: string;
  location: string;
}

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  // Simulated API call
  return [
    { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=80&width=80", testimonial: "TravelApp made planning my dream vacation a breeze. The experiences were unforgettable!", location: "New York, USA" },
    { id: 2, name: "Michael Chen", avatar: "/placeholder.svg?height=80&width=80", testimonial: "I've never had such a seamless travel experience. Highly recommended!", location: "Toronto, Canada" },
    { id: 3, name: "Emma Watson", avatar: "/placeholder.svg?height=80&width=80", testimonial: "The local guides TravelApp connected us with were knowledgeable and friendly. It made our trip extra special.", location: "London, UK" },
    { id: 4, name: "Carlos Rodriguez", avatar: "/placeholder.svg?height=80&width=80", testimonial: "From booking to return, everything was perfect. Can't wait for my next adventure with TravelApp!", location: "Barcelona, Spain" },
  ];
};

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });

  if (isLoading) return <div className="p-4 text-center">Loading testimonials...</div>;
  if (error) return <div className="p-4 text-center">Error loading testimonials</div>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 px-4">What Our Travelers Say</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 px-4">
        {testimonials?.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="flex-shrink-0 w-72"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">"{testimonial.testimonial}"</p>
                <div className="flex items-center mt-4">
                  <Avatar className="mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <motion.div
          className="flex-shrink-0 w-72"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: testimonials?.length ? testimonials.length * 0.1 : 0.5 }}
        >
          <Card className="h-full flex flex-col justify-center items-center bg-primary text-primary-foreground">
            <CardContent className="text-center p-6">
              <h3 className="text-xl font-bold mb-2">Share Your Story</h3>
              <p className="mb-4 text-sm">Had an amazing experience? Let others know!</p>
              <Button variant="secondary" className="group">
                Write a Testimonial
                <MessageSquarePlus className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

