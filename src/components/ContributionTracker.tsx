import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Activity } from "lucide-react";
import { useContributors } from "@/contexts/ContributorContext";
import { useToast } from "@/hooks/use-toast";

interface ContributionTrackerProps {
  contributorId: string;
  contributorName: string;
  currentContributions: number;
}

const ContributionTracker = ({ contributorId, contributorName, currentContributions }: ContributionTrackerProps) => {
  const { incrementContributions, updateContributor } = useContributors();
  const { toast } = useToast();

  const handleIncrement = (amount: number) => {
    incrementContributions(contributorId, amount);
    toast({
      title: "Contribution Updated",
      description: `${contributorName}'s contributions ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)}.`,
    });
  };

  const handleBulkUpdate = (newTotal: number) => {
    updateContributor(contributorId, { contributions: newTotal });
    toast({
      title: "Contributions Updated",
      description: `${contributorName}'s total contributions set to ${newTotal}.`,
    });
  };

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
          <Activity className="h-4 w-4 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Total:</span>
          <span className="font-semibold text-card-foreground">{currentContributions}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleIncrement(-1)}
            disabled={currentContributions <= 0}
            className="flex-1"
          >
            <Minus className="h-3 w-3 mr-1" />
            -1
          </Button>
          <Button
            size="sm"
            onClick={() => handleIncrement(1)}
            className="flex-1 bg-privacy-primary hover:bg-privacy-primary/90 text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            +1
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleIncrement(5)}
            className="flex-1"
          >
            +5
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleIncrement(10)}
            className="flex-1"
          >
            +10
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionTracker;