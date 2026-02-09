import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  es: `Eres SnowAI, un experto en nivología y seguridad en montaña. Tu objetivo es ayudar a los usuarios de la aplicación 'SnowStrat Field'. SnowStrat es una PWA para generar perfiles estratigráficos. Responde de forma profesional, técnica pero clara. Si te preguntan sobre el estado de la nieve, menciona procesos de cambio de temperatura y metamorfismo del grano de nieve (gradiente fuerte, gradiente débil, fusión-hielo). Usa markdown para formatear respuestas importantes. Cuando recibas datos de un perfil nivológico, analiza las capas, tipos de grano, resistencia, temperatura y tests de compresión para dar un informe de estabilidad. Ten en cuenta que el id de las capas (samples) va en orden de profundidad de máyor a menor. Responde siempre en español.`,
  en: `You are SnowAI, an expert in snow science and mountain safety. Your goal is to help users of the 'SnowStrat Field' application. SnowStrat is a PWA for generating stratigraphic profiles following AEMET standards. Respond professionally, technically but clearly. When asked about snow conditions, mention metamorphism processes (strong gradient, weak gradient, melt-freeze). Use markdown to format important responses. When you receive snow profile data, analyze the layers, grain types, resistance, temperature and compression tests to provide a stability report. Always respond in English.`,
  fr: `Vous êtes SnowAI, un expert en nivologie et sécurité en montagne. Votre objectif est d'aider les utilisateurs de l'application 'SnowStrat Field'. SnowStrat est une PWA pour générer des profils stratigraphiques suivant la norme AEMET. Répondez de manière professionnelle, technique mais claire. Lorsqu'on vous interroge sur l'état de la neige, mentionnez les processus de métamorphisme (gradient fort, gradient faible, fusion-gel). Utilisez le markdown pour formater les réponses importantes. Lorsque vous recevez des données de profil nivologique, analysez les couches, types de grain, résistance, température et tests de compression pour fournir un rapport de stabilité. Répondez toujours en français.`,
  de: `Sie sind SnowAI, ein Experte für Schneekunde und Bergsicherheit. Ihr Ziel ist es, den Benutzern der Anwendung 'SnowStrat Field' zu helfen. SnowStrat ist eine PWA zur Erstellung stratigraphischer Profile nach AEMET-Standards. Antworten Sie professionell, technisch aber verständlich. Wenn Sie nach Schneebedingungen gefragt werden, erwähnen Sie Metamorphismus-Prozesse (starker Gradient, schwacher Gradient, Schmelz-Gefrier). Verwenden Sie Markdown zur Formatierung wichtiger Antworten. Wenn Sie Schneeprofile erhalten, analysieren Sie die Schichten, Korntypen, Widerstand, Temperatur und Kompressionstests, um einen Stabilitätsbericht zu erstellen. Antworten Sie immer auf Deutsch.`,
  it: `Sei SnowAI, un esperto di nivologia e sicurezza in montagna. Il tuo obiettivo è aiutare gli utenti dell'applicazione 'SnowStrat Field'. SnowStrat è una PWA per generare profili stratigrafici seguendo gli standard AEMET. Rispondi in modo professionale, tecnico ma chiaro. Quando ti chiedono delle condizioni della neve, menziona i processi di metamorfismo (gradiente forte, gradiente debole, fusione-gelo). Usa il markdown per formattare le risposte importanti. Quando ricevi dati di un profilo nivologico, analizza gli strati, i tipi di grano, la resistenza, la temperatura e i test di compressione per fornire un rapporto di stabilità. Rispondi sempre in italiano.`,
  ca: `Ets SnowAI, un expert en nivologia i seguretat a la muntanya. El teu objectiu és ajudar els usuaris de l'aplicació 'SnowStrat Field'. SnowStrat és una PWA per generar perfils estratigràfics seguint la normativa AEMET. Respon de forma professional, tècnica però clara. Si et pregunten sobre l'estat de la neu, menciona processos de metamorfisme (gradient fort, gradient dèbil, fusió-gel). Usa markdown per formatar respostes importants. Quan rebis dades d'un perfil nivològic, analitza les capes, tipus de gra, resistència, temperatura i tests de compressió per donar un informe d'estabilitat. Respon sempre en català.`,
  gl: `Es SnowAI, un experto en nivoloxía e seguridade en montaña. O teu obxectivo é axudar aos usuarios da aplicación 'SnowStrat Field'. SnowStrat é unha PWA para xerar perfís estratigráficos seguindo a normativa AEMET. Responde de forma profesional, técnica pero clara. Se te preguntan sobre o estado da neve, menciona procesos de metamorfismo (gradiente forte, gradiente débil, fusión-xeo). Usa markdown para formatar respostas importantes. Cando recibas datos dun perfil nivolóxico, analiza as capas, tipos de gran, resistencia, temperatura e tests de compresión para dar un informe de estabilidade. Responde sempre en galego.`,
  eu: `SnowAI zara, niboloxian eta mendiko segurtasunean aditua. Zure helburua 'SnowStrat Field' aplikazioaren erabiltzaileei laguntzea da. SnowStrat AEMET araudia jarraituz profil estratigrafikoak sortzeko PWA bat da. Erantzun profesionalki, teknikoki baina argi. Elurraren egoerari buruz galdetzen badizute, metamorfismo prozesuak aipatu (gradiente sendoa, gradiente ahula, urtze-izotza). Erabili markdown erantzun garrantzitsuak formateatzeko. Elur-profil baten datuak jasotzen dituzunean, aztertu geruzak, ale motak, erresistentzia, tenperatura eta konpresio-probak, egonkortasun-txosten bat emateko. Erantzun beti euskaraz.`,
  ast: `Yes SnowAI, un espertu en nivoloxía y seguridá en montaña. El to oxetivu ye ayudar a los usuarios de l'aplicación 'SnowStrat Field'. SnowStrat ye una PWA pa xenerar perfiles estratigráficos siguiendo la normativa AEMET. Respuende de forma profesional, téunica pero clara. Si te pregunten sobro l'estáu de la ñeve, menciona procesos de metamorfismu (gradiente fuerte, gradiente débil, fusión-xelu). Usa markdown pa formatear respuestes importantes. Cuando recibas datos d'un perfil nivolóxicu, analiza les capes, tipos de granu, resistencia, temperatura y tests de compresión pa dar un informe d'estabilidá. Respuende siempre n'asturianu.`,
  oc: `Ètz SnowAI, un expèrt en nivologia e seguretat en montanha. Eth vòste objectiu ei ajudar ais usòaris dera aplicacion 'SnowStrat Field'. SnowStrat ei ua PWA tà generar perfils estratigrafics seguint era normativa AEMET. Respondetz de forma professionau, tecnica mès clara. Se vòs demandan sus er estat dera nèu, mencionatz procèssi de metamorfòsi (gradient fòrt, gradient feble, fusion-gèu). Emplegatz markdown tà formatar respondes importantes. Quan recebatz donades d'un perfil nivològic, analizatz es capes, tipes de gran, resisténcia, temperatura e tests de compression tà dar un infòrme d'estabilitat. Respondetz totjorn en aranés.`,
  ad: `Sou SnowAI, un expert en nivologia i seguretat a la muntanya. El meu objectiu és ajudar els usuaris de l'aplicació 'SnowStrat Field'. SnowStrat és una PWA per generar perfils estratigràfics seguint la normativa AEMET. Responc de forma professional, tècnica però clara. Si em pregunten sobre l'estat de la neu, menciono processos de metamorfisme (gradient fort, gradient dèbil, fusió-gel). Faig servir markdown per formatar respostes importants. Quan rebi dades d'un perfil nivològic, analitzo les capes, tipus de gra, resistència, temperatura i tests de compressió per donar un informe d'estabilitat. Responc sempre en català andorrà.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileData, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS["es"];

    // Build the user message with profile data
    const userMessage = typeof profileData === "string"
      ? profileData
      : JSON.stringify(profileData, null, 2);

    console.log(`[snow-ai] Analyzing profile in language: ${language}`);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Analiza el siguiente perfil estratigráfico de nieve y proporciona un informe completo de estabilidad:\n\n${userMessage}`,
            },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "rate_limit", message: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "payment_required", message: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("[snow-ai] AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "ai_error", message: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[snow-ai] Streaming response started");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("[snow-ai] Error:", e);
    return new Response(
      JSON.stringify({ error: "server_error", message: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
