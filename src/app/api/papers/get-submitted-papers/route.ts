// done
import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import PaperModel from '@/model/PaperSchema';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: Request) {
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

  try {
    const submittedPapers = await PaperModel.find({
      $or: [{ "paperAuthor.userId": user._id }, { "correspondingAuthor.userId": user._id }],
    })
      .populate('conference', 'conferenceAcronym')
      // .populate('paperAuthor')
      // .populate('correspondingAuthor');

    return new Response(
      JSON.stringify({
        success: true,
        message:
          submittedPapers.length > 0
            ? 'Organized conferences found'
            : 'No organized conferences found',
        data: { submittedPapers },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.log('An unexpected error occurred: ', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error occurred while fetching submitted papers',
      }),
      { status: 500 },
    );
  }
}
