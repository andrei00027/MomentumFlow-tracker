/**
 * HabitIcons.tsx
 *
 * Organized habit icons by category using react-native-remix-icon.
 * Each category contains unique icons - no duplicates across categories.
 * Icons use kebab-case format (e.g., 'heart-pulse' renders as 'heart-pulse-fill')
 */

export interface HabitIconDefinition {
  id: string;
  name: string;
  category: string;
}

export interface HabitIconCategory {
  id: string;
  name: string;
  nameRu: string;
  icons: HabitIconDefinition[];
}

export const HABIT_ICON_CATEGORIES: HabitIconCategory[] = [
  {
    id: 'health',
    name: 'Health & Wellness',
    nameRu: 'Здоровье',
    icons: [
      { id: 'heart-pulse', name: 'Heart Rate', category: 'health' },
      { id: 'heart', name: 'Health', category: 'health' },
      { id: 'mental-health', name: 'Mental Health', category: 'health' },
      { id: 'brain', name: 'Brain', category: 'health' },
      { id: 'zzz', name: 'Sleep', category: 'health' },
      { id: 'hotel-bed', name: 'Rest', category: 'health' },
      { id: 'first-aid-kit', name: 'First Aid', category: 'health' },
      { id: 'health-book', name: 'Health Book', category: 'health' },
      { id: 'stethoscope', name: 'Medical', category: 'health' },
      { id: 'capsule', name: 'Medicine', category: 'health' },
      { id: 'lungs', name: 'Breathing', category: 'health' },
      { id: 'psychotherapy', name: 'Therapy', category: 'health' },
      { id: 'hand-sanitizer', name: 'Hygiene', category: 'health' },
      { id: 'hospital', name: 'Hospital', category: 'health' },
      { id: 'empathize', name: 'Wellness', category: 'health' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness & Sports',
    nameRu: 'Фитнес и спорт',
    icons: [
      { id: 'run', name: 'Running', category: 'fitness' },
      { id: 'walk', name: 'Walking', category: 'fitness' },
      { id: 'bike', name: 'Cycling', category: 'fitness' },
      { id: 'basketball', name: 'Basketball', category: 'fitness' },
      { id: 'football', name: 'Football', category: 'fitness' },
      { id: 'boxing', name: 'Boxing', category: 'fitness' },
      { id: 'ping-pong', name: 'Table Tennis', category: 'fitness' },
      { id: 'golf-ball', name: 'Golf', category: 'fitness' },
      { id: 'riding', name: 'Riding', category: 'fitness' },
      { id: 'sword', name: 'Fencing', category: 'fitness' },
      { id: 'trophy', name: 'Trophy', category: 'fitness' },
      { id: 'medal', name: 'Medal', category: 'fitness' },
      { id: 'award', name: 'Achievement', category: 'fitness' },
      { id: 'fire', name: 'Calories', category: 'fitness' },
      { id: 'flashlight', name: 'Energy', category: 'fitness' },
    ],
  },
  {
    id: 'nutrition',
    name: 'Food & Nutrition',
    nameRu: 'Питание',
    icons: [
      { id: 'cup', name: 'Water', category: 'nutrition' },
      { id: 'drop', name: 'Hydration', category: 'nutrition' },
      { id: 'bowl', name: 'Meal', category: 'nutrition' },
      { id: 'restaurant', name: 'Restaurant', category: 'nutrition' },
      { id: 'knife', name: 'Cutlery', category: 'nutrition' },
      { id: 'cake', name: 'Dessert', category: 'nutrition' },
      { id: 'bread', name: 'Bread', category: 'nutrition' },
      { id: 'fridge', name: 'Refrigerator', category: 'nutrition' },
      { id: 'leaf', name: 'Vegetables', category: 'nutrition' },
      { id: 'seedling', name: 'Healthy Food', category: 'nutrition' },
      { id: 'timer', name: 'Meal Time', category: 'nutrition' },
      { id: 'scales-3', name: 'Portions', category: 'nutrition' },
      { id: 'medicine-bottle', name: 'Vitamins', category: 'nutrition' },
      { id: 'goblet', name: 'Glass', category: 'nutrition' },
      { id: 'drinks', name: 'Drinks', category: 'nutrition' },
    ],
  },
  {
    id: 'creativity',
    name: 'Creativity & Arts',
    nameRu: 'Творчество',
    icons: [
      { id: 'brush', name: 'Brush', category: 'creativity' },
      { id: 'paint-brush', name: 'Paint', category: 'creativity' },
      { id: 'palette', name: 'Palette', category: 'creativity' },
      { id: 'pencil', name: 'Draw', category: 'creativity' },
      { id: 'quill-pen', name: 'Writing', category: 'creativity' },
      { id: 'camera', name: 'Photography', category: 'creativity' },
      { id: 'image', name: 'Image', category: 'creativity' },
      { id: 'film', name: 'Film', category: 'creativity' },
      { id: 'video', name: 'Video', category: 'creativity' },
      { id: 'music', name: 'Music', category: 'creativity' },
      { id: 'headphone', name: 'Listen', category: 'creativity' },
      { id: 'mic', name: 'Recording', category: 'creativity' },
      { id: 'scissors', name: 'Crafts', category: 'creativity' },
      { id: 'artboard', name: 'Design', category: 'creativity' },
      { id: 'contrast-2', name: 'Creativity', category: 'creativity' },
    ],
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    nameRu: 'Обучение',
    icons: [
      { id: 'book-read', name: 'Reading', category: 'learning' },
      { id: 'book-open', name: 'Book', category: 'learning' },
      { id: 'book-marked', name: 'Bookmark', category: 'learning' },
      { id: 'graduation-cap', name: 'Education', category: 'learning' },
      { id: 'lightbulb', name: 'Idea', category: 'learning' },
      { id: 'glasses', name: 'Study', category: 'learning' },
      { id: 'article', name: 'Article', category: 'learning' },
      { id: 'newspaper', name: 'News', category: 'learning' },
      { id: 'file-text', name: 'Document', category: 'learning' },
      { id: 'code-s-slash', name: 'Coding', category: 'learning' },
      { id: 'terminal-box', name: 'Terminal', category: 'learning' },
      { id: 'computer', name: 'Computer', category: 'learning' },
      { id: 'keyboard', name: 'Typing', category: 'learning' },
      { id: 'calculator', name: 'Math', category: 'learning' },
      { id: 'global', name: 'Language', category: 'learning' },
    ],
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Peace',
    nameRu: 'Осознанность',
    icons: [
      { id: 'flower', name: 'Flower', category: 'mindfulness' },
      { id: 'plant', name: 'Plant', category: 'mindfulness' },
      { id: 'cactus', name: 'Cactus', category: 'mindfulness' },
      { id: 'candle', name: 'Candle', category: 'mindfulness' },
      { id: 'moon', name: 'Night', category: 'mindfulness' },
      { id: 'sun', name: 'Morning', category: 'mindfulness' },
      { id: 'sparkling', name: 'Sparkle', category: 'mindfulness' },
      { id: 'earth', name: 'Earth', category: 'mindfulness' },
      { id: 'compass-3', name: 'Compass', category: 'mindfulness' },
      { id: 'rest-time', name: 'Rest Time', category: 'mindfulness' },
      { id: 'time', name: 'Mindful Time', category: 'mindfulness' },
      { id: 'eye', name: 'Awareness', category: 'mindfulness' },
      { id: 'infinity', name: 'Infinity', category: 'mindfulness' },
      { id: 'cloud', name: 'Calm', category: 'mindfulness' },
      { id: 'rainbow', name: 'Positivity', category: 'mindfulness' },
    ],
  },
  {
    id: 'social',
    name: 'Social & Relationships',
    nameRu: 'Общение',
    icons: [
      { id: 'team', name: 'Team', category: 'social' },
      { id: 'group', name: 'Group', category: 'social' },
      { id: 'user-heart', name: 'Love', category: 'social' },
      { id: 'emotion-happy', name: 'Happy', category: 'social' },
      { id: 'chat-smile-3', name: 'Chat', category: 'social' },
      { id: 'message-3', name: 'Message', category: 'social' },
      { id: 'phone', name: 'Phone', category: 'social' },
      { id: 'smartphone', name: 'Mobile', category: 'social' },
      { id: 'home-heart', name: 'Family', category: 'social' },
      { id: 'parent', name: 'Parent', category: 'social' },
      { id: 'shake-hands', name: 'Meeting', category: 'social' },
      { id: 'hand-heart', name: 'Care', category: 'social' },
      { id: 'gift', name: 'Gift', category: 'social' },
      { id: 'user-smile', name: 'Smile', category: 'social' },
      { id: 'hearts', name: 'Love', category: 'social' },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Work',
    nameRu: 'Продуктивность',
    icons: [
      { id: 'calendar-check', name: 'Calendar', category: 'productivity' },
      { id: 'briefcase', name: 'Work', category: 'productivity' },
      { id: 'checkbox-circle', name: 'Task', category: 'productivity' },
      { id: 'task', name: 'Todo', category: 'productivity' },
      { id: 'building-3', name: 'Office', category: 'productivity' },
      { id: 'settings-3', name: 'Settings', category: 'productivity' },
      { id: 'rocket-2', name: 'Launch', category: 'productivity' },
      { id: 'map-pin-2', name: 'Location', category: 'productivity' },
      { id: 'store-3', name: 'Store', category: 'productivity' },
      { id: 'bank', name: 'Bank', category: 'productivity' },
      { id: 'draft', name: 'Draft', category: 'productivity' },
      { id: 'delete-bin', name: 'Clean', category: 'productivity' },
      { id: 'folder-open', name: 'Folder', category: 'productivity' },
      { id: 'tools', name: 'Tools', category: 'productivity' },
      { id: 'focus-3', name: 'Focus', category: 'productivity' },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Hobbies',
    nameRu: 'Образ жизни',
    icons: [
      { id: 'gamepad', name: 'Gaming', category: 'lifestyle' },
      { id: 'chess', name: 'Chess', category: 'lifestyle' },
      { id: 'shirt', name: 'Fashion', category: 'lifestyle' },
      { id: 'handbag', name: 'Shopping', category: 'lifestyle' },
      { id: 'coin', name: 'Savings', category: 'lifestyle' },
      { id: 'wallet-3', name: 'Budget', category: 'lifestyle' },
      { id: 'money-dollar-circle', name: 'Finance', category: 'lifestyle' },
      { id: 'car', name: 'Car', category: 'lifestyle' },
      { id: 'e-bike', name: 'E-Bike', category: 'lifestyle' },
      { id: 'flight-takeoff', name: 'Travel', category: 'lifestyle' },
      { id: 'suitcase', name: 'Trip', category: 'lifestyle' },
      { id: 'home-smile', name: 'Home', category: 'lifestyle' },
      { id: 'sofa', name: 'Relax', category: 'lifestyle' },
      { id: 'tv', name: 'TV', category: 'lifestyle' },
      { id: 'movie', name: 'Movies', category: 'lifestyle' },
    ],
  },
  {
    id: 'badHabits',
    name: 'Bad Habits',
    nameRu: 'Вредные привычки',
    icons: [
      { id: 'beer', name: 'Beer', category: 'badHabits' },
      { id: 'goblet-2', name: 'Wine', category: 'badHabits' },
      { id: 'drinks-2', name: 'Alcohol', category: 'badHabits' },
      { id: 'dice', name: 'Gambling', category: 'badHabits' },
      { id: 'dice-5', name: 'Dice', category: 'badHabits' },
      { id: 'game', name: 'Gaming Addiction', category: 'badHabits' },
      { id: 'skull', name: 'Toxic', category: 'badHabits' },
      { id: 'skull-2', name: 'Danger', category: 'badHabits' },
      { id: 'prohibited', name: 'Prohibited', category: 'badHabits' },
      { id: 'forbid', name: 'Forbidden', category: 'badHabits' },
      { id: 'close-circle', name: 'Stop', category: 'badHabits' },
      { id: 'error-warning', name: 'Warning', category: 'badHabits' },
      { id: 'alert', name: 'Alert', category: 'badHabits' },
      { id: 'thumb-down', name: 'Bad', category: 'badHabits' },
      { id: 'emotion-sad', name: 'Sad', category: 'badHabits' },
    ],
  },
];

// Flatten all icons for easy lookup by ID
export const HABIT_ICONS_BY_ID: Record<string, HabitIconDefinition> = {};
HABIT_ICON_CATEGORIES.forEach((category) => {
  category.icons.forEach((icon) => {
    HABIT_ICONS_BY_ID[icon.id] = icon;
  });
});

// Get icon by ID
export const getHabitIcon = (iconId: string): HabitIconDefinition | undefined => {
  return HABIT_ICONS_BY_ID[iconId];
};

// Default icon if none selected
export const DEFAULT_HABIT_ICON = 'checkbox-circle';
