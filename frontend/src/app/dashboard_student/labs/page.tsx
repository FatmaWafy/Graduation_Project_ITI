"use client"

import { useState, useEffect } from "react"
import { File, Download, Loader2, Search, Calendar, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import Cookies from "js-cookie"

interface Lab {
  id: number
  name: string
  url: string
  track: string
  created_at: string
  size: string
  description?: string
}

export default function StudentLabsPage() {
  const { toast } = useToast()
  const [labs, setLabs] = useState<Lab[]>([])
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchLabs()
  }, [])

  useEffect(() => {
    filterLabs()
  }, [searchQuery, activeTab, labs])

  const fetchLabs = async () => {
    setIsLoading(true)
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://127.0.0.1:8000/labs/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch labs: ${response.statusText}`)
      }

      const data = await response.json()
      setLabs(data)
      setFilteredLabs(data)
    } catch (error) {
      console.error("Error fetching labs:", error)
      toast({
        title: "Error",
        description: "Failed to load labs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterLabs = () => {
    let filtered = [...labs]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by track
    if (activeTab !== "all") {
      filtered = filtered.filter((lab) => lab.track === activeTab)
    }

    setFilteredLabs(filtered)
  }

  const handleDownload = async (lab: Lab) => {
    try {
      toast({
        title: "Downloading...",
        description: `Downloading ${lab.name}`,
      });
  
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`http://127.0.0.1:8000/labs/${lab.id}/download/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error details:", response.status, errorText);
        throw new Error(`Download failed: ${response.status} - ${errorText}`);
      }
  
      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid file type received");
      }
  
      const blob = await response.blob();
      console.log("Blob details:", blob.type, blob.size);
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = lab.name.endsWith(".pdf") ? lab.name : `${lab.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
  
      toast({
        title: "Download complete",
        description: `${lab.name} has been downloaded successfully`,
      });
    } catch (error) {
      console.error("Download error details:", error);
      toast({
        title: "Download failed",
        description: `Failed to download the lab: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get unique tracks for tabs
  const uniqueTracks = Array.from(new Set(labs.map((lab) => lab.track)))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lab Materials</h1>
        <p className="text-muted-foreground">Access and download lab materials for your courses</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search labs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" onClick={fetchLabs} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Labs</TabsTrigger>
          
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <LabsSkeleton />
          ) : filteredLabs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No labs found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try adjusting your search query" : "No lab materials are available for this track yet"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLabs.map((lab) => (
                <Card key={lab.id} className="overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-center h-32">
                    <File className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lab.name}</CardTitle>
                      <Badge variant="outline">{lab.track}</Badge>
                    </div>
                    <CardDescription>{lab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(lab.created_at)}
                      </div>
                      <div>{lab.size}</div>
                    </div>
                    <Button className="w-full" onClick={() => handleDownload(lab)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LabsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-32 w-full" />
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
