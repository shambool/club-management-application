import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 💛 Define user type
type User = {
  email: string;
  password: string;
};

// 💛 Mock single valid user
const validUser: User = {
  email: "sd21180@gmail.com",
  password: "s1111",
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === validUser.email && password === validUser.password) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      router.replace("/feed");
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={{
          uri: "https://illustrations.popsy.co/gray/person-walking-with-bag.png",
        }}
        style={styles.image}
      />

      {/* Welcome Text */}
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#444" />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#777"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#444" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6", // 🌼 pastel yellow
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#3C3C3C",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
