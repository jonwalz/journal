import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";

export interface IUserInfo {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string | null | undefined;
  timezone: string;
  growthGoals: {
    shortTerm: string[];
    longTerm: string[];
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useUserInfo() {
  const data = useLoaderData<{ userInfo: IUserInfo }>();
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(
    data?.userInfo ?? null
  );
  const [isLoading, setIsLoading] = useState(!data?.userInfo);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (data?.userInfo) {
      setUserInfo(data.userInfo);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/user-info");
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const userData: IUserInfo = await response.json();
        setUserInfo(userData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserInfo();
  }, [data?.userInfo]);

  return {
    userInfo,
    isLoading,
    error,
  };
}
