import {
  MessageCircle, Brain, GitBranch, Puzzle, Crown, Clock, Users, Palette, Sparkles, Mic, Heart, Smile, Handshake, ShieldCheck, Target,
  Globe, KeyRound, Share2, MessageSquareWarning, EyeOff, Fish, Link2, BadgeAlert, Footprints, MessagesSquare, MonitorSmartphone, Gamepad2,
  type LucideIcon,
} from 'lucide-react'
import type { Tone } from '@/components/ls/ui'

export type Q = { q: string; options: string[]; answer: number; explain: string }
export type Skill = { slug: string; name: string; icon: LucideIcon; tone: Tone; blurb: string; lessons: { title: string; minutes: number; summary: string }[]; quiz: Q[]; activity: { prompt: string; items: string[] } }

const L = (title: string, minutes: number, summary: string) => ({ title, minutes, summary })

export const skills: Skill[] = [
  { slug: 'communication', name: 'Communication Skills', icon: MessageCircle, tone: 'primary', blurb: 'Speak clearly, listen actively and express ideas with confidence.',
    lessons: [L('Active Listening', 8, 'Listening to understand, not just to reply.'), L('Body Language Basics', 10, 'What your posture and eyes say before you speak.'), L('"I" Statements', 7, 'Share feelings without blaming others.'), L('Asking Great Questions', 9, 'Open questions that start real conversations.')],
    quiz: [{ q: 'Which shows active listening?', options: ['Checking your phone', 'Nodding and summarising', 'Interrupting with your story'], answer: 1, explain: 'Summarising proves you understood what was said.' }, { q: 'An "I" statement starts with…', options: ['"You always…"', '"I feel… when…"', '"Everyone thinks…"'], answer: 1, explain: '"I feel" focuses on your experience, not blame.' }],
    activity: { prompt: 'Sort these into good listening habits', items: ['Eye contact', 'Paraphrasing', 'Patience', 'Open posture'] } },
  { slug: 'critical-thinking', name: 'Critical Thinking', icon: Brain, tone: 'sky', blurb: 'Question claims, weigh evidence and spot weak arguments.',
    lessons: [L('Fact vs Opinion', 8, 'Tell what can be proven from what is believed.'), L('Spotting Bias', 10, 'Every source has a viewpoint.'), L('Evaluating Evidence', 12, 'Is it reliable, recent and relevant?'), L('Logical Fallacies', 11, 'Common tricks in arguments.')],
    quiz: [{ q: '"Chocolate is the best flavour" is a…', options: ['Fact', 'Opinion', 'Statistic'], answer: 1, explain: 'It cannot be proven true for everyone.' }, { q: 'A reliable source usually…', options: ['Has no author', 'Cites evidence', 'Uses ALL CAPS'], answer: 1, explain: 'Good sources show where facts come from.' }],
    activity: { prompt: 'Questions to ask about any claim', items: ['Who said it?', 'How do they know?', 'What is missing?', 'Who benefits?'] } },
  { slug: 'decision-making', name: 'Decision Making', icon: GitBranch, tone: 'mint', blurb: 'Make thoughtful choices by weighing options and consequences.',
    lessons: [L('The DECIDE Model', 9, 'A six-step method for big choices.'), L('Pros & Cons Lists', 7, 'Make trade-offs visible.'), L('Short vs Long Term', 10, 'What feels good now vs later.'), L('Learning from Mistakes', 8, 'Every choice teaches something.')],
    quiz: [{ q: 'First step in good decisions?', options: ['Pick quickly', 'Define the problem', 'Ask a friend to choose'], answer: 1, explain: 'You need to know what you are deciding.' }, { q: 'Thinking about consequences helps you…', options: ['Avoid regret', 'Decide slower forever', 'Ignore feelings'], answer: 0, explain: 'Predicting outcomes leads to wiser choices.' }],
    activity: { prompt: 'The DECIDE steps', items: ['Define', 'Explore options', 'Consider outcomes', 'Act & review'] } },
  { slug: 'problem-solving', name: 'Problem Solving', icon: Puzzle, tone: 'sun', blurb: 'Break big problems into small steps and find creative fixes.',
    lessons: [L('Define the Real Problem', 8, 'Find the root, not the symptom.'), L('Brainstorming', 9, 'Quantity first, judge later.'), L('Test & Iterate', 10, 'Try, learn, improve.'), L('Asking for Help', 6, 'Smart problem solvers collaborate.')],
    quiz: [{ q: 'During brainstorming you should…', options: ['Judge every idea', 'Write all ideas down', 'Stop at one idea'], answer: 1, explain: 'More ideas means better options.' }, { q: 'The "5 Whys" finds…', options: ['The root cause', 'A quick excuse', 'Who to blame'], answer: 0, explain: 'Asking why repeatedly digs deeper.' }],
    activity: { prompt: 'Problem-solving cycle', items: ['Understand', 'Plan', 'Try', 'Reflect'] } },
  { slug: 'leadership', name: 'Leadership Skills', icon: Crown, tone: 'primary', blurb: 'Inspire others, take responsibility and lead by example.',
    lessons: [L('What Makes a Leader?', 8, 'Leadership is action, not a title.'), L('Leading by Example', 9, 'Do what you ask of others.'), L('Giving Feedback', 10, 'Kind, specific and helpful.'), L('Delegating Tasks', 9, 'Match tasks to strengths.')],
    quiz: [{ q: 'Good leaders mostly…', options: ['Give orders', 'Listen and support', 'Do everything alone'], answer: 1, explain: 'Supporting the team brings out the best.' }, { q: 'Delegation means…', options: ['Sharing tasks wisely', 'Avoiding work', 'Doing it all'], answer: 0, explain: 'It uses everyone\u2019s strengths.' }],
    activity: { prompt: 'Leadership traits', items: ['Empathy', 'Integrity', 'Vision', 'Courage'] } },
  { slug: 'time-management', name: 'Time Management', icon: Clock, tone: 'sky', blurb: 'Plan your day, beat procrastination and find balance.',
    lessons: [L('Pomodoro Technique', 7, '25 minutes focus, 5 minutes rest.'), L('Eisenhower Matrix', 10, 'Urgent vs important.'), L('Beating Procrastination', 9, 'Start with just two minutes.'), L('Weekly Planning', 8, 'Sunday sets up the week.')],
    quiz: [{ q: 'A Pomodoro lasts…', options: ['5 minutes', '25 minutes', '2 hours'], answer: 1, explain: '25 minutes of focus then a short break.' }, { q: 'Important but not urgent tasks should be…', options: ['Scheduled', 'Ignored', 'Done instantly'], answer: 0, explain: 'Schedule them so they do not become emergencies.' }],
    activity: { prompt: 'Productive habits', items: ['Plan tomorrow tonight', 'One task at a time', 'Use a timer', 'Take breaks'] } },
  { slug: 'teamwork', name: 'Teamwork', icon: Users, tone: 'mint', blurb: 'Collaborate, share roles and achieve more together.',
    lessons: [L('Roles in a Team', 8, 'Everyone brings something.'), L('Trust Building', 9, 'Reliability creates trust.'), L('Healthy Disagreement', 10, 'Debate ideas, respect people.'), L('Celebrating Wins', 6, 'Recognise everyone\u2019s effort.')],
    quiz: [{ q: 'A great teammate…', options: ['Takes all credit', 'Shares credit', 'Works silently alone'], answer: 1, explain: 'Shared success builds team spirit.' }, { q: 'When teammates disagree…', options: ['Discuss respectfully', 'Stop talking', 'Vote them out'], answer: 0, explain: 'Respectful debate leads to better ideas.' }],
    activity: { prompt: 'Team roles', items: ['Planner', 'Creator', 'Checker', 'Encourager'] } },
  { slug: 'creativity', name: 'Creativity', icon: Palette, tone: 'sun', blurb: 'Think differently, imagine boldly and make new things.',
    lessons: [L('Creative Confidence', 8, 'Everyone is creative.'), L('SCAMPER Method', 11, 'Seven ways to remix an idea.'), L('Mind Mapping', 9, 'Ideas branching from a centre.'), L('Embracing Failure', 7, 'Mistakes fuel discovery.')],
    quiz: [{ q: 'SCAMPER helps you…', options: ['Remix ideas', 'Memorise facts', 'Sleep better'], answer: 0, explain: 'Substitute, Combine, Adapt, Modify…' }, { q: 'Creativity grows when you…', options: ['Fear mistakes', 'Experiment', 'Copy only'], answer: 1, explain: 'Experimentation unlocks new ideas.' }],
    activity: { prompt: 'SCAMPER moves', items: ['Substitute', 'Combine', 'Adapt', 'Put to other use'] } },
  { slug: 'confidence', name: 'Confidence Building', icon: Sparkles, tone: 'primary', blurb: 'Believe in yourself and step outside your comfort zone.',
    lessons: [L('Growth Mindset', 9, '"I can\u2019t do it… yet."'), L('Positive Self-Talk', 7, 'Be your own coach.'), L('Small Brave Steps', 8, 'Courage is a muscle.'), L('Handling Criticism', 10, 'Feedback is information.')],
    quiz: [{ q: 'Growth mindset means…', options: ['Talent is fixed', 'Abilities grow with effort', 'Never fail'], answer: 1, explain: 'Practice grows your brain.' }, { q: 'Positive self-talk sounds like…', options: ['"I\u2019m useless"', '"I can learn this"', '"Why bother"'], answer: 1, explain: 'Encouraging words build resilience.' }],
    activity: { prompt: 'Confidence boosters', items: ['Power pose', 'List 3 wins', 'Try one new thing', 'Celebrate effort'] } },
  { slug: 'public-speaking', name: 'Public Speaking', icon: Mic, tone: 'sky', blurb: 'Present with clarity, calm nerves and engage your audience.',
    lessons: [L('Beating Stage Fright', 8, 'Nerves are energy.'), L('Structuring a Speech', 10, 'Hook, body, close.'), L('Voice & Pace', 9, 'Pause for power.'), L('Engaging the Audience', 9, 'Stories and questions.')],
    quiz: [{ q: 'A strong speech opens with…', options: ['A hook', 'An apology', 'Silence for a minute'], answer: 0, explain: 'A hook grabs attention immediately.' }, { q: 'Pausing while speaking…', options: ['Looks weak', 'Adds emphasis', 'Should be avoided'], answer: 1, explain: 'Pauses give the audience time to think.' }],
    activity: { prompt: 'Speech structure', items: ['Hook', 'Three key points', 'Story', 'Strong close'] } },
  { slug: 'emotional-intelligence', name: 'Emotional Intelligence', icon: Heart, tone: 'rose', blurb: 'Understand and manage your feelings and empathise with others.',
    lessons: [L('Naming Emotions', 7, 'Name it to tame it.'), L('Self-Regulation', 10, 'Pause before reacting.'), L('Empathy', 9, 'Walk in someone\u2019s shoes.'), L('Reading Others', 8, 'Notice cues and tone.')],
    quiz: [{ q: 'Empathy is…', options: ['Feeling sorry', 'Understanding others\u2019 feelings', 'Agreeing always'], answer: 1, explain: 'Empathy is understanding from their view.' }, { q: 'When angry, first…', options: ['Shout', 'Pause and breathe', 'Send a message'], answer: 1, explain: 'A pause helps you respond, not react.' }],
    activity: { prompt: 'Emotion vocabulary', items: ['Frustrated', 'Anxious', 'Grateful', 'Content'] } },
  { slug: 'social-skills', name: 'Social Skills', icon: Smile, tone: 'mint', blurb: 'Make friends, join conversations and build healthy relationships.',
    lessons: [L('Starting Conversations', 8, 'Openers that work.'), L('Being a Good Friend', 9, 'Loyalty, kindness, honesty.'), L('Respecting Boundaries', 8, 'Yes, no and maybe.'), L('Including Others', 7, 'Nobody likes to be left out.')],
    quiz: [{ q: 'A good conversation starter is…', options: ['A yes/no question', 'An open question', 'Silence'], answer: 1, explain: 'Open questions invite longer answers.' }, { q: 'Respecting boundaries means…', options: ['Accepting "no"', 'Pushing until yes', 'Ignoring feelings'], answer: 0, explain: '"No" is a complete sentence.' }],
    activity: { prompt: 'Friendship qualities', items: ['Kindness', 'Trust', 'Fun', 'Respect'] } },
  { slug: 'conflict-resolution', name: 'Conflict Resolution', icon: Handshake, tone: 'sun', blurb: 'Solve disagreements calmly and find win-win solutions.',
    lessons: [L('Why Conflicts Happen', 7, 'Needs, values and misunderstandings.'), L('Calm-Down Strategies', 8, 'Cool off before talking.'), L('Win-Win Solutions', 10, 'Both sides get something.'), L('Apologising Well', 7, 'Own it, fix it.')],
    quiz: [{ q: 'A win-win solution…', options: ['One side loses', 'Both needs are met', 'Nobody talks'], answer: 1, explain: 'Both people walk away satisfied.' }, { q: 'A good apology includes…', options: ['"But you…"', 'Taking responsibility', 'Making excuses'], answer: 1, explain: 'Ownership makes apologies sincere.' }],
    activity: { prompt: 'Resolution steps', items: ['Cool down', 'Listen', 'Brainstorm', 'Agree'] } },
  { slug: 'responsibility', name: 'Responsibility', icon: ShieldCheck, tone: 'primary', blurb: 'Own your actions, keep promises and contribute at home and school.',
    lessons: [L('Owning Mistakes', 8, 'Accountability builds trust.'), L('Keeping Promises', 7, 'Your word matters.'), L('Chores & Contribution', 8, 'Every family member helps.'), L('Community Duty', 9, 'Small acts, big impact.')],
    quiz: [{ q: 'If you break something, you should…', options: ['Hide it', 'Tell someone', 'Blame a sibling'], answer: 1, explain: 'Honesty is the heart of responsibility.' }, { q: 'Being reliable means…', options: ['Following through', 'Being perfect', 'Never saying no'], answer: 0, explain: 'Do what you said you would do.' }],
    activity: { prompt: 'Ways to be responsible', items: ['Do homework on time', 'Help at home', 'Care for pets', 'Keep promises'] } },
  { slug: 'goal-setting', name: 'Goal Setting', icon: Target, tone: 'sky', blurb: 'Set SMART goals and track progress towards your dreams.',
    lessons: [L('SMART Goals', 9, 'Specific, Measurable, Achievable, Relevant, Time-bound.'), L('Breaking Goals Down', 8, 'Milestones make it doable.'), L('Tracking Progress', 7, 'What gets measured improves.'), L('Staying Motivated', 9, 'Remember your why.')],
    quiz: [{ q: 'The "M" in SMART stands for…', options: ['Magic', 'Measurable', 'Massive'], answer: 1, explain: 'You must be able to measure progress.' }, { q: 'Big goals are easier when…', options: ['Broken into steps', 'Kept secret', 'Done in one day'], answer: 0, explain: 'Milestones keep you moving.' }],
    activity: { prompt: 'SMART checklist', items: ['Specific', 'Measurable', 'Achievable', 'Time-bound'] } },
]

