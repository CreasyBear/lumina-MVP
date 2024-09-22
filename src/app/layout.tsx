import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <nav className="p-4 bg-gray-100">
            <Link href="/" className="mr-4">Home</Link>
            <Link href="/protected-page" className="mr-4">Protected Page</Link>
            <SignedIn>
              <Link href="/profile" className="mr-4">Profile</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="mr-4">Sign In</Link>
              <Link href="/sign-up">Sign Up</Link>
            </SignedOut>
          </nav>
          <main className="p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}