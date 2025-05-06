
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronLeft, AlertCircle, User, Vote as VoteIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

// Mock election data (Same as in ElectionDetails)
const mockElection = {
  id: '3',
  title: 'Faculty Senate Vote',
  description: 'Vote for faculty senate members from different departments to represent faculty interests in university governance. Each elected member will serve a one-year term.',
  startDate: '2025-05-01',
  endDate: '2025-05-08',
  status: 'active',
  votingMethod: 'plurality',
  totalVoters: 75,
  votesReceived: 42,
  candidates: [
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', bio: 'Professor with 15 years of teaching experience and research focus on artificial intelligence.' },
    { id: '2', name: 'Prof. Michael Chen', department: 'Electrical Engineering', bio: 'Department chair specializing in semiconductor devices with industry partnerships.' },
    { id: '3', name: 'Dr. Emily Rodriguez', department: 'Mathematics', bio: 'Award-winning educator focused on improving mathematics curriculum across disciplines.' },
    { id: '4', name: 'Prof. David Kim', department: 'Physics', bio: 'Researcher in quantum physics with multiple patents and publications.' },
    { id: '5', name: 'Dr. Lisa Patel', department: 'Biology', bio: 'Leading researcher in genetics with focus on student mentorship and inclusion.' },
    { id: '6', name: 'Prof. James Wilson', department: 'Chemistry', bio: 'Faculty advocate with experience in curriculum development and student success initiatives.' },
    { id: '7', name: 'Dr. Robert Thompson', department: 'Civil Engineering', bio: 'Former industry professional bringing practical applications to academic settings.' },
    { id: '8', name: 'Prof. Amanda Garcia', department: 'Mechanical Engineering', bio: 'Focused on sustainability in engineering education and research.' },
  ],
};

const Vote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isVoter } = useAuth();
  const { toast } = useToast();
  
  // In a real app, you would fetch the election data by ID
  const election = mockElection;
  
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [approvedCandidates, setApprovedCandidates] = useState<string[]>([]);
  const [rankedCandidates, setRankedCandidates] = useState<Map<string, number>>(new Map());
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not a voter
  React.useEffect(() => {
    if (!isVoter()) {
      navigate('/app');
      toast({
        title: "Access Denied",
        description: "Only voters can access the voting page.",
        variant: "destructive",
      });
    }
  }, [isVoter, navigate, toast]);
  
  if (!election) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Election Not Found</h2>
        <p className="mb-4 text-muted-foreground">The election you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/app/elections')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Elections
        </Button>
      </div>
    );
  }
  
  // Handler for plurality voting
  const handlePluralitySelection = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };
  
  // Handler for approval voting
  const handleApprovalSelection = (candidateId: string, checked: boolean) => {
    if (checked) {
      setApprovedCandidates([...approvedCandidates, candidateId]);
    } else {
      setApprovedCandidates(approvedCandidates.filter(id => id !== candidateId));
    }
  };
  
  // Submit vote handler
  const handleSubmitVote = () => {
    setIsSubmitting(true);
    
    // Validate vote based on voting method
    if (election.votingMethod === 'plurality' && !selectedCandidate) {
      toast({
        title: "Selection Required",
        description: "Please select a candidate to vote for.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    if (election.votingMethod === 'approval' && approvedCandidates.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one candidate to approve.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Mock vote submission
    if (currentStep === 1) {
      setCurrentStep(2); // Go to confirmation step
      setIsSubmitting(false);
    } else {
      // Final submission (would be replaced with Supabase after integration)
      setTimeout(() => {
        toast({
          title: "Vote Submitted",
          description: "Your vote has been recorded successfully.",
        });
        setIsSubmitting(false);
        navigate('/app/elections');
      }, 1000);
    }
  };
  
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate(`/app/elections/${election.id}`)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Election Details
      </Button>
      
      {/* Voting Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Vote: {election.title}</h2>
        <p className="text-muted-foreground">
          {election.description}
        </p>
      </div>
      
      {/* Stepper */}
      <div className="flex items-center justify-center">
        <div className="flex w-full max-w-sm items-center">
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-vote-primary text-white' : 'border border-muted-foreground text-muted-foreground'}`}>
              1
            </div>
            <span className="mt-1 text-xs">Make Selection</span>
          </div>
          <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-vote-primary' : 'bg-muted'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-vote-primary text-white' : 'border border-muted-foreground text-muted-foreground'}`}>
              2
            </div>
            <span className="mt-1 text-xs">Confirm</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Voting */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>
              {election.votingMethod === 'plurality' && "Select one candidate you wish to vote for."}
              {election.votingMethod === 'approval' && "Select all candidates you approve of."}
              {election.votingMethod === 'ranked-choice' && "Rank the candidates in your order of preference."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Plurality Voting */}
            {election.votingMethod === 'plurality' && (
              <RadioGroup 
                value={selectedCandidate || ""} 
                onValueChange={handlePluralitySelection} 
                className="space-y-3"
              >
                {election.candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={candidate.id} id={`candidate-${candidate.id}`} className="mt-1" />
                    <div>
                      <Label htmlFor={`candidate-${candidate.id}`} className="text-base font-medium cursor-pointer">
                        {candidate.name}
                      </Label>
                      <Badge variant="outline" className="ml-2">
                        {candidate.department}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {candidate.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {/* Approval Voting */}
            {election.votingMethod === 'approval' && (
              <div className="space-y-3">
                {election.candidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={`candidate-${candidate.id}`} 
                      checked={approvedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) => 
                        handleApprovalSelection(candidate.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor={`candidate-${candidate.id}`} className="text-base font-medium cursor-pointer">
                        {candidate.name}
                      </Label>
                      <Badge variant="outline" className="ml-2">
                        {candidate.department}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {candidate.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(`/app/elections/${election.id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitVote} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                "Continue to Confirmation"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 2: Confirmation */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Vote</CardTitle>
            <CardDescription>
              Please review your selection carefully. Once submitted, you cannot change your vote.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Your vote is confidential and cannot be changed after submission. Please review your selection carefully.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <h3 className="font-medium mb-2">Your Selection:</h3>
              
              {election.votingMethod === 'plurality' && selectedCandidate && (
                <div>
                  {election.candidates.filter(c => c.id === selectedCandidate).map(candidate => (
                    <div key={candidate.id} className="flex items-center gap-3">
                      <User className="h-6 w-6 text-vote-primary" />
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {election.votingMethod === 'approval' && (
                <div className="space-y-3">
                  {approvedCandidates.length === 0 ? (
                    <p className="text-muted-foreground">No candidates selected.</p>
                  ) : (
                    election.candidates
                      .filter(c => approvedCandidates.includes(c.id))
                      .map(candidate => (
                        <div key={candidate.id} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.department}</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Back to Selection
            </Button>
            <Button onClick={handleSubmitVote} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <VoteIcon className="mr-2 h-4 w-4" /> Submit Final Vote
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Vote;
