import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";

export const CustomDefaultTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#000",
    background: "#fff",
    text: "#333",
    //card: '',
    //border: '',
    //notification: '',
  },
};

export const CustomDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#fff",
    background: "#333",
    text: "#fff",
    card: "#333",
    //border: '',
    //notification: '',
  },
};