export type SafetyTopic = { slug: string; name: string; icon: LucideIcon; tone: Tone; blurb: string; tips: string[] }
export const safetyTopics: SafetyTopic[] = [
  { slug: 'internet-safety', name: 'Internet Safety', icon: Globe, tone: 'sky', blurb: 'The golden rules for exploring the web safely.', tips: ['Never share your address or school', 'Tell a trusted adult if something feels wrong', 'Use kid-safe search when possible'] },
  { slug: 'password-security', name: 'Password Security', icon: KeyRound, tone: 'primary', blurb: 'Create strong passwords and keep them secret.', tips: ['Use 12+ characters with symbols', 'Never reuse passwords', 'Turn on two-factor authentication'] },
  { slug: 'social-media', name: 'Social Media Safety', icon: Share2, tone: 'mint', blurb: 'Share smart and keep your profile private.', tips: ['Keep accounts private', 'Only accept people you know', 'Think before you post'] },
  { slug: 'cyberbullying', name: 'Cyberbullying Awareness', icon: MessageSquareWarning, tone: 'rose', blurb: 'Recognise, block and report online bullying.', tips: ['Don\u2019t reply to bullies', 'Screenshot and report', 'Tell a trusted adult'] },
  { slug: 'online-privacy', name: 'Online Privacy', icon: EyeOff, tone: 'sky', blurb: 'Control who sees your personal information.', tips: ['Check app permissions', 'Turn off location sharing', 'Review privacy settings'] },
  { slug: 'phishing', name: 'Phishing Awareness', icon: Fish, tone: 'sun', blurb: 'Spot fake emails and messages that steal data.', tips: ['Check the sender address', 'Don\u2019t click urgent links', 'Look for spelling mistakes'] },
  { slug: 'fake-websites', name: 'Fake Website Detection', icon: Link2, tone: 'primary', blurb: 'Tell real websites from copycats.', tips: ['Look for https and the padlock', 'Check the spelling of the URL', 'Beware of deals too good to be true'] },
  { slug: 'online-scams', name: 'Online Scams', icon: BadgeAlert, tone: 'rose', blurb: 'Avoid prize, gaming and shopping scams.', tips: ['You can\u2019t win a contest you didn\u2019t enter', 'Never pay with gift cards', 'Ask an adult before buying'] },
  { slug: 'digital-footprint', name: 'Digital Footprint', icon: Footprints, tone: 'mint', blurb: 'What you post online stays online.', tips: ['Google yourself sometimes', 'Post things you\u2019d show your grandparents', 'Delete old accounts'] },
  { slug: 'safe-communication', name: 'Safe Online Communication', icon: MessagesSquare, tone: 'sky', blurb: 'Chat respectfully and safely with others.', tips: ['Never meet online friends alone', 'Be kind in comments', 'Don\u2019t share photos with strangers'] },
  { slug: 'screen-time', name: 'Screen Time Management', icon: MonitorSmartphone, tone: 'sun', blurb: 'Balance screens with sleep, play and people.', tips: ['No screens an hour before bed', 'Use the 20-20-20 rule', 'Have screen-free meals'] },
  { slug: 'gaming-safety', name: 'Gaming Safety', icon: Gamepad2, tone: 'primary', blurb: 'Play fair, stay safe and avoid in-game scams.', tips: ['Never share account logins', 'Mute toxic players', 'Ask before in-app purchases'] },
]

