import { BigTextSection } from "@/components/BigTextSection/BigTextSection";
import { VideoSection } from "@/components/VideoSection/VideoSection";
import { EarlyAccessSection } from "@/components/EarlyAccessSection/EarlyAccessSection";
import { ParagraphSection } from "@/components/ParagraphSection/ParagraphSection";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
      <BigTextSection
        text={
          "A complete developer toolkit to add a custom visual page builder to your product."
        }
      ></BigTextSection>

      <VideoSection />

      <ParagraphSection />

      <EarlyAccessSection />
    </div>
  );
}
