"use client";
import Link from "next/link";

const dummyRequests = [
  {
    id: "1",
    name: "Sylhet Engineering University",
    regNumber:"265772",
    website:"https://seu.edu.bd",
    email :"seu@gmail.com"
   
  },
  {
    id: "2",
    name: "Dhaka Private University",
     regNumber:"26772",
    website:"https://du.edu.bd",
    email :"du@gmail.com"
    
  },
];

export default function Home() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">University Requests</h1>
      <div className="space-y-4">
        {dummyRequests.map((req) => (
          <div
            key={req.id}
            className="border p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{req.name}</h2>
              <p className="text-gray-600">EIIN :{req.regNumber}</p>
              <p className="text-sm text-gray-500">
                Website: {req.website} • email{req.email}
              </p>
            </div>
            <Link
  href={{
    pathname: "/createUniPage",
    query: {
      name: req.name,
      regNumber: req.regNumber,
      website: req.website,
      email: req.email,
    },
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
  Create University
</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
