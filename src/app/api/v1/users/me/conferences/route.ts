import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { User } from 'next-auth';
import ConferenceModel from '@/model/Conference';
import { sendConferenceCreationMail } from '@/helpers/sendConferenceCreationMail';
import { authOptions } from '../../../../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Not Authenticated',
      }),
      { status: 401 },
    );
  }

  const {
    conferenceCategory,
    // conferenceEmail,
    conferenceOrganizerWebPage,
    conferenceOrganizerPhoneNumber,
    conferenceOrganizerRole,
    conferenceAnyOtherInformation,
    conferenceAcronym,
    conferenceWebpage,
    conferenceVenue,
    conferenceCity,
    conferenceCountry,
    conferenceEstimatedNumberOfSubmissions,
    conferenceFirstDay,
    conferenceLastDay,
    conferencePrimaryArea,
    conferenceSecondaryArea,
    conferenceAreaNotes,
    conferenceTitle,
    conferenceSubmissionsDeadlineDate,
  } = await request.json();

  if (
    !conferenceCategory ||
    !conferenceSubmissionsDeadlineDate ||
    !conferenceTitle ||
    !conferenceAcronym ||
    // !conferenceWebpage ||
    // !conferenceVenue ||
    // !conferenceCity ||
    // !conferenceCountry ||
    !conferenceFirstDay ||
    !conferenceLastDay ||
    !conferencePrimaryArea ||
    !conferenceTitle
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Missing required fields',
      }),
      { status: 400 },
    );
  }

  const foundConference = await ConferenceModel.findOne({
    $or: [
      { conferenceTitle: conferenceTitle },
      { conferenceAcronym: conferenceAcronym },
    ],
  });

  if (foundConference) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          'Conference already exists with this Title or Acronym. Try to use a different title or acronym.',
      }),
      { status: 400 },
    );
  }

  try {
    const newConference = new ConferenceModel({
      conferenceCategory,
      conferenceOrganizer: user._id,
      conferenceOrganizerWebPage,
      conferenceOrganizerPhoneNumber,
      conferenceOrganizerRole,
      conferenceTitle,
      conferenceEmail: user.email,
      conferenceAnyOtherInformation,
      conferenceAcronym,
      conferenceWebpage,
      conferenceVenue,
      conferenceCity,
      conferenceCountry,
      conferenceEstimatedNumberOfSubmissions,
      conferenceFirstDay,
      conferenceLastDay,
      conferenceSubmissionsDeadlineDate,
      conferencePrimaryArea,
      conferenceSecondaryArea,
      conferenceAreaNotes,
      conferenceIsAcceptingPaper: true,
      conferenceStatus: 'submitted',
    });

    await newConference.save();

    if(!(conferenceCategory==='Book')){

      const emailResponse = await sendConferenceCreationMail(
        user.email as string,
        user.fullname as string,
        conferenceTitle,
        conferenceFirstDay,
      );
  
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          },
        );
      }

    }

    

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Conference created successfully',
      }),
      { status: 201 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error creating conference'+ error,
      }),
      { status: 500 },
    );
  }
}


// get all conferences of the logged in user

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.log(session);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Not Authenticated',
      }),
      { status: 401 },
    );
  }

  try {
    const organizedConferences = await ConferenceModel.find({
      conferenceOrganizer: user._id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          organizedConferences.length > 0
            ? 'Organized conferences found'
            : 'No organized conferences found',
        data: { organizedConferences },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log('An unexpected error occurred: ', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error occurred while fetching organized conferences',
      }),
      { status: 500 },
    );
  }
}

// edit conference by conference acronym 
export async function PUT(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 },
    );
  }

  const formData = await request.json(); // Assuming you're sending JSON data
  const conferenceAcronym = formData.conferenceAcronym as string;
  const updatedData = {
    conferenceEmail: formData.conferenceEmail,
    conferenceTitle: formData.conferenceTitle,
    conferenceWebpage: formData.conferenceWebpage,
    conferenceVenue: formData.conferenceVenue,
    conferenceCity: formData.conferenceCity,
    conferenceCountry: formData.conferenceCountry,
    conferenceEstimatedNumberOfSubmissions:
      formData.conferenceEstimatedNumberOfSubmissions,
    conferenceFirstDay: formData.conferenceFirstDay,
    conferenceLastDay: formData.conferenceLastDay,
    conferenceSubmissionsDeadlineDate:
      formData.conferenceSubmissionsDeadlineDate,
    conferencePrimaryArea: formData.conferencePrimaryArea,
    conferenceSecondaryArea: formData.conferenceSecondaryArea,
    conferenceOrganizerWebPage: formData.conferenceOrganizerWebPage,
    conferenceOrganizerPhoneNumber: formData.conferenceOrganizerPhoneNumber,
    conferenceOrganizerRole: formData.conferenceOrganizerRole,
    conferenceAnyOtherInformation: formData.conferenceAnyOtherInformation,
    conferenceAreaNotes: formData.conferenceAreaNotes,
  };

  try {
    const conferenceDocument = await ConferenceModel.findOneAndUpdate(
      { conferenceAcronym },
      updatedData,
      { new: true },
    );

    if (!conferenceDocument) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conference not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conference updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
