// AI Service — OpenAI chat completions for receptionist responses
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a professional receptionist for an aesthetic clinic.
Responsibilities: book appointments, answer basic service questions, guide patients politely.
STRICT RULES:
- do NOT give medical advice or diagnose
- redirect all medical questions to a consultation
- keep responses short (1-2 sentences max)
- ask one question at a time
- confirm all booking details before finalizing
When booking, collect: patient name, service requested, preferred date and time.
Respond ONLY with what you would say to the patient.`;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClinicContext {
  name: string;
  services: string[];
  timezone: string;
  operating_days: string[];
  working_hours: string;
}

export async function getAIResponse(
  userMessage: string,
  history: Message[],
  clinic: ClinicContext
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "I'm sorry, the AI service is currently unavailable. Please call back later.";
  }

  try {
    const contextMsg = `Clinic: ${clinic.name} | Services: ${clinic.services.join(', ')} | Hours: ${clinic.working_hours} | Days: ${clinic.operating_days.join(', ')} | Timezone: ${clinic.timezone} | Slots: 30 min`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: contextMsg },
        ...history.slice(-6),
        { role: 'user', content: userMessage },
      ],
      max_tokens: 120,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || "Could you please repeat that?";
  } catch (err) {
    console.error('OpenAI error:', err);
    return "I'm having trouble understanding. Could you repeat that?";
  }
}
