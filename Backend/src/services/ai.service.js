const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// async function invokeGeminiAI(){
//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: "Hello gemini ! Explain what is Interview ?"
//         });

//         return response.text;
//     }
//     catch (error) {
//         console.log("Gemini Error:", error.message);

//         // handle overload
//         if (error.status === 503) {
//             return "AI is busy, please try again later.";
//         }

//         throw error;
//     }
// }



async function invokeGeminiAI(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        return response.text;

    } catch (error) {

        // 🔥 fallback to safer model
        if (error.status === 429) {
            console.log("Quota exceeded, switching model...");

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: prompt
            });

            return response.text;
        }

        throw error;
    }
}








module.exports = invokeGeminiAI