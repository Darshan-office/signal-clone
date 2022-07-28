import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import React, { useEffect } from 'react'
import { Button, Input, Image } from "@rneui/themed";
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const auth = getAuth()
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser !== null) {
                navigation.replace('Home')
            }
        });
        return unSubscribe
    }, [])
    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password).catch((err) => { setEmail(''); setPassword(''); alert(err) })
    }
    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            {/* <StatusBar style='light' /> */}
            <Image source={{
                uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png"
            }} style={{ width: 200, height: 200 }} />
            <View style={styles.inputContainer}>
                <Input placeholder='Email' autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder='Password' secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)} onSubmitEditing={signIn} />
            </View>
            <Button containerStyle={styles.button} onPress={signIn} title="Login" />
            <Button containerStyle={styles.button} title="Register" type='outline' onPress={() => navigation.navigate('Register')} />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10
    }
})