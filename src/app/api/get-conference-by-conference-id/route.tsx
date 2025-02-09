import dbConnect from '@/lib/dbConnect';
import ConferenceModel from '@/model/Conference';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      conferenceAcronym: searchParams.get('conferenceAcronym'),
    };
    console.log(queryParams);

    if (!queryParams.conferenceAcronym) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Do not have conference id',
        }),
        { status: 500 },
      );
    }

    // Find the conference by the provided ID
    const getConferenceDetails = await ConferenceModel.findOne({
      conferenceAcronym: queryParams.conferenceAcronym,
    }).populate('conferenceOrganizer', 'fullname');

    if (!getConferenceDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error occurred while fetching conference details',
        }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Conference details fetched successfully',
        data: getConferenceDetails,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log('An unexpected error occurred: ', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error occurred while fetching conference details',
      }),
      { status: 500 },
    );
  }
}
