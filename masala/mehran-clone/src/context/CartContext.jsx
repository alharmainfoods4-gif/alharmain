import React, { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cart.service';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isGiftBoxOrder, setIsGiftBoxOrder] = useState(() => {
        return localStorage.getItem('isGiftBoxOrder') === 'true';
    });
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    // Load cart on initial mount and when auth status changes
    useEffect(() => {
        const loadCart = async () => {
            // Wait for auth to finish loading before loading cart
            if (authLoading) return;

            setLoading(true);
            try {
                if (isAuthenticated) {
                    // Check if there are items in guest cart to sync
                    const localCart = localStorage.getItem('guest_cart');
                    const guestItems = localCart ? JSON.parse(localCart) : [];

                    if (guestItems.length > 0) {
                        // Sync each guest item to backend
                        for (const item of guestItems) {
                            const pid = item._id || item.id;
                            await cartService.addToCart(pid, item.quantity, item.variant?.size);
                        }
                        // Clear guest cart after syncing
                        localStorage.removeItem('guest_cart');
                    }

                    // Fetch finalized cart from backend
                    const response = await cartService.getCart();
                    if (response.success && response.cart) {
                        setCartItems(response.cart.items || []);
                    }
                } else {
                    // Load from localStorage for guests
                    const localCart = localStorage.getItem('guest_cart');
                    if (localCart) {
                        setCartItems(JSON.parse(localCart));
                    }
                }
            } catch (error) {
                console.error('Failed to load/sync cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [isAuthenticated, authLoading]);

    // Save guest cart to localStorage whenever it changes
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('guest_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    useEffect(() => {
        localStorage.setItem('isGiftBoxOrder', isGiftBoxOrder.toString());
    }, [isGiftBoxOrder]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subTotal = cartItems.reduce((acc, item) => {
        // Handle both local (item.basePrice) and backend-populated (item.product.basePrice) structures
        const price = item.variant?.price ||
            item.product?.basePrice ||
            item.product?.price ||
            item.basePrice ||
            item.price || 0;
        return acc + (price * item.quantity);
    }, 0);

    const addToCart = async (product, quantity, selectedVariant = null) => {
        try {
            if (isAuthenticated) {
                const productId = product._id || product.id;
                const response = await cartService.addToCart(productId, quantity, selectedVariant?.size);
                if (response.success) {
                    setCartItems(response.cart.items);
                }
            } else {
                // Local state update for guests
                setCartItems(prev => {
                    const existing = prev.find(item =>
                        (item._id === product._id || item.id === product.id) &&
                        (!selectedVariant || item.variant?.size === selectedVariant.size)
                    );

                    if (existing) {
                        return prev.map(item =>
                            (item._id === product._id || item.id === product.id) &&
                                (!selectedVariant || item.variant?.size === selectedVariant.size)
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    }

                    return [...prev, {
                        ...product,
                        quantity,
                        variant: selectedVariant ? { size: selectedVariant.size, price: selectedVariant.price } : null
                    }];
                });
            }
            setIsCartOpen(true);
        } catch (error) {
            console.error('Add to cart failed:', error);
            alert('Failed to add item to cart');
        }
    };

    const updateQuantity = async (productId, delta, variantSize = null) => {
        try {
            const item = cartItems.find(i =>
                (i.product?._id || i._id || i.id) === productId &&
                (!variantSize || i.variant?.size === variantSize)
            );
            if (!item) return;

            const newQty = Math.max(0, item.quantity + delta);

            if (isAuthenticated) {
                const response = await cartService.updateQuantity(productId, newQty, variantSize);
                if (response.success) {
                    setCartItems(response.cart.items);
                }
            } else {
                if (newQty === 0) {
                    removeItem(productId, variantSize);
                } else {
                    setCartItems(prev => prev.map(i =>
                        (i.product?._id || i._id || i.id) === productId && (!variantSize || i.variant?.size === variantSize)
                            ? { ...i, quantity: newQty }
                            : i
                    ));
                }
            }
        } catch (error) {
            console.error('Update quantity failed:', error);
        }
    };

    const removeItem = async (productId, variantSize = null) => {
        try {
            if (isAuthenticated) {
                const response = await cartService.removeProduct(productId, variantSize);
                if (response.success) {
                    setCartItems(response.cart.items);
                }
            } else {
                setCartItems(prev => prev.filter(i =>
                    !((i.product?._id || i._id || i.id) === productId && (!variantSize || i.variant?.size === variantSize))
                ));
            }
        } catch (error) {
            console.error('Remove item failed:', error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setIsGiftBoxOrder(false);
        localStorage.removeItem('isGiftBoxOrder');
        if (!isAuthenticated) {
            localStorage.removeItem('guest_cart');
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            subTotal,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            loading,
            isGiftBoxOrder,
            setIsGiftBoxOrder,
            showCheckoutModal,
            setShowCheckoutModal
        }}>
            {children}
        </CartContext.Provider>
    );
};
