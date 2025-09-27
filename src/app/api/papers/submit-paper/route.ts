// done
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PaperModel from '@/model/PaperSchema';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import ConferenceModel from '@/model/Conference';
import { generatePaperID } from '@/helpers/PaperId';
import {
  handleFileUpload,
  validateAuthors
} from '@/helpers/FileUploadAndAuthorCheckFunctions';
import { sendConfirmationEmailAfterSubmissionOfPaper } from '@/helpers/confirmationEmailAfterSubmissionOfPaper';
import moment from 'moment';


export async function POST(request: NextRequest) {
  await dbConnect();

  const formData = await request.formData();
  const paperTitle = formData.get('paperTitle') as string;
  const paperKeywords =
    formData.get('paperKeywords')?.toString().split(',') || [];
  const paperAbstract = formData.get('paperAbstract') as string;
  const conference = formData.get('conference') as string;
  const paperFile = formData.get('paperFile') as File;
  const paperAuthors = formData.get('paperAuthors') as string;
  const paperAuthorsArray = JSON.parse(paperAuthors);
  console.log("in submit paper route yeri paper authors array",paperAuthorsArray)

  if (!paperFile) {
    return NextResponse.json(
      {
        success: false,
        message: 'File is required',
      },
      { status: 400 },
    );
  }

  if (paperAuthorsArray.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please add at least yourself as Author',
      },
      { status: 400 },
    );
  }

  try {
    const { Authors, CorrespondingAuthors } =
      await validateAuthors(paperAuthorsArray,paperTitle);



    const conferenceExists = await ConferenceModel.exists({
      conferenceAcronym: conference,
    });
    
    if (!conferenceExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            'The conference is not available in the database. Please check the URL again.',
        },
        { status: 404 },
      );
    }

    const paperID = await generatePaperID(conference);
    const uploadedFileUrl = await handleFileUpload(paperFile,paperID,conference);

    const newPaper = await PaperModel.create({
      paperAuthor: Authors,
      correspondingAuthor: CorrespondingAuthors,
      paperTitle,
      paperFile: uploadedFileUrl,
      paperKeywords,
      paperAbstract,
      paperSubmissionDate: new Date(),
      conference: conferenceExists._id,
      paperStatus: 'submitted',
      paperID: paperID,
    });

    newPaper.save();
    
    // Use moment to format date and time
    const submissionDate = moment(newPaper.paperSubmissionDate).format('DD MMM YYYY');
    const submissionTime = moment(newPaper.paperSubmissionDate).format('hh:mm A');

    const authorsEmail=[...Authors.map((author:any)=>({email:author.email,name:author.name})),...CorrespondingAuthors.map((author:any)=>({email:author.email,name:author.name}))]
    
    sendConfirmationEmailAfterSubmissionOfPaper(
      conference,      // conference object
      paperID,               // paper ID
      paperTitle,            // paper title
      authorsEmail,          // all authors
      submissionDate,        // formatted date
      submissionTime         // formatted time
    );

    return NextResponse.json({
      success: true,
      message: 'Paper submitted successfully',
      paper: newPaper,
    });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
