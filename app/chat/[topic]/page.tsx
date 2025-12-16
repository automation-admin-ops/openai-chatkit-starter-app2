import ChatPage from "@/components/ChatPage";

export default function Page({
  searchParams,
}: {
  searchParams: {
    session_id?: string;
    secret?: string;
  };
}) {
  if (!searchParams.session_id || !searchParams.secret) {
    return <div>Brak danych sesji</div>;
  }

  return (
    <ChatPage
      session={{
        id: searchParams.session_id,
        client_secret: searchParams.secret,
      }}
    />
  );
}
