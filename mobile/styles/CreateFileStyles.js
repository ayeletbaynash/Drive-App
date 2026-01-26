import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    extension: {
        fontSize: 16,
        color: '#888',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        height: 120,           
        minHeight: 100,        
        textAlignVertical: 'top', 
        color: '#000', 
        backgroundColor: '#fafafa', 
        marginTop: 5,
        marginBottom: 20,      
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnSecondary: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnTextPrimary: {
        color: 'white',
        fontWeight: 'bold',
    },
    btnTextSecondary: {
        color: '#555',
    },
});

export default styles;