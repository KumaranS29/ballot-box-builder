
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Vote, CheckCheck, User, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="h-6 w-6 text-vote-primary" />
            <span className="text-xl font-bold">BallotBox</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/app')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container flex flex-col items-center py-12 text-center md:flex-row md:py-24 md:text-left">
          <div className="mb-12 flex-1 space-y-4 md:mb-0 md:pr-12">
            <h1 className="gradient-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              The Modern Way to Run Elections
            </h1>
            <p className="text-xl text-muted-foreground">
              Create, manage and run secure elections with our comprehensive voting platform.
              Perfect for organizations, schools, and communities of all sizes.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-center md:justify-start">
              <Button size="lg" onClick={() => navigate('/register')}>
                Create Your First Election
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative aspect-video overflow-hidden rounded-lg border shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-vote-primary/20 to-vote-accent/20"></div>
              <img
                src="https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                alt="Voting Platform"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
              Our platform provides all the tools you need to run successful and secure elections.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="ballot-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-vote-primary/10">
                <CheckCheck className="h-6 w-6 text-vote-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Simple Voting</h3>
              <p className="text-muted-foreground">
                Create customizable ballots with multiple voting methods including
                ranked choice, approval, and plurality voting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="ballot-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-vote-primary/10">
                <User className="h-6 w-6 text-vote-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Candidate Management</h3>
              <p className="text-muted-foreground">
                Allow candidates to create profiles, submit information, and connect
                with voters throughout the election process.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="ballot-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-vote-primary/10">
                <Users className="h-6 w-6 text-vote-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Voter Verification</h3>
              <p className="text-muted-foreground">
                Ensure electoral integrity with our secure voter verification
                system and real-time results tabulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-vote-primary to-vote-accent p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Elections?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Join thousands of organizations who trust BallotBox for their important decisions.
              Start running secure and efficient elections today.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-vote-primary hover:bg-white/90"
              onClick={() => navigate('/register')}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-vote-primary" />
              <span className="font-semibold">BallotBox</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BallotBox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
