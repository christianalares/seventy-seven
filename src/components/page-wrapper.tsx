type Props = {
  children: React.ReactNode
}

export const PageWrapper = ({ children }: Props) => {
  return <div className="max-w-3xl">{children}</div>
}
