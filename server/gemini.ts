import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return null to trigger realistic fallback mock responses if key is not yet set
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// 1. Profile Analysis Agent
export async function runProfileAudit(businessDetails: {
  name: string;
  category: string;
  address: string;
  phone: string;
  website: string;
  description: string;
}) {
  const ai = getGeminiClient();
  const prompt = `You are an expert Local SEO & Google Business Profile (GMB) Optimization Specialist.
Your goal is to perform a detailed audit of the following business profile to maximize its visibility and conversions on Google Maps and Local Search.

Business Details:
- Name: ${businessDetails.name}
- Current Category: ${businessDetails.category}
- Address: ${businessDetails.address}
- Phone: ${businessDetails.phone}
- Website: ${businessDetails.website}
- Current Description: ${businessDetails.description || 'None provided'}

Provide a comprehensive, high-quality optimization report in clean Markdown format with the following sections:
1. **Missing Information & Immediate Gaps**: Identify what critical pieces are missing or poorly set up.
2. **Category Suggestions**: Suggest the absolute best primary and secondary categories to list in GMB (must be actual Google category terms like 'Cosmetic Dentist', 'Pizza delivery', etc.).
3. **Description Enhancements**: Write an elegant, SEO-optimized 150-250 word business description packed with natural service and location keywords.
4. **FAQ Ideas to Add**: List 2-3 common FAQs and detailed answers regarding this business's services that can be added to the GMB Q&A section.`;

  if (!ai) {
    // Premium mock response matching realistic dentist SEO advice
    return `### Local SEO & Profile Audit - ${businessDetails.name}

**Missing Information & Immediate Gaps:**
1. **Secondary Categories**: Currently listed only under '${businessDetails.category}'. You are missing critical local search volumes by not adding relevant secondary categories.
2. **Profile Completeness**: Ensure your website link connects to a direct booking/contact scheduler page to boost conversions.
3. **Services List**: Comprehensive service lists are missing for your key service areas. Add high-relevance services with individual descriptions.

**Category Suggestions:**
- Primary: **${businessDetails.category}**
- Secondary: **Cosmetic Dentist**, **Dental Clinic**, **Teeth Whitening Service**, **Emergency Dental Service** (or equivalents depending on business type).

**Description Enhancements:**
*Recommended (SEO Optimized)*: '${businessDetails.name} is the premier boutique provider of professional services in the area. Specializing in top-tier care, our experienced specialists provide warm, friendly, and state-of-the-art services. Located conveniently on Main St, we focus on client comfort and exceptional results. Book your appointment online today!'

**FAQ Ideas to Add:**
- *Q: Do you offer same-day or emergency appointments?*
  *A: Yes! We offer priority appointments for urgent matters at our central location. Please call our office directly to verify immediate availability.*
- *Q: Is customer parking available nearby?*
  *A: Yes, there is public parking directly adjacent to our building, and we are easily accessible via public transit.*`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return response.text || "Failed to generate report.";
  } catch (error) {
    console.error("Gemini Audit Error:", error);
    throw error;
  }
}

// 2. Content Generation Agents (Multi-Agent Pipeline: Writer + Image Prompters)
export interface GeneratedPost {
  headline: string;
  content: string;
  imagePrompt: string;
  ctaType: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL' | 'NONE';
  theme: string;
}

