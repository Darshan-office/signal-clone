import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Keyboard, ScrollView, TouchableWithoutFeedback, ToastAndroid } from 'react-native'
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import { Avatar } from '@rneui/themed'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { collection, doc, setDoc, serverTimestamp, getFirestore, orderBy, onSnapshot, query, getDoc, limit, getDocs, startAfter } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { Button } from '@rneui/base';



const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [documentSnap, setDocumentSnap] = useState('')
    const [loading, setLoading] = useState(false)
    const auth = getAuth();
    const scrollRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Avatar source={{
                        uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png'
                    }} />
                    <Text style={{ color: 'white', marginLeft: 10, fontWeight: "700" }}>{route.params.chatName}</Text>
                </View>
            ),

            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20,
                }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <FontAwesome name="video-camera" size={22} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Ionicons name="call" size={22} color="white" />
                    </TouchableOpacity>
                </View>

            ),
        })
    }, [navigation])

    useEffect(() => {

        if (newMessage) {
            if (messages.length === 0) {
                setMessages([newMessage])
            } else {
                setMessages((prevMessages) => {
                    if (prevMessages[prevMessages.length - 1].id !== newMessage.id) {
                        return [...prevMessages, newMessage]
                    }
                    return prevMessages;
                })
            }

        }
    }, [newMessage])

    useEffect(() => {
        async function getData() {
            const db = getFirestore();
            const q = query(collection(db, `Chats/${route.params.id}/messages`), orderBy('timeStamp', 'desc'), limit(10))

            const docSnap = await getDocs(q)
            setDocumentSnap(docSnap);

            setMessages((docSnap.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }))).reverse())

        }

        getData();

    }, [])

    useLayoutEffect(() => {

        const db = getFirestore();
        const q = query(collection(db, `Chats/${route.params.id}/messages`), orderBy('timeStamp', 'desc'), limit(1))
        const unSubsribe = onSnapshot(q, (snapShots) => {
            setNewMessage(
                ...snapShots.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
            )
        })
        return unSubsribe;


    }, [route])



    const sendMessage = async () => {
        Keyboard.dismiss();
        const db = getFirestore()
        const chatRef = doc(collection(db, `Chats/${route.params.id}`, "messages"));
        setInput('')
        await setDoc(chatRef, {
            timeStamp: serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        })
    };

    const loadMessage = () => {
        async function getData() {
            const db = getFirestore();
            const lastVisible = documentSnap.docs[documentSnap.docs.length - 1];
            if (lastVisible) {
                const q = query(collection(db, `Chats/${route.params.id}/messages`), orderBy('timeStamp', 'desc'), startAfter(lastVisible), limit(10))

                const docSnap = await getDocs(q)
                setDocumentSnap(docSnap);
                const loadedData = docSnap.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                })).reverse();
                setMessages((prevMes) => [...loadedData, ...prevMes])
            } else {
                ToastAndroid.show('Reached the end.', ToastAndroid.SHORT)
            }

        }
        setLoading(true)
        getData();
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={90}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                        <ScrollView ref={scrollRef} onContentSizeChange={loading ? () => { scrollRef.current.scrollTo({ y: 0, animated: true }); setLoading(false) } : () => scrollRef.current.scrollToEnd({ animated: true })} >
                            <Button containerStyle={styles.button} onPress={loadMessage} title="Load more" />
                            {messages.map(({ id, data }) =>
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={styles.reciever}>
                                        <Avatar rounded source={{ uri: data.photoURL }} size={20} position="absolute" bottom={-10} right={-5} />
                                        <Text style={styles.recieverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.sender}>
                                        <Avatar rounded source={{ uri: data.photoURL }} size={20} position="absolute" bottom={-10} right={-5} />
                                        <Text style={styles.senderText}>{data.message}</Text>
                                        <Text style={styles.senderName}>{data.displayName}</Text>
                                    </View>
                                )
                            )}
                        </ScrollView>
                        <View style={styles.footer}>
                            <TextInput placeholder='Signal Message' style={styles.textInput} value={input} onChangeText={(text) => setInput(text)} onSubmitEditing={sendMessage} />
                            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                                <Ionicons name="send" size={24} color="#2B68E6" />
                            </TouchableOpacity>
                        </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 50,
        flex: 1,
        marginRight: 15,
        borderColor: 'transparent',
        backgroundColor: '#ECECEC',
        borderWidth: 1,
        padding: 15,
        paddingLeft: 20,
        color: 'grey',
        borderRadius: 30,
    },
    reciever: {
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    sender: {
        padding: 15,
        backgroundColor: '#2B68E6',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative'
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginRight: 10,
        marginBottom: 5,
    },
    recieverText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,


    },
    button: {
        padding: 0,
    }
})