export const careerCategories = ['Technology', 'Health', 'Creative', 'Science', 'Business', 'Public Service', 'Sports', 'Environment']
export type Career = { id: string; name: string; category: string; education: string; skills: string[]; blurb: string; tags: string[]; roleModel: string; path: string[] }
export const careers: Career[] = [
  { id: 'career-software-engineer', name: 'Software Engineer', category: 'Technology', education: 'B.Tech / BSc CS', skills: ['Logic', 'Coding', 'Teamwork'], blurb: 'Build the apps and systems people use every day.', tags: ['Coding', 'Maths', 'Problem Solving'], roleModel: 'Sundar Pichai', path: ['Learn Python in school', 'Science stream in Class 11–12', 'Computer Science degree', 'Internships & projects', 'Software Engineer'] },
  { id: 'career-doctor', name: 'Doctor', category: 'Health', education: 'MBBS + MD', skills: ['Biology', 'Empathy', 'Focus'], blurb: 'Diagnose and treat illness to keep people healthy.', tags: ['Biology', 'Helping', 'Science'], roleModel: 'Dr. Devi Shetty', path: ['Biology in school', 'PCB stream', 'NEET exam', 'MBBS (5.5 yrs)', 'Specialisation'] },
  { id: 'career-ux-designer', name: 'UX Designer', category: 'Creative', education: 'Design degree / bootcamp', skills: ['Empathy', 'Drawing', 'Research'], blurb: 'Design products that are easy and joyful to use.', tags: ['Art', 'Technology', 'People'], roleModel: 'Julie Zhuo', path: ['Art & computers in school', 'Any stream', 'Design degree (B.Des)', 'Build a portfolio', 'UX Designer'] },
  { id: 'career-scientist', name: 'Research Scientist', category: 'Science', education: 'MSc / PhD', skills: ['Curiosity', 'Analysis', 'Patience'], blurb: 'Discover new knowledge through experiments.', tags: ['Science', 'Space', 'Maths'], roleModel: 'Tessy Thomas', path: ['Science fairs', 'PCM/PCB stream', 'BSc', 'MSc + research', 'PhD'] },
  { id: 'career-entrepreneur', name: 'Entrepreneur', category: 'Business', education: 'Any + experience', skills: ['Leadership', 'Risk-taking', 'Selling'], blurb: 'Start businesses that solve real problems.', tags: ['Leadership', 'Money', 'Ideas'], roleModel: 'Falguni Nayar', path: ['Start a mini business', 'Commerce or any stream', 'Business degree (optional)', 'Work experience', 'Launch your startup'] },
  { id: 'career-teacher', name: 'Teacher', category: 'Public Service', education: 'Degree + B.Ed', skills: ['Patience', 'Communication', 'Creativity'], blurb: 'Inspire the next generation of learners.', tags: ['Helping', 'Communication', 'Reading'], roleModel: 'Savitribai Phule', path: ['Tutor younger kids', 'Any stream', 'Bachelor\u2019s degree', 'B.Ed', 'Teacher'] },
  { id: 'career-athlete', name: 'Professional Athlete', category: 'Sports', education: 'Training academy', skills: ['Discipline', 'Fitness', 'Teamwork'], blurb: 'Compete at the highest level in your sport.', tags: ['Football', 'Fitness', 'Teamwork'], roleModel: 'Sunil Chhetri', path: ['School teams', 'District selection', 'Academy training', 'State/National level', 'Pro contract'] },
  { id: 'career-environmental-engineer', name: 'Environmental Engineer', category: 'Environment', education: 'B.Tech Environmental', skills: ['Science', 'Design', 'Problem Solving'], blurb: 'Protect the planet with clean water, air and energy solutions.', tags: ['Nature', 'Science', 'Problem Solving'], roleModel: 'Sunita Narain', path: ['Eco club', 'PCM stream', 'B.Tech', 'Field projects', 'Environmental Engineer'] },
  { id: 'career-animator', name: 'Animator', category: 'Creative', education: 'Animation diploma', skills: ['Drawing', 'Storytelling', 'Software'], blurb: 'Bring characters to life in films and games.', tags: ['Art', 'Stories', 'Technology'], roleModel: 'Hayao Miyazaki', path: ['Draw daily', 'Learn Blender', 'Animation course', 'Showreel', 'Studio animator'] },
  { id: 'career-data-scientist', name: 'Data Scientist', category: 'Technology', education: 'BSc Stats / CS', skills: ['Maths', 'Coding', 'Curiosity'], blurb: 'Find patterns in data to answer big questions.', tags: ['Maths', 'Coding', 'Space'], roleModel: 'Fei-Fei Li', path: ['Love maths puzzles', 'PCM stream', 'Stats/CS degree', 'Kaggle projects', 'Data Scientist'] },
  { id: 'career-psychologist', name: 'Psychologist', category: 'Health', education: 'MA Psychology', skills: ['Empathy', 'Listening', 'Research'], blurb: 'Help people understand their minds and feel better.', tags: ['Helping', 'People', 'Science'], roleModel: 'Dr. Shyam Bhat', path: ['Psychology elective', 'Humanities stream', 'BA Psychology', 'MA + internship', 'Licensed psychologist'] },
  { id: 'career-astronaut', name: 'Astronaut', category: 'Science', education: 'Engineering / Pilot', skills: ['Fitness', 'Science', 'Calm under pressure'], blurb: 'Explore space and conduct experiments in orbit.', tags: ['Space', 'Science', 'Adventure'], roleModel: 'Kalpana Chawla', path: ['Astronomy club', 'PCM stream', 'Aerospace/Pilot', 'Experience', 'Space agency selection'] },
]

