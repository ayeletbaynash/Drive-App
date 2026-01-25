import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { authorizedFetch } from '../services/authorizedFetch';
import FileItem from '../components/FileItem';
import { searchStyles } from '../styles/searchStyles'; // <-- הייבוא של הסטייל החיצוני

export default function SearchScreen() {
  // --- 1. State & Hooks (לוגיקה) ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { theme } = useAppTheme(); // צבעים דינמיים
  const router = useRouter();
  
  const parentStatusCache = useRef(new Map());

  // --- 2. Helper Functions (לוגיקה של מחיקה) ---
  const isUnderDeletedFolder = async (file) => {
    let parentId = file.parent_id;

    while (parentId !== null) {
      if (parentStatusCache.current.has(parentId)) {
        return parentStatusCache.current.get(parentId);
      }

      try {
        const response = await authorizedFetch(`/files/${parentId}`);
        if (!response.ok) {
          parentStatusCache.current.set(parentId, false);
          return false;
        }
        const parent = await response.json();
        // כאן תוסיפי בדיקה אם התיקייה עצמה מחוקה (בהתאם למה שהשרת מחזיר)
        // כרגע זה ממשיך לעלות למעלה
        parentId = parent.parent_id;
      } catch (e) {
        parentStatusCache.current.set(parentId, false);
        return false;
      }
    }
    return false;
  };

  // --- 3. Search Execution (לוגיקה של חיפוש) ---
  const performSearch = async (text, signal) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await authorizedFetch(`/search/${encodeURIComponent(text)}`, { signal });
      if (response.ok) {
        const data = await response.json();
        // כאן אפשר להוסיף את הסינון של isUnderDeletedFolder אם צריך
        setResults(data); 
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Search error:", error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // --- 4. Debounce Effect (לוגיקה של המתנה) ---
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      performSearch(query, controller.signal);
    }, 400); // מחכה 400 מילישניות לפני שליחה לשרת

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  // --- 5. Handlers ---
  const handleOpenFile = (file) => {
    router.push({
      pathname: '/file-viewer',
      params: { file: JSON.stringify(file) }
    });
  };

  // --- 6. The View (התצוגה) ---
  return (
    // משתמשים ב-searchStyles למיקום, וב-theme לצבעים
    <SafeAreaView 
       edges={['left', 'right', 'bottom']} // <-- ביטלנו את 'top'
       style={[searchStyles.container, { backgroundColor: theme.background }]}
    >
      
      {/* Header Section */}
      <View style={[searchStyles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={searchStyles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={[searchStyles.inputWrapper, { backgroundColor: theme.surface }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            style={[searchStyles.input, { color: theme.textMain }]}
            placeholder="Search in Drive"
            placeholderTextColor={theme.textMuted}
            autoFocus={true} // מקלדת קופצת אוטומטית
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {isSearching && <ActivityIndicator size="small" color={theme.primary} />}
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={searchStyles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <FileItem 
            file={item} 
            onOpen={() => handleOpenFile(item)} 
            isTrash={false}
          />
        )}
        ListEmptyComponent={
          !isSearching && query.length > 0 && (
            <View style={searchStyles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={theme.textMuted} style={{ opacity: 0.5 }} />
              <Text style={[searchStyles.emptyText, { color: theme.textMuted }]}>No results found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}