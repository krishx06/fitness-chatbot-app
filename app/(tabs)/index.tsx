import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useThemeContext } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const [personality, setPersonality] = useState<
    'encourager' | 'creative' | 'finisher'
  >('encourager');

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const brandColor = Colors[theme ?? 'light'].brandPrimary;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
      <View style={[styles.contentContainer, { backgroundColor }]}>
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroGraphicContainer}>
              <Image
                source={require('@/assets/images/logo.jpg')}
                style={styles.heroLogo}
              />
            </View>

            <View style={styles.heroTextContent}>
              <ThemedText style={styles.brandName}>NextYou</ThemedText>
              <ThemedText style={[styles.heroHeadline, { color: textColor }]}>
                Discover Your Next{'\n'}Best Version
              </ThemedText>
              <ThemedText style={[styles.heroSubtitle, { color: textSecondaryColor }]}>
                Your personal AI fitness companion
              </ThemedText>
            </View>
          </View>

          <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark" size={18} color="#166534" />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText type="defaultSemiBold" style={[styles.infoTitle, { color: textColor }]}>What it can do</ThemedText>
                <ThemedText style={[styles.infoDescription, { color: textSecondaryColor }]}>Fitness plans, wellness guidance, and consistency support.</ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="alert" size={18} color="#991B1B" />
              </View>
              <View style={styles.infoTextContainer}>
                <ThemedText type="defaultSemiBold" style={[styles.infoTitle, { color: textColor }]}>What it cannot do</ThemedText>
                <ThemedText style={[styles.infoDescription, { color: textSecondaryColor }]}>Diagnose injuries, prescribe meds, or provide medical advice.</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionHeader, { color: textColor }]}>
              Choose Your Personality{'\n'}
              <ThemedText style={[styles.sectionSubHeader, { color: textSecondaryColor }]}>
                Select the personality that best matches your fitness journey
              </ThemedText>
            </ThemedText>

            <View style={styles.personalityContainer}>
              <PersonalityCard
                title="Encouragement Seeker"
                subtitle="Prefers reassurance, motivation, and positive reinforcement"
                icon="heart"
                active={personality === 'encourager'}
                onPress={() => setPersonality('encourager')}
                color={Colors.light.brandPrimary}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                subTextColor={textSecondaryColor}
              />
              <PersonalityCard
                title="Creative Explorer"
                subtitle="Prefers flexible, creative guidance over rigid instructions"
                icon="bulb"
                active={personality === 'creative'}
                onPress={() => setPersonality('creative')}
                color="#F59E0B"
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                subTextColor={textSecondaryColor}
              />
              <PersonalityCard
                title="Goal Finisher"
                subtitle="Prefers structured plans, clear goals, and task completion"
                icon="trophy"
                active={personality === 'finisher'}
                onPress={() => setPersonality('finisher')}
                color={Colors.light.brandSecondary}
                cardColor={cardColor}
                borderColor={borderColor}
                textColor={textColor}
                subTextColor={textSecondaryColor}
              />
            </View>
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={[styles.bottomContainer, { backgroundColor, borderTopColor: borderColor }]}>
          <Pressable
            onPress={() => router.push('/chat')}
            style={styles.ctaButton}
          >
            <ThemedText style={styles.ctaText}>Start Chat</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PersonalityCard({
  title,
  subtitle,
  icon,
  active,
  onPress,
  color,
  cardColor,
  borderColor,
  textColor,
  subTextColor,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
  color: string;
  cardColor: string;
  borderColor: string;
  textColor: string;
  subTextColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pCard,
        { backgroundColor: cardColor, borderColor },
        active && styles.pCardActive,
        active && { borderColor: color, backgroundColor: cardColor === '#1C1F23' ? '#2A2F35' : '#FDFBFF' }
      ]}
    >
      <View style={[
        styles.pIconBox,
        { backgroundColor: active ? color : (cardColor === '#1C1F23' ? '#2A2F35' : '#F5F3FF') }
      ]}>
        <Ionicons
          name={icon}
          size={22}
          color={active ? '#FFF' : '#64748B'}
        />
      </View>
      <View style={styles.pContent}>
        <ThemedText style={[styles.pTitle, { color: textColor }, active && { color: color }]}>{title}</ThemedText>
        <ThemedText style={[styles.pSubtitle, { color: subTextColor }]}>{subtitle}</ThemedText>
      </View>
      {active && (
        <Ionicons name="radio-button-on" size={24} color={color} />
      )}
      {!active && (
        <Ionicons name="radio-button-off" size={24} color="#CBD5E1" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    position: 'relative',
  },

  blobTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: 'rgba(91, 46, 255, 0.05)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: 'rgba(91, 46, 255, 0.05)',
  },

  scrollContent: {
    padding: Spacing.xl,
    paddingTop: 20,
  },

  hero: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heroGraphicContainer: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.brandPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroLogo: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  heroTextContent: {
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroHeadline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },

  infoCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 24,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.light.brandPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(91, 46, 255, 0.15)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(91, 46, 255, 0.1)',
    marginVertical: Spacing.lg,
  },

  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    fontSize: 18,
    color: '#0F172A',
    marginLeft: 4,
  },
  personalityContainer: {
    gap: Spacing.md,
  },
  pCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  pCardActive: {
    shadowOpacity: 0.1,
    transform: [{ scale: 1.01 }],
  },
  pIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pContent: {
    flex: 1,
  },
  pTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  pSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  ctaButton: {
    backgroundColor: '#1a0d37ff',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubHeader: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
});
