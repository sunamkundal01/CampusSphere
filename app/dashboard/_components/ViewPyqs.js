"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { FileText, Download, Calendar, BookOpen } from "lucide-react";

function ViewPyqs({ children }) {
  const [open, setOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  const semesters = useQuery(api.pyqStorage.GetUniqueSemesters);
  const subjects = useQuery(api.pyqStorage.GetUniqueSubjects, {
    semester: selectedSemester || undefined,
  });
  const allPyqFiles = useQuery(api.pyqStorage.GetAllPyqFiles);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleFilter = () => {
    if (!allPyqFiles) return;

    let filtered = allPyqFiles;

    if (selectedSemester) {
      filtered = filtered.filter((file) => file.semester === selectedSemester);
    }

    if (selectedSubject) {
      filtered = filtered.filter((file) => file.subject === selectedSubject);
    }

    setFilteredFiles(filtered);
  };

  const clearFilters = () => {
    setSelectedSemester("");
    setSelectedSubject("");
    setFilteredFiles(allPyqFiles || []);
  };

  useEffect(() => {
    if (allPyqFiles) {
      setFilteredFiles(allPyqFiles);
    }
  }, [allPyqFiles]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Previous Year Questions (PYQs)
          </DialogTitle>
          <DialogDescription className="text-sm">
            Browse and download previous year question papers shared by the
            community
          </DialogDescription>
        </DialogHeader>

        {/* Filter Section */}
        <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            Filter PYQs
          </h3>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Semesters</option>
                  {semesters?.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Subjects</option>
                  {subjects?.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleFilter}
                className="flex-1 sm:flex-none px-4 py-2 text-sm"
              >
                Apply Filter
              </Button>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex-1 sm:flex-none px-4 py-2 text-sm"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-3 text-sm sm:text-base">
            Available PYQs ({filteredFiles.length})
          </h3>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm sm:text-base">
                No PYQs found matching your criteria
              </p>
              <p className="text-xs sm:text-sm">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredFiles.map((file) => (
                <div
                  key={file._id}
                  className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm sm:text-lg mb-2 break-words">
                        {file.fileName}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          {file.semester}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                          {file.subject}
                        </span>
                        <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                        <span>By: {file.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                        className="flex items-center gap-1 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        View/Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewPyqs;
