interface NoteProps {
  text: string;
}

export default function Note(props: NoteProps) {
  const { text } = props;
  return (
    <div className="bg-[#2B3043] rounded-lg px-4 py-2">
      <span className="text-primary">Note:</span>{" "}
      <span className="text-primary-foreground">{text}</span>
    </div>
  );
}
