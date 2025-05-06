
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, CalendarIcon, Filter, List, CheckCheck, Vote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const mockElections = [
  {
    id: '1',
    title: 'Student Council Election',
    description: 'Election for the student council representatives for the academic year 2025-2026',
    startDate: '2025-05-15',
    endDate: '2025-05-17',
    status: 'upcoming',
    totalVoters: 230,
    candidates: 5,
  },
  {
    id: '2',
    title: 'Department Representative',
    description: 'Election for department representatives',
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    status: 'upcoming',
    totalVoters: 120,
    candidates: 3,
  },
  {
    id: '3',
    title: 'Faculty Senate Vote',
    description: 'Vote for faculty senate members',
    startDate: '2025-05-01',
    endDate: '2025-05-08',
    status: 'active',
    totalVoters: 75,
    candidates: 8,
    votesReceived: 42,
  },
  {
    id: '4',
    title: 'Club President Election',
    description: 'Election for the Chess Club president',
    startDate: '2025-04-20',
    endDate: '2025-04-25',
    status: 'completed',
    totalVoters: 48,
    candidates: 2,
    votesReceived: 45,
  },
  {
    id: '5',
    title: 'Budget Approval Vote',
    description: 'Vote to approve the annual budget allocation',
    startDate: '2025-04-10',
    endDate: '2025-04-15',
    status: 'completed',
    totalVoters: 200,
    candidates: 0,
    votesReceived: 180,
  },
];

const Elections: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter elections based on search term and status
  const filteredElections = mockElections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || election.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  const activeElections = filteredElections.filter(election => election.status === 'active');
  const upcomingElections = filteredElections.filter(election => election.status === 'upcoming');
  const completedElections = filteredElections.filter(election => election.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Elections</h2>
          <p className="text-muted-foreground">
            Manage all your election campaigns in one place.
          </p>
        </div>
        
        {isAdmin() && (
          <Button onClick={() => navigate('/app/elections/create')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Election
          </Button>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elections..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Elections</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Elections Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        {/* All Elections */}
        <TabsContent value="all" className="space-y-4">
          {filteredElections.length === 0 ? (
            <EmptyElections />
          ) : (
            <div className="grid gap-6">
              {filteredElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onView={() => navigate(`/app/elections/${election.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Active Elections */}
        <TabsContent value="active" className="space-y-4">
          {activeElections.length === 0 ? (
            <EmptyElections message="No active elections found." />
          ) : (
            <div className="grid gap-6">
              {activeElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onView={() => navigate(`/app/elections/${election.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Upcoming Elections */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingElections.length === 0 ? (
            <EmptyElections message="No upcoming elections found." />
          ) : (
            <div className="grid gap-6">
              {upcomingElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onView={() => navigate(`/app/elections/${election.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Completed Elections */}
        <TabsContent value="completed" className="space-y-4">
          {completedElections.length === 0 ? (
            <EmptyElections message="No completed elections found." />
          ) : (
            <div className="grid gap-6">
              {completedElections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onView={() => navigate(`/app/elections/${election.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ElectionCardProps {
  election: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    totalVoters: number;
    candidates: number;
    votesReceived?: number;
  };
  onView: () => void;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-amber-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{election.title}</CardTitle>
            <CardDescription className="mt-1">{election.description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-2 capitalize">
            <span className={`inline-flex h-2 w-2 rounded-full ${getStatusColor(election.status)} mr-1.5`}></span>
            {election.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Duration:</span>{" "}
              {formatDate(election.startDate)} - {formatDate(election.endDate)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Eligible Voters:</span> {election.totalVoters}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Candidates:</span> {election.candidates}
            </div>
          </div>
          {election.votesReceived !== undefined && (
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium">Votes Cast:</span> {election.votesReceived} / {election.totalVoters}
                {' '}
                ({Math.round((election.votesReceived / election.totalVoters) * 100)}%)
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onView}>
          View Details
        </Button>
        {election.status === 'active' && (
          <Button>
            Vote Now
          </Button>
        )}
        {election.status === 'completed' && (
          <Button variant="secondary">
            View Results
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

interface EmptyElectionsProps {
  message?: string;
}

const EmptyElections: React.FC<EmptyElectionsProps> = ({ message = "No elections found matching your search criteria." }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
    <Vote className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-xl font-semibold">No Elections Found</h3>
    <p className="mb-4 text-muted-foreground">{message}</p>
    <Button variant="outline" asChild>
      <a href="/app/elections/create">
        <Plus className="mr-2 h-4 w-4" /> Create an Election
      </a>
    </Button>
  </div>
);

export default Elections;
