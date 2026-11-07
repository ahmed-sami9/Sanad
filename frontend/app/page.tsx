import { LandingNavbar } from "./_components/landing/LandingNavbar";
import { Hero } from "./_components/landing/Hero";
import { HowItWorks } from "./_components/landing/HowItWorks";
import { StoriesPreview } from "./_components/landing/StoriesPreview";
import { Conversations } from "./_components/landing/Conversations";
import { Communities } from "./_components/landing/Communities";
import { SafetyBand } from "./_components/landing/SafetyBand";
import { ClosingCta } from "./_components/landing/ClosingCta";
import { LandingFooter } from "./_components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <StoriesPreview />
        <Conversations />
        <Communities />
        <SafetyBand />
        <ClosingCta />
      </main>
      <LandingFooter />
    </>
  );
}
