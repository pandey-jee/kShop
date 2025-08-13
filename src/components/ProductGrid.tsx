import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isHot?: boolean;
  isDiscount?: boolean;
  rating?: number;
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  // Sample products data
  const products: Product[] = [
    {
      id: "1",
      name: "High-Performance LED Light Bar 42 Inch",
      price: 12999,
      originalPrice: 15999,
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
      category: "Auxiliary Lights",
      isHot: true,
      isDiscount: true,
      rating: 4.5
    },
    {
      id: "2", 
      name: "Premium Air Horn Kit with Compressor",
      price: 8500,
      image: "https://images.unsplash.com/photo-1609974936665-bb6c2f7f31e6?w=400",
      category: "Horns & Sounds",
      rating: 4.8
    },
    {
      id: "3",
      name: "Carbon Fiber Side Skirts Set",
      price: 25000,
      originalPrice: 28000,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
      category: "Modifications",
      isDiscount: true,
      rating: 4.3
    },
    {
      id: "4",
      name: "18 Inch Alloy Wheels Set of 4",
      price: 45000,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      category: "Wheels",
      isHot: true,
      rating: 4.7
    },
    {
      id: "5",
      name: "LED Toggle Switch Panel",
      price: 3500,
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400",
      category: "Switches",
      rating: 4.2
    },
    {
      id: "6",
      name: "Premium Leather Seat Covers",
      price: 15000,
      originalPrice: 18000,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
      category: "Accessories",
      isDiscount: true,
      rating: 4.6
    }
  ];

  const categoryOptions = ["All", "Horns & Sounds", "Auxiliary Lights", "Modifications", "Accessories", "Wheels", "Switches"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-automotive mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our extensive collection of premium automotive accessories designed to enhance your vehicle's performance and style.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            {categoryOptions.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-xs lg:text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;