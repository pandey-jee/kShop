import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Mail, CreditCard, Truck, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import api from '@/lib/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get cart items from state or localStorage
  const cartItems: CartItem[] = location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]');
  
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total + shipping;

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};
    
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.email.trim()) newErrors.email = 'Email is required';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Phone validation
    if (address.phone && !/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Email validation
    if (address.email && !/\S+@\S+\.\S+/.test(address.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async (orderData: any) => {
    const isRazorpayLoaded = await initializeRazorpay();
    
    if (!isRazorpayLoaded) {
      toast({
        title: 'Payment Error',
        description: 'Razorpay SDK failed to load. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create Razorpay order
      const { data } = await api.post('/payment/create-order', {
        amount: finalTotal,
        currency: 'INR',
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_9WqAlav6LSOn9O',
        amount: data.amount,
        currency: data.currency,
        name: 'Panditji Auto Connect',
        description: 'Auto Parts Purchase',
        image: '/favicon.ico',
        order_id: data.id,
        handler: async (response: any) => {
          try {
            // Verify payment and create order
            const verifyResponse = await api.post('/payment/verify', {
              ...response,
              orderData
            });

            if (verifyResponse.data.success) {
              localStorage.removeItem('cartItems');
              toast({
                title: 'Payment Successful',
                description: 'Your order has been placed successfully!',
              });
              navigate(`/order-confirmation/${verifyResponse.data.order._id}`, {
                state: { order: verifyResponse.data.order }
              });
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Payment Error',
              description: 'Payment verification failed. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: total,
        shippingPrice: shipping,
        totalPrice: finalTotal
      };

      if (paymentMethod === 'ONLINE') {
        await handleOnlinePayment(orderData);
      } else {
        // COD Order
        const response = await api.post('/orders/cod', orderData);
        
        if (response && response.order) {
          localStorage.removeItem('cartItems');
          toast({
            title: 'Order Placed',
            description: 'Your order has been placed successfully!',
          });
          navigate(`/order-confirmation/${response.order._id}`, {
            state: { order: response.order }
          });
        }
      }
    } catch (error: any) {
      console.error('Order placement failed:', error);
      toast({
        title: 'Order Failed',
        description: error.response?.data?.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Shipping Address Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={address.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="10-digit phone number"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={address.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={address.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="House number, street name"
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={address.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="ZIP Code"
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={address.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value: 'COD' | 'ONLINE') => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                      </div>
                      <Badge variant="secondary">
                        <Truck className="mr-1 h-3 w-3" />
                        COD
                      </Badge>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="ONLINE" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Online Payment</p>
                        <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
                      </div>
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        <Shield className="mr-1 h-3 w-3" />
                        Secure
                      </Badge>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">Free shipping on orders over ₹999!</p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Payment Method:</strong> {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {paymentMethod === 'COD' 
                        ? 'Pay when your order is delivered to your doorstep'
                        : 'Secure payment powered by Razorpay'
                      }
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading 
                      ? 'Processing...' 
                      : paymentMethod === 'COD' 
                        ? 'Place Order' 
                        : `Pay ₹${finalTotal.toLocaleString()}`
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
