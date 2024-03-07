import Link from 'next/link'

export const Sidebar = () => {
  return (
    <aside className="border-r w-52 p-4">
      <nav>
        <ul className="flex flex-col gap-4">
          <li>
            <Link href="/">Overview</Link>
          </li>
          <li>
            <Link href="/inbox">Inbox</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
