export function PlaceLabel({ place, time }: { place?: string; time?: string }) {
  if (!place && !time) return null
  return (
    <div className="ov-place" key={`${place}|${time}`}>
      {place && <span>{place}</span>}
      {place && time && <span className="sep"> · </span>}
      {time && <span>{time}</span>}
    </div>
  )
}
