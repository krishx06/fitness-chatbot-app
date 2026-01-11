import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useCoins } from '@/context/CoinsContext';
import { Personality, usePersonality } from '@/context/PersonalityContext';
import { useThemeContext } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';

type Message = {
  id: string;
  text: string;
  role: 'user' | 'assistant';
};



type ChatHistoryItem = {
  id: string;
  title: string;
  messages: Message[];
};

const INITIAL_QUICK_ACTIONS = ['Warm-up', 'Beginner Plan', 'Diet Tips'];

const API_URL = 'http://localhost:4000/chat';

const mapPersonalityToBackend = (p: Personality): string => {
  switch (p) {
    case 'encourager': return 'encouragement_seeker';
    case 'creative': return 'creative_explorer';
    case 'finisher': return 'goal_finisher';
    default: return 'encouragement_seeker';
  }
};

const getInitialMessage = (p: Personality): Message => ({
  id: Date.now().toString(),
  role: 'assistant',
  text:
    p === 'creative'
      ? 'Let’s keep things fun and flexible'
      : p === 'finisher'
        ? 'Let’s stay focused and get results'
        : 'I’m here to support you every step',
});


export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const { personality, setPersonality } = usePersonality();
  const { coins, addCoins } = useCoins();

  const [messages, setMessages] = useState<Message[]>([
    getInitialMessage(personality),
  ]);
  const [quickActions, setQuickActions] = useState<string[]>(INITIAL_QUICK_ACTIONS);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [personalityVisible, setPersonalityVisible] = useState(false);
  const [xpInfoVisible, setXpInfoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useThemeContext();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const brandColor = Colors[theme ?? 'light'].brandPrimary;

  const aiBubbleColor = theme === 'dark' ? '#22262B' : '#F3E8FF';
  const inputBackgroundColor = theme === 'dark' ? '#1C1F23' : '#FFFFFF';
  const placeholderColor = theme === 'dark' ? '#9BA1A6' : '#94A3B8';

  const isInputValid = input.trim().length > 0 && !isLoading;

  const lastAssistantIndex = [...messages]
    .reverse()
    .findIndex(m => m.role === 'assistant');
  const showPills = lastAssistantIndex === 0;

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([getInitialMessage(personality)]);
    }
  }, [personality]);

  const sendMessageToBackend = async (userText: string) => {
    // Optimistic UI update
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', text: userText },
    ]);

    setIsLoading(true);
    addCoins(1);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          personality: mapPersonalityToBackend(personality),
          daysUsingApp: 6,
          lifestyle: {
            steps: 5432,
            exerciseMinutes: 45,
            sleepHours: 7.5,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setQuickActions(data.suggestions);
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            text: data.reply,
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            text: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          text: 'Network error. Please make sure the backend is running.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!isInputValid) return;
    const text = input.trim();
    setInput('');
    sendMessageToBackend(text);
  };

  const handleQuickAction = (action: string) => {
    sendMessageToBackend(action);
  };

  const handleNewChat = () => {
    setMenuVisible(false);

    if (messages.length > 1) {
      setChatHistory(prev => [
        {
          id: Date.now().toString(),
          title: messages[1]?.text.slice(0, 28) || 'Previous chat',
          messages,
        },
        ...prev.slice(0, 4),
      ]);
    }

    setMessages([getInitialMessage(personality)]);
  };

  const handlePersonalityChange = (p: Personality) => {
    setPersonality(p);
    setPersonalityVisible(false);
    setMessages([getInitialMessage(p)]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, { backgroundColor }]}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </Pressable>

          <View style={styles.logoWrapper} pointerEvents="none">
            <Image
              source={require('@/assets/images/logo.jpg')}
              style={styles.logo}
            />
          </View>

          <View style={styles.headerRight}>
            <Pressable onPress={() => setXpInfoVisible(v => !v)}>
              <View style={[styles.xpBadge, { backgroundColor: theme === 'dark' ? 'rgba(124,58,237,0.2)' : '#F5F3FF' }]}>
                <MaterialIcons name="monetization-on" size={14} color="#7C3AED" />
                <ThemedText style={styles.xpText}>{coins}</ThemedText>
              </View>
            </Pressable>

            <Pressable onPress={() => setMenuVisible(true)} hitSlop={10}>
              <Ionicons name="ellipsis-horizontal" size={22} color={textColor} />
            </Pressable>
          </View>
        </View>

        {xpInfoVisible && (
          <>
            <Pressable
              style={styles.backdrop}
              onPress={() => setXpInfoVisible(false)}
            />
            <View style={[styles.xpTooltip, { backgroundColor: cardColor, borderColor }]}>
              <MaterialIcons name="monetization-on" size={16} color="#7C3AED" />
              <ThemedText style={styles.xpTipText}>
                You earn 1 Coin for every question you ask. Stay consistent 💪
              </ThemedText>
            </View>
          </>
        )}

        {menuVisible && (
          <>
            <Pressable
              style={styles.backdrop}
              onPress={() => setMenuVisible(false)}
            />
            <View style={[styles.menu, { backgroundColor: cardColor, borderColor }]}>
              <Pressable style={styles.menuAction} onPress={handleNewChat}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={textColor} />
                <ThemedText>New Chat</ThemedText>
              </Pressable>

              <Pressable
                style={styles.menuAction}
                onPress={() => {
                  setMenuVisible(false);
                  setHistoryVisible(true);
                }}
              >
                <Ionicons name="time-outline" size={20} color={textColor} />
                <ThemedText>Chat History</ThemedText>
              </Pressable>

              <Pressable
                style={styles.menuAction}
                onPress={() => {
                  setMenuVisible(false);
                  setPersonalityVisible(true);
                }}
              >
                <Ionicons name="options-outline" size={20} color={textColor} />
                <ThemedText>Change Personality</ThemedText>
              </Pressable>
            </View>
          </>
        )}

        {historyVisible && (
          <>
            <Pressable
              style={styles.backdrop}
              onPress={() => setHistoryVisible(false)}
            />
            <View style={[styles.historyModal, { backgroundColor: cardColor }]}>
              <ThemedText type="defaultSemiBold">Chat History</ThemedText>

              {chatHistory.length === 0 && (
                <ThemedText>No previous chats yet</ThemedText>
              )}

              {chatHistory.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => {
                    setMessages(item.messages);
                    setHistoryVisible(false);
                  }}
                >
                  <ThemedText>{item.title}</ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {personalityVisible && (
          <>
            <Pressable
              style={styles.backdrop}
              onPress={() => setPersonalityVisible(false)}
            />
            <View style={[styles.personalityModal, { backgroundColor: cardColor }]}>
              <PersonalityOption
                label="Encouragement Seeker"
                active={personality === 'encourager'}
                onPress={() => handlePersonalityChange('encourager')}
                borderColor={borderColor}
                activeColor={brandColor}
                textColor={textColor}
                activeBackgroundColor={theme === 'dark' ? '#2E1065' : '#F5F3FF'}
              />
              <PersonalityOption
                label="Creative Explorer"
                active={personality === 'creative'}
                onPress={() => handlePersonalityChange('creative')}
                borderColor={borderColor}
                activeColor={brandColor}
                textColor={textColor}
                activeBackgroundColor={theme === 'dark' ? '#2E1065' : '#F5F3FF'}
              />
              <PersonalityOption
                label="Goal Finisher"
                active={personality === 'finisher'}
                onPress={() => handlePersonalityChange('finisher')}
                borderColor={borderColor}
                activeColor={brandColor}
                textColor={textColor}
                activeBackgroundColor={theme === 'dark' ? '#2E1065' : '#F5F3FF'}
              />
            </View>
          </>
        )}

        <View style={[styles.chatBackground, { backgroundColor }]}>
          <View style={styles.blobTopRight} />
          <View style={styles.blobBottomLeft} />

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatArea}
            renderItem={({ item, index }) => (
              <>
                <View
                  style={[
                    styles.bubble,
                    item.role === 'user'
                      ? { backgroundColor: brandColor, alignSelf: 'flex-end' }
                      : { backgroundColor: aiBubbleColor, alignSelf: 'flex-start' },
                  ]}
                >
                  <ThemedText
                    style={item.role === 'user' ? styles.userText : { color: textColor }}
                  >
                    {item.text}
                  </ThemedText>
                </View>

                {item.role === 'assistant' &&
                  index === messages.length - 1 &&
                  showPills && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.pillsScroll}
                      contentContainerStyle={styles.pillsContainer}
                    >
                      {quickActions.map((action, idx) => (
                        <Pressable
                          key={`${action}-${idx}`}
                          style={[styles.pill, { backgroundColor: theme === 'dark' ? 'rgba(124,58,237,0.2)' : '#F5F3FF', borderColor: borderColor }]}
                          onPress={() => handleQuickAction(action)}
                        >
                          <ThemedText style={styles.pillText}>
                            {action}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
              </>
            )}
          />
        </View>

        <View style={styles.inputWrapper}>
          <View style={[styles.inputBox, { backgroundColor: inputBackgroundColor, borderColor }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask me anything about fitness…"
              placeholderTextColor={placeholderColor}
              style={[styles.input, { color: textColor }]}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={!isInputValid}
              style={[
                styles.sendButton,
                { backgroundColor: brandColor },
                !isInputValid && styles.sendDisabled,
              ]}
            >
              <Ionicons name={isLoading ? "ellipsis-horizontal" : "arrow-up"} size={18} color="#FFF" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PersonalityOption({
  label,
  active,
  onPress,
  borderColor,
  activeColor,
  textColor,
  activeBackgroundColor,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  borderColor: string;
  activeColor: string;
  textColor: string;
  activeBackgroundColor: string;
}) {
  return (
    <Pressable
      style={[
        styles.personalityOption,
        { borderColor },
        active && { borderColor: activeColor, backgroundColor: activeBackgroundColor }
      ]}
      onPress={onPress}
    >
      <ThemedText style={{ color: textColor }}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },

  header: {
    height: 56,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: { width: 32, height: 32, borderRadius: 8 },

  headerRight: { flexDirection: 'row', gap: 12 },

  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F5F3FF',
  },
  xpText: { fontWeight: '600', color: '#5B21B6' },

  xpTooltip: {
    position: 'absolute',
    top: 64,
    right: Spacing.lg,
    backgroundColor: 'rgba(248,247,255,0.96)',
    padding: 10,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    zIndex: 40,
  },
  xpTipText: { fontSize: 13 },

  backdrop: { position: 'absolute', inset: 0, zIndex: 10 },

  menu: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    backgroundColor: '#F8F7FF',
    borderRadius: 16,
    padding: 8,
    zIndex: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  menuAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  historyModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 30,
  },
  historyItem: { paddingVertical: 12 },

  personalityModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: Spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: Spacing.md,
    zIndex: 30,
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

  chatBackground: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    position: 'relative',
    overflow: 'hidden',
  },

  blobTopRight: {
    position: 'absolute',
    top: 20,
    right: -140,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -160,
    left: -160,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(124,58,237,0.05)',
  },

  chatArea: { padding: Spacing.lg, gap: Spacing.md },

  bubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '78%',
  },
  aiBubble: { backgroundColor: '#F3E8FF', alignSelf: 'flex-start' },
  userBubble: {
    backgroundColor: Colors.light.brandSecondary,
    alignSelf: 'flex-end',
  },
  userText: { color: '#FFF' },

  pillsScroll: {
    marginTop: 6,
    flexGrow: 0,
  },
  pillsContainer: {
    paddingHorizontal: 4,
    gap: 8,
    paddingRight: 20,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  pillText: {
    fontSize: 12,
    color: '#5B21B6',
    fontWeight: '500',
  },

  inputWrapper: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  inputBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 999,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: 16, paddingHorizontal: 8 },
  sendButton: {
    backgroundColor: Colors.light.brandSecondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { backgroundColor: '#CBD5E1' },
});
