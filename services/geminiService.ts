
import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPersonalFeedback = async (data: AppState) => {
  const prompt = `
    Bertindaklah sebagai mentor karir profesional. Berikut adalah data diri mahasiswa:
    Nama: ${data.profile.name}
    Jurusan: ${data.profile.major}
    IPK: ${data.academics.map(a => `${a.semester}: ${a.gpa}`).join(', ')}
    Prestasi: ${data.achievements.map(a => a.title).join(', ')}
    Pengalaman: ${data.experiences.map(e => `${e.role} di ${e.organization}`).join(', ')}

    Berikan 3 poin feedback konstruktif untuk meningkatkan portofolio mahasiswa ini agar siap kerja.
    Format respons dalam JSON dengan property: "feedback" (array of strings) dan "motivation" (string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            motivation: { type: Type.STRING }
          },
          required: ["feedback", "motivation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      feedback: ["Lengkapi data untuk mendapatkan feedback AI."],
      motivation: "Terus semangat mengejar cita-cita!"
    };
  }
};
