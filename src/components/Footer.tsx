import { MessageCircle, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-automotive text-automotive-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Panditji.shop</h3>
            <p className="text-automotive-foreground/80 mb-6 max-w-md">
              Your trusted partner for premium vehicle accessories and performance parts. 
              Quality products, fast delivery, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-green-400 hover:bg-green-400/10"
                onClick={() => window.open('https://wa.me/9034667768', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-pink-400 hover:bg-pink-400/10"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-automotive-foreground/80">
              <li><a href="#" className="hover:text-primary transition-colors">Horns & Sounds</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Auxiliary Lights</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Modifications</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Wheels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-automotive-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>9034667768</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>kgpanditjishop@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span>Maha Laxmi AutoMobile, India</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-automotive-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-automotive-foreground/60">
          <p>&copy; 2024 Panditji.shop. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;