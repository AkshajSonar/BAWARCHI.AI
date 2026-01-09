export function CountdownBadge({
  expiresAt,
}: {
  expiresAt: string
}) {
  const minutesLeft = Math.floor(
    (new Date(expiresAt).getTime() - Date.now()) / 60000
  )

  if (minutesLeft <= 0) {
    return (
      <span className="text-red-600 text-sm font-semibold">
        Expired
      </span>
    )
  }

  return (
    <span
      className={`text-sm font-medium ${
        minutesLeft < 30
          ? "text-orange-600"
          : "text-green-600"
      }`}
    >
      Expires in {minutesLeft}m
    </span>
  )
}
