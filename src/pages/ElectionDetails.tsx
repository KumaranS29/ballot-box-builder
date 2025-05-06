
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Users, Vote, Check, ChevronLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock data for election
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
    { id: '1', name: 'Dr. Sarah Johnson', department: 'Computer Science', votes: 15 },
    { id: '2', name: 'Prof. Michael Chen', department: 'Electrical Engineering', votes: 12 },
    { id: '3', name: 'Dr. Emily Rodriguez', department: 'Mathematics', votes: 8 },
    { id: '4', name: 'Prof. David Kim', department: 'Physics', votes: 7 },
    { id: '5', name: 'Dr. Lisa Patel', department: 'Biology', votes: 0 },
    { id: '6', name: 'Prof. James Wilson', department: 'Chemistry', votes: 0 },
    { id: '7', name: 'Dr. Robert Thompson', department: 'Civil Engineering', votes: 0 },
    { id: '8', name: 'Prof. Amanda Garcia', department: 'Mechanical Engineering', votes: 0 },
  ],
  voters: [
    { id: '1', name: 'John Doe', department: 'Computer Science', voted: true },
    { id: '2', name: 'Jane Smith', department: 'Electrical Engineering', voted: true },
    { id: '3', name: 'Michael Johnson', department: 'Mathematics', voted: false },
    // ... more voters
  ]
};

const ElectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isVoter } = useAuth();
  
  // In a real app, fetch election data based on ID
  const election = mockElection;
  
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
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const votingMethodName = (method: string) => {
    switch (method) {
      case 'plurality': return 'Plurality Voting';
      case 'ranked-choice': return 'Ranked Choice Voting';
      case 'approval': return 'Approval Voting';
      default: return method;
    }
  };
  
  const votingProgress = (votesReceived: number, totalVoters: number) => {
    return Math.round((votesReceived / totalVoters) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/app/elections')}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Elections
      </Button>
      
      {/* Election Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{election.title}</h2>
          <Badge variant="outline" className="ml-2 capitalize">
            <span className={`inline-flex h-2 w-2 rounded-full ${getStatusColor(election.status)} mr-1.5`}></span>
            {election.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">{election.description}</p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {election.status === 'active' && isVoter() && (
          <Button onClick={() => navigate(`/app/vote/${election.id}`)}>
            <Vote className="mr-2 h-4 w-4" /> Vote Now
          </Button>
        )}
        
        {election.status === 'completed' && (
          <Button onClick={() => navigate(`/app/results/${election.id}`)}>
            <Check className="mr-2 h-4 w-4" /> View Results
          </Button>
        )}
        
        {isAdmin() && (
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" /> Manage Candidates
          </Button>
        )}
        
        {isAdmin() && (
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Manage Voters
          </Button>
        )}
      </div>
      
      {/* Election Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Election Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-1 text-sm font-medium">Election Period</h4>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(election.startDate)} - {formatDate(election.endDate)}
              </div>
            </div>
            
            <div>
              <h4 className="mb-1 text-sm font-medium">Voting Method</h4>
              <div className="flex items-center text-sm">
                <Vote className="mr-2 h-4 w-4 text-muted-foreground" />
                {votingMethodName(election.votingMethod)}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="mb-2 text-sm font-medium">Participation</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Votes Cast</span>
                <span className="font-medium">
                  {election.votesReceived} of {election.totalVoters}
                </span>
              </div>
              <Progress value={votingProgress(election.votesReceived, election.totalVoters)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {votingProgress(election.votesReceived, election.totalVoters)}% participation rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Candidates and Voters */}
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
        </TabsList>
        
        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {election.candidates.map((candidate) => (
              <Card key={candidate.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  {election.status === 'completed' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Votes</span>
                        <span className="font-medium">{candidate.votes}</span>
                      </div>
                      <Progress
                        value={candidate.votes / Math.max(...election.candidates.map(c => c.votes)) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <a href={`/app/candidates/${candidate.id}`}>
                      View Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Voters Tab */}
        <TabsContent value="voters" className="space-y-4">
          {isAdmin() ? (
            <Card>
              <CardHeader>
                <CardTitle>Voter Participation</CardTitle>
                <CardDescription>
                  Track who has and hasn't voted in this election.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Department</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {election.voters.map((voter) => (
                      <tr key={voter.id} className="border-b">
                        <td className="py-3">{voter.name}</td>
                        <td className="py-3">{voter.department}</td>
                        <td className="py-3 text-right">
                          {voter.voted ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600">
                              <Check className="mr-1 h-3 w-3" /> Voted
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                              Pending
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter>
                {isAdmin() && (
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" /> Invite More Voters
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Voter Information</CardTitle>
                <CardDescription>
                  Only administrators can view the full voter list.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p>
                  {election.votesReceived} out of {election.totalVoters} eligible voters
                  have participated in this election.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionDetails;
