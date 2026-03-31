type Props = {
  title: string
  time?: string
}

export default function NotificationItem({ title, time }: Props) {
  return (
    <div className="p-3 text-sm hover:bg-muted cursor-pointer border-b last:border-0">
      <p className="font-medium">{title}</p>
      {time && (
        <p className="text-xs text-muted-foreground">{time}</p>
      )}
    </div>
  )
}