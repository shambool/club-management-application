import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

export default function Header() {
  const router = useRouter();
  
  const {isSignedIn} = useAuth(); // Assuming useAuth is a hook that provides auth status

   const handleSavedPress = () => {
    if (isSignedIn) {
      router.push("/saved_events"); // ✅ logged in → go to saved events
    } else {
      router.push("/signIn/signInPage"); // 🚫 not logged in → go to sign-in page
    }
  };
  
  return (
    <View style={styles.header}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={() => handleSavedPress()}>
        <Ionicons name="bookmark-outline" size={26} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
});
