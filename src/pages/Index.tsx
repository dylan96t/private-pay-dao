import { Shield, Lock } from "lucide-react";
import WalletConnectButton from "@/components/WalletConnectButton";
import ContributorCard from "@/components/ContributorCard";
import TreasuryOverview from "@/components/TreasuryOverview";
import AddContributorDialog from "@/components/AddContributorDialog";
import Logo from "@/components/Logo";
import { useContributors } from "@/contexts/ContributorContext";

const Index = () => {
  const { contributors } = useContributors();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                <Logo size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Private Pay DAO
                </h1>
                <p className="text-sm text-muted-foreground">Work Openly, Earn Privately</p>
              </div>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Work Openly, <span className="bg-gradient-dao bg-clip-text text-transparent">Earn Privately</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent contributions with confidential compensation. Every reward is encrypted, 
            while treasury usage remains publicly auditable.
          </p>
        </div>

        {/* Treasury Overview */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Treasury Overview</h3>
            <div className="px-3 py-1 bg-gradient-privacy rounded-full">
              <span className="text-sm text-privacy-primary font-medium">Public</span>
            </div>
          </div>
          <TreasuryOverview />
        </section>

        {/* Contributors Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-semibold text-foreground">Contributors</h3>
              <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-privacy rounded-full">
                <Lock className="h-3 w-3 text-privacy-primary" />
                <span className="text-sm text-privacy-primary font-medium">Rewards Encrypted</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <AddContributorDialog />
              <div className="text-sm text-muted-foreground">
                {contributors.length} active contributors
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((contributor) => (
              <ContributorCard
                key={contributor.id}
                id={contributor.id}
                name={contributor.name}
                role={contributor.role}
                contributions={contributor.contributions}
                isEncrypted={contributor.isEncrypted}
                joinDate={contributor.joinDate}
                lastActive={contributor.lastActive}
              />
            ))}
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="mt-12 p-6 bg-gradient-privacy border border-privacy-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-privacy-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">Privacy & Transparency</h4>
              <p className="text-sm text-muted-foreground">
                Individual compensation is encrypted using zero-knowledge proofs, ensuring privacy while maintaining 
                complete transparency of treasury operations. Contributors can verify their rewards without exposing 
                sensitive salary information to others.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;