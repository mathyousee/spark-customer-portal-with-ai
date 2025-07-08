import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAccountSummary, mockInvoices, mockSupportTickets, formatCurrency, formatDate } from "@/lib/mock-data";
import { CalendarBlank, CurrencyDollar, FileText, ArrowRight, Robot } from "@phosphor-icons/react";

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const recentInvoices = mockInvoices.slice(0, 3);
  const recentTickets = mockSupportTickets.slice(0, 2);
  
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Here's an overview of your account</p>
      </div>

      {/* Account Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CurrencyDollar className="text-primary" size={16} />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockAccountSummary.currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Plan: {mockAccountSummary.plan}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarBlank className="text-primary" size={16} />
              Next Billing Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(mockAccountSummary.nextBillingDate)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-payment enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="text-primary" size={16} />
              Account Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAccountSummary.accountManager}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contact via email or phone
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>View and manage your invoices</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('invoices')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{invoice.number}</p>
                  <p className="text-xs text-muted-foreground">
                    Issued: {formatDate(invoice.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                    <Badge 
                      variant={
                        invoice.status === 'paid' 
                          ? 'outline' 
                          : invoice.status === 'pending' 
                          ? 'secondary' 
                          : 'destructive'
                      }
                      className="text-xs font-normal"
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Tools Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Robot className="text-primary" size={20} />
            New AI Document Summarization
          </CardTitle>
          <CardDescription>
            Upload documents or images and get instant AI-powered summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-lg">
              <p className="text-sm">
                Our new AI tool helps you extract key insights from documents and images without reading through everything.
                Perfect for quickly understanding contracts, reports, and more.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Supports PDF, Word, text files and images
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Powered by Azure OpenAI for accurate summaries
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Save time reviewing complex documents
                </li>
              </ul>
            </div>
            <Button onClick={() => onNavigate('ai-tools')} className="whitespace-nowrap">
              Try it now
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Support Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Your recent support requests</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate('support')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Opened: {formatDate(ticket.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={
                      ticket.status === 'resolved' 
                        ? 'outline' 
                        : ticket.status === 'in-progress' 
                        ? 'secondary' 
                        : 'default'
                    }
                    className="text-xs font-normal"
                  >
                    {ticket.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}