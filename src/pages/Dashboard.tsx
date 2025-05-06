
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Vote, User, Plus, ArrowRight, CheckCheck } from 'lucide-react';

// Mock data for elections
const upcomingElections = [
  { id: '1', title: 'Student Council Election', startDate: '2025-05-15', endDate: '2025-05-17', status: 'upcoming' },
  { id: '2', title: 'Department Representative', startDate: '2025-06-01', endDate: '2025-06-03', status: 'upcoming' },
];

const activeElections = [
  { id: '3', title: 'Faculty Senate Vote', startDate: '2025-05-01', endDate: '2025-05-08', status: 'active' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isCandidate, isVoter } = useAuth();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your elections today.
          </p>
        </div>
        
        {isAdmin() && (
          <Button onClick={() => navigate('/app/elections/create')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Election
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Elections" 
          value="1" 
          description="Currently running" 
          icon={<Vote className="h-4 w-4 text-vote-accent" />} 
        />
        <StatCard 
          title="Upcoming Elections" 
          value="2" 
          description="Scheduled elections" 
          icon={<Calendar className="h-4 w-4 text-vote-primary" />} 
        />
        <StatCard 
          title="Total Votes" 
          value="149" 
          description="Across all elections" 
          icon={<CheckCheck className="h-4 w-4 text-vote-secondary" />} 
        />
        <StatCard 
          title="Registered Voters" 
          value="248" 
          description="Active participants" 
          icon={<Users className="h-4 w-4 text-vote-accent" />} 
        />
      </div>

      {/* Active Elections */}
      {activeElections.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-medium">Active Elections</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onView={() => navigate(`/app/elections/${election.id}`)}
                onVote={() => navigate(`/app/vote/${election.id}`)}
                showVoteButton={isVoter()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Elections */}
      {upcomingElections.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-medium">Upcoming Elections</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onView={() => navigate(`/app/elections/${election.id}`)}
                showVoteButton={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* For Candidates */}
      {isCandidate() && (
        <div>
          <h3 className="mb-4 text-lg font-medium">My Candidacy</h3>
          <Card>
            <CardHeader>
              <CardTitle>Your Candidate Profile</CardTitle>
              <CardDescription>
                Manage your information that voters will see
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-vote-light flex items-center justify-center text-vote-primary text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold">{user?.name || 'User'}</h4>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate(`/app/candidates/${user?.id}`)}>
                <User className="mr-2 h-4 w-4" /> View My Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* For Admins */}
      {isAdmin() && (
        <div>
          <h3 className="mb-4 text-lg font-medium">Admin Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <AdminActionCard 
              title="Manage Elections" 
              description="Create, edit or delete elections" 
              icon={<Calendar className="h-12 w-12 text-vote-primary" />}
              onClick={() => navigate('/app/elections')}
            />
            <AdminActionCard 
              title="Voter Management" 
              description="Add or remove voters, send invitations" 
              icon={<Users className="h-12 w-12 text-vote-primary" />}
              onClick={() => {}}
            />
            <AdminActionCard 
              title="System Settings" 
              description="Configure security and preferences" 
              icon={<Vote className="h-12 w-12 text-vote-primary" />}
              onClick={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface ElectionCardProps {
  election: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  onView: () => void;
  onVote?: () => void;
  showVoteButton: boolean;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election, onView, onVote, showVoteButton }) => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">{election.title}</CardTitle>
      <CardDescription>
        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <span className={`inline-flex h-2 w-2 rounded-full ${election.status === 'active' ? 'bg-green-500' : 'bg-amber-500'} mr-2`}></span>
        <span className="text-sm capitalize">{election.status}</span>
      </div>
    </CardContent>
    <CardFooter className="flex gap-2 justify-between">
      <Button variant="outline" size="sm" onClick={onView}>
        View Details
      </Button>
      {showVoteButton && election.status === 'active' && onVote && (
        <Button size="sm" onClick={onVote}>
          Vote Now
        </Button>
      )}
    </CardFooter>
  </Card>
);

interface AdminActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const AdminActionCard: React.FC<AdminActionCardProps> = ({ title, description, icon, onClick }) => (
  <Card className="overflow-hidden hover:border-primary/50 cursor-pointer transition-all" onClick={onClick}>
    <CardHeader className="pb-2">
      <div className="mb-2">{icon}</div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="ghost" size="sm" className="gap-1">
        Get Started <ArrowRight className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

export default Dashboard;
