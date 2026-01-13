'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Partner } from '@/types/partner.types';
import { BeautifulLoader } from '@/components/Shared/Loading/BeautifulLoader';
import PartnerDetailsModal from '../_components/NetworkCardModal/PartnerDetailsModal';
import { getPartnerById } from '@/services/partner/partner';

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchPartner = async () => {
    try {
      const result = await getPartnerById(params.id as string);
      
      if ('error' in result) {
        console.error('Failed to fetch partner:', result.error);
        setPartner(null);
      } else {
        setPartner(result as Partner);
      }
    } catch (err) {
      console.error('Error:', err);
      setPartner(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (params.id) {
    fetchPartner();
  }
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
        onClose={() => router.push('/network')}
        partner={partner}
      />
    </div>
  );
}