export type Mentor = { id: string; name: string; title: string; expertise: string[]; bio: string; slots: string[] }
export const resourceTypes = ['Article', 'Video', 'Worksheet', 'PDF', 'Guide']
export const resourceCats = ['Life Skills', 'Career', 'Safety', 'Finance', 'Wellbeing', 'Creativity']
export type Resource = { id: string; title: string; type: string; category: string; minutes: number; level: string }
export const resources: Resource[] = [
  ['The Art of Active Listening', 'Article', 'Life Skills'], ['How Money Grows: Compound Interest', 'Video', 'Finance'], ['My Weekly Budget Worksheet', 'Worksheet', 'Finance'],
  ['Password Power Guide', 'PDF', 'Safety'], ['Careers in Climate Science', 'Article', 'Career'], ['5-Minute Mindfulness for Teens', 'Video', 'Wellbeing'],
  ['SMART Goal Planner', 'Worksheet', 'Life Skills'], ['Spotting Fake News', 'Guide', 'Safety'], ['Starting Your First Portfolio', 'Guide', 'Creativity'],
  ['Sleep Science Explained', 'Video', 'Wellbeing'], ['Interview Skills for Teens', 'PDF', 'Career'], ['Needs vs Wants Sorting Cards', 'Worksheet', 'Finance'],
  ['Cyberbullying: What To Do', 'Guide', 'Safety'], ['Drawing Comics Step-by-Step', 'Video', 'Creativity'], ['Emotions Wheel Poster', 'PDF', 'Wellbeing'],
  ['Debate Club Starter Kit', 'Guide', 'Life Skills'], ['What Does a UX Designer Do?', 'Video', 'Career'], ['Digital Payment Safety Checklist', 'PDF', 'Finance'],
].map(([title, type, category], i) => ({ id: `res-${i + 1}`, title, type, category, minutes: 5 + ((i * 7) % 20), level: ['Beginner', 'Intermediate', 'Advanced'][i % 3] }))

