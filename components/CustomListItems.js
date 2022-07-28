import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ListItem, Avatar } from '@rneui/themed'

const CustomListItems = ({ id, chatName, enterChat }) => {
    return (
        <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
            <Avatar source={{ uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png', }} />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: '800' }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    Group Chat
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItems

const styles = StyleSheet.create({})