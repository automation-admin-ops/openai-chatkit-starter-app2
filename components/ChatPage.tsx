import ChatKitPanel from "./ChatKitPanel";

export default function ChatPage({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return <ChatKitPanel clientSecret={clientSecret} />;
}
