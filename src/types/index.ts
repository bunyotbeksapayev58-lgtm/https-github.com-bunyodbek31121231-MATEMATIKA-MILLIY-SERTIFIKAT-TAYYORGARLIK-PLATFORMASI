export type UserRole = 'student' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  target_score: number;
  daily_goal_questions: number;
  current_streak: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  code: string;
  title: string;
  section: string;
  description: string | null;
  order_num: number;
  is_active: boolean;
  question_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Subtopic {
  id: string;
  topic_id: string;
  code: string | null;
  title: string;
  description: string | null;
  order_num: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'numeric' | 'text';

export interface QuestionOption {
  id?: string;
  question_id?: string;
  key: string;
  text: string;
  order_num?: number;
}

export interface Question {
  id: string;
  custom_id: string | null;
  topic_id: string | null;
  subtopic_id: string | null;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  image_url: string | null;
  correct_answer?: string; // Hidden during active tests
  explanation: string | null;
  source: string | null;
  tags: string[];
  is_active: boolean;
  options?: QuestionOption[];
  topic?: Topic;
  subtopic?: Subtopic;
  created_at: string;
  updated_at: string;
}

export type TestMode = 'topic' | 'mixed' | 'exam';
export type TestStatus = 'in_progress' | 'completed' | 'abandoned';

export interface TestSession {
  id: string;
  user_id: string;
  mode: TestMode;
  topic_id: string | null;
  subtopic_id: string | null;
  exam_template_id: string | null;
  title: string;
  total_questions: number;
  time_limit_seconds: number;
  time_spent_seconds: number;
  score: number;
  max_score: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  accuracy_percent: number;
  status: TestStatus;
  started_at: string;
  submitted_at: string | null;
  created_at: string;
}

export interface TestAnswer {
  id: string;
  session_id: string;
  question_id: string;
  question_order: number;
  user_answer: string | null;
  is_correct: boolean | null;
  is_marked_for_review: boolean;
  time_spent_seconds: number;
  question?: Question;
}

export interface ExamTemplate {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  rules: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mistake {
  id: string;
  user_id: string;
  question_id: string;
  session_id: string | null;
  user_answer: string | null;
  is_reviewed: boolean;
  review_count: number;
  created_at: string;
  question?: Question;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  note: string | null;
  created_at: string;
  question?: Question;
}

export interface Formula {
  id: string;
  category: string;
  title: string;
  formula_latex: string;
  description: string | null;
  examples: string | null;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface StudentDashboardStats {
  total_tests_completed: number;
  total_questions_answered: number;
  correct_answers: number;
  accuracy_percentage: number;
  daily_goal: number;
  today_answered: number;
  current_learning_streak: number;
  weekly_activity: {
    date: string;
    day_name: string;
    questions_answered: number;
    correct_answers: number;
  }[];
  recent_attempts: {
    id: string;
    title: string;
    mode: TestMode;
    score: number;
    accuracy_percent: number;
    total_questions: number;
    correct_count: number;
    created_at: string;
  }[];
  weakest_topics: {
    topic_id: string;
    topic_title: string;
    mistakes_count: number;
  }[];
}

export interface ImportHistoryItem {
  id: string;
  admin_id: string | null;
  file_name: string;
  total_questions: number;
  imported_questions: number;
  failed_questions: number;
  status: string;
  errors_log: any[];
  created_at: string;
}
