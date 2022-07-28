import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { setDoc, getFirestore, doc, collection } from "firebase/firestore";




const AddChatScreen = ({ navigation }) => {

    const [input, setInput] = useState('')
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new Chat',
            headerBackTitle: 'Chats'
        })
    }, [])
    const createChatScreen = async () => {
        const db = getFirestore();
        const colRef = doc(collection(db, "Chats"));
        if (input) {
            await setDoc(colRef, { chatName: input }).then(() => navigation.goBack()).catch((err) => alert(err));
        } else {
            ToastAndroid.show('Please enter chat name!', ToastAndroid.SHORT)
        }
    }
    return (
        <View style={styles.container}>
            <Input placeholder='Enter a chat name' value={input} onChangeText={(text) => setInput(text)} leftIcon={
                <AntDesign name="wechat" size={24} color="black" />
            }
                onSubmitEditing={createChatScreen}
            />
            <Button onPress={createChatScreen} title='Create new Chat' />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        height: '100%'
    }
})