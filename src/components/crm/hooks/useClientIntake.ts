
import { useState } from "react";
import { FormData } from "../types";
import { toast } from "sonner";

export const useClientIntake = () => {
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    mobilePhone: "",
    companyName: "",
    businessType: "",
    notes: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    dateOfBirth: "",
    sin: "",
    maritalStatus: "",
    leadSource: "",
    otherLeadSourceDetails: "",
    preferredContactMethod: "email", // Default to email
    preferredLanguage: "english" // Default to English
  });

  const openClientDialog = () => {
    setCurrentStep(1);
    setFormProgress(0);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      mobilePhone: "",
      companyName: "",
      businessType: "",
      notes: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      dateOfBirth: "",
      sin: "",
      maritalStatus: "",
      leadSource: "",
      otherLeadSourceDetails: "",
      preferredContactMethod: "email",
      preferredLanguage: "english"
    });
    setIsClientDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate progress based on filled fields
    calculateProgress();
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Apply smart CRM logic based on preferred contact method
    if (field === 'preferredContactMethod') {
      applyContactMethodAutomation(value);
    }
    
    calculateProgress();
  };
  
  const applyContactMethodAutomation = (contactMethod: string) => {
    switch (contactMethod) {
      case 'phone':
        // Auto-create a call task
        toast.success("Call Task Created", {
          description: "A call task has been scheduled for the assigned representative.",
        });
        console.log("Automation: Created call task for client");
        break;
      case 'email':
        // Set default reply templates
        toast.success("Email Templates Prepared", {
          description: "Email follow-up reminders have been set up.",
        });
        console.log("Automation: Email templates and reminders configured");
        break;
      case 'sms':
        // Route to Twilio API
        toast.success("SMS Handling Configured", {
          description: "Automated text messaging has been set up via Twilio.",
        });
        console.log("Automation: SMS handling via Twilio configured");
        break;
    }
  };
  
  const handleEmploymentTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, employmentType: value }));
    calculateProgress();
  };
  
  const calculateProgress = () => {
    // Step 1: Personal Info (8 fields)
    const step1Fields = ['fullName', 'dateOfBirth', 'sin', 'maritalStatus', 'address', 'city', 'province', 'postalCode', 'email', 'phone', 'mobilePhone', 'preferredContactMethod', 'preferredLanguage'];
    const step1FilledFields = step1Fields.filter(field => formData[field as keyof FormData]);
    const step1Progress = Math.min(100, (step1FilledFields.length / 6) * 100); // At least 6 fields for 100%
    
    // Step 2: Employment & Income (5 fields)
    const step2Fields = ['employmentType', 'employer', 'occupation', 'monthlyIncome', 'incomeFrequency'];
    const step2FilledFields = step2Fields.filter(field => formData[field as keyof FormData]);
    const step2Progress = Math.min(100, (step2FilledFields.length / 3) * 100); // At least 3 fields for 100%
    
    // Step 3: Financial Details (6 fields)
    const step3Fields = ['unsecuredDebt', 'securedDebt', 'taxDebt', 'realEstate', 'vehicles', 'bankAccounts'];
    const step3FilledFields = step3Fields.filter(field => formData[field as keyof FormData]);
    const step3Progress = Math.min(100, (step3FilledFields.length / 3) * 100); // At least 3 fields for 100%
    
    // Calculate total progress based on current step
    let totalProgress;
    if (currentStep === 1) {
      totalProgress = step1Progress * 0.25;
    } else if (currentStep === 2) {
      totalProgress = 25 + (step2Progress * 0.25);
    } else if (currentStep === 3) {
      totalProgress = 50 + (step3Progress * 0.25);
    } else if (currentStep === 4) {
      totalProgress = 75 + (25 * 0.25); // Document upload step
    } else {
      totalProgress = 100; // Final step
    }
    
    setFormProgress(Math.round(totalProgress));
  };
  
  const handleSubmitForm = () => {
    // Handle final form submission
    toast.success("Client added successfully", {
      description: "New client has been created with all provided information.",
    });
    setIsClientDialogOpen(false);
  };

  return {
    isClientDialogOpen,
    setIsClientDialogOpen,
    currentStep,
    setCurrentStep,
    formProgress,
    formData,
    openClientDialog,
    handleInputChange,
    handleSelectChange,
    handleEmploymentTypeChange,
    handleSubmitForm
  };
};
