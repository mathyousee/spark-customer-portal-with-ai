import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAccountSummary, mockInvoices, mockSupportTickets, formatCurrency, formatDate } from "@/lib/mock-data";
import { CalendarBlank, CurrencyDollar, FileText, ArrowRight } from "@phosphor-icons/react";

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