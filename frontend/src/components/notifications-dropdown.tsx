
// import { useState, useEffect } from "react"
// import { Bell, Check, CheckCheck, RefreshCcw, UserCircle, Users } from 'lucide-react'
// import { formatDistanceToNow } from "date-fns"
// import { Button } from "../components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu"
// import { ScrollArea } from "../components/ui/scroll-area"
// import { Badge } from "../components/ui/badge"
// import { useToast } from "../components/ui/use-toast"
// import axios from 'axios'  // استيراد axios
// import Cookies from 'js-cookie';

// interface Notification {
//   id: string;
//   message: string;
//   created_at: string;
//   instructor: number;
//   read: boolean;
//   is_track_notification?: boolean;
// }

// export function NotificationsDropdown() {
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [open, setOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const fetchNotifications = async () => {
//     setIsLoading(true)
//     try {
//       const token = Cookies.get('token');  
//       if (!token) {
//         console.error('Token not found in cookies');
//         return;
//       }
  
//       const response = await axios.get('http://127.0.0.1:8000/notifications/notes/', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
  
//       if (response.data && Array.isArray(response.data)) {
//         console.log(response.data);
  
//         const formattedNotifications = response.data.map((notification: any) => ({
//           id: `${notification.id}`,  
//           message: notification.message,
//           created_at: notification.created_at,
//           instructor: notification.instructor ?? 0, // التأكد من وجود قيمة
//           read: false, // تعيين افتراضي، تحقق إن كنت بحاجة لقيمة أخرى
//           is_track_notification: notification.is_track_notification || false,
//         }));
  
//         setNotifications(formattedNotifications);
        
//         // حساب عدد الإشعارات غير المقروءة
//         const unread = formattedNotifications.filter(n => !n.read).length;
//         setUnreadCount(unread);
//       } else {
//         throw new Error("Invalid response data");
//       }
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load notifications. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     if (open) {
//       fetchNotifications()
//     }
//   }, [open])

//   // Poll for new notifications every 30 seconds
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       if (!open) { // Only poll for new notifications when dropdown is closed
//         fetchNotifications()
//       }
//     }, 30000)

//     return () => clearInterval(intervalId)
//   }, [open])

//   // Initial fetch
//   useEffect(() => {
//     fetchNotifications()
//   }, [])

//   const markAsRead = (id: string) => {
//     setNotifications(prev => {
//       const updatedNotifications = prev.filter(notification => notification.id !== id);
//       setUnreadCount(updatedNotifications.filter(n => !n.read).length);
//       return updatedNotifications;
//     });
//   };
  
//   const markAllAsRead = () => {
//     setNotifications([]);
//     setUnreadCount(0);
//   };

//   const handleNotificationClick = (notification: Notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id)
//     }
//     // في تطبيق حقيقي، يمكنك التنقل إلى صفحة معينة بناءً على الإشعار
//   }

//   const getNotificationIcon = (notification: Notification) => {
//     if (notification.is_track_notification) {
//       return <div className="h-2 w-2 rounded-full bg-yellow-500" />
//     } else {
//       return <div className="h-2 w-2 rounded-full bg-blue-500" />
//     }
//   }

//   return (
//     <DropdownMenu open={open} onOpenChange={setOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//               {unreadCount}
//             </span>
//           )}
//           <span className="sr-only">Notifications</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <div className="flex items-center justify-between p-4">
//           <h3 className="font-medium">Notifications</h3>
//           <div className="flex gap-2">
//             {isLoading && <RefreshCcw className="h-4 w-4 animate-spin text-muted-foreground" />}
//             {unreadCount > 0 && (
//               <Button onClick={markAllAsRead} className="h-auto p-0 text-xs">
//                 <CheckCheck className="mr-1 h-3 w-3" />
//                 Mark all as read
//               </Button>
//             )}
//           </div>
//         </div>
//         <DropdownMenuSeparator />
//         <ScrollArea className="h-[300px]">
//           {notifications.length === 0 ? (
//             <div className="p-4 text-center text-sm text-muted-foreground">
//               {isLoading ? "Loading notifications..." : "No notifications"}
//             </div>
//           ) : (
//             notifications.map((notification) => (
//               <DropdownMenuItem
//                 key={notification.id}
//                 className={`flex cursor-pointer flex-col items-start gap-1 p-4 ${
//                   !notification.read ? "bg-muted/50" : ""
//                 }`}
//                 onClick={() => handleNotificationClick(notification)}
//               >
//                 <div className="flex w-full items-start justify-between gap-2">
//                   <div className="flex items-center gap-2">
//                     {getNotificationIcon(notification)}
//                     <span className="font-medium">
//                       Instructor #{notification.instructor}
//                     </span>
//                     {notification.is_track_notification ? (
//                       <Badge className="ml-1 text-xs">
//                         <Users className="mr-1 h-3 w-3" />
//                         Track
//                       </Badge>
//                     ) : (
//                       <Badge className="ml-1 text-xs">
//                         <UserCircle className="mr-1 h-3 w-3" />
//                         Personal
//                       </Badge>
//                     )}
//                   </div>
//                   {notification.read ? <Check className="h-3 w-3 text-muted-foreground" /> : null}
//                 </div>
//                 <p className="text-sm text-muted-foreground">{notification.message}</p>
//                 <span className="text-xs text-muted-foreground">
//                   {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
//                 </span>
//               </DropdownMenuItem>
//             ))
//           )}
//         </ScrollArea>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, RefreshCcw, UserCircle, Users } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { ScrollArea } from "../components/ui/scroll-area"
import { Badge } from "../components/ui/badge"
import { useToast } from "../components/ui/use-toast"
import axios from 'axios'
import Cookies from 'js-cookie';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  instructor: number;
  read: boolean;
  is_track_notification?: boolean;
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const token = Cookies.get('token');  
      if (!token) {
        console.error('Token not found in cookies');
        return;
      }
  
      const response = await axios.get('http://127.0.0.1:8000/notifications/notes/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data && Array.isArray(response.data)) {
        const formattedNotifications = response.data.map((notification: any) => ({
          id: `${notification.id}`,
          message: notification.message,
          created_at: notification.created_at,
          instructor: notification.instructor_name,
          read: notification.read,  // تعيين الحالة من الـ API مباشرة
          is_track_notification: notification.is_track_notification || false,
        }));
  
        setNotifications(formattedNotifications);
        
        const unread = formattedNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!open) {
        fetchNotifications()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [open])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token not found in cookies');
        return;
      }

      await axios.patch(`http://127.0.0.1:8000/notifications/notes/${id}/`, { read: true }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // عند نجاح التحديث، نقوم بتصفية الإشعار المميز على أنه "مقروء"
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setUnreadCount(prevCount => prevCount - 1);

      toast({
        title: "Notification",
        description: "Notification marked as read and deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Token not found in cookies');
        return;
      }

      await axios.patch('http://127.0.0.1:8000/notifications/mark-all-read/', { read: true }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications([]);
      setUnreadCount(0);
      toast({
        title: "Notifications",
        description: "All notifications marked as read.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const getNotificationIcon = (notification: Notification) => {
    if (notification.is_track_notification) {
      return <div className="h-2 w-2 rounded-full bg-yellow-500" />
    } else {
      return <div className="h-2 w-2 rounded-full bg-blue-500" />
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            {isLoading && <RefreshCcw className="h-4 w-4 animate-spin text-muted-foreground" />}
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} className="h-auto p-0 text-xs">
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {isLoading ? "Loading notifications..." : "No notifications"}
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex cursor-pointer flex-col items-start gap-1 p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification)}
                    <span className="font-medium">
                      Instructor #{notification.instructor}
                    </span>
                    {notification.is_track_notification ? (
                      <Badge className="ml-1 text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        Track
                      </Badge>
                    ) : (
                      <Badge className="ml-1 text-xs">
                        <UserCircle className="mr-1 h-3 w-3" />
                        Personal
                      </Badge>
                    )}
                  </div>
                  {notification.read ? <Check className="h-3 w-3 text-muted-foreground" /> : null}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
