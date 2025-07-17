import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Breadcrumb from "./Breadcrumb";

interface CollectionHeaderProps {
  category: string;
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemCount: number;
}

const CollectionHeader = ({ 
  category, 
  title, 
  subtitle, 
  searchQuery, 
  onSearchChange,
  itemCount 
}: CollectionHeaderProps) => {
  const breadcrumbItems = [
    { label: "Collections", href: "/" },
    { label: title }
  ];

  return (
    <div className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} available
            </p>
          </div>
          
          <div className="lg:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={`Search in ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;