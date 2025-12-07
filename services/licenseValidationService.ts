// License Validation Service using Gemini AI
// Detects and fixes license discrepancies automatically

const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;

export interface LicenseValidationResult {
  detectedLicense: string | null;
  correctedLicense: string | null;
  confidence: number;
  reason: string;
  needsCorrection: boolean;
}

// Common license mapping and variations
const KNOWN_LICENSES: Record<string, string[]> = {
  'MIT': ['MIT', 'MIT License'],
  'Apache-2.0': ['Apache 2.0', 'Apache License 2.0', 'Apache', 'Apache-2.0'],
  'GPL-3.0': ['GPLv3', 'GPL 3.0', 'GNU GPL 3.0', 'GPL-3.0', 'GPLv3+'],
  'BSD-3-Clause': ['BSD 3-Clause', 'BSD-3-Clause', '3-clause BSD', 'BSD 3 Clause'],
  'BSD-2-Clause': ['BSD 2-Clause', 'BSD-2-Clause', '2-clause BSD', 'Simplified BSD'],
  'ISC': ['ISC', 'ISC License'],
  'LGPL-3.0': ['LGPLv3', 'LGPL 3.0', 'LGPL-3.0'],
  'Unlicense': ['Unlicense', 'The Unlicense'],
  'MPL-2.0': ['Mozilla Public License 2.0', 'MPL 2.0', 'MPL-2.0'],
  'AGPL-3.0': ['AGPLv3', 'AGPL 3.0', 'AGPL-3.0'],
};

// Reverse mapping for quick lookup
const LICENSE_VARIATIONS: Record<string, string> = {};
Object.entries(KNOWN_LICENSES).forEach(([canonical, variations]) => {
  variations.forEach(v => {
    LICENSE_VARIATIONS[v.toLowerCase()] = canonical;
  });
});

/**
 * Validate license using Gemini AI
 * Detects discrepancies between detected and actual license
 */
export async function validateLicenseWithAI(
  toolName: string,
  detectedLicense: string | null,
  description: string
): Promise<LicenseValidationResult> {
  if (!GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not configured, using fallback validation');
    return validateLicenseLocally(toolName, detectedLicense, description);
  }

  try {
    const prompt = `
You are a software license expert. Analyze the following repository information and determine the correct/actual license.

Tool Name: ${toolName}
Currently Detected License: ${detectedLicense || 'None detected'}
Description: ${description}

Based on your knowledge of open-source projects:
1. Is the detected license likely correct?
2. If not, what is the actual/correct license?
3. Provide confidence level (0-100).
4. Explain briefly why (one sentence).

Respond in JSON format:
{
  "detectedLicense": "string or null",
  "correctedLicense": "string or null (only if different from detected)",
  "confidence": number (0-100),
  "reason": "brief explanation",
  "needsCorrection": boolean
}
`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 256,
        }
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.warn('Gemini API error, using fallback validation');
      return validateLicenseLocally(toolName, detectedLicense, description);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return validateLicenseLocally(toolName, detectedLicense, description);
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return validateLicenseLocally(toolName, detectedLicense, description);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      detectedLicense: parsed.detectedLicense || detectedLicense || null,
      correctedLicense: parsed.correctedLicense || null,
      confidence: parsed.confidence || 0,
      reason: parsed.reason || 'AI analysis',
      needsCorrection: Boolean(parsed.correctedLicense)
    };

  } catch (error) {
    console.error('License validation error:', error);
    return validateLicenseLocally(toolName, detectedLicense, description);
  }
}

/**
 * Fallback local license validation
 * Uses keyword matching and known patterns
 */
function validateLicenseLocally(
  toolName: string,
  detectedLicense: string | null,
  description: string
): LicenseValidationResult {
  const searchText = (toolName + ' ' + description).toLowerCase();
  
  // Common license keywords and their canonical forms
  const licenseKeywords: Record<string, string> = {
    'bsd 3-clause': 'BSD-3-Clause',
    'bsd-3': 'BSD-3-Clause',
    '3-clause': 'BSD-3-Clause',
    'bsd 2-clause': 'BSD-2-Clause',
    'bsd-2': 'BSD-2-Clause',
    'apache 2': 'Apache-2.0',
    'apache-2': 'Apache-2.0',
    'gpl-3': 'GPL-3.0',
    'gplv3': 'GPL-3.0',
    'agpl-3': 'AGPL-3.0',
    'agplv3': 'AGPL-3.0',
    'lgpl-3': 'LGPL-3.0',
    'lgplv3': 'LGPL-3.0',
  };

  // Check if detected license has variation
  const normalizedDetected = detectedLicense?.toLowerCase();
  const canonicalLicense = normalizedDetected ? LICENSE_VARIATIONS[normalizedDetected] : null;

  // Try to find license in description/keywords
  let detectedInDescription = null;
  for (const [keyword, canonical] of Object.entries(licenseKeywords)) {
    if (searchText.includes(keyword)) {
      detectedInDescription = canonical;
      break;
    }
  }

  const needsCorrection = 
    detectedLicense !== null && 
    detectedLicense !== 'Unlicense' && 
    detectedInDescription && 
    detectedInDescription !== detectedLicense;

  return {
    detectedLicense: canonicalLicense || detectedLicense || null,
    correctedLicense: needsCorrection ? detectedInDescription : null,
    confidence: needsCorrection ? 75 : 50,
    reason: needsCorrection 
      ? `Keywords in description suggest ${detectedInDescription}`
      : 'No significant discrepancy detected',
    needsCorrection
  };
}

/**
 * Normalize license name to canonical form
 */
export function normalizeLicense(license: string | null): string | null {
  if (!license) return null;
  return LICENSE_VARIATIONS[license.toLowerCase()] || license;
}

/**
 * Get all known canonical license names
 */
export function getKnownLicenses(): string[] {
  return Object.keys(KNOWN_LICENSES);
}