export type ScenarioChoice = { text: string; score: number; feedback: string; next?: string }
export type ScenarioNode = { id: string; text: string; choices: ScenarioChoice[] }
export type Scenario = { id: string; category: string; title: string; tone: Tone; timed: number; nodes: ScenarioNode[]; lesson: string }
const sc = (id: string, category: string, title: string, tone: Tone, timed: number, lesson: string, start: string, c: ScenarioChoice[], followText: string, follow: ScenarioChoice[]): Scenario => ({
  id, category, title, tone, timed, lesson,
  nodes: [{ id: 'start', text: start, choices: c }, { id: 'follow', text: followText, choices: follow }],
})
export const scenarios: Scenario[] = [
  sc('s1', 'School', 'The Forgotten Homework', 'sky', 30, 'Honesty plus a plan turns a mistake into trust.', 'You realise on the bus that you forgot your homework at home. It is due first period.',
    [{ text: 'Tell the teacher honestly and offer to bring it tomorrow', score: 100, feedback: 'Honesty builds trust and shows responsibility.' }, { text: 'Quickly copy a friend\u2019s homework', score: 10, feedback: 'Copying is dishonest and you won\u2019t learn.' }, { text: 'Say nothing and hope the teacher forgets', score: 40, feedback: 'Avoiding it adds stress.', next: 'follow' }],
    'The teacher asks the class to hand in homework. What now?', [{ text: 'Explain truthfully', score: 80, feedback: 'Better late than never – honesty wins.' }, { text: 'Say the dog ate it', score: 0, feedback: 'Excuses damage trust.' }]),
  sc('s2', 'Friendship', 'The Left-Out Friend', 'mint', 30, 'Including others is a small act with huge impact.', 'Your group is planning a weekend outing but one friend, Dev, wasn\u2019t invited and looks upset.',
    [{ text: 'Suggest inviting Dev too', score: 100, feedback: 'Kind and inclusive – great leadership!' }, { text: 'Ignore it; it\u2019s not your plan', score: 30, feedback: 'Small actions could have helped Dev feel included.', next: 'follow' }, { text: 'Joke about it in the group chat', score: 0, feedback: 'That could hurt Dev a lot.' }],
    'Later you see Dev sitting alone at lunch.', [{ text: 'Sit with Dev and chat', score: 80, feedback: 'Empathy in action.' }, { text: 'Walk past', score: 10, feedback: 'A kind word could have made Dev\u2019s day.' }]),
  sc('s3', 'Peer Pressure', 'The Group Chat Dare', 'rose', 20, 'Saying no to unsafe dares is a sign of strength.', 'Friends dare you to post an embarrassing photo of a classmate. "Everyone\u2019s doing it!"',
    [{ text: 'Refuse and explain it\u2019s hurtful', score: 100, feedback: 'Standing up for others takes courage.' }, { text: 'Post it but delete later', score: 0, feedback: 'Screenshots last forever and it\u2019s bullying.' }, { text: 'Leave the chat quietly', score: 60, feedback: 'Better than joining in, but you could also report it.', next: 'follow' }],
    'The photo is posted by someone else anyway.', [{ text: 'Report it and tell an adult', score: 90, feedback: 'Reporting helps protect your classmate.' }, { text: 'Like it so you fit in', score: 0, feedback: 'Liking it spreads harm.' }]),
  sc('s4', 'Online Safety', 'The Free Skin Offer', 'primary', 20, 'If it sounds too good to be true, it usually is.', 'A message says: "Get 10,000 free game coins! Just log in at freecoinz-game.xyz"',
    [{ text: 'Ignore and report the message', score: 100, feedback: 'Smart! That\u2019s a classic phishing scam.' }, { text: 'Click to check it out', score: 20, feedback: 'Clicking may install malware.', next: 'follow' }, { text: 'Share with friends', score: 0, feedback: 'Sharing spreads the scam.' }],
    'The site asks for your game password.', [{ text: 'Close the page and change your password', score: 70, feedback: 'Good recovery.' }, { text: 'Enter your password', score: 0, feedback: 'Your account would be stolen.' }]),
  sc('s5', 'Money', 'Birthday Money Dilemma', 'sun', 30, 'Saving part of every income builds future freedom.', 'You got ₹1,000 for your birthday. A new video game costs ₹999.',
    [{ text: 'Save half, spend half on something smaller', score: 100, feedback: 'Balanced and wise!' }, { text: 'Buy the game right now', score: 40, feedback: 'Fun, but nothing is left for goals.', next: 'follow' }, { text: 'Save it all for your drawing tablet', score: 90, feedback: 'Great discipline toward your goal.' }],
    'Next week your friend\u2019s birthday comes up and you need a gift.', [{ text: 'Make a handmade gift', score: 80, feedback: 'Creative and thoughtful!' }, { text: 'Borrow money from a sibling', score: 30, feedback: 'Borrowing creates debt.' }]),
  sc('s6', 'Emergency', 'Kitchen Smoke', 'rose', 15, 'Stay calm, get safe, then call for help.', 'You smell smoke coming from the kitchen while home with your little brother.',
    [{ text: 'Get your brother out and call emergency services', score: 100, feedback: 'Safety first – perfect!' }, { text: 'Try to put out a big fire with water', score: 20, feedback: 'Water can make oil fires worse.' }, { text: 'Hide in your room', score: 0, feedback: 'Never hide during a fire.' }],
    '', []),
  sc('s7', 'Communication', 'The Group Presentation', 'sky', 30, 'Clear, kind communication keeps teams on track.', 'Your teammate hasn\u2019t done their part and the presentation is tomorrow.',
    [{ text: 'Message them kindly to check in and offer help', score: 100, feedback: 'Empathy + clarity = great teamwork.' }, { text: 'Complain to the whole class', score: 10, feedback: 'Public blame hurts relationships.' }, { text: 'Do their part secretly', score: 50, feedback: 'Helpful, but it doesn\u2019t solve the issue.', next: 'follow' }],
    'Your teacher asks who did each part.', [{ text: 'Explain honestly but kindly', score: 80, feedback: 'Fair and truthful.' }, { text: 'Take all the credit', score: 20, feedback: 'That isn\u2019t fair either.' }]),
  sc('s8', 'Teamwork', 'Football Captain', 'mint', 30, 'Good captains lift everyone up.', 'You\u2019re team captain and a new player keeps missing passes. Others are getting annoyed.',
    [{ text: 'Practise with them after training', score: 100, feedback: 'True leadership!' }, { text: 'Bench them for the season', score: 30, feedback: 'Everyone deserves a chance to grow.' }, { text: 'Let the team tease them', score: 0, feedback: 'That breaks team spirit.' }],
    '', []),
  sc('s9', 'Ethics', 'The Found Wallet', 'primary', 25, 'Integrity is doing the right thing when nobody is watching.', 'You find a wallet with ₹2,000 and an ID card in the park.',
    [{ text: 'Return it using the ID or give it to police', score: 100, feedback: 'Integrity at its best.' }, { text: 'Keep the cash, return the wallet', score: 10, feedback: 'That\u2019s still taking what isn\u2019t yours.' }, { text: 'Leave it where it is', score: 40, feedback: 'Someone else might take it.' }],
    '', []),
  sc('s10', 'Responsibility', 'The Pet Promise', 'sun', 30, 'Commitments matter even when they get boring.', 'You promised to walk the dog every evening, but your friends invite you to play.',
    [{ text: 'Walk the dog first, then join them', score: 100, feedback: 'Responsible and fun!' }, { text: 'Skip the walk today', score: 30, feedback: 'Your dog relies on you.' }, { text: 'Ask a sibling to cover and return the favour', score: 80, feedback: 'Good negotiation skills.' }],
    '', []),
]

