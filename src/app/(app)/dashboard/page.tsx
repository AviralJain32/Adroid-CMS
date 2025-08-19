'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetOrganizedConferencesQuery } from '@/store/features/ConferenceApiSlice';
import { useGetSubmittedPapersQuery } from '@/store/features/PaperApiSlice';
// import { useGetReviewedPapersQuery } from "@/store/features/ReviewerApiSlice"; // Add Reviewer API
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PulseLoader } from 'react-spinners';
import ReviewedPapersComponent from './(reviewSystem)/ReviewPaperComponent';
import { useSession } from 'next-auth/react';
import EditConferencePopup from './EditConferencePopup';
import EditPopup from './EditPopup';


// Organized Conferences Component
const OrganizedConferenceComponent = () => {
  const { data: organizedConferences, isLoading } =
    useGetOrganizedConferencesQuery();
    console.log(organizedConferences)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organized Conferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conference Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Conference Dates</TableHead>
              <TableHead>Submissions Deadline</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading <PulseLoader size={6} />
                </TableCell>
              </TableRow>    
            ) : organizedConferences && organizedConferences?.length > 0 ? (
              organizedConferences.filter((conference)=>conference.conferenceCategory=="Conference").map((conference: any) => (
                <TableRow key={conference._id}>
                  <TableCell className="font-bold">
                    {conference.conferenceAcronym}
                  </TableCell>
                  <TableCell>{conference.conferenceOrganizerRole}</TableCell>
                  <TableCell>
                    {moment(conference.conferenceFirstDay).calendar()} to{' '}
                    {moment(conference.conferenceLastDay).calendar()}
                  </TableCell>
                  <TableCell>
                    {moment(
                      conference.conferenceSubmissionsDeadlineDate,
                    ).calendar()}
                  </TableCell>
                  <TableCell>
                    {moment(conference.conferenceCreatedAt).calendar()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/${conference.conferenceAcronym}`}
                      passHref
                    >
                      <Button variant="outline">Open</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <EditConferencePopup conferenceDetails={conference}/>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No organized conferences found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardHeader>
        <CardTitle>Book Chapters</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Name</TableHead>
              <TableHead>Abstract Submission Date</TableHead>
              <TableHead>Full Chapter Submission Date</TableHead>
              <TableHead>Final Notification Date</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading <PulseLoader size={6} />
                </TableCell>
              </TableRow>
            ) : organizedConferences && organizedConferences?.length > 0 ? (
              organizedConferences.filter((conference)=>conference.conferenceCategory=="Book").map((conference: any) => (
                <TableRow key={conference._id}>
                  <TableCell className="font-bold">
                    {conference.conferenceAcronym}
                  </TableCell>
                  <TableCell>
                    {moment(conference.conferenceFirstDay).calendar()}
                  </TableCell>
                  <TableCell>
                    {moment(
                      conference.conferenceSubmissionsDeadlineDate,
                    ).calendar()}
                  </TableCell>
                  <TableCell>{moment(conference.conferenceLastDay).calendar()}</TableCell>
                  
                  <TableCell>
                    {moment(conference.conferenceCreatedAt).calendar()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/${conference.conferenceAcronym}`}
                      passHref
                    >
                      <Button variant="outline">Open</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No organized conferences found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// const OrganizedConferenceComponent = () => {
//   const { data: organizedConferences, isLoading } = useGetOrganizedConferencesQuery();
//   const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

//   const filteredConferences = organizedConferences
//     ? organizedConferences.filter(c => c.conferenceCategory === selectedCategory)
//     : [];

//   // Columns for current category
//   const columns = CATEGORY_CONFIGS[selectedCategory];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Organized {`${selectedCategory}`}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-4 flex flex-row items-center gap-3 justify-end">
//           <span className="font-medium">Filter by Category:</span>
//           <Select
//             value={selectedCategory}
//             onValueChange={setSelectedCategory}
//           >
//             <SelectTrigger className="w-[260px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {CATEGORIES.map(cat => (
//                 <SelectItem key={cat} value={cat}>{cat}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map(col => (
//                 <TableHead key={col.label}>{col.label}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="text-center">
//                   Loading <PulseLoader size={6} />
//                 </TableCell>
//               </TableRow>
//             ) : filteredConferences.length > 0 ? (
//               filteredConferences.map(c => (
//                 <TableRow key={c._id}>
//                   {columns.map(col => (
//                     <TableCell key={col.label}>{col.accessor(c)}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="text-center">
//                   No entries found for {selectedCategory}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// Submitted Papers Component
const SubmittedPaperComponent = () => {
  const { data: submittedPapers, isLoading } = useGetSubmittedPapersQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted Papers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paper Id</TableHead>
              <TableHead>Paper Title</TableHead>
              <TableHead>Conference</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading <PulseLoader size={6} />
                </TableCell>
              </TableRow>
            ) : submittedPapers && submittedPapers?.length > 0 ? (
              submittedPapers.map((paper: any) => (
                <TableRow key={paper.paperTitle}>
                  <TableCell className="font-bold">{paper.paperID}</TableCell>
                  <TableCell className="font-medium">
                    {paper.paperTitle}
                  </TableCell>
                  <TableCell>{paper.conference.conferenceAcronym}</TableCell>
                  <TableCell>
                    {moment(paper.paperSubmissionDate).calendar()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={paper.paperStatus}>
                      {paper.paperStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <EditPopup {...paper}/>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No submitted papers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main Page
const Page: React.FC = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Manage your conferences, papers, and reviews seamlessly.
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Tabs defaultValue="organized" className="w-full">
          <TabsList className="flex justify-center gap-6 mb-8">
            <TabsTrigger
              value="organized"
              className="px-6 py-3 text-lg font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
            >
              Organized Conferences
            </TabsTrigger>
            <TabsTrigger
              value="submitted"
              className="px-6 py-3 text-lg font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
            >
              Submitted Papers
            </TabsTrigger>
            <TabsTrigger
              value="reviewed"
              className="px-6 py-3 text-lg font-semibold text-gray-700 hover:text-blue-500 transition-all border-b-2 border-transparent focus:border-blue-500"
            >
              Reviewed Papers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organized">
            <OrganizedConferenceComponent />
          </TabsContent>
          <TabsContent value="submitted">
            <SubmittedPaperComponent />
          </TabsContent>
          <TabsContent value="reviewed">
            <ReviewedPapersComponent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
