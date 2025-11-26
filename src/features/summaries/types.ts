// KPI Data Structure
export interface Data1 {
    simpleCatalogCount: number;
    compositeCatalogCount: number;
    materialsCatalogCount: number;
    compositeWorkCount: number;
  }
  
  // Budget Data Item Structure
  export interface BudgetProject {
    businessUnit: string;
    country: string;
    year: number;
    tasksInfo: string;
    status: string;
    budgetTotal: string; // Keeping as string as per source, will parse for charts
    project: string;
  }
  
  // API Response Types
  export type Tipo2 = BudgetProject[];
  export type Tipo3 = BudgetProject[];
  
  export interface DashboardData {
    kpis: Data1;
    activeBudgets: Tipo2;
    historicalBudgets: Tipo3;
  }
  
  export enum TabView {
    DASHBOARD = 'DASHBOARD',
    BUDGETS = 'BUDGETS',
    HISTORY = 'HISTORY',
  }
  