import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { mockSupportTickets, formatDate, SupportTicket } from '@/lib/mock-data';
import { 
  Plus, 
  ChatTeardrop, 
  Clock, 
  CheckCircle,
  ArrowClockwise,
  WarningCircle
} from '@phosphor-icons/react';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';

export function Support() {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useKV<SupportTicket[]>("user-support-tickets", mockSupportTickets);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (value: string) => {
    setNewTicket(prev => ({
      ...prev,
      priority: value as 'low' | 'medium' | 'high'
    }));
  };

  const handleSubmit = () => {
    if (!newTicket.title || !newTicket.description) {
      toast.error("Please fill out all fields");
      return;
    }
    
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
      priority: newTicket.priority as 'low' | 'medium' | 'high'
    };
    
    setTickets(current => [ticket, ...current]);
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium'
    });
    setOpen(false);
    toast.success("Support ticket created successfully");
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'low':
        return <Clock className="text-muted-foreground" size={16} />;
      case 'medium':
        return <ArrowClockwise className="text-amber-500" size={16} />;
      case 'high':
        return <WarningCircle className="text-destructive" size={16} />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open':
        return <ChatTeardrop className="text-primary" size={16} />;
      case 'in-progress':
        return <ArrowClockwise className="text-amber-500" size={16} />;
      case 'resolved':
        return <CheckCircle className="text-emerald-500" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">Contact us for help and submit support tickets</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new support request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={newTicket.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide details about your issue"
                  value={newTicket.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{ticket.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Opened on {formatDate(ticket.date)}
                  </CardDescription>
                </div>
                <Badge 
                  variant={
                    ticket.status === 'resolved' 
                      ? 'outline' 
                      : ticket.status === 'in-progress' 
                      ? 'secondary' 
                      : 'default'
                  }
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(ticket.status)}
                  <span>
                    {ticket.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-foreground">{ticket.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">Priority:</span>
                <span className="flex items-center gap-1 font-medium">
                  {getPriorityIcon(ticket.priority)}
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Immediate Help?</CardTitle>
          <CardDescription>
            Contact our support team directly for urgent issues
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 p-4 rounded-lg bg-muted flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ChatTeardrop weight="fill" size={20} />
            </div>
            <div>
              <h4 className="font-medium">Live Chat</h4>
              <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
            </div>
          </div>
          <div className="flex-1 p-4 rounded-lg bg-muted flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ChatTeardrop weight="fill" size={20} />
            </div>
            <div>
              <h4 className="font-medium">Email Support</h4>
              <p className="text-sm text-muted-foreground">support@company.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}