export async function generateWeeklyContentSchedule(businessDetails: {
  name: string;
  category: string;
  address: string;
}): Promise<GeneratedPost[]> {
  const ai = getGeminiClient();

  const prompt = `You are a professional local social media team consisting of two specialist AI agents:
1. **Post Writer**: Drafts high-converting, SEO-optimized Google Business Posts.
2. **Image Prompt Agent**: Crafts detailed, high-quality image prompt ideas to accompany each post (optimized for Google local updates).

For the business: "${businessDetails.name}" (Category: "${businessDetails.category}", located in "${businessDetails.address}").

Generate a 7-day posting calendar (7 posts total). Rotate through these diverse themes:
- Day 1: Offer / Special Promotion
- Day 2: Expert Tip / Educational Info
- Day 3: Behind the Scenes / Team highlight
- Day 4: Frequently Asked Question (FAQ)
- Day 5: Customer Testimonial / Review highlight
- Day 6: Product/Service Feature spotlight
- Day 7: Seasonal/Weekend greeting

For each of the 7 days, generate:
- Theme: Theme of the post
- Headline: Catchy local-optimized headline
- Content: 150-300 words with rich keywords (service & local city/neighborhood), friendly tone, relevant hashtags, and a natural call to action.
- Image Prompt: A highly descriptive visual prompt that could be fed to an image generator (like Gemini or Imagen) to produce high-contrast, professional, click-worthy visual assets.
- CTA Type: Choose exactly one of these strings: "BOOK", "ORDER", "SHOP", "LEARN_MORE", "SIGN_UP", "CALL".

Return your response strictly as a JSON array of objects conforming to the following JSON structure:
[
  {
    "theme": "Offer / Special Promotion",
    "headline": "...",
    "content": "...",
    "imagePrompt": "...",
    "ctaType": "BOOK"
  },
  ...
]`;

  if (!ai) {
    // Multi-agent styled high-quality mock calendar
    return [
      {
        theme: "Offer / Special Promotion",
        headline: "🎉 Fresh Smile Special: $99 New Patient Teeth Whitening!",
        content: `Ready to light up the room? For a limited time, Bennett Dental Downtown is offering our signature professional teeth whitening treatment for only $99 to all new patients in San Francisco! \n\nOur custom-molded whitening trays give you rapid, clinical-strength results that last. Say goodbye to surface stains from coffee and tea, and hello to a brilliant new smile. \n\nSpots are filling fast for this seasonal promotion. Book your dental appointment online now or call our Sutter St office to secure your slot!\n\n#TeethWhitening #NewPatientSpecial #SanFranciscoDentist #CosmeticDentistry #SmileMakeover`,
        imagePrompt: "Close-up photo of a radiant, beautiful white smile in natural studio lighting, surrounded by elegant dental care accessories. Modern dental clinic background, high-contrast, warm professional aesthetic.",
        ctaType: "BOOK"
      },
      {
        theme: "Expert Tip / Educational Info",
        headline: "🦷 Dental Health Tip: The Hidden Power of Flossing",
        content: `Did you know that brushing only cleans about 60% of your teeth's surfaces? The remaining 40% lies between your teeth, which is why Dr. Catherine Bennett recommends flossing once a day.\n\nLeaving food particles and plaque between teeth leads to cavities and gum disease. By flossing, you ensure full protection and fresher breath. \n\nCombine daily flossing with your professional biannual cleanings! Click learn more to read our full guide to local San Francisco oral care.\n\n#FlossingTips #DentalHealthSF #PreventativeCare #DowntownSF #OralHygiene`,
        imagePrompt: "Flat lay of modern oral hygiene products on a neutral slate surface: sustainable dental floss, wooden toothbrush, and clean mint leaves. Bright, airy, minimalist aesthetic.",
        ctaType: "LEARN_MORE"
      },
      {
        theme: "Behind the Scenes / Team highlight",
        headline: "👩‍⚕️ Meet Dr. Catherine Bennett: Delivering SF's Best Smiles",
        content: `At Bennett Dental Downtown, we believe dentistry should be gentle, state-of-the-art, and personalized. Meet our founder, Dr. Catherine Bennett! \n\nWith over 12 years of clinical experience in cosmetic and general dentistry, Dr. Bennett is passionate about creating a comfortable, anxiety-free environment for all our patients. When she's not in the clinic, you can find her hiking in Marin County or checking out local SF farmers markets. \n\nCome say hello and let us look after your smile! Click below to book an appointment with our amazing team.\n\n#MeetTheDoctor #WomenInDentistry #SanFranciscoClinic #BoutiqueDentist #DowntownSF`,
        imagePrompt: "Professional portrait of a friendly female dentist in a clean, modern clinic, smiling warmly, holding a tablet with a dental chart. Soft lighting, high-end boutique office aesthetic.",
        ctaType: "BOOK"
      },
      {
        theme: "Frequently Asked Question (FAQ)",
        headline: "❓ Emergency Dentistry: What is a Dental Emergency?",
        content: `We get asked this a lot: 'How do I know if I need an emergency appointment?' \n\nIf you are experiencing severe toothache pain, a chipped/broken tooth that causes pain, a knocked-out tooth, or soft-tissue swelling, you should see Dr. Bennett immediately. These are clinical emergencies that require prompt treatment to save the tooth and stop infection.\n\nAt Bennett Dental Downtown, we reserve same-day emergency slots specifically for situations like this. Call us directly to secure a slot today.\n\n#EmergencyDentist #SFDentist #SutterStreetEmergency #ToothacheRelief #DentalCare`,
        imagePrompt: "Infographic style illustration with a warm background, featuring clean line icons for tooth pain, chipped tooth, and direct booking CTA. Clean professional typography, highly legible.",
        ctaType: "CALL"
      },
      {
        theme: "Customer Testimonial / Review highlight",
        headline: "⭐ 'Gentle, modern, and beautiful care!' - David S.",
        content: `Hearing from our patients makes our day! Here's what David Sterling said about his experience at Bennett Dental Downtown:\n\n'Absolutely the best dental experience in San Francisco. Dr. Catherine Bennett was extremely gentle, explained the whole process, and the clinic is beautiful and modern. Highly recommend their cosmetic teeth whitening!'\n\nThank you, David! We take pride in delivering San Francisco's best boutique dental experience on Sutter St. Ready for premium care? Reserve your visit now!\n\n#DentalReviews #PatientLove #SFLocalDentist #SutterStreet #HappyPatients`,
        imagePrompt: "Elegant testimonial card graphics featuring a 5-star rating, clean typography, soft gold accent borders, and a professional aesthetic.",
        ctaType: "BOOK"
      },
      {
        theme: "Product/Service Feature spotlight",
        headline: "✨ Straighten Your Smile Comfortably with Invisalign",
        content: `Dreaming of a straight smile but want to avoid metal braces? Bennett Dental Downtown is a certified gold provider of Invisalign clear aligners in San Francisco!\n\nInvisalign aligners are virtually invisible, removable for easy eating and brushing, and engineered to align your teeth comfortably. Our team uses advanced 3D scanning to map your entire treatment journey so you can see your future smile before you even start.\n\nSchedule your Invisalign consultation today and discover a clear path to confidence!\n\n#InvisalignSF #ClearAligners #CosmeticDentistry #SmileInStyle #SanFranciscoDentist`,
        imagePrompt: "Close-up of a hand holding a pair of clear Invisalign orthodontic aligners. Sparkling clean water drops, bright clinical background, premium medical photography style.",
        ctaType: "BOOK"
      },
      {
        theme: "Seasonal/Weekend greeting",
        headline: "☀️ Happy Weekend from Bennett Dental Downtown!",
        content: `Wishing all of our amazing San Francisco patients and neighbors a restful, happy weekend! \n\nRemember to keep your teeth healthy between weekend treats by rinsing with water after eating sweet local SF pastries. Our Sutter St clinic is closed for the weekend, but our online booking is open 24/7 so you can lock in your appointments for next week.\n\nStay safe, smile big, and enjoy the beautiful Bay Area weather!\n\n#SFWeekend #BayAreaDental #SutterStSF #DowntownSanFrancisco #WeekendVibes`,
        imagePrompt: "Scenic photo of San Francisco skyline on a clear sunny day with beautiful bridge framing. Warm lighting, travel magazine aesthetic.",
        ctaType: "LEARN_MORE"
      }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              headline: { type: Type.STRING },
              content: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              ctaType: { type: Type.STRING }
            },
            required: ["theme", "headline", "content", "imagePrompt", "ctaType"]
          }
        }
      }
    });

    const text = response.text?.trim() || "[]";
    return JSON.parse(text) as GeneratedPost[];
  } catch (error) {
    console.error("Gemini Weekly Schedule Generation Error:", error);
    // Fall back to safety default list
    return [];
  }
}

