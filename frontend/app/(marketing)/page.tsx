import { LandingNavbar } from "./_components/LandingNavbar";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { StoriesPreview } from "./_components/StoriesPreview";
import { Conversations } from "./_components/Conversations";
import { Communities } from "./_components/Communities";
import { SafetyBand } from "./_components/SafetyBand";
import { ClosingCta } from "./_components/ClosingCta";
import { LandingFooter } from "./_components/LandingFooter";

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
