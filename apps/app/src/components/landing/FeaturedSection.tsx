import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Building, TreePine, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  slug: string,
  description: string;
  icon: React.ReactNode;
}

const fetchCategories = async (): Promise<Category[]> => {
  // Simulated API call
  return [
    {
      id: 1,
      name: "Homes for Sale",
      slug: "reals-sale",
      description: "Find your dream home",
      icon: <Home className="h-10 w-10" />,
    },
    {
      id: 2,
      name: "Homes for Renting",
      description: "Perfect rentals",
      slug: "reals-renting",
      icon: <Building className="h-10 w-10" />,
    },
    {
      id: 3,
      name: "Lands for Sale",
      slug: "lands-sale",
      description: "Invest in real estate",
      icon: <TreePine className="h-10 w-10" />,
    },
  ];
};

const FeaturedSection: React.FC = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['propertyCategories'],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div className="p-4 text-center">Loading categories...</div>;
  if (error) return <div className="p-4 text-center">Error loading categories</div>;

  return (

      <div className="grid grid-cols-2 gap-4">
        {categories?.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={category.slug}>
              <Card className="h-full">
                <CardHeader className="p-2 pb-2 flex flex-col items-center">
                  <div className="text-primary mb-2">
                    {category.icon}
                  </div>
                  <CardTitle className="text-base text-center">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-center">
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>

                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categories?.length ? categories.length * 0.1 : 0.5 }}
        >
          <Card className="h-full flex flex-col justify-center items-center bg-primary text-primary-foreground">
            <CardContent className="text-center p-4">
              <Plus className="h-16 w-16 mb-2" />
              <h3 className="text-lg font-bold mb-2">Add Your</h3>
              {/* <p className="mb-4 text-sm">Discover all listings</p> */}
             
            </CardContent>
          </Card>
        </motion.div>
      </div>

  );
};

export default FeaturedSection;

