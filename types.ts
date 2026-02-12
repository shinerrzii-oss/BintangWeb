
export interface UserProfile {
  name: string;
  major: string;
  university: string;
  bio: string;
  email: string;
  avatar: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  category: 'National' | 'International' | 'Campus';
  certificateUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: 'Work' | 'Organization' | 'Volunteer';
  description?: string;
}

export interface AcademicRecord {
  semester: string;
  gpa: number;
}

export interface Hobby {
  id: string;
  name: string;
  icon: string;
}

export interface AppState {
  profile: UserProfile;
  achievements: Achievement[];
  experiences: Experience[];
  academics: AcademicRecord[];
  hobbies: Hobby[];
}
