import { auth } from "@clerk/nextjs";
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div>
      <h1>Welcome to Lumina AI-Assisted Consulting Tool</h1>
      {isSignedIn ? (
        <p>You are signed in. Visit the <Link href="/protected-page">protected page</Link>.</p>
      ) : (
        <p>Please <Link href="/sign-in">sign in</Link> to access all features.</p>
      )}
    </div>
  );
}