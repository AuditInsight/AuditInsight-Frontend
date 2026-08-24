import { EVIDENCE_FOLDERS, type OrganisationType, type EvidenceFolder } from '@/constants/evidenceFolders';

export const getEvidenceFolders = (orgType: OrganisationType | string | undefined): EvidenceFolder[] => {
  const type = (orgType as OrganisationType) || 'PRIVATE';
  return EVIDENCE_FOLDERS[type] || EVIDENCE_FOLDERS.PRIVATE;
};

export const getFolderNames = (orgType: OrganisationType | string | undefined): string[] => {
  return getEvidenceFolders(orgType).map(f => f.folder);
};

export const getSubfolders = (orgType: OrganisationType | string | undefined, folder: string): string[] => {
  const folders = getEvidenceFolders(orgType);
  const folderData = folders.find(f => f.folder === folder);
  return folderData?.subfolders || [];
};

export const isValidFolderPath = (
  orgType: OrganisationType | string | undefined,
  folder: string,
  subfolder: string
): boolean => {
  const subfolders = getSubfolders(orgType, folder);
  return subfolders.includes(subfolder);
};
