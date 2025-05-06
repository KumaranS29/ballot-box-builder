
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronLeft, User, Edit, Calendar, Mail, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

// Mock candidate data
const mockCandidate = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.edu',
  department: 'Computer Science',
  bio: 'Professor with 15 years of teaching experience and research focus on artificial intelligence and machine learning. I advocate for interdisciplinary collaboration and student-centered teaching methods.',
  qualifications: 'Ph.D. in Computer Science\nExperienced Department Chair\nRecipient of Teaching Excellence Award',
  platform: 'I plan to focus on enhancing research opportunities for faculty, improving classroom technology, and creating more interdisciplinary programs. I believe in transparent governance and will work to ensure faculty voices are heard in all university decisions.',
  elections: [
    { id: '1', title: 'Faculty Senate Election 2024', status: 'completed', result: 'elected' },
    { id: '3', title: 'Faculty Senate Vote', status: 'active', result: 'pending' },
  ]
};

const CandidateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // In a real app, fetch candidate data based on ID
  const candidate = mockCandidate;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(candidate.bio);
  const [editedQualifications, setEditedQualifications] = useState(candidate.qualifications);
  const [editedPlatform, setEditedPlatform] = useState(candidate.platform);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if this is the user's own profile
  const isOwnProfile = user?.id === candidate.id;
  
  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Candidate Not Found</h2>
        <p className="mb-4 text-muted-foreground">The candidate profile you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/app/elections')}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Elections
        </Button>
      </div>
    );
  }
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditedBio(candidate.bio);
    setEditedQualifications(candidate.qualifications);
    setEditedPlatform(candidate.platform);
    setIsEditing(false);
  };
  
  const handleSave = () => {
    setIsSubmitting(true);
    
    // In a real app, save the changes to the database
    setTimeout(() => {
      toast({
        title: "Profile Updated",
        description: "Your candidate profile has been updated successfully.",
      });
      setIsSubmitting(false);
      setIsEditing(false);
      
      // Update local state to reflect changes
      candidate.bio = editedBio;
      candidate.qualifications = editedQualifications;
      candidate.platform = editedPlatform;
    }, 1000);
  };
  
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back Button */}
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      {/* Candidate Header */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-vote-light text-3xl font-bold text-vote-primary">
          {candidate.name.charAt(0)}
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">{candidate.name}</h2>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant="outline">{candidate.department}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-1 h-4 w-4" />
              {candidate.email}
            </div>
          </div>
          
          {(isAdmin() || isOwnProfile) && !isEditing && (
            <Button variant="outline" size="sm" className="mt-4" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      {/* Candidate Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Tell voters about yourself..."
                  />
                </div>
              ) : (
                <p>{candidate.bio}</p>
              )}
            </CardContent>
          </Card>
          
          {/* Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Textarea
                    id="qualifications"
                    value={editedQualifications}
                    onChange={(e) => setEditedQualifications(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="List your qualifications..."
                  />
                </div>
              ) : (
                <div className="whitespace-pre-line">{candidate.qualifications}</div>
              )}
            </CardContent>
          </Card>
          
          {/* Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Election Platform</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Textarea
                    id="platform"
                    value={editedPlatform}
                    onChange={(e) => setEditedPlatform(e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Describe your platform and goals..."
                  />
                </div>
              ) : (
                <p>{candidate.platform}</p>
              )}
            </CardContent>
          </Card>
          
          {/* Edit Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Elections */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Election History</CardTitle>
              <CardDescription>
                Past and current elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {candidate.elections.length > 0 ? (
                <div className="space-y-4">
                  {candidate.elections.map((election) => (
                    <div key={election.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{election.title}</h4>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="capitalize text-muted-foreground">{election.status}</span>
                          </div>
                        </div>
                        {election.result && (
                          <Badge 
                            variant={election.result === 'elected' ? 'default' : 'outline'}
                            className={election.result === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                          >
                            {election.result === 'elected' ? (
                              <>
                                <Check className="mr-1 h-3 w-3" /> Elected
                              </>
                            ) : (
                              'Pending'
                            )}
                          </Badge>
                        )}
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No election history available.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/app/elections">
                  View All Elections
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
