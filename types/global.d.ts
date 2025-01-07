interface Issue {
  id: string;
  name: string;
  status: IssueStatusEnum;
  startDate: DateObject;
  endDate: DateObject;
  issue_type: IssueTypeEnum;
  assigned_to: UserObject;
  assigned_date: Date;
  created_by: UserObject;
  created_date: Date;
  updated_by: UserObject;
  updated_date: Date;
  summary: string;
  description: string;
  acceptance_criteria: string;
  ref_to?: string | null;
  ref_by?: string | null;
  dependency_to?: string | null;
  dependency_by?: string | null;
  assigned_iteration?: string | null;
  child?: boolean;
  parent?: string;
}

interface TimeRange {
  fromSelectMonth: number;
  fromSelectYear: string;
  toSelectMonth: number;
  toSelectYear: string;
}

interface Project {
  id: string;
  name?: string;
  status?: IssueStatusEnum;
  startDate?: DateObject;
  endDate?: DateObject;
  issue_type?: IssueTypeEnum;
  assigned_to?: UserObject;
  assigned_date?: Date;
  created_by?: UserObject;
  created_date?: Date;
  updated_by?: UserObject;
  updated_date?: Date;
  summary?: string;
  description?: string;
  acceptance_criteria?: string;
  ref_to?: string | null;
  ref_by?: string | null;
  dependency_to?: string | null;
  dependency_by?: string | null;
  children?: Issue[];
}

interface DateObject {
  y: number;
  m: number;
  d: number;
}
