"use client";

import { useState, useEffect } from "react";
import {
  File,
  Download,
  Loader2,
  Search,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const origin = process.env.NEXT_PUBLIC_API_URL;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from "js-cookie";

interface Lab {
  id: number;
  name: string;
  url: string;
  track: string;
  created_at: string;
  size: string;
  description?: string;
  submission_link?: string;
}

export default function StudentLabsPage() {
  const { toast } = useToast();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    filterLabs();
  }, [searchQuery, activeTab, labs]);

  const fetchLabs = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${origin}/labs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch labs: ${response.statusText}`);

      const data = await response.json();
      setLabs(data);
      setFilteredLabs(data);
    } catch (error) {
      console.error("Error fetching labs:", error);
      toast({
        title: "Error",
        description: "Failed to load labs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLabs = () => {
    let filtered = [...labs];

    if (searchQuery) {
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((lab) => lab.track === activeTab);
    }

    setFilteredLabs(filtered);
  };

  const handleDownload = async (lab: Lab) => {
    setIsDownloading(true);
    try {
      toast({
        title: "Downloading...",
        description: `Downloading ${lab.name}`,
      });

      const token = Cookies.get("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${origin}/labs/${lab.id}/download/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // إذا كانت الاستجابة تحتوي على رابط URL، قم بفتحه في نافذة جديدة
      if (result && result.url) {
        window.open(result.url, "_blank");
        toast({
          title: "File opened",
          description: `${lab.name} has been opened in a new tab`,
        });
      } else {
        throw new Error("No URL found in response");
      }
    } catch (error) {
      console.error("Download error details:", error);
      toast({
        title: "Download failed",
        description: `Failed to download the lab: ${
          error instanceof Error ? error.message : String(error)
        }`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // تعديل وظيفة حذف المعمل لإرسال طلب حذف إلى الخادم
  const handleDeleteLab = async (labId: number) => {
    setIsDeleting(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No authentication token found");

      // إرسال طلب حذف إلى الخادم
      const response = await fetch(`${origin}/labs/${labId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `Failed to delete lab: ${response.status} ${response.statusText}${
            errorData ? ` - ${JSON.stringify(errorData)}` : ""
          }`
        );
      }

      // تحديث قائمة المعامل المحلية بعد الحذف الناجح
      setLabs((prevLabs) => prevLabs.filter((lab) => lab.id !== labId));

      toast({
        title: "Lab deleted",
        description: "The lab has been deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete lab",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueTracks = Array.from(new Set(labs.map((lab) => lab.track)));

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Lab Materials</h1>
        <p className='text-muted-foreground'>
          Access and download lab materials for your courses
        </p>
      </div>

      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <div className='relative w-full md:w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search labs...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={fetchLabs}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
        {/* <TabsList className='mb-4'>
          <TabsTrigger value='all'>All Labs</TabsTrigger>
          {uniqueTracks.map((track) => (
            <TabsTrigger key={track} value={track}>
              {track}
            </TabsTrigger>
          ))}
        </TabsList> */}

        <TabsContent value={activeTab}>
          {isLoading ? (
            <LabsSkeleton />
          ) : filteredLabs.length === 0 ? (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium'>No labs found</h3>
              <p className='text-muted-foreground mt-1'>
                {searchQuery
                  ? "Try adjusting your search query"
                  : "No lab materials are available for this track yet"}
              </p>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {filteredLabs.map((lab) => (
                <Card key={lab.id} className='overflow-hidden'>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>{lab.name}</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='outline'
                            className='w-30 h-30 rounded-md'
                          >
                            X
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='sm:max-w-[400px] [&>button]:hidden'>
                          <DialogHeader>
                            <DialogTitle>
                              Are you sure you want to delete this lab?
                            </DialogTitle>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant='outline'>Cancel</Button>
                            </DialogClose>
                            <Button
                              variant='destructive'
                              onClick={() => handleDeleteLab(lab.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <CardDescription>{lab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between items-center text-sm text-muted-foreground mb-4'>
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        {formatDate(lab.created_at)}
                      </div>
                      <div>{lab.size}</div>
                    </div>
                    <Button
                      className='w-full'
                      onClick={() => handleDownload(lab)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className='h-4 w-4 animate-spin mr-2' />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className='h-4 w-4 mr-2' />
                          Download
                        </>
                      )}
                    </Button>
                    {lab.submission_link && (
                      <Button
                        variant='outline'
                        className='w-full mt-2'
                        onClick={() =>
                          window.open(lab.submission_link, "_blank")
                        }
                      >
                        Submit Solution
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LabsSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='overflow-hidden'>
          <Skeleton className='h-32 w-full' />
          <CardHeader className='pb-2'>
            <Skeleton className='h-6 w-3/4 mb-2' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3 mt-1' />
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-center mb-4'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-16' />
            </div>
            <Skeleton className='h-10 w-full' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
