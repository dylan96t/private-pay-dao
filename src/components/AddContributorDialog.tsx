import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContributors } from "@/contexts/ContributorContext";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddContributorDialog = () => {
  const { addContributor } = useContributors();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contributions: 0,
    isEncrypted: true,
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString().split('T')[0]
  });

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Smart Contract Developer",
    "UI/UX Designer",
    "Product Manager",
    "DevOps Engineer",
    "Data Analyst",
    "QA Engineer"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addContributor(formData);
    
    toast({
      title: "Success",
      description: `${formData.name} has been added as a contributor.`,
    });

    // Reset form
    setFormData({
      name: "",
      role: "",
      contributions: 0,
      isEncrypted: true,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-privacy-primary hover:bg-privacy-primary/90 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Contributor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contributor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter contributor's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contributions">Initial Contributions</Label>
            <Input
              id="contributions"
              type="number"
              min="0"
              value={formData.contributions}
              onChange={(e) => setFormData(prev => ({ ...prev, contributions: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">Join Date</Label>
            <Input
              id="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-privacy-primary hover:bg-privacy-primary/90 text-white">
              Add Contributor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContributorDialog;