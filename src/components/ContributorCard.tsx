import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, User, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { useContributors } from "@/contexts/ContributorContext";
import { useToast } from "@/hooks/use-toast";
import ContributionTracker from "./ContributionTracker";

interface ContributorCardProps {
  id: string;
  name: string;
  role: string;
  contributions: number;
  isEncrypted: boolean;
  joinDate: string;
  lastActive: string;
}

const ContributorCard = ({ id, name, role, contributions, isEncrypted, joinDate, lastActive }: ContributorCardProps) => {
  const { removeContributor } = useContributors();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const handleRemove = () => {
    removeContributor(id);
    toast({
      title: "Contributor Removed",
      description: `${name} has been removed from the DAO.`,
    });
    setShowDetails(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-card border-border hover:border-privacy-primary/30 transition-all duration-300 shadow-card-custom hover:shadow-glow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-privacy-primary/10 rounded-lg">
              <User className="h-5 w-5 text-privacy-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Contributor Details - {name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Role:</span>
                      <p className="font-medium">{role}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contributions:</span>
                      <p className="font-medium">{contributions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Joined:</span>
                      <p className="font-medium">{formatDate(joinDate)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Active:</span>
                      <p className="font-medium">{formatDate(lastActive)}</p>
                    </div>
                  </div>
                  
                  <ContributionTracker 
                    contributorId={id}
                    contributorName={name}
                    currentContributions={contributions}
                  />
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRemove}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Contributor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {isEncrypted && (
              <Badge variant="secondary" className="bg-privacy-primary/10 text-privacy-primary border-privacy-primary/20">
                <Lock className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contributions</span>
            <span className="font-medium text-card-foreground">{contributions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Rewards</span>
            <div className="flex items-center space-x-1 text-privacy-primary">
              <Lock className="h-3 w-3" />
              <span className="text-sm font-mono">••••••••</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Active</span>
            <span className="text-xs text-muted-foreground">{formatDate(lastActive)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributorCard;