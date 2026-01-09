import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck } from "lucide-react";
import useCart from "@/hooks/useCart";
import { useState, useEffect } from "react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotalPrice, getCartTotalQuantity } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "delivery">("paystack");

  const totalPrice = getCartTotalPrice();
  const totalQuantity = getCartTotalQuantity();
  const shippingFee = totalPrice >= 50000 ? 0 : 5000; // Free shipping over ₦50,000
  const finalTotal = totalPrice + shippingFee;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePaystackPayment = () => {
    // Paystack payment integration
    // In production, this would call your backend API to initialize Paystack payment
    const handler = (window as any).PaystackPop?.setup({
      key: "pk_test_YOUR_PUBLIC_KEY", // Replace with your Paystack public key
      email: "customer@example.com", // Get from user profile
      amount: finalTotal * 100, // Amount in kobo (lowest currency unit)
      currency: "NGN",
      ref: `DRI-${Date.now()}`, // Generate unique reference
      metadata: {
        cart_items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.priceValue,
        })),
      },
      callback: function (response: any) {
        // Handle successful payment
        alert("Payment successful! Reference: " + response.reference);
        clearCart();
        navigate("/");
      },
      onClose: function () {
        alert("Payment window closed.");
      },
    });
    handler.openIframe();
  };

  const handlePayOnDelivery = () => {
    // Handle pay on delivery order
    alert("Order placed successfully! You will pay on delivery.");
    clearCart();
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background py-8 md:py-12">
          <div className="main">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted hover:text-main mb-6 transition-colors font-space uppercase text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingBag size={48} className="text-muted" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-muted mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors"
              >
                <ShoppingBag size={18} />
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background py-8 md:py-12">
        <div className="main">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-main uppercase font-space mb-2">
                Shopping Cart
              </h1>
              <p className="text-muted text-sm md:text-base">
                {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-line text-main font-space font-semibold uppercase text-sm hover:bg-secondary transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-secondary p-4 md:p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Product Image */}
                  <Link
                    to={`/shop/${item.id}`}
                    className="w-full md:w-32 h-32 bg-background flex-shrink-0 overflow-hidden"
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-muted text-xs font-space uppercase text-center">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/shop/${item.id}`}
                          className="text-lg font-semibold text-main hover:text-main/80 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted font-space uppercase">
                          {item.category}
                        </p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 mt-2">
                            {item.selectedSize && (
                              <span className="text-xs px-2 py-1 bg-background text-main font-space">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs px-2 py-1 bg-background text-main font-space">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted hover:text-main transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-background transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-space font-semibold text-main min-w-[50px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-background transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-main font-space">
                        ₦{(item.priceValue * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-main uppercase font-space mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-main font-semibold">₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Shipping</span>
                    <span className="text-main font-semibold">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₦${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-line pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-main uppercase font-space">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-main font-space">
                      ₦{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6 space-y-3">
                  <label className="block text-sm font-semibold text-main uppercase font-space mb-3">
                    Payment Method
                  </label>
                  <button
                    onClick={() => setPaymentMethod("paystack")}
                    className={`w-full flex items-center gap-3 p-4 border-2 transition-all ${
                      paymentMethod === "paystack"
                        ? "border-main bg-main/10"
                        : "border-line hover:border-main/50"
                    }`}
                  >
                    <CreditCard size={20} />
                    <span className="font-space font-semibold text-sm">Pay with Paystack</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("delivery")}
                    className={`w-full flex items-center gap-3 p-4 border-2 transition-all ${
                      paymentMethod === "delivery"
                        ? "border-main bg-main/10"
                        : "border-line hover:border-main/50"
                    }`}
                  >
                    <Truck size={20} />
                    <span className="font-space font-semibold text-sm">Pay on Delivery</span>
                  </button>
                </div>

                {/* Payment Buttons */}
                {paymentMethod === "paystack" ? (
                  <button
                    onClick={handlePaystackPayment}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors mb-3"
                  >
                    <CreditCard size={18} />
                    <span>Pay Now with Paystack</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePayOnDelivery}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-colors mb-3"
                  >
                    <Truck size={18} />
                    <span>Place Order (Pay on Delivery)</span>
                  </button>
                )}

                <Link
                  to="/shop"
                  className="block text-center text-sm text-muted hover:text-main transition-colors font-space uppercase"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

