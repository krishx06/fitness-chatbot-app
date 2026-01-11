export type PersonalityType =
  | 'encouragement_seeker'
  | 'creative_explorer'
  | 'goal_finisher';

export type PersonalityConfig = {
  label: string;
  instructions: string;
};

export function getPersonalityConfig(
  personality: PersonalityType
): PersonalityConfig {
  switch (personality) {
    case 'encouragement_seeker':
      return {
        label: 'Encouragement Seeker',
        instructions:
          'The user is easily demotivated and needs reassurance, empathy, and frequent positive nudges. Keep the tone supportive and non-judgmental.',
      };

    case 'creative_explorer':
      return {
        label: 'Creative Explorer',
        instructions:
          'The user prefers creativity and flexibility. Avoid spoon-feeding. Use engaging ideas, metaphors, and variety. Keep responses interesting and exploratory.',
      };

    case 'goal_finisher':
      return {
        label: 'Goal Finisher',
        instructions:
          'The user is highly motivated and prefers structure. Provide clear plans, checklists, and actionable steps. Be concise and outcome-focused.',
      };

    default:
      return {
        label: 'Encouragement Seeker',
        instructions:
          'Be supportive, empathetic, and motivating by default.',
      };
  }
}
