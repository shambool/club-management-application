// import * as SecureStore from "expo-secure-store";
// import { Platform } from "react-native";
// import { TokenCache } from "@clerk/clerk-expo";



// const createTokenCache = (): TokenCache => {
//   return {
//     getToken: async (key : string) => {
//       try {
//         const item = await SecureStore.getItemAsync(key)
//         if (item) {
//           console.log(`${key} was used \n`);
//         }
//         else{
//           console.log(`${key} not found \n`);
//         }
//         return item;
//       } catch (error) {
//         console.error("secure store get item error: ", error)
//         await SecureStore.deleteItemAsync(key);
//         return null;
//       }},
//       saveToken: async (key : string, token : string) => {
//         return SecureStore.setItemAsync(key, token);
//     }, 
//   }
// }

// export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined;
//       // Implement your logic to retrieve the token from storage or memory