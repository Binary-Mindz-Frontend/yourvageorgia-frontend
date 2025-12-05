"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Globe, MessageCircle, MapPin, Calendar, Tag, InstagramIcon } from "lucide-react";
import { Partner } from "@/types/partner.types";
import { getPartnerById } from "@/services/partner/partner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [partner, setPartner] = useState<Partner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPartner = async () => {
            if (!params.id) return;

            setLoading(true);
            const result = await getPartnerById(params.id as string);

            if ("error" in result) {
                setError(result.error);
            } else {
                setPartner(result as Partner);
            }
            setLoading(false);
        };

        fetchPartner();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    
                    <Skeleton className="w-16 h-16 rounded-full mb-4" /> {/* Skeleton for the logo */}
                    <Skeleton className="w-32 h-6 mb-2" /> {/* Skeleton for the title */}
                    <Skeleton className="w-24 h-4 mb-3" /> {/* Skeleton for category */}
                    <Skeleton className="w-40 h-4 mb-4" /> {/* Skeleton for address */}
                </div>
            </div>
        );
    }

    if (error || !partner) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Button className="cursor-pointer" onClick={() => router.push('/dashboard/admin/partners')}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-black text-white">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Button className="cursor-pointer" variant="outline" onClick={() => router.push('/dashboard/admin/partners')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Main Content */}
            <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
                {/* Hero Section */}
                <div className="bg-linear-to-r from-blue-500 to-purple-600 p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Title */}
                            {loading ? (
                                <Skeleton className="w-32 h-6 mb-2" /> // Skeleton for the name
                            ) : (
                                <h1 className="text-3xl font-bold mb-2">{partner.name}</h1>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                                <span className="bg-white/20 px-3 py-1 rounded-full">
                                    {typeof partner.category === 'string'
                                        ? partner.category
                                        : partner.category.title}
                                </span>
                                {partner.isFeatured && (
                                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-semibold">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {loading ? (
                                    <Skeleton className="w-40 h-4" />
                                ) : (
                                    partner.address
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="p-8 border-b">
                    <h2 className="text-2xl font-semibold mb-4">
                        {loading ? <Skeleton className="w-32 h-4" /> : partner?.about?.title}
                    </h2>
                    <p className="text-gray leading-relaxed">
                        {loading ? <Skeleton className="w-full h-4" /> : partner?.about?.description}
                    </p>
                </div>

                {/* Offer Section */}
                {partner.offer && (
                    <div className="p-8 bg-gray-900 border-b">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className="w-5 h-5 text-green-600" />
                                    <h3 className="text-xl font-semibold text-green-600">Special Offer</h3>
                                </div>
                                <h4 className="text-lg font-medium mb-2">
                                    {loading ? <Skeleton className="w-32 h-4" /> : partner.offer.title}
                                </h4>
                                <p className="text-white mb-3">
                                    {loading ? <Skeleton className="w-full h-4" /> : partner.offer.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-white">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4 " />
                                        Valid until:{" "}
                                        {loading ? (
                                            <Skeleton className="w-24 h-4" />
                                        ) : (
                                            new Date(partner.offer.validUntil).toLocaleDateString()
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center bg-white rounded-lg p-4 shadow-md">
                                <div className="text-4xl font-bold text-green-600">
                                    {loading ? <Skeleton className="w-24 h-6" /> : partner.offer.offerPercentage}%{" "}
                                </div>
                                <div className="text-sm text-gray-600">OFF</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms & Conditions */}
                {partner.terms && partner.terms.length > 0 && (
                    <div className="p-8 border-b">
                        <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray">
                            {partner.terms.map((term, index) => (
                                <li key={index}>{term}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Contact Information */}
                <div className="">
                    {partner.contacts?.map((contact, index) => (
                        <div key={index} className="bg-gray-900 p-8 rounded-lg text-white my-8">
                            <h4 className="font-semibold mb-3 text-lg">{contact.officeName}</h4>
                            <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium">Phone:</span> {contact.phone}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium">Mobile:</span> {contact.mobile}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium">Email:</span> {contact.email}
                                </p>
                                <p className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                                    <span>
                                        <span className="font-medium">Address:</span> {contact.address}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Links */}
                <div className="p-8">
                    <h3 className="text-xl font-semibold mb-4 text-white text-center sm:text-left">Connect With Us</h3>
                    <div className="flex gap-2 justify-center flex-wrap sm:gap-4 sm:justify-start">
                        {partner.socials?.website && (
                            <a
                                href={partner.socials.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400 sm:px-4 sm:py-2 sm:gap-2"
                            >
                                <Globe className="w-5 h-5" />
                                <span className="hidden sm:inline">Website</span>
                            </a>
                        )}
                        {partner.socials?.instagram && (
                            <a
                                href={`https://instagram.com/${partner.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition focus:outline-none focus:ring-2 focus:ring-pink-400 sm:px-4 sm:py-2 sm:gap-2"
                            >
                                <InstagramIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Instagram</span>
                            </a>
                        )}
                        {partner.socials?.whatsapp && (
                            <a
                                href={`https://wa.me/${partner.socials.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400 sm:px-4 sm:py-2 sm:gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
