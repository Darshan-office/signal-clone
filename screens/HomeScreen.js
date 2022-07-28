import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomListItems from '../components/CustomListItems'
import { Avatar } from '@rneui/base'
import { getAuth } from 'firebase/auth'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { onSnapshot, collection, getFirestore } from "firebase/firestore";

const HomeScreen = ({ navigation }) => {


    const [chats, setChats] = useState([])


    const auth = getAuth()
    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

    useEffect(() => {
        const db = getFirestore();
        const unSubsribe = onSnapshot(collection(db, "Chats"), (snapShots) => setChats(snapShots.docs.map((doc) => ({
            id: doc.id,
            data: doc.data()
        }))))
        return unSubsribe;
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Signal', headerStyle: { backgroundColor: '#fff' }, headerTitleStyle: { color: 'black' }, headerTintColor: 'black',
            headerLeft: () =>
            (<View style={{ marginLeft: 20, marginRight: 10 }}>
                <TouchableOpacity activeOpacity={0.5}>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                </TouchableOpacity>
            </View>),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 120,
                    marginRight: 20,
                }}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name="camerao" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddChat')}>
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <SimpleLineIcons name="logout" size={24} color="black" />
                    </TouchableOpacity>

                </View>
            )
        });
    }, [navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: chatName
        })
    }
    return (
        // <SafeAreaView>
        <ScrollView style={styles.container}>
            {chats.map(({ id, data: { chatName } }) => (
                <CustomListItems key={id} id={id} chatName={chatName} enterChat={enterChat} />
            ))}
        </ScrollView>
        //     {/* </SafeAreaView> */}
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
    }
})