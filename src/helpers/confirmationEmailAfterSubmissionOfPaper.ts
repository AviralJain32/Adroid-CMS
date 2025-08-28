import sgMail from '@sendgrid/mail';
import { render } from '@react-email/components';
import { ApiResponse } from '@/types/ApiResponse';
// import a confirmation email template instead of ReviewerNotificationEmail
import PaperSubmissionEmail from '../../emails/PaperSubmissionEmailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface Author {
  email: string;
  name: string;
}

export async function sendConfirmationEmailAfterSubmissionOfPaper(
  conference:string,
  paperID: string,
  paperTitle: string,
  authors: { email: string; name: string }[],
  submissionDate: string,
  submissionTime: string,

): Promise<ApiResponse> {
  try {
    const emailPromises = authors.map(async author => {
      const emailHtml = render(
        PaperSubmissionEmail({
          username: author.name || 'Author',
          paperID,
          paperTitle,
          conferenceName: conference,
          submissionDate,
          submissionTime,
        }),
      );

      await sgMail.send({
        to: author.email,
        from: 'conference@adroidcms.com',
        subject: `Paper Submission ${conference} ${paperID}`,
        html: emailHtml,
      });

      console.log(`Confirmation email sent to ${author.email}`);
    });

    await Promise.all(emailPromises);

    return {
      success: true,
      message: 'Paper submission confirmation emails sent successfully.',
    };
  } catch (emailError) {
    console.error('Error sending confirmation emails', emailError);
    return {
      success: false,
      message: 'Failed to send paper submission confirmation emails.',
    };
  }
}
