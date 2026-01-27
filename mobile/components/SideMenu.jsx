import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLogo from './AppLogo';
import { createSideMenuStyles } from '../styles/SideMenuStyles';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

export default function SideMenu({ visible, onClose }) {
  const { theme } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname(); // כדי לדעת איפה אנחנו נמצאים ולסמן את הכפתור
  
  // יצירת הסטיילים עם הצבעים העדכניים
  const styles = createSideMenuStyles(theme);

  // משתני אנימציה
  // 1. מיקום התפריט (מתחיל מחוץ למסך בצד שמאל)
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  // 2. שקיפות הרקע הכהה (מתחיל שקוף לגמרי)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // הפעלה כש-visible משתנה
  useEffect(() => {
    if (visible) {
      // כניסה: החלקה פנימה והחשכה של הרקע במקביל
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300, // מהירות האנימציה (מילישניות)
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // פונקציית סגירה מותאמת (קודם אנימציה, ואז סגירה אמיתית)
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH, // יציאה החוצה
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0, // העלמת הרקע הכהה
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(); // רק בסוף האנימציה מעלימים את המודל
    });
  };

  // פונקציה לניווט
  const navigateTo = (path) => {
    handleClose(); // קודם סוגרים יפה
    setTimeout(() => router.push(path), 200); // ואז מנווטים
  };

  // רכיב עזר לכפתור בתפריט (כדי לא לשכפל קוד)
  const MenuItem = ({ label, icon, path }) => {
    // בדיקה אם אנחנו בעמוד הנוכחי כדי להדגיש אותו
    const isActive = pathname === path; 
    
    return (
      <TouchableOpacity 
        style={[
          styles.navItem, 
          // אם פעיל - צבע רקע ירוק עדין מאוד
          isActive && { backgroundColor: theme.rowHover } 
        ]} 
        onPress={() => navigateTo(path)}
      >
        <Ionicons 
          name={isActive ? icon : `${icon}-outline`} // אייקון מלא אם פעיל
          size={24} 
          color={theme.primary} 
        />
        <Text style={[styles.navText, isActive && { fontWeight: 'bold' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {/* 1. הרקע הכהה (לוחצים עליו כדי לסגור) */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
           <Pressable style={{ flex: 1 }} onPress={handleClose} />
        </Animated.View>

        {/* 2. התפריט הגולש (החלקה) */}
        <Animated.View 
          style={[
            styles.menuContainer, 
            { transform: [{ translateX: slideAnim }] } // כאן קורה הקסם של התזוזה
          ]}
        >
          <SafeAreaView style={{ flex: 1 }}>
            
            {/* 1. לוגו למעלה */}
            <View style={styles.logoContainer}>
              {/* מבטלים לחיצה על הלוגו בתוך התפריט */}
              <View pointerEvents="none"> 
                 <AppLogo scale={1.2} />
              </View>
            </View>

            {/* 2. רשימת הניווט */}
            <View style={styles.navItems}>
              
              <MenuItem label="Recent" icon="time" path="/recent" />
              <MenuItem label="Trash" icon="trash" path="/trash" />
              
              {/* אפשר להוסיף כאן עוד כפתורים בעתיד */}
            
            </View>

            {/* 3. פוטר קטן */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>AwesoMe Drive v1.0</Text>
            </View>

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}