export type Challenge = { id: string; title: string; type: 'Daily' | 'Weekly' | 'Monthly'; mode: 'Individual' | 'Family' | 'Team'; category: string; xp: number; description: string }
export const challenges: Challenge[] = [
  { id: 'ch1', title: '7-Day Reading Sprint', type: 'Weekly', mode: 'Individual', category: 'Reading', xp: 300, description: 'Read 20 minutes every day for a week.' },
  { id: 'ch2', title: 'Kindness Mission', type: 'Daily', mode: 'Individual', category: 'Life Skills', xp: 50, description: 'Do one kind act and write about it.' },
  { id: 'ch3', title: 'Family Budget Battle', type: 'Weekly', mode: 'Family', category: 'Finance', xp: 250, description: 'Plan a family dinner under ₹800.' },
  { id: 'ch4', title: 'Monthly Coding Cup', type: 'Monthly', mode: 'Team', category: 'Coding', xp: 800, description: 'Build a mini-game in Scratch or Python as a team of 3.' },
  { id: 'ch5', title: 'Poster Design Contest', type: 'Monthly', mode: 'Individual', category: 'Creative', xp: 600, description: 'Design a poster about online safety.' },
  { id: 'ch6', title: 'Quiz Masters League', type: 'Weekly', mode: 'Individual', category: 'Quiz', xp: 200, description: 'Answer 10 GK questions daily.' },
  { id: 'ch7', title: '10K Steps Daily', type: 'Daily', mode: 'Individual', category: 'Fitness', xp: 40, description: 'Walk 10,000 steps today.' },
  { id: 'ch8', title: 'Family Fitness Week', type: 'Weekly', mode: 'Family', category: 'Fitness', xp: 300, description: 'Exercise together 30 minutes daily.' },
  { id: 'ch9', title: 'Story in 100 Words', type: 'Weekly', mode: 'Individual', category: 'Creative', xp: 180, description: 'Write a complete story in exactly 100 words.' },
  { id: 'ch10', title: 'Eco Warriors Squad', type: 'Monthly', mode: 'Team', category: 'Life Skills', xp: 700, description: 'Run a recycling drive in your neighbourhood.' },
]

