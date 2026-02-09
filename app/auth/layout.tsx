import { LightPillar } from "@/components/effects/LightPillar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background light pillars */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex gap-20 opacity-30">
          <LightPillar color="solar" height={600} intensity="high" />
          <LightPillar color="transform" height={500} intensity="medium" />
          <LightPillar color="architect" height={550} intensity="high" />
          <LightPillar color="unity" height={480} intensity="medium" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
