import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { Button, Input, Text } from '@rneui/themed'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import * as DocumentPicker from 'expo-document-picker';




const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [file, setFile] = useState({})
    const [fileName, setFileName] = useState('')
    const auth = getAuth();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login"
        })
    }, [navigation])

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: file.uri,
                })
            }).catch((error) => alert(error.message))
    }

    const uploadFile = () => {
        DocumentPicker.getDocumentAsync('*/*', true, false).then((res) => {
            setFile(res);
            setFileName(res.name)
        }).catch((err) => {
            console.log(err)
        })
    }


    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <Text h3 style={{ marginBottom: 50 }}>Create a Signal account</Text>
            <View style={styles.inputContainer}>
                <Input placeholder='Full Name' autoFocus type="text" value={name} onChangeText={(text) => setName(text)} />
                <Input placeholder='Email' type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder='Password' type="password" secureTextEntry value={password} onChangeText={(text) => setPassword(text)} />
                <Button onPress={uploadFile} title={fileName ? fileName : `Upload Profile Pic`} containerStyle={styles.uploadButton} />
            </View>
            <Button raised onPress={register} title="Register" containerStyle={styles.button} />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: 'white',

    },
    button: {
        width: 200,
        marginTop: 80,
    },
    uploadButton: {
        width: 300,
        marginTop: 10,

    },
    inputContainer: {
        width: 300,
        justifyContent: "center",
        alignItems: 'center'
    }
})