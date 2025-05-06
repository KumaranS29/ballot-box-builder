
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, User, Calendar, Users, Vote, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

// Mock election result data
const mockElectionResults = {
  id: '4',
  title: 'Club President Election',
  description: 'Election for the Chess Club president for the 2025-2026 academic year.',
  startDate: '2025-04-20',
  endDate: '2025-04-25',
  status: 'completed',
  votingMethod: 'plurality',
  totalVoters: 48,
  votesReceived: 45,
  candidates: [
    { id: '1', name: 'Alex Thompson', votes: 28, percentage: 62.2 },
    { id: '2', name: 'Jamie Parker', votes: 17, percentage: 37.8 },
  ],
  departmentBreakdown: [
    { name: 'Computer Science', votes: 12 },
    { name: 'Business', votes: 10 },
    { name: 'Engineering', votes: 8 },
    { name: 'Arts', votes: 7 },
    { name: 'Sciences', votes: 5 },
    { name: 'Other', votes: 3 },
  ],
  dateBreakdown: [
    { date: '04/20', votes: 15 },
    { date: '04/21', votes: 12 },
    { date: '04/22', votes: 7 },
    { date: '04/23', votes: 5 },
    { date: '04/24', votes: 4 },
    { date: '04/25', votes: 2 },
  ]
};

const COLORS = ['#8B5CF6', '#6E59A5', '#0EA5E9', '#D6BCFA', '#C084FC', '#E879F9'];

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // In a real app, fetch results data based on ID
  const electionResults = mockElectionResults;
  
  if (!electionResults) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Results Not Found</h2>
        <p className="mb-4 text-muted-foreground">The election results you're looking for don't exist.</p>
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
  
  const winner = electionResults.candidates.reduce((prev, current) => 
    (prev.votes > current.votes) ? prev : current
  );
  
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate(`/app/elections/${electionResults.id}`)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Election Details
      </Button>
      
      {/* Results Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Results: {electionResults.title}</h2>
          <Badge variant="outline" className="ml-2 capitalize">
            <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
            Completed
          </Badge>
        </div>
        <p className="text-muted-foreground">{electionResults.description}</p>
      </div>
      
      {/* Summary Card */}
      <Card className="border-vote-primary/20 bg-vote-primary/5">
        <CardHeader>
          <CardTitle>Election Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Election Period</h4>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {formatDate(electionResults.startDate)} - {formatDate(electionResults.endDate)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Participation</h4>
                <div className="flex items-center text-sm">
                  <Vote className="mr-2 h-4 w-4 text-muted-foreground" />
                  {electionResults.votesReceived} of {electionResults.totalVoters} voters
                  {' '}
                  ({Math.round((electionResults.votesReceived / electionResults.totalVoters) * 100)}%)
                </div>
              </div>
            </div>
            
            <div className="rounded-md border bg-background p-4">
              <h3 className="mb-2 text-lg font-semibold">Winner</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vote-light text-lg font-bold text-vote-primary">
                  {winner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{winner.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <span>{winner.votes} votes</span>
                    <span>({winner.percentage}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionResults.candidates}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {electionResults.candidates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Results */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Candidate Results */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Results</CardTitle>
            <CardDescription>
              Breakdown of votes received by each candidate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {electionResults.candidates.map((candidate, index) => (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-vote-light flex items-center justify-center text-xs font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                      {candidate.name.charAt(0)}
                    </div>
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {candidate.votes} votes
                  </div>
                </div>
                <Progress value={candidate.percentage} className="h-2" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}>
                  <div className="h-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                </Progress>
                <p className="text-xs text-right text-muted-foreground">
                  {candidate.percentage}% of total votes
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Voting Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Patterns</CardTitle>
            <CardDescription>
              Distribution of votes over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={electionResults.dateBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>
              Distribution of votes by department
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={electionResults.departmentBreakdown} 
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="votes" fill="#6E59A5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Export Results */}
        <Card>
          <CardHeader>
            <CardTitle>Export Results</CardTitle>
            <CardDescription>
              Download the full election results for your records
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-56">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-vote-light">
              <Download className="h-8 w-8 text-vote-primary" />
            </div>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Export your election data in various formats for reporting and analysis.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">CSV</Button>
              <Button variant="outline" size="sm">PDF</Button>
              <Button variant="outline" size="sm">Excel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
