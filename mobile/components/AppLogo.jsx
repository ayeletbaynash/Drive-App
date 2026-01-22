import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';

const AppLogo = ({ scale = 1 }) => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.push('/')} style={[styles.container, { transform: [{ scale }] }]}>
            <View style={styles.cloudWrapper}>
                {/* the circles of the cloud */}
                <View style={[styles.cloudCircle, styles.centerCircle]} />
                <View style={[styles.cloudCircle, styles.leftCircle]} />
                <View style={[styles.cloudCircle, styles.rightCircle]} />

                {/* the flat base that closes the holes */}
                <View style={styles.cloudBase} />

                {/* the arrow */}
                <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>↑</Text>
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.brandText}>
                    <Text style={styles.bold}>A</Text>we
                    <Text style={styles.bold}>S</Text>o
                    <Text style={styles.bold}>M</Text>e
                    <Text style={styles.muted}> drive</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
    },
    cloudWrapper: {
        width: 50,
        height: 40,
        marginRight: 12,
        position: 'relative',
    },
    cloudCircle: {
        backgroundColor: '#277d3f',
        position: 'absolute',
    },
    centerCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        top: 0,
        left: 9,
    },
    leftCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        bottom: 5,
        left: 0,
    },
    rightCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        bottom: 5,
        right: 0,
    },
    // the flat base that closes the holes between the circles
    cloudBase: {
        position: 'absolute',
        backgroundColor: '#277d3f',
        height: 18,
        width: 26,
        bottom: 5,
        left: 9,
    },
    arrowContainer: {
        position: 'absolute',
        top: 4,
        left: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    arrow: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textContainer: {
        flexDirection: 'row',
    },
    brandText: {
        fontSize: 22,
        color: theme.colors.textMain,
    },
    bold: {
        fontWeight: 'bold',
    },
    muted: {
        color: '#666',
    },
});

export default AppLogo;