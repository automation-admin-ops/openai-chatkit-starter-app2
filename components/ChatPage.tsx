import ChatKitPanel from "./ChatKitPanel";

export default function ChatPage({
  session,
}: {
  session: {
    id: string;
    client_secret: string;
  };
}) {
  return <ChatKitPanel session={session} />;
}
