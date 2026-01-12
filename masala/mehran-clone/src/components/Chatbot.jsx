import React, { useState } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { products } from '../data/products';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Welcome to Al-Harmain Foods Assistant. I can help you with comprehensive details regarding our collection. Please ask about products, prices, or delivery information.", isBot: true }
    ]);
    const [input, setInput] = useState("");

    // A to Z Knowledge System (English Only, No Emojis)
    const getBotResponse = (userMsg) => {
        const msg = userMsg.toLowerCase().trim();

        // 1. Greetings & Identity
        if (msg.match(/^(hi|hello|hey|salam|assalam|salaam|kia hal|kaise ho|hay)/)) {
            return "Greetings! Welcome to Al-Harmain Foods. I am the Al-Harmain Assistant. I can provide information on product pricing, delivery details, and assist you with the ordering process. How can I help you today?";
        }

        // 2. Company Info
        if (msg.includes('who are you') || msg.includes('company') || msg.includes('about')) {
            return "Al-Harmain Foods is a premium spice brand. We provide 100% pure, halal, and authentic spices. Our quality is recommended by both professional chefs and home cooks.";
        }

        // 3. Price Queries
        if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
            const product = products.find(p =>
                msg.includes(p.name.toLowerCase()) ||
                p.name.toLowerCase().split(' ').some(word => word.length > 3 && msg.includes(word))
            );

            if (product) {
                const p50 = Math.floor(product.price * 0.6);
                const p100 = product.price;
                const p250 = Math.floor(product.price * 2.2);
                const p500 = Math.floor(product.price * 4.5);

                return `${product.name} Prices:\n\n50g: Rs. ${p50}\n100g: Rs. ${p100}\n250g: Rs. ${p250}\n500g: Rs. ${p500}\n\nDelivery: Rs. 300\nTax: 10% GST\n\nWould you like to proceed with an order for this item?`;
            }

            return "Our spice prices range from Rs. 270 to Rs. 2025 depending on the weight. Please specify the product name for detailed pricing.";
        }

        // 4. Product Range
        if (msg.includes('product') || msg.includes('items') || msg.includes('list') || msg.includes('masala')) {
            const pList = products.slice(0, 5).map(p => p.name).join('\n• ');
            return `We offer a wide variety of premium spices including:\n\n• ${pList}\n\nYou can view our complete collection in 'The Treasury' section of our website.`;
        }

        // 5. Delivery & Shipping
        if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('home delivery')) {
            return "Delivery Details:\n\n• Shipping Charges: Rs. 300 (Flat rate across Pakistan)\n• Delivery Time: 3 to 5 business days\n• Service: Doorstep delivery\n• Packaging: Premium and secure\n\nPlease provide your address to proceed with the delivery.";
        }

        // 6. Payment Methods
        if (msg.includes('payment') || msg.includes('pay')) {
            return "We offer 4 payment options:\n\n1. Cash on Delivery (COD)\n2. Bank Transfer (Dubai Islamic Bank)\n3. JazzCash\n4. EasyPaisa\n\nYou can select the most convenient method for you during checkout.";
        }

        // 7. Bank Details
        if (msg.includes('bank') || msg.includes('account') || msg.includes('transfer')) {
            return "Bank Details:\n\nBank: Dubai Islamic Bank\nTitle: Muhammad Tariq\nA/C #: 0282874002\n\nPlease share the payment screenshot on WhatsApp (0333-3666707) once the transfer is complete.";
        }

        // 8. Location
        if (msg.includes('shop') || msg.includes('location') || msg.includes('address') || msg.includes('office')) {
            return "Our main office is located in Karachi, and we offer online delivery across Pakistan. You can place your order directly through our website for home delivery.";
        }

        // 9. Quality & Halal
        if (msg.includes('halal') || msg.includes('quality') || msg.includes('pure')) {
            return "Al-Harmain Foods maintains the highest quality standards:\n\n• 100% Halal\n• No Artificial Colors\n• Sourced from Origin\n• Export Quality\n\nYou can trust the purity of our products.";
        }

        // 10. WhatsApp / Support
        if (msg.includes('whatsapp') || msg.includes('call') || msg.includes('number')) {
            return "For professional support or urgent inquiries:\n\nWhatsApp: 0333-3666707\nPhone: 03432309181\n\nWe are available to assist you.";
        }

        // 11. Discounts
        if (msg.includes('discount') || msg.includes('offer') || msg.includes('sale')) {
            return "Our prices are competitive for the premium quality we provide. However, for bulk orders, we offer special discounts. Please contact us on WhatsApp for more details.";
        }

        // 12. Thank you
        if (msg.includes('thank') || msg.includes('thanks')) {
            return "You are very welcome. Please let me know if there is anything else I can assist you with.";
        }

        // Default Response
        return "I apologize, but I did not understand your request. You may ask about:\n• Product prices (e.g., 'Black Pepper price')\n• Delivery information\n• Bank details\n• Our product list\n\nPlease rephrase your question or specify a product.";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { text: input, isBot: false }]);
        const userInput = input;
        setInput("");

        // Response with delay
        setTimeout(() => {
            const response = getBotResponse(userInput);
            setMessages(prev => [...prev, { text: response, isBot: true }]);
        }, 500);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--brand-primary)', color: '#000',
                    border: 'none', fontSize: '1.5rem', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(201, 162, 77, 0.4)',
                    zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <FaTimes /> : <FaComments />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '7rem', right: '2rem',
                    width: '350px', height: '520px', background: 'var(--surface-card)',
                    borderRadius: '20px', border: '1px solid rgba(201, 162, 77, 0.3)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    zIndex: 1500, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, var(--brand-primary) 0%, #8a6d2c 100%)',
                        color: 'black',
                        fontWeight: 'bold',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem'
                    }}>
                        <div style={{ width: '10px', height: '10px', background: '#00ff00', borderRadius: '50%', boxShadow: '0 0 10px #00ff00' }}></div>
                        Al-Harmain Assistant
                    </div>

                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#0a0a0a' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                            }}>
                                <div style={{
                                    background: msg.isBot ? 'rgba(255,255,255,0.05)' : 'var(--brand-primary)',
                                    color: msg.isBot ? 'var(--text-main)' : '#000',
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '15px',
                                    borderTopLeftRadius: msg.isBot ? '0' : '15px',
                                    borderTopRightRadius: msg.isBot ? '15px' : '0',
                                    maxWidth: '85%',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1.2rem', background: '#111', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            style={{
                                flex: 1,
                                padding: '0.9rem 1.2rem',
                                borderRadius: '25px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                outline: 'none',
                                background: 'rgba(255,255,255,0.03)',
                                color: 'white',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                background: 'var(--brand-primary)',
                                border: 'none',
                                color: 'black',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
