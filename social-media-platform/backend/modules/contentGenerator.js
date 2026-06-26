const Anthropic = require('@anthropic-ai/sdk');

class ContentGenerator {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateContent(params) {
    const {
      topic,
      tone = 'professional',
      platform = 'instagram',
      industry = 'general',
      includeHashtags = true
    } = params;

    const platformGuide = this.getPlatformGuide(platform);
    const industryContext = this.getIndustryContext(industry);

    const prompt = `
You are an expert social media content creator. Generate a single social media post based on the following:

Topic: ${topic}
Tone: ${tone}
Platform: ${platform}
Industry: ${industry}
Include Hashtags: ${includeHashtags}

${platformGuide}

${industryContext}

Guidelines:
- Write compelling, engaging copy
- Keep it concise but impactful
- Use appropriate language for the platform
- If requested, include relevant hashtags (3-5 for Instagram/TikTok, 1-2 for LinkedIn)
- Include emojis where appropriate for the platform
- Make it feel authentic and human-written
- Focus on providing value or generating engagement

Platform-specific requirements:
${platformGuide}

Generate ONLY the post content, no additional commentary or explanations.
`;

    try {
      console.log(`Generating ${platform} content for: ${topic}`);

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.content[0].text;

      return {
        content: content.trim(),
        platform,
        topic,
        tone,
        industry,
        generateDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Content generation error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  getPlatformGuide(platform) {
    const guides = {
      instagram: `
Instagram Specifics:
- Character limit: 2,200 characters (but keep shorter for readability)
- Use line breaks to improve readability
- Include 3-5 relevant hashtags
- Can include emojis liberally
- Focus on visual/lifestyle appeal
- Call to action works well
- Story behind the post performs better
      `,
      facebook: `
Facebook Specifics:
- Character limit: 63,206 (but keep to 1-3 short paragraphs)
- Use line breaks effectively
- Can include 1-2 hashtags (optional)
- Emojis work but use moderately
- Stories and personal touches work well
- Community engagement oriented
- Ask questions to drive comments
      `,
      linkedin: `
LinkedIn Specifics:
- Professional tone is essential
- Keep to 1-3 paragraphs with line breaks
- Minimal hashtags (0-1)
- Avoid excessive emojis
- Focus on insights, industry trends, or professional growth
- Business value and actionable advice work well
- B2B audience - make it relevant to professionals
- Include thought-provoking questions
      `,
      tiktok: `
TikTok Specifics:
- Very concise text (100-150 characters max)
- Casual, trendy tone
- Heavy emoji use
- Hashtags (3-5)
- Conversational and fun
- Encourages interaction and shares
- Trending sounds and challenges orientation
      `
    };

    return guides[platform] || guides.instagram;
  }

  getIndustryContext(industry) {
    const contexts = {
      roofing: `
Industry Context: Roofing
- Focus on: durability, weather protection, energy efficiency
- Pain points: leaks, storm damage, aging roofs
- Services: repairs, replacements, inspections
- Seasonal themes work well (storm preparation, spring maintenance)
- Include trust signals: certifications, years in business, customer satisfaction
      `,
      hvac: `
Industry Context: HVAC
- Focus on: comfort, energy savings, air quality
- Pain points: breakdowns, high utility bills, poor air quality
- Services: maintenance, repairs, installations, seasonal checks
- Seasonal content: spring cooling prep, winter heating checks
- Highlight: efficiency, emergency service, expert technicians
      `,
      plumbing: `
Industry Context: Plumbing
- Focus on: reliability, quick response, water conservation
- Pain points: clogs, leaks, burst pipes, water damage
- Services: repairs, maintenance, emergency calls, installations
- Seasonal: winterization, spring plumbing prep
- Highlight: 24/7 availability, licensed professionals, guaranteed work
      `,
      solar: `
Industry Context: Solar/Green Energy
- Focus on: savings, sustainability, environmental impact
- Pain points: high energy bills, carbon footprint, energy independence
- Services: installations, maintenance, consultations
- Highlight: ROI, incentives, government rebates, long-term savings
- Educational content about solar benefits
      `,
      general: `
Industry Context: General Service Business
- Focus on: quality, customer satisfaction, reliability
- Pain points: time, convenience, trust
- Services: your specific offerings
- Highlight: experience, customer testimonials, professionalism
      `
    };

    return contexts[industry] || contexts.general;
  }

  // Generate multiple variations of the same content
  async generateVariations(params, count = 3) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const content = await this.generateContent(params);
      variations.push(content);
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return variations;
  }
}

module.exports = ContentGenerator;
