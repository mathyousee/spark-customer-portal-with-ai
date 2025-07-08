import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAccountSummary } from '@/lib/mock-data';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';
import { Check } from '@phosphor-icons/react';

export function Settings() {
  const [profile, setProfile] = useKV("user-profile", {
    name: mockAccountSummary.name,
    email: mockAccountSummary.email,
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001"
  });
  
  const [notifications, setNotifications] = useKV("user-notifications", {
    invoices: true,
    support: true,
    marketing: false,
    product: true,
  });
  
  const [formProfile, setFormProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (key: keyof typeof notifications, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
    
    toast.success(`Notification preferences updated`);
  };
  
  const handleSaveProfile = () => {
    setProfile(formProfile);
    setIsEditing(false);
    toast.success("Profile information updated successfully");
  };
  
  const handleCancelEdit = () => {
    setFormProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formProfile.name} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formProfile.email} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formProfile.phone} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formProfile.address} 
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Check className="mr-2" size={16} />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <div></div>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what information you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Invoice Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new invoices and payment reminders
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.invoices} 
                    onCheckedChange={(checked) => handleNotificationChange('invoices', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Support Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates on your support tickets
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.support} 
                    onCheckedChange={(checked) => handleNotificationChange('support', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive news, announcements and promotional offers
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new features and improvements
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.product} 
                    onCheckedChange={(checked) => handleNotificationChange('product', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your billing details and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Current Plan</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{mockAccountSummary.plan}</p>
                      <p className="text-sm text-muted-foreground">Billed monthly</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 bg-card rounded-md border flex items-center justify-center text-sm font-medium">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/24</p>
                      </div>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Billing Address</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p>{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}