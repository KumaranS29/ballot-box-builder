
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";

const votingMethods = [
  {
    id: 'plurality',
    name: 'Plurality Voting',
    description: 'Voters select one candidate, and the candidate with the most votes wins.'
  },
  {
    id: 'ranked-choice',
    name: 'Ranked Choice Voting',
    description: 'Voters rank candidates in order of preference.'
  },
  {
    id: 'approval',
    name: 'Approval Voting',
    description: 'Voters can select multiple candidates they approve of.'
  },
];

const CreateElection: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [votingMethod, setVotingMethod] = useState('plurality');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/app');
      toast({
        title: "Access Denied",
        description: "Only administrators can create elections.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate, toast]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after the start date.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Mock creation - would be replaced with Supabase after integration
    setTimeout(() => {
      toast({
        title: "Election Created",
        description: "Your election has been created successfully.",
      });
      setIsSubmitting(false);
      navigate('/app/elections');
    }, 1000);
  };
  
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Election</h2>
        <p className="text-muted-foreground">
          Set up a new election for your organization.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the essential details for your election.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input
                id="title"
                placeholder="e.g., Student Council Election 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose and scope of this election..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Voting Method */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Method</CardTitle>
            <CardDescription>
              Select how voters will cast their votes in this election.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={votingMethod} 
              onValueChange={setVotingMethod} 
              className="space-y-4"
            >
              {votingMethods.map((method) => (
                <div key={method.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div>
                    <Label htmlFor={method.id} className="text-base font-medium">
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/app/elections')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Creating...
              </>
            ) : (
              "Create Election"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateElection;
