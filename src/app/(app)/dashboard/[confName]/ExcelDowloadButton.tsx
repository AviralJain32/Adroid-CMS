'use client';

import React, { useState } from 'react';
import { exportToExcel } from '@/helpers/exportToExcel';
import { SubmittedPaper } from '@/types/SubmittedPaperType';
import moment from 'moment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaperRangeSelector } from './RangeComponent';
import { SelectIcon } from '@radix-ui/react-select';
import { ChevronsUpDown } from 'lucide-react';

const DownloadExcelButton = ({ papers }: { papers: SubmittedPaper[] }) => {
  const getAuthorDetails = (authors: any[]) => {
    const names = authors.map(author => author.userId?.fullname || author.name).join(', ');
    const emails = authors.map(author => author.userId?.email || author.email || 'N/A').join(', ');
    const affiliations = authors.map(author => author.userId?.affiliation || author.affilation || 'N/A').join(', ');
    return { names, emails, affiliations };
  };

  const sanitizedPapers = papers.map((paper: SubmittedPaper) => {
    const submissionDate = moment(paper.paperSubmissionDate).format('MMMM Do YYYY, h:mm:ss a');
    const correspondingAuthors = getAuthorDetails(paper.correspondingAuthor);
    const allAuthors = getAuthorDetails(paper.paperAuthor);

    return {
      Timestamp: submissionDate,
      PaperID: paper.paperID,
      PaperTitle: paper.paperTitle,
      Abstract: paper.paperAbstract,
      Keywords: paper.paperKeywords.join(', '),
      CorrespondingAuthor: correspondingAuthors.names,
      EmailID: correspondingAuthors.emails,
      Affiliation: correspondingAuthors.affiliations,
      AllAuthors: allAuthors.names,
      AllAuthorEmails: allAuthors.emails,
      AllAuthorAffiliations: allAuthors.affiliations,
    };
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleDownload = () => {
    exportToExcel(sanitizedPapers, 'conference_papers');
  };

  return (
    <>
      <Select
        onValueChange={(value) => {
          if (value === "download-all") {
            handleDownload();
          }
          if (value === "download-range") {
            setModalOpen(true);
          }
        }}
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Download Excel" />
          <SelectIcon>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="download-all">Download All Papers</SelectItem>
          <SelectItem value="download-range">Download Excel with Range</SelectItem>
        </SelectContent>
      </Select>

      {modalOpen && (
        <PaperRangeSelector
          papers={papers}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onPapersSelected={(selectedPapers) => {
            exportToExcel(selectedPapers);
          }}
        />
      )}
    </>
  );
};

export default DownloadExcelButton;