export const badges = [
  { id: 'first-step', name: 'First Step', desc: 'Complete your first lesson', tone: 'primary' as Tone },
  { id: 'smooth-talker', name: 'Smooth Talker', desc: 'Finish 2 communication lessons', tone: 'sky' as Tone },
  { id: 'streak-7', name: 'On Fire', desc: '7-day learning streak', tone: 'sun' as Tone },
  { id: 'streak-30', name: 'Unstoppable', desc: '30-day learning streak', tone: 'sun' as Tone },
  { id: 'safety-scout', name: 'Safety Scout', desc: 'Pass the digital safety quiz', tone: 'mint' as Tone },
  { id: 'scam-buster', name: 'Scam Buster', desc: 'Spot 5 scams in the simulator', tone: 'rose' as Tone },
  { id: 'saver', name: 'Super Saver', desc: 'Save ₹1,000 towards a goal', tone: 'mint' as Tone },
  { id: 'budget-boss', name: 'Budget Boss', desc: 'Complete the monthly budget challenge', tone: 'sun' as Tone },
  { id: 'bookworm', name: 'Bookworm', desc: 'Read 10 resources', tone: 'primary' as Tone },
  { id: 'zen', name: 'Zen Master', desc: 'Complete 10 breathing sessions', tone: 'sky' as Tone },
  { id: 'creator', name: 'Creator', desc: 'Upload 5 creations', tone: 'primary' as Tone },
  { id: 'mentor-mate', name: 'Mentor Mate', desc: 'Attend 3 mentor sessions', tone: 'mint' as Tone },
  { id: 'decision-pro', name: 'Decision Pro', desc: 'Score 90%+ in 5 scenarios', tone: 'sky' as Tone },
  { id: 'career-explorer', name: 'Career Explorer', desc: 'Explore 10 careers', tone: 'sun' as Tone },
  { id: 'team-player', name: 'Team Player', desc: 'Join a team challenge', tone: 'mint' as Tone },
  { id: 'legend', name: 'LittleSteps Legend', desc: 'Reach level 20', tone: 'primary' as Tone },
]

export const storeItems = [
  { id: 'avatar-explorer', name: 'Explorer Hat', kind: 'Avatar', price: 0 }, { id: 'avatar-astronaut', name: 'Astronaut Helmet', kind: 'Avatar', price: 150 },
  { id: 'avatar-wizard', name: 'Wizard Cape', kind: 'Avatar', price: 220 }, { id: 'avatar-ninja', name: 'Ninja Mask', kind: 'Avatar', price: 180 },
  { id: 'theme-lavender', name: 'Lavender Dream', kind: 'Theme', price: 0 }, { id: 'theme-ocean', name: 'Ocean Breeze', kind: 'Theme', price: 120 },
  { id: 'theme-mint', name: 'Mint Forest', kind: 'Theme', price: 120 }, { id: 'theme-sunset', name: 'Sunny Sunset', kind: 'Theme', price: 160 },
  { id: 'frame-basic', name: 'Classic Frame', kind: 'Frame', price: 0 }, { id: 'frame-gold', name: 'Golden Frame', kind: 'Frame', price: 300 },
  { id: 'frame-rainbow', name: 'Rainbow Frame', kind: 'Frame', price: 250 }, { id: 'reward-shield', name: 'Streak Shield', kind: 'Power-up', price: 100 },
  { id: 'reward-screen', name: '+30 min Screen Time*', kind: 'Real reward', price: 200 }, { id: 'reward-movie', name: 'Family Movie Night*', kind: 'Real reward', price: 400 },
]

