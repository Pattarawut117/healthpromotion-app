"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

type Profile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

type LiffContextType = {
  isLoggedIn: boolean;
  profile: Profile | null;
  liffObject: typeof liff | null;
  idToken: string | null;
};

const LiffContext = createContext<LiffContextType>({
  isLoggedIn: false,
  profile: null,
  liffObject: null,
  idToken: null,
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: "2007987577-9DzlZY4K" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        setIsLoggedIn(true);
        const prof = await liff.getProfile();
        setProfile(prof);
        const token = liff.getIDToken();
        setIdToken(token);
      } catch (err) {
        console.error("LIFF init error", err);
      }
    };

    init();
  }, []);

  return (
    <LiffContext.Provider value={{ isLoggedIn, profile, liffObject: liff, idToken }}>
      {children}
    </LiffContext.Provider>
  );
};