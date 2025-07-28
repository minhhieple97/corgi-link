'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteUrl } from './use-delete-url';
import { UI_CONSTANTS } from '@/constants';
import { useRouter } from 'next/navigation';
import { env } from '@/env';

export const useUserUrlsTable = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrCodeShortCode, setQrCodeShortCode] = useState<string>('');
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<{
    id: number;
    shortCode: string;
    expiresAt?: Date | null;
  } | null>(null);

  const router = useRouter();
  const { handleDelete: deleteUrlAction } = useDeleteUrl({});
  const [deletingUrlId, setDeletingUrlId] = useState<number | null>(null);

  const getShortUrl = (shortCode: string) => {
    return `${env.NEXT_PUBLIC_APP_URL}${UI_CONSTANTS.URL_PREFIX_SEPARATOR}${shortCode}`;
  };

  const copyToClipboard = async (shortCode: string) => {
    const shortUrl = getShortUrl(shortCode);

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success(UI_CONSTANTS.TOAST_MESSAGES.COPY_SUCCESS, {
        description: 'The short URL has been copied to your clipboard',
      });
    } catch (error) {
      console.error('Failed to copy short URL to clipboard', error);
      toast.error('Failed to copy to clipboard', {
        description: 'Please try again or copy manually',
      });
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingUrlId(id);
    deleteUrlAction(id);
  };
  const showQrCode = (shortCode: string) => {
    const shortUrl = getShortUrl(shortCode);
    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  const handleEdit = (id: number, shortCode: string, expiresAt?: Date | null) => {
    setUrlToEdit({ id, shortCode, expiresAt });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    if (!urlToEdit) return;

    toast.success('URL updated successfully', {
      description: 'The short code has been updated',
    });
  };

  const closeQrCodeModal = () => {
    setIsQrCodeModalOpen(false);
    setQrCodeUrl('');
    setQrCodeShortCode('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUrlToEdit(null);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard?page=${newPage}`);
  };

  return {
    isDeleting: deletingUrlId,
    qrCodeUrl,
    qrCodeShortCode,
    isQrCodeModalOpen,
    isEditModalOpen,
    urlToEdit,

    copyToClipboard,
    handleDelete,
    showQrCode,
    handleEdit,
    handleEditSuccess,
    closeQrCodeModal,
    closeEditModal,

    setIsQrCodeModalOpen,
    setIsEditModalOpen,

    getShortUrl,
    handlePageChange,
  };
};
