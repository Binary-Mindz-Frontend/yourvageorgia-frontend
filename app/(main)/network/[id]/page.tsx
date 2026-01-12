'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Partner } from '@/types/partner.types';
import { getPartners } from '@/services/partner/getpartner';
import { BeautifulLoader } from '@/components/Shared/Loading/BeautifulLoader';
import PartnerDetailsModal from '../_components/NetworkCardModal/PartnerDetailsModal';

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const result = await getPartners({ limit: 1000 });
        if ('error' in result) {
          console.error('Failed to fetch partners');
          return;
        }
        
        const found = result.data?.find((p) => p._id === params.id);
        setPartner(found || null);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartner();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BeautifulLoader size="lg" text="Loading partner details" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Partner not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <PartnerDetailsModal
        onClose={() => router.back()}
        partner={partner}
      />
    </div>
  );
}