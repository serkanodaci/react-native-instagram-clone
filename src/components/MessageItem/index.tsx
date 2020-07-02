import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Animated, Image, TouchableOpacity, GestureResponderEvent } from 'react-native'
import { seenTypes, Message, messagesTypes } from '../../reducers/messageReducer'
import { store } from '../../store'
import { ProfileX } from '../../reducers/profileXReducer'
import FastImage from 'react-native-fast-image'
import { SCREEN_WIDTH } from '../../constants'

interface MessageItemProps {
    item: Message,
    index: number,
    owner: ProfileX,
    showMsgEmojiSelection?: (px: number, py: number, index: number) => void
}
const emoijList = ['❤️', '😂', '😮', '😢', '😡', '👍']
const MessageItem = ({ item, index, owner, showMsgEmojiSelection }: MessageItemProps) => {
    const myUsername = store.getState().user.user.userInfo?.username || ''
    const _animRatio = React.useMemo(() => new Animated.Value(1), [])
    const isMyMessage = item.userId === myUsername
    const lastSeen = index === 0 && isMyMessage && item.seen === seenTypes.SEEN
    const _showEmojiOptions = ({
        nativeEvent: {
            pageX, pageY
        }
    }: GestureResponderEvent) => {
        Animated.sequence([
            Animated.timing(_animRatio, {
                toValue: 0.9,
                useNativeDriver: true,
                duration: 250
            }),
            Animated.timing(_animRatio, {
                toValue: 1,
                useNativeDriver: true,
                duration: 300
            })
        ]).start(() => {
            if (showMsgEmojiSelection) showMsgEmojiSelection(pageX, pageY, index)
        })
    }
    const _onMessagePress = () => {

    }
    let extraStyle = {}
    switch (item.type) {
        case messagesTypes.TEXT:
            extraStyle = styles.textMessage
            break;
        case messagesTypes.POST:
            extraStyle = styles.postMessage
            break
        case messagesTypes.SUPER_IMAGE:
            extraStyle = styles.superImageMessage
            break;
        case messagesTypes.ADDRESS:
            extraStyle = styles.addressMessage
            break
        case messagesTypes.IMAGE:
            extraStyle = styles.imageMessage
            break
        default:
            break;
    }
    const { width, height } = item
    return (
        <TouchableOpacity
            onPress={_onMessagePress}
            onLongPress={_showEmojiOptions}
            delayLongPress={200}
            activeOpacity={1}
            style={{
                ...styles.messageItem,
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                paddingBottom: (lastSeen || item.yourEmoji || item.ownEmoji) ? 15 : 0,
                ...((lastSeen && (item.yourEmoji || item.ownEmoji)) ? { paddingBottom: 30 } : {})
            }}>
            {!isMyMessage &&
                <FastImage style={styles.yourAvatar}
                    source={{
                        uri: owner.avatarURL
                    }}
                />
            }
            <Animated.View style={[styles.message, extraStyle, isMyMessage
                ? styles.myMessage : styles.yourMessage, {
                transform: [
                    {
                        scale: _animRatio
                    }
                ]
            }]}>
                {item.type === messagesTypes.TEXT &&
                    <Text style={styles.msgText}>{item.text}</Text>
                }
                {item.type === messagesTypes.IMAGE &&
                    <FastImage
                        style={{
                            borderRadius: 20,
                            width: SCREEN_WIDTH * 0.4,
                            height: (height || 0) * SCREEN_WIDTH * 0.4 / (width || 1)
                        }}
                        source={{
                            uri: `${item.sourceUri}`
                        }}
                    />
                }
                {(item.yourEmoji || item.ownEmoji) &&
                    <TouchableOpacity style={{
                        ...styles.emojiLabel,
                        width: (item.yourEmoji && item.ownEmoji) ? 60 : 44,
                        ...(isMyMessage ? { right: 10 } : { left: 10 })
                    }}>
                        <Text>{item.yourEmoji && emoijList[item.yourEmoji - 1]}</Text>
                        <Text>{item.ownEmoji && emoijList[item.ownEmoji - 1]}</Text>
                    </TouchableOpacity>
                }
            </Animated.View>
            {
                lastSeen &&
                <View style={styles.seenLabel}>
                    <Text style={{
                        fontSize: 12,
                        color: '#666'
                    }}>Seen</Text>
                </View>
            }

        </TouchableOpacity >
    )
}
export default React.memo(MessageItem)
const styles = StyleSheet.create({
    messageItem: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-end'
    },
    message: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        maxWidth: SCREEN_WIDTH * 0.6,
    },
    textMessage: {
        paddingHorizontal: 15,
    },
    postMessage: {

    },
    superImageMessage: {

    },
    addressMessage: {

    },
    imageMessage: {
        borderWidth: 0
    },
    myMessage: {
        backgroundColor: '#ddd',
        marginHorizontal: 15,
    },
    yourAvatar: {
        marginLeft: 15,
        marginRight: 10,
        height: 40,
        width: 40,
        borderRadius: 40
    },
    yourMessage: {

    },
    msgText: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    seenLabel: {
        zIndex: 1,
        position: 'absolute',
        width: 50,
        bottom: 0,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    emojiLabel: {
        zIndex: 2,
        position: 'absolute',
        height: 30,
        borderRadius: 20,
        borderColor: "#fff",
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: -20,

        backgroundColor: '#ddd',
        flexDirection: 'row',
    }
})