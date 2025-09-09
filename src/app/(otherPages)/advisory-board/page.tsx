import React from 'react'

const page = () => {
    const advisoryBoardMembers = [
        {
          name: "Aditya Gupta",
          designation: "Software Development Engineer II",
          organization: "Amazon Web Services",
        },
        {
          name: "Prasanalakshmi B",
          designation: "Research Professor, Department of Computer Science",
          organization: "College of Computer Science, King Khalid University, Abha 62223, Saudi Arabia",
        },
        {
          name: "Rahul Vadisetty",
          designation: "Senior Software Engineer (Artificial Intelligence/ Machine Learning Researcher)",
          organization: "U.S. Bank / Wayne State University",
        },
        {
          name: "Deepak Gupta",
          designation: "Computer Science & Engineering",
          organization: "Maharaja Agrasen Institute of Technology, Delhi, India",
        },
        {
          name: "Suresh Chavhan",
          designation: "Professor",
          organization: "IIIT Raichur, India",
        },
        {
          name: "Aditya Khamparia",
          designation: "Professor",
          organization: "Babasaheb Bhimrao Ambedkar University (A Central University), Uttar Pradesh, Lucknow, India",
        },
        {
          name: "Gulshan Shrivastava",
          designation: "Associate Professor",
          organization: "SCSE, Bennett University, Gr. Noida, India",
        },
      ];
  return (
    <div className='container'>
      {/* Advisory Board Section */}
      <h2 className=" text-gray-800 text-center font-bold text-4xl my-7 ">Advisory Board</h2>
      <section id="advisory-board" className="mb-10 bg-gray-50 p-6 rounded-lg shadow-md">
        
        <ul className="mt-4 space-y-4">
          {advisoryBoardMembers.map((member, index) => (
            <li key={index} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-700">{member.designation}</p>
              <p className="text-gray-600 italic">{member.organization}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default page
