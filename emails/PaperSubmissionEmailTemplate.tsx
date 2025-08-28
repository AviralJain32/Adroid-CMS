import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PaperSubmissionEmailProps {
  username: string;
  paperID: string;
  paperTitle: string;
  submissionDate: string;
  submissionTime: string;
  conferenceName?: string;
}

export const PaperSubmissionEmail = ({
  username,
  paperID,
  paperTitle,
  submissionDate,
  submissionTime,
  conferenceName
}: PaperSubmissionEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={header}>Paper Submission Confirmation</Text>

        <Heading style={heading}>Your Paper Has Been Successfully Submitted</Heading>

        <Text style={description}>
          Dear {username},<br />
          Thank you for submitting your paper to {conferenceName}.
          Please find the submission details below:
        </Text>

        <Section style={infoContainer}>
          <Text style={label}>Paper ID:</Text>
          <Text style={value}>{paperID}</Text>

          <Text style={label}>Title:</Text>
          <Text style={value}>{paperTitle}</Text>

          <Text style={label}>Submission Date:</Text>
          <Text style={value}>{submissionDate}</Text>

          <Text style={label}>Submission Time:</Text>
          <Text style={value}>{submissionTime}</Text>
        </Section>

        <Text style={description}>
          You will be notified regarding further updates about the review
          process. Please keep this information for your records.
        </Text>

        <Text style={paragraph}>
          If you have any questions, feel free to contact our support team.
        </Text>
      </Container>

      <Text style={footer}>Powered securely by AdroidCMS</Text>
    </Body>
  </Html>
);

PaperSubmissionEmail.PreviewProps = {
  username: 'Author Name',
  paperID: 'ABC123',
  paperTitle: 'A Study on AI Applications',
  submissionDate: '28 Aug 2025',
  submissionTime: '3:45 PM',
} as PaperSubmissionEmailProps;

export default PaperSubmissionEmail;

// Styles (same as your reviewer template for consistency)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  padding: '40px 20px',
  maxWidth: '600px',
  margin: '0 auto',
};

const header = {
  color: '#0a85ea',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
  marginBottom: '10px',
};

const heading = {
  color: '#333',
  fontSize: '22px',
  fontWeight: 600,
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const description = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const infoContainer = {
  backgroundColor: '#f1f3f5',
  borderRadius: '8px',
  padding: '15px',
  marginBottom: '20px',
};

const label = {
  color: '#777',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  marginTop: '10px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  marginTop: '5px',
};

const paragraph = {
  color: '#777',
  fontSize: '14px',
  textAlign: 'center' as const,
  lineHeight: '22px',
  marginTop: '20px',
  padding: '0 20px',
};

const footer = {
  color: '#888',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px',
};
