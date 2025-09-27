import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import PaperModel from '@/model/PaperSchema';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: Request,{ params }: { params: { paperID: string } }) {
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
    

    const getPaperDetails = await PaperModel.findOne({
      paperID: params.paperID,
    })
      .populate({path:'paperAuthor.userId',select:'fullname country affilation'}) // Populating paper authors
      .populate({path:'correspondingAuthor.userId',select:'fullname country affilation'}) // Populating corresponding authors
      .populate({
        path: 'reviewers.Id', // Path to populate reviewers
        select: 'fullname email', // Only select name and email fields
      })
      .populate({
        path: 'reviewRequests.reviewerId', // Path to populate reviewRequests
        select: 'fullname email', // Only select name and email fields
      });

    console.log(getPaperDetails);
    if (!getPaperDetails) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Paper Details not found',
          data: null,
        }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Papers details for the conference',
        data: getPaperDetails,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log('An unexpected error occurred: ', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error occurred while fetching paper details',
        data: null,
      }),
      { status: 500 },
    );
  }
}
