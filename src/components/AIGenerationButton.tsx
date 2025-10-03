"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AISettingsModal } from "./AISettingsModal";

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
  const [aiSettings, setAiSettings] = useState({
    provider: localStorage.getItem('aiProvider') || 'deepseek',
    apiKey: localStorage.getItem('aiApiKey') || ''
  });
  const { toast } = useToast();

  const generateContent = async () => {
    if (!aiSettings.apiKey) {
      toast({
        title: "API Key required",
        description: "Please configure your AI settings first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = context 
        ? `Generate medical exam question content about: ${context}`
        : "Generate a medical exam question with explanation";

      // Map providers to their respective API endpoints
      const providerEndpoints = {
        deepseek: 'https://api.deepseek.com/v1/chat/completions',
        openai: 'https://api.openai.com/v1/chat/completions',
        anthropic: 'https://api.anthropic.com/v1/messages',
        gemini: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
      };

      const endpoint = providerEndpoints[aiSettings.provider as keyof typeof providerEndpoints];
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiSettings.apiKey}`
        },
        body: JSON.stringify({
          model: aiSettings.provider === 'deepseek' ? 'deepseek-chat' : 
                 aiSettings.provider === 'openai' ? 'gpt-4' :
                 aiSettings.provider === 'anthropic' ? 'claude-3-sonnet-20240229' :
                 'gemini-pro',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      
      // Extract content based on provider response format
      let generatedContent = '';
      if (aiSettings.provider === 'deepseek' || aiSettings.provider === 'openai') {
        generatedContent = data.choices[0]?.message?.content || '';
      } else if (aiSettings.provider === 'anthropic') {
        generatedContent = data.content[0]?.text || '';
      } else if (aiSettings.provider === 'gemini') {
        generatedContent = data.candidates[0]?.content?.parts[0]?.text || '';
      }

      onContentGenerated(generatedContent);
      
      toast({
        title: "Content generated",
        description: "AI has generated content successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSettingsSave = (settings: { provider: string; apiKey: string }) => {
    setAiSettings(settings);
  };

  return (
    <div className="flex items-center gap-2">
      <AISettingsModal onSettingsSave={handleSettingsSave} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generateContent}
        disabled={disabled || isGenerating || !aiSettings.apiKey}
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        AI Generate
      </Button>
    </div>
  );
};