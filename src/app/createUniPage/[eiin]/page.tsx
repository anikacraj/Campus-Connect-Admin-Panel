"use client";
import { useParams } from "next/navigation";

import UniRequestScreen from "@/components/createUniPage";

const dummyRequests = [
  {
    id: "1",
    name: "Sylhet Engineering University",
    estd: "2010",
    location: "Sylhet, Bangladesh",
    type: "Public",
    website: "https://sylhet-uni.edu",
    bio: "A reputed engineering university in Sylhet focusing on modern technology and innovation.",
    email: "info@sylhet-uni.edu",
    regNumber: "SEU-2025",
  },
  {
    id: "2",
    name: "Dhaka Private University",
    estd: "2005",
    location: "Dhaka, Bangladesh",
    type: "Private",
    website: "https://dhaka-private.edu",
    bio: "Private institution in Dhaka that provides high-quality education with global standards.",
    email: "contact@dhaka-private.edu",
    regNumber: "DPU-2005",
  },
];

export default function CreateUniPage() {
  const { id } = useParams();
  const uni = dummyRequests.find((u) => u.id === id);

  if (!uni) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">University not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <UniRequestScreen prefill={uni} />
    </div>
  );
}
