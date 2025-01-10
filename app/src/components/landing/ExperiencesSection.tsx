import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';


interface Experience {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
}

const fetchExperiences = async (): Promise<Experience[]> => {
  // Simulated API call
  return [
    { id: 1, name: "Cooking Class in Tuscany", description: "Learn to cook authentic Italian dishes", image: "/placeholder.svg?height=300&width=400", category: "Culinary" },
    { id: 2, name: "Scuba Diving in Great Barrier Reef", description: "Explore the underwater world", image: "/placeholder.svg?height=300&width=400", category: "Adventure" },
    { id: 3, name: "Northern Lights Tour in Iceland", description: "Witness the magical aurora borealis", image: "/placeholder.svg?height=300&width=400", category: "Nature" },
    { id: 4, name: "Safari in Serengeti", description: "See the Big Five in their natural habitat", image: "/placeholder.svg?height=300&width=400", category: "Wildlife" },
    { id: 5, name: "Yoga Retreat in Bali", description: "Find inner peace in a tropical paradise", image: "/placeholder.svg?height=300&width=400", category: "Wellness" },
  ];
};

const ExperiencesSection: React.FC = () => {
  const { data: experiences, isLoading, error } = useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences,
  });

  if (isLoading) return <div className="p-4 text-center">Loading experiences...</div>;
  if (error) return <div className="p-4 text-center">Error loading experiences</div>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 px-4">Unforgettable Experiences</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 px-4">
        {experiences?.map((experience, index) => (
          <motion.div
            key={experience.id}
            className="flex-shrink-0 w-64"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <div className="relative h-40">
                <img 
                  src={experience.image} 
                  alt={experience.name} 

                />
                <Badge className="absolute top-2 left-2">
                  {experience.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{experience.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{experience.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <motion.div
          className="flex-shrink-0 w-64"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: experiences?.length ? experiences.length * 0.1 : 0.5 }}
        >
          <Card className="h-full flex flex-col justify-center items-center bg-primary text-primary-foreground">
            <CardContent className="text-center">
              <h3 className="text-xl font-bold mb-2">Explore More</h3>
              <p className="mb-4 text-sm">Discover unique activities worldwide.</p>
              <Button variant="secondary" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperiencesSection;

