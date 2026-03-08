import axios from 'axios';

const API_KEY = 'AIzaSyDy-sPRTuh5hbI6jjLoh-T3o_cEBMQV_PY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Function to fetch general disease information
const fetchDiseaseInfo = async (diseaseName) => {
  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Provide detailed information about the plant disease "${diseaseName}" that affects tea plants.
                       Structure your response in JSON format with the following fields. This app use for srilankan tea plantations.:
                       - description: A detailed description of the disease (200-300 words)
                       - symptoms: List of primary symptoms
                       - causativeAgent: The pathogen/cause of the disease
                       - lifecycle: Brief explanation of the disease lifecycle
                       - controlMeasures: Object containing cultural, chemical, and resistant varieties measures
                       
                       Return ONLY valid JSON with these fields, no other text.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
        }
      }
    );

    let jsonResponse;
    try {
      // Extract the text content from the Gemini response
      const textContent = response.data.candidates[0].content.parts[0].text;
      
      // Try to find and parse JSON if it's wrapped in markdown code blocks
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                        textContent.match(/```\n([\s\S]*?)\n```/);
                        
      if (jsonMatch && jsonMatch[1]) {
        jsonResponse = JSON.parse(jsonMatch[1]);
      } else {
        // Otherwise try to parse the whole response as JSON
        jsonResponse = JSON.parse(textContent);
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      // Fallback to default structure with error message
      jsonResponse = {
        description: "Unable to retrieve disease information. Please check your connection and try again.",
        symptoms: ["Information unavailable"],
        causativeAgent: "Unknown",
        lifecycle: "Information unavailable",
        controlMeasures: {
          cultural: ["Information unavailable"],
          chemical: ["Information unavailable"],
          resistantVarieties: ["Information unavailable"]
        }
      };
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
    throw error;
  }
};

