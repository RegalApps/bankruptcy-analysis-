
import React from "react";
import { FolderTree } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Document } from "@/components/DocumentList/types";

interface BreadcrumbNavigationProps {
  folderPath: { id: string; name: string }[];
  selectedItemId?: string;
  selectedItemType?: "folder" | "file";
  onFolderClick: (id: string) => void;
  documents?: Document[];
}

export const BreadcrumbNavigation = ({
  folderPath,
  selectedItemId,
  selectedItemType,
  onFolderClick,
  documents,
}: BreadcrumbNavigationProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/documents">
            <FolderTree className="h-4 w-4 mr-1" />
            Documents
          </BreadcrumbLink>
        </BreadcrumbItem>

        {folderPath.map((folder) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onFolderClick(folder.id)}
                className="cursor-pointer"
              >
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        {selectedItemId && selectedItemType === "file" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {documents?.find((doc) => doc.id === selectedItemId)?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
