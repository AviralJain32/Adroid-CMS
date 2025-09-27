// For smart Sub feature

import dbConnect from '@/lib/dbConnect';
import ConferenceModel from '@/model/Conference';

export const dynamic = "force-dynamic"

export async function GET() {
  await dbConnect();


  try {
    const getConferenceDetails = await ConferenceModel.find({
      conferenceStatus: 'accepted',
    });

    if (!getConferenceDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'conference Details not found',
        }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'all accepted conference are sended',
        data: getConferenceDetails,
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