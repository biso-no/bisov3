"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePage } from '@/lib/actions/save-page';
import { Models } from 'node-appwrite';

interface Page {
  title: string;
  path: string;
  $id: string;
  $createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function PageManagement({ getPages }: { getPages: () => Promise<Models.DocumentList<Models.Document>> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPages = filteredPages.slice(startIndex, endIndex);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Running into strange errors when getPages is called from client components. Passed in function instead.
        const pages = await getPages();
        const formattedRows = pages.documents.map((page) => ({
          $id: page.$id,
          title: page.title,
          path: page.path,
          $createdAt: page.$createdAt,
        }));
        setPages(formattedRows);
      } catch (error) {
        console.error("Error fetching page content:", error);
      }
    };

    fetchData();
  }, [getPages]);

  const handleCreatePage = () => {
    router.push(BASE_URL + "/new/edit");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDeletePage = async (pageId: string) => {
    await deletePage(pageId, '/admin/pages');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Page Management</h1>
        <Button onClick={handleCreatePage} className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Page
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search pages..."
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">ID</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created At</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPages.map((page) => (
                <tr key={page.$id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">{page.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{page.path}</td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{page.$id}</td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">{new Date(page.$createdAt).toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(BASE_URL + `/${page.path}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(BASE_URL + `/${page.path}/edit`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePage(page.$id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 space-y-4 sm:space-y-0">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredPages.length)} of {filteredPages.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentPage} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}