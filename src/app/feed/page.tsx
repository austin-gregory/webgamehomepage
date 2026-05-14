import { DevlogContact } from "@/components/DevlogContact";
import { GamesShowcase } from "@/components/GamesShowcase";

export default function Feed() {
  return (
    <main className="relative w-full bg-black pt-12">
      <GamesShowcase />
      <DevlogContact />
    </main>
  );
}
