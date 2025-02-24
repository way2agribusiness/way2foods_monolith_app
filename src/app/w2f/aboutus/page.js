import React from 'react';

const AboutUs = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">About Way2Foods</h2>

                <div className="text-lg text-gray-700 mb-12">
                    <p className="mb-4">
                        Way2Agribusiness India Pvt. Ltd., established in March 2014, is a social enterprise committed to transforming agriculture into agribusiness. We provide comprehensive, one-stop solutions for farmers and agribusiness enterprises to enhance their competitiveness through innovative products and services.
                    </p>
                    <p>
                        We operate under two main initiatives: Way2Agritech for agricultural inputs and Way2Foods for agricultural outputs. Our services cater to a wide range of stakeholders, from farmers to agri-entrepreneurs.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                        <p className="text-lg text-gray-700">
                            To be the leading one-stop solution provider for farmers and agribusiness enterprises by offering comprehensive services that enhance business competitiveness.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                        <p className="text-lg text-gray-700">
                            We aim to empower farmers and agri-entrepreneurs by providing enabling products and services that enhance their competitiveness in the agricultural and agribusiness sectors.
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg p-8 rounded-lg text-left">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Objectives</h3>
                    <ul className="list-disc pl-6 text-lg text-gray-700">
                        <li>Provide research-based consultancy services and contemporary solutions in agribusiness.</li>
                        <li>Seamless project implementation and management for agribusiness ventures.</li>
                        <li>Engage in trading operations of agri-outputs and inputs, including implements and machinery.</li>
                    </ul>
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Five for Five</h3>
                    <p className="text-lg text-gray-700">
                        The "Five for Five" initiative focuses on niche contributions to the transformation of agriculture into agribusiness, addressing the evolving needs of farmers, agritech startups, entrepreneurs, and government bodies.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
