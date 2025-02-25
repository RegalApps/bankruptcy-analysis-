import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "./DocumentUpload";
import { IntelligentScheduling } from "./IntelligentScheduling";
import { supabase } from "@/lib/supabase";
import { 
  Mic, 
  User, 
  Building2, 
  Contact, 
  Upload,
  Calendar,
  Trophy,
  Bot,
  ChevronRight,
  PauseCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ClientIntakeSection = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcription, setTranscription] = useState("");
  const totalSteps = 4;

  // Basic form state
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    businessType: "",
    notes: ""
  });

  // Voice recognition setup
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setTranscription(transcript);
        
        // Try to extract information from voice input
        if (transcript.toLowerCase().includes('name is')) {
          const name = transcript.split('name is')[1].trim();
          setFormData(prev => ({ ...prev, fullName: name }));
        }
        // Add more voice input parsing logic here
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Update progress based on filled fields
    const filledFields = Object.values(formData).filter(val => val.length > 0).length;
    setProgress((filledFields / Object.keys(formData).length) * 100);
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        toast({
          title: "Voice Input Active",
          description: "Start speaking to fill out the form...",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Voice recognition is not supported in your browser.",
        });
      }
    } else {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.stop();
      toast({
        title: "Voice Input Stopped",
        description: "Voice input has been paused.",
      });
    }
  };

  const handleNextStep = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the final form data
      try {
        const { data, error } = await supabase.functions.invoke('process-client-intake', {
          body: { formData, transcription }
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Client intake form submitted successfully.",
        });

        // Reset form
        setFormData({
          fullName: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
          businessType: "",
          notes: ""
        });
        setCurrentStep(1);
        setProgress(0);
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit form. Please try again.",
        });
      }
    }
  };

  const renderBadges = () => (
    <div className="flex gap-2 mb-4">
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Progress Badge
      </Badge>
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Quick Learner
      </Badge>
      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
        Detail Master
      </Badge>
    </div>
  );

  const renderAIAssistant = () => (
    <div className="bg-slate-50 p-4 rounded-lg mb-4 flex items-start gap-3">
      <Bot className="h-6 w-6 text-primary mt-1" />
      <div>
        <h4 className="font-medium mb-1">AI Assistant Tips</h4>
        <p className="text-sm text-muted-foreground">
          {currentStep === 1 && "Start with your basic information. You can use voice input for faster entry!"}
          {currentStep === 2 && "Tell us about your business. This helps us tailor our services to your needs."}
          {currentStep === 3 && "Upload any relevant documents that might help us understand your situation better."}
          {currentStep === 4 && "Choose a time that works best for your initial consultation."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>New Client Intake</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleVoiceRecording}
              className={isRecording ? "animate-pulse" : ""}
            >
              {isRecording ? (
                <PauseCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {renderBadges()}
            {renderAIAssistant()}

            {isRecording && (
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">
                  Transcribing: {transcription}
                </p>
              </div>
            )}

            <Tabs value={`step-${currentStep}`} className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="step-1">Basic Info</TabsTrigger>
                <TabsTrigger value="step-2">Business</TabsTrigger>
                <TabsTrigger value="step-3">Documents</TabsTrigger>
                <TabsTrigger value="step-4">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="step-1" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step-2" className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      placeholder="Enter business type"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step-3" className="space-y-4">
                <DocumentUpload onUploadComplete={(id) => {
                  toast({
                    title: "Document Uploaded",
                    description: "Your document has been successfully uploaded.",
                  });
                }} />
              </TabsContent>

              <TabsContent value="step-4" className="space-y-4">
                <IntelligentScheduling />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={currentStep === totalSteps}
                className="gap-2"
              >
                {currentStep === totalSteps ? "Complete" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
