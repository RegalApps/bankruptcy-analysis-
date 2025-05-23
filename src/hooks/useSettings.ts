
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { UserSettings } from "@/types/settings";
import { useDebounce } from "@/hooks/use-debounce";

export const useSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log("No authenticated user found");
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', session.session.user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // If it's not a "no rows returned" error
          throw error;
        }
        // No settings found, using defaults
        console.log("No settings found, using defaults");
        return;
      }

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
      toast.error("Failed to load settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (section: "general" | "security") => {
    if (isSaving) return; // Prevent multiple simultaneous saves
    
    setIsSaving(true);
    
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

      toast.success(`${section === "general" ? "General" : "Security"} settings saved successfully.`);

      if (section === "security" && twoFactorEnabled) {
        console.log("2FA enabled - setup required");
      }

    } catch (error: any) {
      console.error(`Error saving ${section} settings:`, error);
      toast.error(`Failed to save ${section} settings. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  // We'll use a regular function instead of a debounced one to fix the glitching issue
  const handleSaveSettings = (section: "general" | "security") => {
    return saveSettings(section);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    isLoading,
    isSaving,
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
    saveSettings: handleSaveSettings,
  };
};
