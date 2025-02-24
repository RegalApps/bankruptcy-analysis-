
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, Shield, Clock, Bell } from "lucide-react";

export const DocumentVault = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Secure Document Vault</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileSignature className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pending Signatures</h4>
                    <p className="text-sm text-muted-foreground">5 documents</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Documents</h4>
                    <p className="text-sm text-muted-foreground">128-bit encrypted</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Recent Activity</h4>
                    <p className="text-sm text-muted-foreground">Last hour</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Recent Documents</h4>
              {["Client Agreement.pdf", "Power of Attorney.pdf", "Consent Form.pdf"].map((doc) => (
                <Card key={doc} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileSignature className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc}</p>
                        <p className="text-sm text-muted-foreground">Pending signature</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
