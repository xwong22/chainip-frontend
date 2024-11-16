import { useRouter } from "next/router";

export default function CampaignDetails() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch details about the specific campaign here...

  return (
    <div>
      <h1>Campaign #{id}</h1>
      {/* Add more details about the campaign here */}
    </div>
  );
}
