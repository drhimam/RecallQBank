"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIGenerationButtonProps {
  onContentGenerated: (content: string) => void;
  context?: string;
  disabled?: boolean;
}

export const AIGenerationButton = ({ 
  onContentGenerated, 
  context, 
  disabled = false 
}: AIGenerationButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!process.env.NEXT_PUBLIC_AI_API_KEY) {
      toast({
        title: "AI API not configured",
        description: "Please configure the AI API key in environment variables",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = context 
        ? `Generate medical exam question content about: ${context}`
        : "Generate a medical exam question with explanation";

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          provider: process.env.NEXT_PUBLIC_AI_PROVIDER || 'deepseek',
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      onContentGenerated(data.content);
      
      toast({
        title: "Content generated",
        description: "AI has generated content successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generateContent}
      disabled={disabled || isGenerating}
      className="flex items-center gap-2"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      AI Generate
    </Button>
  );
};