// 3. Review Response Agent
export async function generateReviewReply(review: {
  reviewerName: string;
  rating: number;
  comment: string;
}, tone: 'professional' | 'apologetic' | 'upbeat' | 'grateful'): Promise<string> {
  const ai = getGeminiClient();

  const prompt = `You are a professional Online Reputation Manager.
Draft a natural, highly professional, brand-safe reply to the following customer review on our Google Business Profile.

Reviewer: ${review.reviewerName}
Rating: ${review.rating} / 5 stars
Comment: "${review.comment}"

Desired Reply Tone: "${tone}"

Guidelines:
- If positive review (4-5 stars): Express warm gratitude, mention their specific feedback, invite them back, and sign off as Dr. Catherine Bennett & Team.
- If negative review (1-3 stars): Be extremely polite, express sincere apology for their frustration, promise to look into the situation, suggest they reach out directly to our practice manager, and do not sound defensive. Keep it brief.
- Avoid generic robotic responses. Sound human and personalized.`;

  if (!ai) {
    // Highly-stylized fallback reply
    if (review.rating >= 4) {
      return `Hi ${review.reviewerName}! Thank you so much for the wonderful review. We are delighted to hear you had a great experience with our team. It is always our pleasure to deliver warm, high-quality care. We look forward to seeing you at your next visit! - Bennett Dental Downtown Team`;
    } else {
      return `Dear ${review.reviewerName}, thank you for your feedback. We sincerely apologize for your frustration. We aim for complete transparency and a seamless experience. Our office manager would appreciate the opportunity to speak with you directly to address this and find a resolution. Please reach out to us at our downtown clinic at your convenience. - Bennett Dental Team`;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || "Thank you for your review.";
  } catch (error) {
    console.error("Gemini Review Reply Error:", error);
    return "Thank you so much for your feedback. We appreciate your review and will check into this.";
  }
}
