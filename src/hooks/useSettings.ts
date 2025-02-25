
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { UserSettings } from "@/types/settings";

export const useSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // General settings states
  const [timeZone, setTimeZone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [documentSync, setDocumentSync] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("CAD");

  // Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [documentEncryption, setDocumentEncryption] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  const loadSettings = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setTimeZone(data.timeZone || "UTC");
        setLanguage(data.language || "en");
        setDefaultCurrency(data.defaultCurrency || "CAD");
        setAutoSave(data.autoSave ?? true);
        setCompactView(data.compactView ?? false);
        setDocumentSync(data.documentSync ?? true);
        setTwoFactorEnabled(data.twoFactorEnabled ?? false);
        setSessionTimeout(data.sessionTimeout || "30");
        setIpWhitelisting(data.ipWhitelisting ?? false);
        setLoginNotifications(data.loginNotifications ?? true);
        setDocumentEncryption(data.documentEncryption ?? true);
        setPasswordExpiry(data.passwordExpiry || "90");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load settings. Please try again.",
      });
    }
  };

  const saveSettings = async (section: "general" | "security") => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No authenticated user");
      }

      const settings: Partial<UserSettings> = section === "general" 
        ? {
            timeZone,
            language,
            defaultCurrency,
            autoSave,
            compactView,
            documentSync,
          }
        : {
            twoFactorEnabled,
            sessionTimeout,
            ipWhitelisting,
            loginNotifications,
            documentEncryption,
            passwordExpiry,
          };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.session.user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${section === "general" ? "General" : "Security"} settings saved successfully.`,
      });

      if (section === "security" && twoFactorEnabled) {
        console.log("2FA enabled - setup required");
      }

    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save ${section} settings. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    isLoading,
    generalSettings: {
      timeZone,
      setTimeZone,
      language,
      setLanguage,
      autoSave,
      setAutoSave,
      compactView,
      setCompactView,
      documentSync,
      setDocumentSync,
      defaultCurrency,
      setDefaultCurrency,
    },
    securitySettings: {
      twoFactorEnabled,
      setTwoFactorEnabled,
      sessionTimeout,
      setSessionTimeout,
      ipWhitelisting,
      setIpWhitelisting,
      loginNotifications,
      setLoginNotifications,
      documentEncryption,
      setDocumentEncryption,
      passwordExpiry,
      setPasswordExpiry,
    },
    saveSettings,
  };
};
