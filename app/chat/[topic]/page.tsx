export default function ChatPage({
  params,
}: {
  params: { topic: string };
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "red",
        color: "white",
        fontSize: "24px",
        padding: "20px",
      }}
    >
      TEST PAGE RENDER
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
