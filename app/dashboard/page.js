"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import UploadPrivatePdf from "./_components/UploadPrivatePdf";
import { Button } from "../../components/ui/button";

const Dashboard = () => {
  const { user } = useUser();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress.emailAddress,
  });

  console.log(fileList);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="font-medium text-2xl sm:text-3xl">
          <span className="border-b-[2px] border-primary">Workspace</span>
        </h2>
        <UploadPrivatePdf>
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            + Upload PDF
          </Button>
        </UploadPrivatePdf>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mt-6">
        {fileList === undefined ? (
          // Loading state
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
            <div
              key={index}
              className="bg-slate-200 rounded-md h-[140px] sm:h-[150px] animate-pulse"
            ></div>
          ))
        ) : fileList?.length > 0 ? (
          // Files exist
          fileList.map((file, index) => {
            return (
              <Link href={"/workspace/" + file.fileId} key={index}>
                <div className="flex flex-col items-center justify-center p-4 sm:p-5 shadow-md rounded-md border cursor-pointer hover:scale-105 transition-all min-h-[140px] sm:min-h-[150px]">
                  <Image
                    src={"/pdf.png"}
                    alt=""
                    height={40}
                    width={40}
                    className="sm:h-[50px] sm:w-[50px]"
                  />
                  <h2 className="text-center mt-2 text-xs sm:text-sm leading-tight break-words hyphens-auto">
                    {file.fileName}
                  </h2>
                </div>
              </Link>
            );
          })
        ) : (
          // No files yet
          <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 text-gray-500 px-4">
            <Image
              src={"/pdf.png"}
              alt=""
              height={60}
              width={60}
              className="sm:h-[80px] sm:w-[80px] opacity-30 mb-4"
            />
            <h3 className="text-base sm:text-lg font-medium mb-2 text-center">
              No PDFs uploaded yet
            </h3>
            <p className="text-sm text-gray-400 mb-4 text-center">
              Upload your first PDF to get started
            </p>
            <UploadPrivatePdf>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                + Upload Your First PDF
              </Button>
            </UploadPrivatePdf>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
