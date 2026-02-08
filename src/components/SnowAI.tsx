import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { ParsedSnowProfile } from '@/types/snowProfile';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Sparkles, ChevronDown, ChevronUp, AlertTriangle, Loader2 } from 'lucide-react';

interface SnowAIProps {
  profile: ParsedSnowProfile;
}

type Message = {
  role: 'assistant';
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/snow-ai`;

const SnowAI: React.FC<SnowAIProps> = ({ profile }) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when profile or language changes
  useEffect(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, [profile.id, i18n.language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const buildProfileSummary = useCallback(() => {
    const { properties, geometry } = profile;
    const summary = {
      name: properties.name,
      observer: properties.observer,
      date: properties.timestamp,
      coordinates: {
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
        altitude: geometry.coordinates[2],
      },
      totalHeight: properties.totalHeight,
      temperature: properties.temperature,
      observations: properties.observations,
      sampleCount: properties.sampleCount,
      samples: properties.samples.map(s => ({
        number: s.number,
        height: s.height,
        temperature: s.temperature,
        resistance: s.resistance,
        resistanceLabel: s.resistanceLabel,
        grainType: s.grainTypeLabel,
        diameter: s.diameter,
        humidity: s.humidity,
      })),
      ctTests: properties.ctSamples?.map(ct => ({
        taps: ct.taps,
        fractureQuality: ct.fractureQuality,
        reference: ct.reference,
        depth: ct.depth,
        grainType: ct.grainTypeLabel,
        diameter: ct.diameter,
        result: ct.formattedResult,
      })) || [],
    };
    return summary;
  }, [profile]);

  const handleAnalyze = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setIsExpanded(true);
    setMessages([]);

    let assistantContent = '';

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages([{ role: 'assistant', content: assistantContent }]);
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          profileData: buildProfileSummary(),
          language: i18n.language,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        if (resp.status === 429) {
          setError(t('ai.errorRateLimit'));
        } else if (resp.status === 402) {
          setError(t('ai.errorPayment'));
        } else {
          setError(errorData.message || t('ai.error'));
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        setError(t('ai.error'));
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final buffer flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) updateAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error('SnowAI stream error:', e);
      setError(t('ai.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">SnowAI</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            — {t('ai.subtitle')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            size="sm"
            className="gap-1.5 h-8 text-xs sm:text-sm"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>{isLoading ? t('ai.analyzing') : t('ai.analyze')}</span>
          </Button>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Content area */}
      {isExpanded && (messages.length > 0 || error) && (
        <div className="flex flex-col">
          <ScrollArea className="max-h-[300px] sm:max-h-[400px]">
            <div ref={scrollRef} className="p-3 sm:p-4 space-y-3">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-semibold [&_h3]:font-semibold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {isLoading && idx === messages.length - 1 && (
                      <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Disclaimer */}
          <div className="px-3 sm:px-4 py-2 border-t border-border bg-muted/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              <AlertTriangle className="h-3 w-3 inline mr-1 -mt-0.5" />
              {t('ai.disclaimer')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnowAI;
