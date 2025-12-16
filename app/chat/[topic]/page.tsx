import ChatPage from "@/components/ChatPage";

export default function Page({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams: { secret?: string };
}) {
  if (!searchParams.secret) {
    return <div>Brak client secret</div>;
  }

  return <ChatPage clientSecret={searchParams.secret} />;
}