// Function to generate a formal disease report in different languages
const fetchDiseaseReport = async (diseaseName, language, diseaseInfo) => {
  try {
    // Create the prompt based on the selected language
    let promptText = "";
    
    switch(language) {
      case 'sinhala':
        promptText = `
          මෙම තේ ශාක රෝගය පිළිබඳ වාර්තාවක් සිංහල භාෂාවෙන් සාදන්න: "${diseaseName}".
          පහත තොරතුරු භාවිතා කරන්න:
          
          ${JSON.stringify(diseaseInfo, null, 2)}
          
          වාර්තාව මෙම JSON ආකෘතියෙන් සකස් කරන්න:
          {
            "title": "රෝග වාර්තාව - [රෝගයේ නම]",
            "contentSections": [
              {
                "title": "රෝගය පිළිබඳ දළ විශ්ලේෂණය",
                "content": "රෝගය පිළිබඳ විස්තර..."
              },
              {
                "title": "රෝග ලක්ෂණ",
                "content": "ලක්ෂණ විස්තර..."
              },
              {
                "title": "රෝග වැළඳීමේ හේතුව",
                "content": "රෝග කාරක විස්තර..."
              },
              {
                "title": "රෝග පාලන ක්‍රමවේද",
                "content": "පාලන ක්‍රම විස්තර..."
              }
            ],
            "quickReference": ["ඉක්මන් යොමුව 1", "ඉක්මන් යොමුව 2", "ඉක්මන් යොමුව 3"],
            "disclaimer": "වගකීම් ප්‍රකාශය..."
          }
          
          පිළිතුර ලෙස වලංගු JSON පමණක් ලබා දෙන්න. රෝගය පාලනය සඳහා ප්‍රායෝගික විසඳුම් ඇතුළත් කරන්න. සංක්ෂිප්ත හා පැහැදිලි ලෙස ලියන්න. ප්‍රායෝගික ක්‍රියාමාර්ග පිළිබඳ ඉක්මන් යොමුවක් සහ ශ්‍රී ලංකාවේ තේ වගා මණ්ඩලයේ නිර්දේශවලට අනුකූල වන පරිදි මෙම තොරතුරු සකස් කරන්න.`;
        break;
        
      case 'tamil':
        promptText = `
          இந்த தேயிலை நோய் பற்றிய அறிக்கையை தமிழில் உருவாக்கவும்: "${diseaseName}".
          பின்வரும் தகவலைப் பயன்படுத்தவும்:
          
          ${JSON.stringify(diseaseInfo, null, 2)}
          
          அறிக்கையை பின்வரும் JSON வடிவமைப்பில் உருவாக்கவும்:
          {
            "title": "நோய் அறிக்கை - [நோயின் பெயர்]",
            "contentSections": [
              {
                "title": "நோய் பற்றிய விளக்கம்",
                "content": "நோய் பற்றிய விளக்கம்..."
              },
              {
                "title": "நோயின் அறிகுறிகள்",
                "content": "அறிகுறிகள் விளக்கம்..."
              },
              {
                "title": "நோய்க்கான காரணம்",
                "content": "நோய்க்காரணிகள் விளக்கம்..."
              },
              {
                "title": "நோய் கட்டுப்பாட்டு முறைகள்",
                "content": "கட்டுப்பாட்டு முறைகள் விளக்கம்..."
              }
            ],
            "quickReference": ["விரைவு குறிப்பு 1", "விரைவு குறிப்பு 2", "விரைவு குறிப்பு 3"],
            "disclaimer": "பொறுப்புத் துறப்பு அறிக்கை..."
          }
          
          பதிலாக சரியான JSON மட்டுமே வழங்கவும். நோய் கட்டுப்பாட்டிற்கான நடைமுறை தீர்வுகளை உள்ளடக்கவும். சுருக்கமாகவும் தெளிவாகவும் எழுதவும். நடைமுறை நடவடிக்கைகளுக்கான விரைவு குறிப்புகளையும், இலங்கை தேயிலை வாரியத்தின் பரிந்துரைகளுக்கு ஏற்ப இந்த தகவல்களை உருவாக்கவும்.`;
        break;
        
      default:
        promptText = `
          Create a formal report in English about this tea plant disease: "${diseaseName}".
          Use the following information:
          
          ${JSON.stringify(diseaseInfo, null, 2)}
          
          Structure the report in this JSON format:
          {
            "title": "Disease Report - [Disease Name]",
            "contentSections": [
              {
                "title": "Disease Overview",
                "content": "Description of the disease..."
              },
              {
                "title": "Symptoms",
                "content": "Description of symptoms..."
              },
              {
                "title": "Causative Agent",
                "content": "Description of pathogens..."
              },
              {
                "title": "Control Measures",
                "content": "Description of control methods..."
              }
            ],
            "quickReference": ["Quick reference 1", "Quick reference 2", "Quick reference 3"],
            "disclaimer": "Disclaimer statement..."
          }
          
          Return only valid JSON as your response. Include practical solutions for disease management. Write concisely and clearly. Include a quick reference for practical actions and ensure these recommendations conform to Sri Lanka Tea Board guidelines.`;
    }
    
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      }
    );

    let reportData;
    try {
      // Extract the text content from the Gemini response
      const textContent = response.data.candidates[0].content.parts[0].text;
      
      // Try to find and parse JSON if it's wrapped in markdown code blocks
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                        textContent.match(/```\n([\s\S]*?)\n```/);
                        
      if (jsonMatch && jsonMatch[1]) {
        reportData = JSON.parse(jsonMatch[1]);
      } else {
        // Otherwise try to parse the whole response as JSON
        reportData = JSON.parse(textContent);
      }
    } catch (error) {
      console.error('Error parsing JSON report response:', error);
      // Create a default report structure based on language
      let defaultTitle, defaultOverview, defaultDisclaimer;
      
      switch(language) {
        case 'sinhala':
          defaultTitle = `රෝග වාර්තාව - ${diseaseName}`;
          defaultOverview = "තොරතුරු ලබා ගැනීමට නොහැකි විය. කරුණාකර පසුව නැවත උත්සාහ කරන්න.";
          defaultDisclaimer = "මෙම වාර්තාව තොරතුරු සඳහා පමණි. ඕනෑම රෝග කළමනාකරණ ක්‍රමවේදයක් ක්‍රියාත්මක කිරීමට පෙර කෘෂිකාර්මික විශේෂඥයෙකුගෙන් උපදෙස් ලබා ගන්න.";
          break;
        case 'tamil':
          defaultTitle = `நோய் அறிக்கை - ${diseaseName}`;
          defaultOverview = "தகவலைப் பெற முடியவில்லை. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.";
          defaultDisclaimer = "இந்த அறிக்கை தகவல் நோக்கங்களுக்கு மட்டுமே. எந்தவொரு நோய் மேலாண்மை உத்திகளையும் செயல்படுத்துவதற்கு முன் ஒரு விவசாய நிபுணரை கலந்தாலோசிக்கவும்.";
          break;
        default: // English
          defaultTitle = `Disease Report - ${diseaseName}`;
          defaultOverview = "Information could not be retrieved. Please try again later.";
          defaultDisclaimer = "This report is for informational purposes only. Always consult with an agricultural expert before implementing any disease management strategies.";
      }
      
      reportData = {
        title: defaultTitle,
        contentSections: [
          {
            title: language === 'sinhala' ? "රෝගය පිළිබඳ දළ විශ්ලේෂණය" : 
                   language === 'tamil' ? "நோய் பற்றிய விளக்கம்" : 
                   "Disease Overview",
            content: defaultOverview
          }
        ],
        quickReference: [],
        disclaimer: defaultDisclaimer
      };
      
      if (diseaseInfo) {
        if (diseaseInfo.description) {
          reportData.contentSections[0].content = diseaseInfo.description;
        }
        
        if (diseaseInfo.symptoms && diseaseInfo.symptoms.length > 0) {
          reportData.contentSections.push({
            title: language === 'sinhala' ? "රෝග ලක්ෂණ" : 
                   language === 'tamil' ? "நோயின் அறிகுறிகள்" : 
                   "Symptoms",
            content: diseaseInfo.symptoms.join("\n\n")
          });
        }
        
        if (diseaseInfo.controlMeasures) {
          const controlMeasuresContent = [];
          
          if (diseaseInfo.controlMeasures.cultural && diseaseInfo.controlMeasures.cultural.length > 0) {
            controlMeasuresContent.push(
              language === 'sinhala' ? "සංස්කෘතික පාලනය:" : 
              language === 'tamil' ? "கலாச்சார கட்டுப்பாடு:" : 
              "Cultural Control:",
              ...diseaseInfo.controlMeasures.cultural
            );
          }
          
          if (diseaseInfo.controlMeasures.chemical && diseaseInfo.controlMeasures.chemical.length > 0) {
            controlMeasuresContent.push(
              language === 'sinhala' ? "රසායනික පාලනය:" : 
              language === 'tamil' ? "இரசாயன கட்டுப்பாடு:" : 
              "Chemical Control:",
              ...diseaseInfo.controlMeasures.chemical
            );
          }
          
          if (controlMeasuresContent.length > 0) {
            reportData.contentSections.push({
              title: language === 'sinhala' ? "රෝග පාලන ක්‍රමවේද" : 
                     language === 'tamil' ? "நோய் கட்டுப்பாட்டு முறைகள்" : 
                     "Control Measures",
              content: controlMeasuresContent.join("\n\n")
            });
          }
        }
      }
    }
    
    return reportData;
  } catch (error) {
    console.error('Error generating disease report:', error);
    throw error;
  }
};

export { fetchDiseaseInfo, fetchDiseaseReport };