import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Users, DollarSign } from "lucide-react";

const TreasuryOverview = () => {
  const treasuryStats = [
    {
      title: "Total Treasury",
      value: "$2,847,392",
      change: "+12.3%",
      icon: Wallet,
      color: "text-treasury-accent"
    },
    {
      title: "Monthly Payouts",
      value: "$156,240",
      change: "+8.7%",
      icon: DollarSign,
      color: "text-privacy-primary"
    },
    {
      title: "Active Contributors",
      value: "47",
      change: "+3",
      icon: Users,
      color: "text-success"
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {treasuryStats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="bg-gradient-card border-border hover:border-privacy-primary/30 transition-all duration-300 shadow-card-custom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-success mt-1">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TreasuryOverview;