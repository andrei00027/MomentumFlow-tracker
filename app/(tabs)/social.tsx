/**
 * TODO v2.0: Social Features
 *
 * This screen is disabled for v1.0 release.
 *
 * Planned features for v2.0:
 * - Friends list and friend requests
 * - Group challenges and competitions
 * - Leaderboards (weekly, monthly, all-time)
 * - Social feed with friends' achievements
 * - Accountability partners
 * - Team challenges
 * - Achievement sharing
 *
 * Implementation requirements:
 * - Backend API (Firebase/Supabase)
 * - Real-time updates
 * - Push notifications for social interactions
 * - Privacy settings
 * - User search and discovery
 */

import { StyleSheet, Text, View } from 'react-native';
import { Colors, Sizes } from '@/src/constants';

export default function SocialScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Социальное</Text>
      <Text style={styles.subtitle}>Друзья и челленджи</Text>
      <Text style={styles.comingSoon}>Скоро в версии 2.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Sizes.spacing.sm,
  },
  subtitle: {
    fontSize: Sizes.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: Sizes.fontSize.md,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Sizes.spacing.lg,
    fontStyle: 'italic',
  },
});
