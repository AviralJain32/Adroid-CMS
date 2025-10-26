import React from 'react'

const page = () => {
  const advisoryBoardDirector = {
    name: "Dr. Deepak Gupta",
    designation: "Advisory Board Director",
    organization: "Department of Computer Science & Engineering, Maharaja Agrasen Institute of Technology, Delhi, India",
  };

  const advisoryBoardMembers = [
    {
      name: "Aditya Gupta",
      designation: "Software Development Engineer II",
      organization: "Amazon Web Services",
    },
    {
      name: "Prasanalakshmi B",
      designation: "Research Professor, Department of Computer Science",
      organization:
        "College of Computer Science, King Khalid University, Abha 62223, Saudi Arabia",
    },
    {
      name: "Rahul Vadisetty",
      designation:
        "Senior Software Engineer (Artificial Intelligence/ Machine Learning Researcher)",
      organization: "U.S. Bank / Wayne State University",
    },
    {
      name: "Suresh Chavhan",
      designation: "Professor",
      organization: "IIIT Raichur, India",
    },
    {
      name: "Aditya Khamparia",
      designation: "Professor",
      organization:
        "Babasaheb Bhimrao Ambedkar University (A Central University), Uttar Pradesh, Lucknow, India",
    },
    {
      name: "Gulshan Shrivastava",
      designation: "Associate Professor",
      organization: "SCSE, Bennett University, Gr. Noida, India",
    },
  ];

  return (
    <div className="container">
      {/* Advisory Board Section */}
      <h2 className="text-gray-800 text-center font-bold text-4xl my-7">
        Advisory Board
      </h2>

      {/* Advisory Board Director */}
      <section className="mb-10 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Advisory Board Director
        </h3>
        <div className="p-4 border rounded-lg shadow-sm bg-white text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {advisoryBoardDirector.name}
          </h3>
          <p className="text-gray-700">{advisoryBoardDirector.designation}</p>
          <p className="text-gray-600 italic">
            {advisoryBoardDirector.organization}
          </p>
        </div>
      </section>

      {/* Advisory Board Members */}
      <section
        id="advisory-board"
        className="mb-10 bg-gray-50 p-6 rounded-lg shadow-md"
      >
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Advisory Board Members
        </h3>
        <ul className="mt-4 space-y-4">
          {advisoryBoardMembers.map((member, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-700">{member.designation}</p>
              <p className="text-gray-600 italic">{member.organization}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default page;
