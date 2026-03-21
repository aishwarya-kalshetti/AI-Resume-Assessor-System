/**
 * Normalizes skill names to handle common aliases and case sensitivity.
 * e.g., 'ReactJS', 'react.js' -> 'React'
 */

const SKILL_ALIASES: Record<string, string[]> = {
  'React': ['react', 'react.js', 'reactjs', 'react js'],
  'React Native': ['react native', 'react-native', 'rn'],
  'Node.js': ['node.js', 'nodejs', 'node js', 'node'],
  'HTML': ['html', 'html5'],
  'CSS': ['css', 'css3', 'tailwind', 'sass', 'scss'],
  'Problem Solving': ['problem solving', 'analytical thinking', 'critical thinking'],
  'Teamwork': ['teamwork', 'collaboration', 'team player'],
  'Communication': ['communication', 'verbal communication', 'written communication'],
  'MongoDB': ['mongodb', 'mongo', 'mongo db'],
  'MySQL': ['mysql', 'my sql', 'sql'],
  'PostgreSQL': ['postgresql', 'postgres', 'postgre'],
  'TypeScript': ['typescript', 'ts'],
  'JavaScript': ['javascript', 'js'],
  'REST API': ['rest api', 'restful api', 'rest'],
  'AWS': ['aws', 'amazon web services'],
  'Docker': ['docker', 'docker container'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'Express': ['express', 'expressjs', 'express.js'],
  'Next.js': ['next.js', 'nextjs'],
  'Vue': ['vue', 'vuejs', 'vue.js'],
  'Angular': ['angular', 'angularjs', 'angular.js'],
  'GraphQL': ['graphql', 'gql'],
  'Flutter': ['flutter', 'dart'],
  'CI/CD': ['ci/cd', 'continuous integration', 'continuous delivery', 'github actions', 'jenkins'],
};

/**
 * Normalizes a skill name to its canonical version.
 * Handles React.js vs ReactJS vs React etc.
 */
export const normalizeSkill = (skill: string): string => {
  if (!skill) return '';
  
  const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s = clean(skill);
  
  // High-priority exact mappings (after punctuation removal)
  if (s === 'react' || s === 'reactjs') return 'React';
  if (s === 'reactnative' || s === 'rn') return 'React Native';
  if (s === 'node' || s === 'nodejs') return 'Node.js';
  if (s === 'mongodb' || s === 'mongo') return 'MongoDB';
  if (s === 'mysql' || s === 'sql') return 'MySQL';

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const canonicalClean = clean(canonical);
    if (s === canonicalClean) return canonical;
    
    for (const alias of aliases) {
      if (s === clean(alias)) return canonical;
    }
  }
  
  // Capitalize first letter as fallback for unknown skills
  return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
};

/**
 * Checks if a piece of text contains a skill, accounting for aliases.
 */
export const extractSkillsFromText = (text: string): string[] => {
  const found: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    // Check canonical name
    if (lowerText.includes(canonical.toLowerCase())) {
      found.add(canonical);
      continue;
    }
    // Check aliases
    for (const alias of aliases) {
      const regex = new RegExp(`\\b${alias.replace('.', '\\.')}\\b`, 'i');
      if (regex.test(lowerText)) {
        found.add(canonical);
        break;
      }
    }
  }
  return Array.from(found);
};
