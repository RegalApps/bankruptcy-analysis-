
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRegulationSearch } from "@/hooks/useRegulationSearch";

export const RegulationSearch = () => {
  const [query, setQuery] = useState('');
  const { searchRegulations, results, isLoading, error } = useRegulationSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchRegulations(query);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search BIA regulations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{result.title}</CardTitle>
              <CardDescription>
                Relevance Score: {(result.score * 100).toFixed(1)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.text}</p>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline mt-2 block"
              >
                View Source
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