export const assessments: { id: string; title: string; skill: string; minutes: number; tone: Tone; questions: Q[] }[] = [
  { id: 'a1', title: 'Digital Safety Basics', skill: 'Safety', minutes: 3, tone: 'sky', questions: [
    { q: 'Which password is strongest?', options: ['password123', 'Aarav2012', 'T!ger#Moon$92x', 'qwerty'], answer: 2, explain: 'Long, mixed characters and no personal info.' },
    { q: 'A stranger online asks for your school name. You…', options: ['Tell them', 'Refuse and tell an adult', 'Give a fake school'], answer: 1, explain: 'Never share personal details with strangers.' },
    { q: '"https" means a site is…', options: ['Always safe', 'Encrypted', 'Government owned'], answer: 1, explain: 'It is encrypted, but you should still check the URL.' },
    { q: 'Cyberbullying should be…', options: ['Ignored forever', 'Screenshotted and reported', 'Answered with insults'], answer: 1, explain: 'Evidence + reporting gets help.' },
    { q: 'Two-factor authentication adds…', options: ['A second check', 'More ads', 'Faster logins'], answer: 0, explain: 'A code or app approves your login.' },
  ] },
  { id: 'a2', title: 'Money Smarts', skill: 'Finance', minutes: 3, tone: 'mint', questions: [
    { q: 'Which is a NEED?', options: ['Video game', 'Food', 'Designer shoes'], answer: 1, explain: 'Needs are essential for living.' },
    { q: 'Interest on savings means…', options: ['Bank pays you', 'You pay the bank', 'Nothing'], answer: 0, explain: 'Banks reward savers with interest.' },
    { q: 'A budget helps you…', options: ['Spend more', 'Plan your money', 'Avoid school'], answer: 1, explain: 'It is a plan for money in and out.' },
    { q: 'Never share your UPI…', options: ['ID', 'PIN', 'App name'], answer: 1, explain: 'Your PIN is like a password.' },
    { q: 'Saving 10% of ₹500 is…', options: ['₹5', '₹50', '₹100'], answer: 1, explain: '10% of 500 = 50.' },
  ] },
  { id: 'a3', title: 'Life Skills Check-up', skill: 'Life Skills', minutes: 4, tone: 'primary', questions: [
    { q: 'SMART goals are…', options: ['Vague', 'Specific & time-bound', 'Secret'], answer: 1, explain: 'Specific, Measurable, Achievable, Relevant, Time-bound.' },
    { q: 'Active listening includes…', options: ['Interrupting', 'Paraphrasing', 'Texting'], answer: 1, explain: 'Paraphrasing confirms understanding.' },
    { q: 'Best way to handle conflict?', options: ['Shouting', 'Calm talk & compromise', 'Avoid forever'], answer: 1, explain: 'Calm conversation finds solutions.' },
    { q: 'The Pomodoro technique uses…', options: ['Timed focus sessions', 'All-night studying', 'Multitasking'], answer: 0, explain: '25-minute focus bursts.' },
    { q: 'Empathy means…', options: ['Understanding feelings', 'Winning arguments', 'Being quiet'], answer: 0, explain: 'Seeing from another\u2019s perspective.' },
  ] },
  { id: 'a4', title: 'Wellbeing Wisdom', skill: 'Wellbeing', minutes: 3, tone: 'sun', questions: [
    { q: 'Teens need about … hours of sleep.', options: ['5–6', '8–10', '12–14'], answer: 1, explain: '8–10 hours supports growth and memory.' },
    { q: 'Box breathing counts…', options: ['4-4-4-4', '1-2-3', '10-0-10'], answer: 0, explain: 'Inhale, hold, exhale, hold for 4 each.' },
    { q: 'Feeling stressed before exams is…', options: ['Abnormal', 'Normal and manageable', 'Dangerous always'], answer: 1, explain: 'Some stress is normal; tools help manage it.' },
    { q: 'The 20-20-20 rule protects your…', options: ['Eyes', 'Ears', 'Knees'], answer: 0, explain: 'Every 20 min, look 20 ft away for 20 s.' },
    { q: 'Daily water target for teens?', options: ['2 glasses', '6–8 glasses', '20 glasses'], answer: 1, explain: 'About 6–8 glasses keeps you hydrated.' },
  ] },
  { id: 'a5', title: 'General Knowledge Blitz', skill: 'GK', minutes: 2, tone: 'rose', questions: [
    { q: 'Largest planet in our solar system?', options: ['Earth', 'Jupiter', 'Mars'], answer: 1, explain: 'Jupiter is over 11 times wider than Earth.' },
    { q: 'Who wrote the Indian national anthem?', options: ['Rabindranath Tagore', 'Premchand', 'Sarojini Naidu'], answer: 0, explain: 'Tagore wrote "Jana Gana Mana".' },
    { q: 'H₂O is…', options: ['Salt', 'Water', 'Oxygen'], answer: 1, explain: 'Two hydrogen atoms and one oxygen atom.' },
    { q: 'How many continents are there?', options: ['5', '7', '9'], answer: 1, explain: 'Asia, Africa, N. America, S. America, Antarctica, Europe, Australia.' },
    { q: 'Fastest land animal?', options: ['Cheetah', 'Horse', 'Lion'], answer: 0, explain: 'Cheetahs reach ~110 km/h.' },
  ] },
]

export const quotes = [
  'Every big journey starts with a little step.', 'Mistakes are proof that you are trying.', 'Be the reason someone smiles today.',
  'Small progress is still progress.', 'Your only limit is the one you set yourself.', 'Kindness is a superpower.', 'Dream big, start small, act now.',
]
export const affirmations = ['I am capable of amazing things.', 'I learn from every mistake.', 'My feelings matter.', 'I am kind to myself and others.', 'I can do hard things.', 'I am growing every day.']

export const moodOptions = [
  { id: 'happy', label: 'Happy', color: 'bg-sun' },
  { id: 'excited', label: 'Excited', color: 'bg-chart-5' },
  { id: 'calm', label: 'Calm', color: 'bg-mint' },
  { id: 'proud', label: 'Proud', color: 'bg-primary' },
  { id: 'tired', label: 'Tired', color: 'bg-lavender' },
  { id: 'sad', label: 'Sad', color: 'bg-sky' },
  { id: 'angry', label: 'Angry', color: 'bg-destructive' },
]

