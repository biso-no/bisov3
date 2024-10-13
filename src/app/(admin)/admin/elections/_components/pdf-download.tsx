"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { pdf } from '@react-pdf/renderer';
import ElectionResultsPDF from './pdf-results';
import { Election, DetailedVoteResult } from '../actions';

interface PDFDownloadButtonProps {
  election: Election;
  detailedResults: DetailedVoteResult[];
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ election, detailedResults }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const blob = await pdf(
        <ElectionResultsPDF election={election} detailedResults={detailedResults} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${election.name}_results.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading}>
      {isLoading ? 'Generating PDF...' : 'Download Results PDF'}
    </Button>
  );
};

export default PDFDownloadButton;