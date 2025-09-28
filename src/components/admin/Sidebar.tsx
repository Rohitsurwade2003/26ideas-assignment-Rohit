import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, BarChart3 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Leads", url: "/admin", icon: Users },
];

export const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="h-screen" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-h3 text-text-primary font-semibold">
              Admin
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="w-full justify-start text-text-primary hover:bg-background-tertiary data-[state=open]:bg-background-tertiary"
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start text-text-secondary hover:bg-background-tertiary border border-border-primary"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};