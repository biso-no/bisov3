"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Election, DetailedVoteResult } from '../actions';
import { LoaderIcon } from 'lucide-react';

interface PDFDownloadButtonProps {
  election: Election;
  detailedResults: DetailedVoteResult[];
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({ election, detailedResults }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const [{ pdf }, { default: ElectionResultsPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./pdf-results'),
      ]);

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
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading}>
      {isLoading ? (
        <>
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        'Download Results PDF'
      )}
    </Button>
  );
};

export default PDFDownloadButton;
