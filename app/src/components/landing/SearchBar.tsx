import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-4">
      <Input
        type="search"
        placeholder="Search properties..."
        className="pl-9 pr-4 py-1 w-full rounded-full border-2 border-primary text-sm"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    </div>
  );
};

export default SearchBar;

