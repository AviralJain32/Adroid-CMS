//paper submit to koi bhi kr sakta hai isliye v1 me hai
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PaperModel from '@/model/PaperSchema';
import ConferenceModel from '@/model/Conference';
import { generatePaperID } from '@/helpers/PaperId';
import {
  handleFileUpload,
  validateAuthors
} from '@/helpers/FileUploadAndAuthorCheckFunctions';
import { sendConfirmationEmailAfterSubmissionOfPaper } from '@/helpers/confirmationEmailAfterSubmissionOfPaper';
import moment from 'moment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { User } from '@/model/User';



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


// for the organizer context fetch the all the submitted papers to his conference

export async function GET(request: Request,{ params }: { params: { conferenceAcronym: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Not Authenticated',
      }),
      { status: 401 },
    );
  }
  try {
    const { conferenceAcronym } = params;

    const getConferenceDetails = await ConferenceModel.findOne({
      conferenceAcronym: conferenceAcronym,
    });

    if (!getConferenceDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error occurred while fetching conference Details',
        }),
        { status: 500 },
      );
    }
    const paperSubmittedInConference = await PaperModel.find({
      conference: getConferenceDetails._id,
    })
      .populate('paperAuthor.userId', 'fullname email affilation')
      .populate('correspondingAuthor.userId', 'fullname email affilation');
      console.log(paperSubmittedInConference)

    if (
      !paperSubmittedInConference ||
      paperSubmittedInConference.length === 0
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No papers found for this conference',
          data: { getConferenceDetails },
        }),
        { status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Papers found for the conference',
        data: { paperSubmittedInConference, getConferenceDetails },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log('An unexpected error occurred: ', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error occurred while fetching papers for the conference',
      }),
      { status: 500 },
    );
  }
}


export async function DELETE(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // Check if user is authenticated
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 },
    );
  }

  try {
    // Parse request body
    const { paperIdList } = await request.json();

    // Validate paperIdList
    if (!paperIdList || paperIdList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please add at least one paper to delete.',
        },
        { status: 400 },
      );
    }

    // Delete papers in bulk
    const result = await PaperModel.deleteMany({
      paperID: { $in: paperIdList },
    });

    // Log how many papers were deleted
    console.log(`${result.deletedCount} papers deleted`);

    // Send success response with deleted count
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} paper(s) deleted successfully`,
    });
  } catch (error: any) {
    // Error handling with descriptive message
    console.error('Error deleting papers:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete papers. Please try again later.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}