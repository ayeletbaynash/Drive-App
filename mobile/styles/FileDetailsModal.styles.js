import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // הרקע הכהה מאחור
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    // הקופסה הלבנה שעולה מלמטה
    sheetContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        maxHeight: height * 0.85, // מקסימום 85% גובה מסך
        paddingBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // הפס הקטן למעלה לגרירה
    handleWrapper: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
    },
    // כותרת עליונה (אייקון + שם)
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
        textAlign: 'center',
        color: '#333',
    },
    // כותרות של מקטעים (System Properties / Access)
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#888',
        marginBottom: 10,
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // הקופסה האפורה שמכילה את המידע
    infoBox: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EDEEF0',
    },
    // שורת מידע (Label + Value)
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        color: '#6c757d',
        fontSize: 14,
        fontWeight: '500',
    },
    value: {
        color: '#212529',
        fontSize: 14,
        fontWeight: '600',
    },
    // --- עיצוב למשתמשים ---
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarOwner: {
        backgroundColor: '#198754', // ירוק לבעלים
    },
    avatarCollab: {
        backgroundColor: '#6c757d', // אפור לאחרים
    },
    avatarText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
    },
    role: {
        fontSize: 13,
        color: '#6c757d',
    },
    emptyText: {
        color: '#adb5bd',
        fontStyle: 'italic',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 5,
    },
    scrollContent: {
        paddingBottom: 20
    }
});