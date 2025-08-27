'use client';

import React from 'react';
import { exportToExcel } from '@/helpers/exportToExcel';
import { SubmittedPaper } from '@/types/SubmittedPaperType';
import moment from 'moment';

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

  const handleDownload = () => {
    exportToExcel(sanitizedPapers, 'conference_papers');
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download Excel
    </button>
  );
};

export default DownloadExcelButton;
