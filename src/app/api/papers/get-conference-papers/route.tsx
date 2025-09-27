// done
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import PaperModel from '@/model/PaperSchema';
import ConferenceModel from '@/model/Conference';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const queryParams = {
      confName: searchParams.get('confName'),
    };

    const getConferenceDetails = await ConferenceModel.findOne({
      conferenceAcronym: queryParams.confName,
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
