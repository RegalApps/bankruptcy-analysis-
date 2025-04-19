
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DocumentRisk } from '@/utils/documents/types';
import { RiskList } from './RiskList';
import { AlertTriangle, AlertOctagon, Info, Ban } from 'lucide-react';

interface DocumentAnalysisProps {
  summary: string;
  risks: DocumentRisk[];
  extractedInfo?: Record<string, any>;
  complianceStatus?: {
    overall: string;
    details: string;
    score?: number;
  };
}

export function DocumentAnalysis({
  summary,
  risks,
  extractedInfo,
  complianceStatus
}: DocumentAnalysisProps) {
  // Filter risks by severity
  const criticalRisks = risks.filter(risk => risk.severity === 'critical');
  const highRisks = risks.filter(risk => risk.severity === 'high');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium');
  const lowRisks = risks.filter(risk => risk.severity === 'low');
  
  const hasRisks = risks.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
          <CardDescription>AI-generated summary of this document</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </CardContent>
      </Card>
      
      {/* Risk Assessment */}
      <Card>
        <CardHeader className="space-y-1.5">
          <div className="flex justify-between items-center">
            <CardTitle>Risk Assessment</CardTitle>
            <RiskLevelBadge count={criticalRisks.length + highRisks.length + mediumRisks.length + lowRisks.length} />
          </div>
          <CardDescription>
            Identified issues and compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasRisks ? (
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">No Issues Detected</AlertTitle>
              <AlertDescription className="text-green-600">
                This document appears to meet all compliance requirements with no identified issues.
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="critical">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="critical" className="flex-1">
                  Critical
                  {criticalRisks.length > 0 && (
                    <Badge variant="destructive" className="ml-2">{criticalRisks.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="high" className="flex-1">
                  High
                  {highRisks.length > 0 && (
                    <Badge variant="destructive" className="ml-2 bg-orange-500">{highRisks.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="medium" className="flex-1">
                  Medium
                  {mediumRisks.length > 0 && (
                    <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                      {mediumRisks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="low" className="flex-1">
                  Low
                  {lowRisks.length > 0 && (
                    <Badge variant="outline" className="ml-2">{lowRisks.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="critical">
                {criticalRisks.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Critical Issues</AlertTitle>
                    <AlertDescription>
                      No critical issues were detected in this document.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RiskList risks={criticalRisks} />
                )}
              </TabsContent>
              
              <TabsContent value="high">
                {highRisks.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No High-Priority Issues</AlertTitle>
                    <AlertDescription>
                      No high-priority issues were detected in this document.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RiskList risks={highRisks} />
                )}
              </TabsContent>
              
              <TabsContent value="medium">
                {mediumRisks.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Medium-Priority Issues</AlertTitle>
                    <AlertDescription>
                      No medium-priority issues were detected in this document.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RiskList risks={mediumRisks} />
                )}
              </TabsContent>
              
              <TabsContent value="low">
                {lowRisks.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Low-Priority Issues</AlertTitle>
                    <AlertDescription>
                      No low-priority issues were detected in this document.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <RiskList risks={lowRisks} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {/* Extracted Information */}
      {extractedInfo && Object.keys(extractedInfo).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Information</CardTitle>
            <CardDescription>Key data extracted from this document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(extractedInfo).map(([key, value]) => (
                <div key={key} className="border rounded p-3">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {formatFieldName(key)}
                  </div>
                  <div className="text-base">
                    {formatFieldValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Compliance Status */}
      {complianceStatus && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Compliance Status</CardTitle>
              <ComplianceBadge status={complianceStatus.overall} />
            </div>
            <CardDescription>Regulatory compliance assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">{complianceStatus.details}</p>
            
            {complianceStatus.score !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getComplianceScoreColor(complianceStatus.score)}`}
                  style={{ width: `${complianceStatus.score * 100}%` }}
                ></div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0%</span>
                  <span>Compliance Score: {Math.round(complianceStatus.score * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper components
function RiskLevelBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        No Issues
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive">
        {count} {count === 1 ? 'Issue' : 'Issues'}
      </Badge>
    );
  }
}

function ComplianceBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case 'compliant':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Compliant
        </Badge>
      );
    case 'attention_required':
    case 'attention required':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          Attention Required
        </Badge>
      );
    case 'non_compliant':
    case 'non-compliant':
      return (
        <Badge variant="destructive">
          Non-compliant
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}

function getComplianceScoreColor(score: number): string {
  if (score >= 0.9) return 'bg-green-500';
  if (score >= 0.75) return 'bg-yellow-400';
  if (score >= 0.5) return 'bg-orange-500';
  return 'bg-red-500';
}

function formatFieldName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatFieldValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}
