// i think it is a extra route that we do not need
import dbConnect from '@/lib/dbConnect';
import ConferenceModel from '@/model/Conference';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      confName: searchParams.get('confName'),
    };
    console.log("ye route chlkra")
    console.log(queryParams.confName)

    const getConferenceDate = await ConferenceModel.findOne({
      conferenceAcronym: queryParams.confName,
    }).select("conferenceSubmissionsDeadlineDate");
    console.log(getConferenceDate)


    if (!getConferenceDate) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Conference Date not found , maybe conference do not exist',
        }),
        { status: 500 },
      );
    }

    return new Response(
        JSON.stringify({
            success: true,
            message: 'conference submission Date found for the conference',
            data: { getConferenceDate},
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
