export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  schoolGrade?: string;
  studyGoals?: string;
  phone?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface Essay {
  id: number;
  title: string;
  theme: string;
  content: string;
  status: EssayStatus;
  essayType?: string;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  user?: User;
  feedbacks?: Feedback[];
}

export enum EssayStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ANALYZED = 'ANALYZED',
  ARCHIVED = 'ARCHIVED'
}

export interface Feedback {
  id: number;
  overallScore?: number;
  competence1Score?: number;
  competence2Score?: number;
  competence3Score?: number;
  competence4Score?: number;
  competence5Score?: number;
  generalComment: string;
  competence1Comment?: string;
  competence2Comment?: string;
  competence3Comment?: string;
  competence4Comment?: string;
  competence5Comment?: string;
  competence1Detailed?: string;
  competence2Detailed?: string;
  competence3Detailed?: string;
  competence4Detailed?: string;
  competence5Detailed?: string;
  lineErrors?: string;
  webResearchContext?: string;
  suggestions?: string;
  positivePoints?: string;
  type: FeedbackType;
  createdAt: string;
  essayId?: number;
  reviewer?: User;
}

export enum FeedbackType {
  AI_GENERATED = 'AI_GENERATED',
  HUMAN_REVIEW = 'HUMAN_REVIEW',
  PEER_REVIEW = 'PEER_REVIEW'
}

export interface EssayCreateRequest {
  title: string;
  theme: string;
  content: string;
  essayType?: string;
}

export interface UserRegistrationRequest {
  name: string;
  email: string;
  password: string;
  schoolGrade?: string;
  studyGoals?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface UserStats {
  averageScore: number;
  feedbackCount: number;
  totalEssays: number;
}

export interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  command?: () => void;
  items?: MenuItem[];
}

export interface NotificationOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

