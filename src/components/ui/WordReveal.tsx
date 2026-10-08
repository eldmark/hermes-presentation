/** Muestra las primeras `count` palabras; las demás ocupan lugar (invisibles) para que el texto no salte. */
export function WordReveal({ words, count }: { words: string[]; count: number }) {
  return (
    <p className="ov-words">
      {words.map((w, i) => (
        <span key={i} className={i < count ? 'ov-word on' : 'ov-word'} aria-hidden={i >= count}>
          {w}{' '}
        </span>
      ))}
    </p>
  )
}
