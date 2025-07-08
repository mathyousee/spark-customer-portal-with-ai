// Mock data for Customer Portal

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

export interface AccountSummary {
  name: string;
  email: string;
  plan: string;
  nextBillingDate: string;
  currentBalance: number;
  accountManager: string;
}

// Generate mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    number: 'INV-2023-001',
    date: '2023-06-15',
    dueDate: '2023-07-15',
    amount: 1250.00,
    status: 'paid'
  },
  {
    id: 'inv-002',
    number: 'INV-2023-002',
    date: '2023-07-15',
    dueDate: '2023-08-15',
    amount: 1250.00,
    status: 'paid'
  },
  {
    id: 'inv-003',
    number: 'INV-2023-003',
    date: '2023-08-15',
    dueDate: '2023-09-15',
    amount: 1250.00,
    status: 'pending'
  },
  {
    id: 'inv-004',
    number: 'INV-2023-004',
    date: '2023-09-15',
    dueDate: '2023-10-15',
    amount: 1500.00,
    status: 'pending'
  },
  {
    id: 'inv-005',
    number: 'INV-2023-005',
    date: '2023-05-15',
    dueDate: '2023-06-15',
    amount: 1250.00,
    status: 'overdue'
  }
];

// Generate mock support tickets
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-001',
    title: 'Cannot access reporting feature',
    description: 'When I try to access the reporting section, I get an error message.',
    date: '2023-09-28',
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: 'ticket-002',
    title: 'Need to update billing information',
    description: 'I need to update our company credit card details for future payments.',
    date: '2023-09-25',
    status: 'resolved',
    priority: 'medium'
  },
  {
    id: 'ticket-003',
    title: 'Question about new features',
    description: 'I saw your recent product update email. When will the new analytics dashboard be available?',
    date: '2023-09-22',
    status: 'open',
    priority: 'low'
  }
];

// Generate mock account summary
export const mockAccountSummary: AccountSummary = {
  name: 'Acme Corporation',
  email: 'billing@acmecorp.example',
  plan: 'Enterprise',
  nextBillingDate: '2023-10-15',
  currentBalance: 1500.00,
  accountManager: 'Sarah Johnson'
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};