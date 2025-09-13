export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'qa_engineer' | 'qa_manager' | 'developer' | 'compliance_officer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: number;
  title: string;
  description: string;
  preconditions?: string;
  steps: string[];
  expected_results: string;
  test_data?: string;
  priority: number;
  status: 'draft' | 'active' | 'in_progress' | 'passed' | 'failed';
  assigned_user?: string;
  created_by: string;
  folder?: string;
  automated: boolean;
  project_id?: string;
  pass_rate?: number;
  comments_count?: number;
  automation_scripts_count?: number;
  latest_run?: any;
  created_at: string;
  updated_at: string;
}


export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'minor' | 'major' | 'critical' | 'blocker';
  assigned_user?: string;
  created_by: string;
  test_case?: string;
  test_run_id?: number;
  labels: Label[];
  comments_count: number;
  linked_to_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestRun {
  id: number;
  test_case_id: number;
  user_id: number;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'blocked' | 'skipped';
  execution_time?: number;
  notes?: string;
  evidence?: any;
  automated?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  file_size: string;
  content_type: string;
  version: string;
  tags: string[];
  folder?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
  tickets_count?: number;
}

export interface AutomationScript {
  id: number;
  name: string;
  description: string;
  script_path: string;
  status: 'draft' | 'active' | 'inactive';
  test_case: string;
  created_by: string;
  success_rate: number;
  last_execution?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  test_metrics: {
    total_test_cases: number;
    active_test_cases: number;
    pass_rate: number;
    recent_runs: number;
  };
  ticket_metrics: {
    total_tickets: number;
    open_tickets: number;
    closed_tickets: number;
    critical_tickets: number;
  };
  automation_metrics: {
    automation_coverage: number;
    automated_runs: number;
    manual_runs: number;
  };
  document_metrics: {
    total_documents: number;
    recent_uploads: number;
  };
}

export interface Activity {
  type: string;
  message: string;
  user: string;
  timestamp: string;
}

export interface TrendData {
  date: string;
  passed?: number;
  failed?: number;
  opened?: number;
  closed?: number;
  automated?: number;
  manual?: number;
}

// src/types/index.ts (add to existing types)
export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}
