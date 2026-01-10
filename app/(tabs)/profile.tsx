import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Switch,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { useThemeContext } from '@/context/ThemeContext';

const DAYS_USING_APP = 6;
const XP = 1240;

type Personality = 'Encouragement Seeker' | 'Creative Explorer' | 'Goal Finisher';

function getAIBehavior(days: number) {
    if (days <= 3) return 'Empathetic';
    if (days <= 8) return 'Friendly';
    return 'Coach-like';
}

export default function ProfileScreen() {
    const router = useRouter();
    const { theme, toggleTheme } = useThemeContext();

    const darkModeEnabled = theme === 'dark';
    // Removed local state setDarkModeEnabled in favor of context toggle
    const [personality, setPersonality] =
        useState<Personality>('Encouragement Seeker');
    const [personalityModalVisible, setPersonalityModalVisible] =
        useState(false);

    const aiBehavior = getAIBehavior(DAYS_USING_APP);

    // --- THEME COLORS ---
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const textSecondaryColor = useThemeColor({}, 'textSecondary');
    const brandColor = Colors[theme ?? 'light'].brandPrimary;
    const activeItemBackgroundColor = theme === 'dark' ? '#2E1065' : '#F5F3FF';

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
                <Pressable hitSlop={10} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={textColor} />
                </Pressable>

                <ThemedText type="defaultSemiBold">Profile</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <View style={[styles.container, { backgroundColor }]}>
                <View style={styles.blobTopRight} />
                <View style={styles.blobBottomLeft} />

                <View style={[styles.profileCard, { backgroundColor: cardColor }]}>
                    <Image
                        source={require('@/assets/images/logo.jpg')}
                        style={styles.avatar}
                    />
                    <ThemedText type="subtitle">Guest</ThemedText>
                    <ThemedText style={[styles.subText, { color: textSecondaryColor }]}>
                        Day {DAYS_USING_APP} • {XP} XP
                    </ThemedText>
                </View>

                <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                    <View style={styles.cardRow}>
                        <Ionicons
                            name="sparkles-outline"
                            size={20}
                            color={brandColor}
                        />
                        <ThemedText type="defaultSemiBold">
                            Your Personality
                        </ThemedText>
                    </View>

                    <ThemedText style={[styles.cardValue, { color: textSecondaryColor }]}>
                        {personality}
                    </ThemedText>

                    <Pressable
                        style={[styles.secondaryButton, { backgroundColor: borderColor }]}
                        onPress={() => setPersonalityModalVisible(true)}
                    >
                        <ThemedText style={styles.secondaryButtonText}>
                            Change Personality
                        </ThemedText>
                    </Pressable>
                </View>

                <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                    <View style={styles.cardRow}>
                        <Ionicons
                            name="trending-up-outline"
                            size={20}
                            color={brandColor}
                        />
                        <ThemedText type="defaultSemiBold">
                            Your Status
                        </ThemedText>
                    </View>

                    <View style={styles.statsRow}>
                        <Stat label="XP" value={`${XP}`} />
                        <Stat label="Streak" value={`${DAYS_USING_APP} days`} />
                        <Stat label="AI Behavior" value={aiBehavior} />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                    <View style={styles.toggleRow}>
                        <ThemedText>Dark Mode</ThemedText>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={toggleTheme}
                            trackColor={{
                                false: borderColor,
                                true: brandColor,
                            }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>
            </View>

            {personalityModalVisible && (
                <>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setPersonalityModalVisible(false)}
                    />

                    <View style={[styles.personalityModal, { backgroundColor: cardColor }]}>
                        <PersonalityOption
                            label="Encouragement Seeker"
                            active={personality === 'Encouragement Seeker'}
                            onPress={() => {
                                setPersonality('Encouragement Seeker');
                                setPersonalityModalVisible(false);
                            }}
                            borderColor={borderColor}
                            activeColor={brandColor}
                            activeBackgroundColor={activeItemBackgroundColor}
                        />

                        <PersonalityOption
                            label="Creative Explorer"
                            active={personality === 'Creative Explorer'}
                            onPress={() => {
                                setPersonality('Creative Explorer');
                                setPersonalityModalVisible(false);
                            }}
                            borderColor={borderColor}
                            activeColor={brandColor}
                            activeBackgroundColor={activeItemBackgroundColor}
                        />

                        <PersonalityOption
                            label="Goal Finisher"
                            active={personality === 'Goal Finisher'}
                            onPress={() => {
                                setPersonality('Goal Finisher');
                                setPersonalityModalVisible(false);
                            }}
                            borderColor={borderColor}
                            activeColor={brandColor}
                            activeBackgroundColor={activeItemBackgroundColor}
                        />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    const textSecondaryColor = useThemeColor({}, 'textSecondary');
    return (
        <View style={styles.statBox}>
            <ThemedText type="defaultSemiBold">{value}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: textSecondaryColor }]}>{label}</ThemedText>
        </View>
    );
}

function PersonalityOption({
    label,
    active,
    onPress,
    borderColor,
    activeColor,
    activeBackgroundColor,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
    borderColor: string;
    activeColor: string;
    activeBackgroundColor: string;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.personalityOption,
                { borderColor },
                active && { borderColor: activeColor, backgroundColor: activeBackgroundColor },
            ]}
        >
            <ThemedText>{label}</ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },

    header: {
        height: 56,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },

    container: {
        flex: 1,
        padding: Spacing.lg,
        gap: Spacing.lg,
        backgroundColor: '#ECE8FF',
        position: 'relative',
        overflow: 'hidden',
    },

    blobTopRight: {
        position: 'absolute',
        top: -120,
        right: -140,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: 'rgba(124,58,237,0.12)',
    },

    blobBottomLeft: {
        position: 'absolute',
        bottom: -160,
        left: -160,
        width: 360,
        height: 360,
        borderRadius: 180,
        backgroundColor: 'rgba(124,58,237,0.10)',
    },

    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: Radius.lg,
        alignItems: 'center',
        padding: Spacing.lg,
        gap: 6,
        borderColor: 'rgba(185, 144, 255, 0.15)',
        borderWidth: 1,
    },

    avatar: {
        width: 72,
        height: 72,
        borderRadius: 18,
        marginBottom: 8,
    },

    subText: { color: '#64748B' },

    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        gap: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(124,58,237,0.15)',
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cardValue: { color: '#475569' },

    secondaryButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Radius.md,
        backgroundColor: '#F1F5F9',
    },

    secondaryButtonText: {
        color: Colors.light.brandPrimary,
        fontWeight: '600',
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    statBox: {
        flex: 1,
        alignItems: 'center',
    },

    statLabel: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
    },

    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    backdrop: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },

    personalityModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: Spacing.md,
    },

    personalityOption: {
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    personalityActive: {
        borderColor: Colors.light.brandPrimary,
        backgroundColor: '#F5F3FF',
    },
});
