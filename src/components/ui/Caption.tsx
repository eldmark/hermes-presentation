export function Caption({ text }: { text: string }) {
  return <p className="ov-caption" key={text}>{text}</p>
}
