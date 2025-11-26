import { dictionaryNames } from "@/constants/dictionary";

const STATUS_DICTIONARY_MAP = {
  approved: "approved",
  created: "created",
  rejected: "rejected",
  "in review": "inReview",
  closed: "closed",
} as const;

export const normalizeStatusKey = (status: string): string =>
  status.toLowerCase();

export const translateStatusLabel = (status: string): string => {
  const normalized = normalizeStatusKey(status);
  const dictionaryKey =
    STATUS_DICTIONARY_MAP[
      normalized as keyof typeof STATUS_DICTIONARY_MAP
    ];
  if (dictionaryKey) {
    return dictionaryNames[dictionaryKey];
  }

  return (
    dictionaryNames[normalized as keyof typeof dictionaryNames] ?? status
  );
};
