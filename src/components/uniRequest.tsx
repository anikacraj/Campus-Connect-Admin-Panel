"use client";
import Link from "next/link";

const dummyRequests = [
  {
    id: "1",
    name: "Sylhet Engineering University",
    location: "Sylhet, Bangladesh",
    estd: "2010",
    type: "Public",
  },
  {
    id: "2",
    name: "Dhaka Private University",
    location: "Dhaka, Bangladesh",
    estd: "2005",
    type: "Private",
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
              <p className="text-gray-600">{req.location}</p>
              <p className="text-sm text-gray-500">
                Estd: {req.estd} • {req.type}
              </p>
            </div>
            <Link
              href={`/createUniPage/${req.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Review & Create
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
