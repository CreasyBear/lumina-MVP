import { UserDetails } from "../_components/user-details";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { CodeSwitcher } from "../_components/code-switcher";
import { LearnMore } from "../_components/learn-more";
import { Footer } from "../_components/footer";
import { ClerkLogo } from "../_components/clerk-logo";
import { NextLogo } from "../_components/next-logo";

import { DASHBOARD_CARDS } from "../_components/consts/cards";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[75rem] w-full mx-auto">
        <div className="grid grid-cols-[1fr_20.5rem] gap-10 pb-10">
          <div>
            <header className="flex items-center justify-between w-full h-16 gap-4">
              <div className="flex gap-4">
                <ClerkLogo />
                <div aria-hidden className="w-px h-6 bg-[#C7C7C8]" />
                <NextLogo />
              </div>
              <div className="flex items-center gap-2">
                <OrganizationSwitcher
                  appearance={{
                    elements: {
                      organizationPreviewAvatarBox: "size-6",
                    },
                  }}
                />
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "size-6",
                    },
                  }}
                />
              </div>
            </header>
            <UserDetails />
          </div>
          <div className="pt-[3.5rem]">
            <CodeSwitcher />
          </div>
        </div>
      </main>
      <LearnMore cards={DASHBOARD_CARDS} />
      <Footer />
    </>
  );
}
