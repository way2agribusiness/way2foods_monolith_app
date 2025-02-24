'use client';  // Add this line at the top of your file

import React from 'react';

const ContactUs = () => {
    const handlePhoneClick = (phoneNumber) => {
        const url = `https://wa.me/91${phoneNumber}`;
        window.open(url, '_blank');
    };

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h2>

                {/* Address Section */}
                <div className="text-lg text-gray-700 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Contact Address</h3>
                    <p className="mb-4">
                        ಕೃಷಿ ಉದ್ದಿಮೆ ಕೇಂದ್ರ/ Agribusiness Center # 636, BDA Block 2, APMC (RMC) Yard,
                        Yeshwanthpura, Bengaluru - 560022
                    </p>
                </div>

                {/* Phone & WhatsApp Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Phone & Landline</h3>
                        <ul className="space-y-4 text-lg text-gray-700">
                            <li>
                                <button
                                    onClick={() => handlePhoneClick('8277078435')}
                                    className="hover:text-green-500">
                                    +91 8277078435
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handlePhoneClick('9449004956')}
                                    className="hover:text-green-500">
                                    +91 9449004956
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handlePhoneClick('08095000388')}
                                    className="hover:text-green-500">
                                    +91 080-95000388
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Email Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">E-Mail</h3>
                        <ul className="space-y-4 text-lg text-gray-700">
                            <li>
                                <a href="mailto:way2foods@way2agribusiness.com" className="hover:text-green-500">
                                    way2foods@way2agribusiness.com
                                </a>
                            </li>
                            <li>
                                <a href="mailto:way2foods@gmail.com" className="hover:text-green-500">
                                    way2foods@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Additional Message Section */}
                <div className="text-lg text-gray-700">
                    <p>
                        We’re happy to assist you with any inquiries. Reach out to us via phone, WhatsApp, or email, and we’ll get back to you promptly.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
